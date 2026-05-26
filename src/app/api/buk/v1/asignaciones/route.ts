/**
 * /api/buk/v1/asignaciones
 *
 * GET  → lista asignaciones desde Supabase con filtros
 * POST → asigna colaboradora a hogar (cambia area_id en Buk + escribe histórico Supabase)
 *
 * Modelo: la asignación "actual" es la fila con fecha_fin = null para ese buk_employee_id.
 * Al hacer nueva asignación, cerramos la anterior con fecha_fin = fecha_inicio nuevo.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getBukSDK } from '@/lib/buk-sdk';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseBody, parseQuery, paginationQuerySchema } from '@/lib/api/utils';
import { AsignarColaboradoraBody } from '@/lib/api/schemas/asignaciones';
import { CARGO_EMPLEADOR } from '@/lib/api/schemas/colaboradoras';
import { requireScope } from '@/lib/api/auth';

const ListAsignacionesQuery = paginationQuerySchema.extend({
  colaboradora_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  activas: z.enum(['true', 'false']).optional(),
});

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;

  const parsed = parseQuery(req, ListAsignacionesQuery);
  if (!parsed.ok) return parsed.error;

  const supabase = await createClient();
  let query = supabase
    .from('asignaciones')
    .select('*')
    .order('fecha_inicio', { ascending: false });

  if (parsed.data.colaboradora_id) query = query.eq('buk_employee_id', parsed.data.colaboradora_id);
  if (parsed.data.hogar_id) query = query.eq('buk_area_id', parsed.data.hogar_id);
  if (parsed.data.activas === 'true') query = query.is('fecha_fin', null);

  const { data, error } = await query;
  if (error) return fail('INTERNAL_ERROR', `Supabase error: ${error.message}`);

  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;

  const parsed = await parseBody(req, AsignarColaboradoraBody);
  if (!parsed.ok) return parsed.error;

  const sdk = getBukSDK();

  // Validar que la colaboradora no sea empleador
  const emp = await sdk.employees.get(parsed.data.colaboradora_id);
  if (emp.current_job?.role?.name === CARGO_EMPLEADOR) {
    return fail(
      'VALIDATION_ERROR',
      'No se puede reasignar un empleador — solo colaboradoras.',
      { colaboradora_id: ['es empleador'] }
    );
  }

  // Validar hogar
  try {
    await sdk.organization.getArea(parsed.data.hogar_id);
  } catch {
    return fail('NOT_FOUND', `Hogar (area_id=${parsed.data.hogar_id}) no existe`);
  }

  const supabase = await createClient();

  // 1. Cerrar asignación activa anterior (si existe)
  const { error: closeErr } = await supabase
    .from('asignaciones')
    .update({ fecha_fin: parsed.data.fecha_inicio })
    .eq('buk_employee_id', parsed.data.colaboradora_id)
    .is('fecha_fin', null);

  if (closeErr) {
    return fail('INTERNAL_ERROR', `Supabase close error: ${closeErr.message}`);
  }

  // 2. Crear nueva asignación
  const { data: created, error: insertErr } = await supabase
    .from('asignaciones')
    .insert({
      buk_employee_id: parsed.data.colaboradora_id,
      buk_area_id: parsed.data.hogar_id,
      fecha_inicio: parsed.data.fecha_inicio,
      modalidad: parsed.data.modalidad,
      observaciones: parsed.data.observaciones,
      created_by: auth.data.user_id,
    })
    .select()
    .single();

  if (insertErr) {
    return fail('INTERNAL_ERROR', `Supabase insert error: ${insertErr.message}`);
  }

  // 3. Actualizar area_id en Buk
  try {
    await sdk.employees.update(
      parsed.data.colaboradora_id,
      { area_id: parsed.data.hogar_id } as unknown as Parameters<typeof sdk.employees.update>[1]
    );
  } catch (err) {
    // Rollback: marcar la asignación recién creada como inválida
    await supabase.from('asignaciones').delete().eq('id', (created as { id: string }).id);
    throw err;
  }

  return ok(created, 201);
});

/**
 * /api/buk/v1/tareas
 *
 * GET  → lista tareas (filtra por scope via RLS de Supabase)
 * POST → crea tarea (empleador o admin; colaboradora no puede crear)
 *
 * Las RLS policies de Supabase ya hacen el filtrado en BD según rol/area.
 * Acá solo necesitamos auth y construir los filtros.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import { ListTareasQuery, CreateTareaBody } from '@/lib/api/schemas/tareas';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;

  const parsed = parseQuery(req, ListTareasQuery);
  if (!parsed.ok) return parsed.error;

  const supabase = await createClient();
  let query = supabase.from('tareas').select('*').order('created_at', { ascending: false });

  if (parsed.data.hogar_id) query = query.eq('buk_area_id', parsed.data.hogar_id);
  if (parsed.data.colaboradora_id) query = query.eq('buk_employee_id', parsed.data.colaboradora_id);
  if (parsed.data.estado) query = query.eq('estado', parsed.data.estado);

  const { data, error } = await query;
  if (error) return fail('INTERNAL_ERROR', `Supabase: ${error.message}`);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;

  const parsed = await parseBody(req, CreateTareaBody);
  if (!parsed.ok) return parsed.error;

  // Empleador solo puede crear tareas para su area
  if (auth.data.rol === 'empleador' && parsed.data.buk_area_id !== auth.data.buk_area_id) {
    return fail('FORBIDDEN', 'Solo puede crear tareas para su hogar');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tareas')
    .insert({
      buk_area_id: parsed.data.buk_area_id,
      buk_employee_id: parsed.data.buk_employee_id,
      titulo: parsed.data.titulo,
      descripcion: parsed.data.descripcion,
      prioridad: parsed.data.prioridad,
      fecha_para: parsed.data.fecha_para,
      hora_para: parsed.data.hora_para,
      created_by: auth.data.user_id,
    })
    .select()
    .single();

  if (error) return fail('INTERNAL_ERROR', `Supabase: ${error.message}`);
  return ok(data, 201);
});

/**
 * GET → lista (RLS filtra: colaboradora ve las propias, empleador ve las de su area, admin todo)
 * POST → crear (típicamente colaboradora avisando)
 */
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import { ListSolicitudesSaludQuery, CreateSolicitudSaludBody } from '@/lib/api/schemas/solicitudes-salud';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListSolicitudesSaludQuery);
  if (!parsed.ok) return parsed.error;
  const supabase = await createClient();
  let q = supabase.from('solicitudes_salud').select('*').order('fecha', { ascending: false });
  if (parsed.data.colaboradora_id) q = q.eq('buk_employee_id', parsed.data.colaboradora_id);
  if (parsed.data.hogar_id) q = q.eq('buk_area_id', parsed.data.hogar_id);
  const { data, error } = await q;
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateSolicitudSaludBody);
  if (!parsed.ok) return parsed.error;

  // Quién es la colaboradora afectada: el user si es colaboradora, o requiere flag para admin/empleador
  let buk_employee_id: number | null = null;
  if (auth.data.rol === 'colaboradora') {
    buk_employee_id = auth.data.buk_employee_id;
  } else {
    // admin/empleador deben pasar la colaboradora explícita — extraer del body si viene
    const extra = parsed.data as unknown as { buk_employee_id?: number };
    buk_employee_id = extra.buk_employee_id ?? null;
  }
  if (!buk_employee_id) {
    return fail('VALIDATION_ERROR', 'buk_employee_id requerido para roles distintos a colaboradora');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('solicitudes_salud')
    .insert({
      buk_employee_id,
      buk_area_id: parsed.data.buk_area_id,
      tipo: parsed.data.tipo,
      descripcion: parsed.data.descripcion,
      fecha: parsed.data.fecha,
    })
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data, 201);
});

/**
 * GET → lista (RLS filtra: empleador ve su area, colaboradora se ve a sí misma)
 * POST → crear (auto-detecta evaluador_rol y emisor_uid del scope)
 */
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import { ListEvaluacionesQuery, CreateEvaluacionBody } from '@/lib/api/schemas/evaluaciones';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListEvaluacionesQuery);
  if (!parsed.ok) return parsed.error;
  const supabase = await createClient();
  let q = supabase.from('evaluaciones').select('*').order('created_at', { ascending: false });
  if (parsed.data.colaboradora_id) q = q.eq('buk_employee_id', parsed.data.colaboradora_id);
  if (parsed.data.hogar_id) q = q.eq('buk_area_id', parsed.data.hogar_id);
  const { data, error } = await q;
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  if (auth.data.rol === 'admin') {
    return fail('FORBIDDEN', 'Admin no puede emitir evaluaciones — solo empleadores y colaboradoras');
  }
  const parsed = await parseBody(req, CreateEvaluacionBody);
  if (!parsed.ok) return parsed.error;

  // Validar consistencia: empleador solo evalúa su area, colaboradora solo evalúa su propia area
  if (parsed.data.buk_area_id !== auth.data.buk_area_id) {
    return fail('FORBIDDEN', 'Solo puede evaluar dentro de su hogar');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('evaluaciones')
    .insert({
      buk_area_id: parsed.data.buk_area_id,
      buk_employee_id: parsed.data.buk_employee_id,
      evaluador_uid: auth.data.user_id,
      evaluador_rol: auth.data.rol,
      puntaje: parsed.data.puntaje,
      comentario: parsed.data.comentario,
    })
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data, 201);
});

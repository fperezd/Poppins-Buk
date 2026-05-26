/**
 * /api/buk/v1/listas-compras
 * GET → lista (RLS filtra por scope)
 * POST → crear (admin o empleador-de-area)
 */
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import { ListListasQuery, CreateListaBody } from '@/lib/api/schemas/listas-compras';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListListasQuery);
  if (!parsed.ok) return parsed.error;
  const supabase = await createClient();
  let q = supabase.from('listas_compras').select('*').order('created_at', { ascending: false });
  if (parsed.data.hogar_id) q = q.eq('buk_area_id', parsed.data.hogar_id);
  if (parsed.data.estado) q = q.eq('estado', parsed.data.estado);
  const { data, error } = await q;
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateListaBody);
  if (!parsed.ok) return parsed.error;
  if (auth.data.rol === 'empleador' && parsed.data.buk_area_id !== auth.data.buk_area_id) {
    return fail('FORBIDDEN', 'Solo puede crear listas para su hogar');
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listas_compras')
    .insert({
      buk_area_id: parsed.data.buk_area_id,
      nombre: parsed.data.nombre ?? 'Lista de compras',
      created_by: auth.data.user_id,
    })
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data, 201);
});

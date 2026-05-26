/**
 * /api/buk/v1/conversaciones
 * GET → lista (RLS Supabase filtra)
 * POST → crear o devolver existente (upsert por unique(buk_area_id, buk_employee_id))
 */
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import { ListConversacionesQuery, CreateConversacionBody } from '@/lib/api/schemas/mensajes';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListConversacionesQuery);
  if (!parsed.ok) return parsed.error;
  const supabase = await createClient();
  let q = supabase.from('conversaciones').select('*').order('ultimo_mensaje_at', { ascending: false, nullsFirst: false });
  if (parsed.data.hogar_id) q = q.eq('buk_area_id', parsed.data.hogar_id);
  const { data, error } = await q;
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateConversacionBody);
  if (!parsed.ok) return parsed.error;
  const supabase = await createClient();

  // Buscar existente
  const { data: existing } = await supabase
    .from('conversaciones')
    .select('*')
    .eq('buk_area_id', parsed.data.buk_area_id)
    .eq('buk_employee_id', parsed.data.buk_employee_id)
    .maybeSingle();
  if (existing) return ok(existing, 200);

  const { data, error } = await supabase
    .from('conversaciones')
    .insert(parsed.data)
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data, 201);
});

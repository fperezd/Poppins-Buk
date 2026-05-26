import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseParams, parseBody } from '@/lib/api/utils';
import { CreateItemBody } from '@/lib/api/schemas/listas-compras';
import { requireScope } from '@/lib/api/auth';

const uuid = z.object({ id: z.string().uuid() });
interface Ctx { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => {
  const raw = await ctx.params;
  const p = parseParams(raw, uuid);
  if (!p.ok) return p.error;
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const supabase = await createClient();
  const { data, error } = await supabase.from('items_lista').select('*').eq('lista_id', p.data.id).order('created_at');
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest, ctx: Ctx) => {
  const raw = await ctx.params;
  const p = parseParams(raw, uuid);
  if (!p.ok) return p.error;
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const body = await parseBody(req, CreateItemBody);
  if (!body.ok) return body.error;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('items_lista')
    .insert({ lista_id: p.data.id, ...body.data, agregado_por: auth.data.user_id })
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data, 201);
});

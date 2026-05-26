import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseParams } from '@/lib/api/utils';
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
  const { data, error } = await supabase.from('conversaciones').select('*').eq('id', p.data.id).single();
  if (error) return fail('NOT_FOUND', 'Conversación no encontrada o sin acceso');
  return ok(data);
});

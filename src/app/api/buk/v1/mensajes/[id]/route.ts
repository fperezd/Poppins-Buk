/**
 * PATCH /mensajes/{id} → marcar como leído.
 */
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseParams } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';

const uuid = z.object({ id: z.string().uuid() });
interface Ctx { params: Promise<{ id: string }>; }

export const PATCH = handle(async (_req: NextRequest, ctx: Ctx) => {
  const raw = await ctx.params;
  const p = parseParams(raw, uuid);
  if (!p.ok) return p.error;
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mensajes')
    .update({ leido_at: new Date().toISOString() })
    .eq('id', p.data.id)
    .neq('emisor_uid', auth.data.user_id)  // No marcar como leído los propios
    .select()
    .maybeSingle();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? { skipped: true });
});

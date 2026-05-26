import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseParams, parseBody } from '@/lib/api/utils';
import { UpdateSolicitudSaludBody } from '@/lib/api/schemas/solicitudes-salud';
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
  const { data, error } = await supabase.from('solicitudes_salud').select('*').eq('id', p.data.id).single();
  if (error) return fail('NOT_FOUND', 'Solicitud no encontrada');
  return ok(data);
});

export const PATCH = handle(async (req: NextRequest, ctx: Ctx) => {
  const raw = await ctx.params;
  const p = parseParams(raw, uuid);
  if (!p.ok) return p.error;
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const body = await parseBody(req, UpdateSolicitudSaludBody);
  if (!body.ok) return body.error;
  const supabase = await createClient();
  const { data, error } = await supabase.from('solicitudes_salud').update(body.data).eq('id', p.data.id).select().single();
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data);
});

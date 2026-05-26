/**
 * GET  → lista mensajes de la conversación (paginado con limit, opcional ?desde=ISO)
 * POST → crear mensaje. Auto-actualiza ultimo_mensaje_at de la conversación.
 */
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseParams, parseQuery, parseBody } from '@/lib/api/utils';
import { ListMensajesQuery, CreateMensajeBody } from '@/lib/api/schemas/mensajes';
import { requireScope } from '@/lib/api/auth';

const uuid = z.object({ id: z.string().uuid() });
interface Ctx { params: Promise<{ id: string }>; }

export const GET = handle(async (req: NextRequest, ctx: Ctx) => {
  const raw = await ctx.params;
  const p = parseParams(raw, uuid);
  if (!p.ok) return p.error;
  const q = parseQuery(req, ListMensajesQuery);
  if (!q.ok) return q.error;
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const supabase = await createClient();
  let query = supabase
    .from('mensajes')
    .select('*')
    .eq('conversacion_id', p.data.id)
    .order('created_at', { ascending: false })
    .limit(q.data.limit ?? 50);
  if (q.data.desde) query = query.gte('created_at', q.data.desde);
  const { data, error } = await query;
  if (error) return fail('INTERNAL_ERROR', error.message);
  return ok(data ?? []);
});

export const POST = handle(async (req: NextRequest, ctx: Ctx) => {
  const raw = await ctx.params;
  const p = parseParams(raw, uuid);
  if (!p.ok) return p.error;
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const body = await parseBody(req, CreateMensajeBody);
  if (!body.ok) return body.error;
  const supabase = await createClient();

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('mensajes')
    .insert({
      conversacion_id: p.data.id,
      emisor_uid: auth.data.user_id,
      emisor_rol: auth.data.rol,
      contenido: body.data.contenido,
      adjunto_url: body.data.adjunto_url,
    })
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', error.message);

  // Actualizar ultimo_mensaje_at en la conversación
  await supabase.from('conversaciones').update({ ultimo_mensaje_at: now }).eq('id', p.data.id);

  return ok(data, 201);
});

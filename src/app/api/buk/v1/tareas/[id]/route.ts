/**
 * /api/buk/v1/tareas/{id}
 *
 * GET    → detalle (RLS Supabase filtra automáticamente)
 * PATCH  → actualizar (empleador edita todo; colaboradora solo cambia estado a 'completada')
 * DELETE → eliminar (admin o empleador-dueño)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { handle, ok, fail, parseParams, parseBody } from '@/lib/api/utils';
import { UpdateTareaBody } from '@/lib/api/schemas/tareas';
import { requireScope } from '@/lib/api/auth';

const uuidParamSchema = z.object({
  id: z.string().uuid('id debe ser UUID válido'),
});

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const raw = await ctx.params;
  const parsed = parseParams(raw, uuidParamSchema);
  if (!parsed.ok) return parsed.error;

  const auth = await requireScope();
  if (!auth.ok) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase.from('tareas').select('*').eq('id', parsed.data.id).single();
  if (error) return fail('NOT_FOUND', 'Tarea no encontrada o sin acceso');
  return ok(data);
});

export const PATCH = handle(async (req: NextRequest, ctx: RouteContext) => {
  const raw = await ctx.params;
  const parsedParams = parseParams(raw, uuidParamSchema);
  if (!parsedParams.ok) return parsedParams.error;

  const auth = await requireScope();
  if (!auth.ok) return auth.error;

  const parsedBody = await parseBody(req, UpdateTareaBody);
  if (!parsedBody.ok) return parsedBody.error;

  // Colaboradora solo puede cambiar estado a completada
  if (auth.data.rol === 'colaboradora') {
    const allowedKeys = ['estado'];
    const givenKeys = Object.keys(parsedBody.data);
    const hasIllegal = givenKeys.some(k => !allowedKeys.includes(k));
    if (hasIllegal || parsedBody.data.estado !== 'completada') {
      return fail('FORBIDDEN', 'Colaboradora solo puede marcar tareas como completadas');
    }
  }

  const updates: Record<string, unknown> = { ...parsedBody.data };
  if (parsedBody.data.estado === 'completada') {
    updates.completada_at = new Date().toISOString();
    updates.completada_por = auth.data.user_id;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tareas')
    .update(updates)
    .eq('id', parsedParams.data.id)
    .select()
    .single();
  if (error) return fail('INTERNAL_ERROR', `Supabase: ${error.message}`);
  return ok(data);
});

export const DELETE = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const raw = await ctx.params;
  const parsed = parseParams(raw, uuidParamSchema);
  if (!parsed.ok) return parsed.error;

  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;

  const supabase = await createClient();
  const { error } = await supabase.from('tareas').delete().eq('id', parsed.data.id);
  if (error) return fail('INTERNAL_ERROR', `Supabase: ${error.message}`);
  return ok({ deleted: true, id: parsed.data.id });
});

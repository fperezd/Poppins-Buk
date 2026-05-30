import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { UpdateBonoBody } from '@/lib/api/schemas/bonos';

interface RouteContext { params: Promise<{ id: string }>; }

export const PATCH = handle(async (req: NextRequest, ctx: RouteContext) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsedParams = parseParams(raw, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;
  const parsedBody = await parseBody(req, UpdateBonoBody);
  if (!parsedBody.ok) return parsedBody.error;
  const sdk = getBukSDK();
  const updated = await sdk.raw().request(`/assigns/${parsedParams.data.id}`, {
    method: 'POST',
    body: parsedBody.data as Record<string, unknown>,
  });
  return ok(updated);
});

export const DELETE = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsed = parseParams(raw, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  await sdk.raw().delete(`/assigns/${parsed.data.id}`);
  return ok({ deleted: true, id: parsed.data.id });
});

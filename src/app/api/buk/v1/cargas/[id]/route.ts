import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { UpdateCargaBody } from '@/lib/api/schemas/cargas';

interface RouteContext { params: Promise<{ id: string }>; }

export const PATCH = handle(async (req: NextRequest, ctx: RouteContext) => {
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsedParams = parseParams(raw, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;
  const parsedBody = await parseBody(req, UpdateCargaBody);
  if (!parsedBody.ok) return parsedBody.error;
  const sdk = getBukSDK();
  const updated = await sdk.raw().request(`/cargas/${parsedParams.data.id}`, {
    method: 'POST', // El SDK base no expone PATCH directo; usamos POST con override
    body: parsedBody.data as Record<string, unknown>,
  });
  return ok(updated);
});

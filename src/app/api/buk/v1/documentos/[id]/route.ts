import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  // Spec de documento (referencia): exigir sesión válida.
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsed = parseParams(raw, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const spec = await sdk.documents.getDocSpec(parsed.data.id);
  return ok(spec);
});

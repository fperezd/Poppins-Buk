import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  // POP-C0-01 (gap /v1): vacación por id (PII). Admin-only hasta POP-C0-12.
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const rawParams = await ctx.params;
  const parsed = parseParams(rawParams, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  // El SDK no expone get(id) directo de vacación; usamos request
  type Vac = unknown;
  const response = await sdk.raw().get<Vac>(`/vacations/${parsed.data.id}`);
  return ok(response.data);
});

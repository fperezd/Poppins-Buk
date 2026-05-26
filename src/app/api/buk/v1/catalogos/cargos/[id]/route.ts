/**
 * /api/buk/v1/catalogos/cargos/{id} → GET /roles/{id}
 */
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, idParamSchema } from '@/lib/api/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsed = parseParams(rawParams, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const role = await sdk.organization.getRole(parsed.data.id);
  return ok(role);
});

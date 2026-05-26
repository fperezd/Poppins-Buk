/**
 * /api/buk/v1/hogares/{id}
 *
 * GET   → detalle del hogar (Area)
 * PATCH → actualizar campos del hogar
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { UpdateHogarBody } from '@/lib/api/schemas/hogares';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsed = parseParams(rawParams, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const area = await sdk.organization.getArea(parsed.data.id);
  return ok(area);
});

export const PATCH = handle(async (req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsedParams = parseParams(rawParams, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;
  const parsedBody = await parseBody(req, UpdateHogarBody);
  if (!parsedBody.ok) return parsedBody.error;
  const sdk = getBukSDK();
  const updated = await sdk.organization.updateArea(parsedParams.data.id, parsedBody.data);
  return ok(updated);
});

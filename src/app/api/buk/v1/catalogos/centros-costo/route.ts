/**
 * /api/buk/v1/catalogos/centros-costo → GET /centro_costo_definitions
 */
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery, paginationQuerySchema } from '@/lib/api/utils';

export const GET = handle(async (req: NextRequest) => {
  const parsed = parseQuery(req, paginationQuerySchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.organization.listCostCenters(parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

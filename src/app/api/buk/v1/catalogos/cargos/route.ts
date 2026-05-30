/**
 * /api/buk/v1/catalogos/cargos → GET /roles
 */
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery } from '@/lib/api/utils';
import { paginationQuerySchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, paginationQuerySchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.organization.listRoles(parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

/**
 * /api/buk/v1/catalogos/familias-cargos → GET /role_families
 */
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok } from '@/lib/api/utils';

export const GET = handle(async (_req: NextRequest) => {
  const sdk = getBukSDK();
  const response = await sdk.organization.listRoleFamilies();
  return ok(response.data, 200, { pagination: response.pagination });
});

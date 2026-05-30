import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (_req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const sdk = getBukSDK();
  const response = await sdk.absences.listLicenseTypes();
  return ok(response.data, 200, { pagination: response.pagination });
});

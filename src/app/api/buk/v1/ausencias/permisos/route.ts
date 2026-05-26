import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery, parseBody } from '@/lib/api/utils';
import { ListAusenciasQuery, CreatePermisoBody } from '@/lib/api/schemas/ausencias';

export const GET = handle(async (req: NextRequest) => {
  const parsed = parseQuery(req, ListAusenciasQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.absences.listPermissions(parsed.data, parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  const parsed = await parseBody(req, CreatePermisoBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.absences.createPermission(parsed.data as unknown as Parameters<typeof sdk.absences.createPermission>[0]);
  return ok(created, 201);
});

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery, parseBody } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { ListAusenciasQuery, CreateLicenciaBody } from '@/lib/api/schemas/ausencias';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListAusenciasQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.absences.listLicenses(parsed.data, parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateLicenciaBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.absences.createLicense(parsed.data as unknown as Parameters<typeof sdk.absences.createLicense>[0]);
  return ok(created, 201);
});

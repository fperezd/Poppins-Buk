import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { ListAusenciasQuery } from '@/lib/api/schemas/ausencias';

export const GET = handle(async (req: NextRequest) => {
  // POP-C0-01 (gap /v1): lista todas las ausencias sin filtro. Admin-only hasta POP-C0-12.
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListAusenciasQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.absences.listAbsences(parsed.data, parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

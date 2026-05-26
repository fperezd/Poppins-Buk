/**
 * /api/buk/v1/hogares
 *
 * GET  → lista areas (= hogares)
 * POST → crea area (POST /organization/areas/)
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery, parseBody } from '@/lib/api/utils';
import { ListHogaresQuery, CreateHogarBody } from '@/lib/api/schemas/hogares';
import { requireScope } from '@/lib/api/auth';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListHogaresQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.organization.listAreas(parsed.data.page, parsed.data.page_size);
  let data = response.data;
  // Empleador y colaboradora: solo ven su propia area
  if (auth.data.rol !== 'admin' && auth.data.buk_area_id !== null) {
    data = data.filter(a => a.id === auth.data.buk_area_id);
  } else if (auth.data.rol !== 'admin') {
    data = [];
  }
  return ok(data, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateHogarBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.organization.createArea(parsed.data);
  return ok(created, 201);
});

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery, parseBody } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { ListHorasExtrasQuery, CreateHorasExtrasBody, UpdateHorasExtrasBody } from '@/lib/api/schemas/horas-extras';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListHorasExtrasQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.overtime.list(parsed.data, parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateHorasExtrasBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.overtime.create(parsed.data);
  return ok(created, 201);
});

export const PUT = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, UpdateHorasExtrasBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const updated = await sdk.overtime.update(parsed.data);
  return ok(updated);
});

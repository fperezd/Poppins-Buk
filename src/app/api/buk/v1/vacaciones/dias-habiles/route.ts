import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery } from '@/lib/api/utils';
import { DiasHabilesQuery } from '@/lib/api/schemas/vacaciones';

export const GET = handle(async (req: NextRequest) => {
  const parsed = parseQuery(req, DiasHabilesQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const response = await sdk.raw().request<unknown>('/vacations/business_days', {
    params: { start_date: parsed.data.desde, end_date: parsed.data.hasta },
  });
  return ok(response);
});

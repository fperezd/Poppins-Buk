import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery } from '@/lib/api/utils';
import { ListLiquidacionesQuery } from '@/lib/api/schemas/liquidaciones';

export const GET = handle(async (req: NextRequest) => {
  const parsed = parseQuery(req, ListLiquidacionesQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const filters = { start: parsed.data.start, end: parsed.data.end };

  let response;
  switch (parsed.data.periodicidad) {
    case 'month':
      response = await sdk.payroll.listMonthly(filters, parsed.data.page, parsed.data.page_size);
      break;
    case 'semi_month':
      response = await sdk.payroll.listSemiMonthly(filters, parsed.data.page, parsed.data.page_size);
      break;
    case 'week':
      response = await sdk.payroll.listWeekly(filters, parsed.data.page, parsed.data.page_size);
      break;
  }
  return ok(response.data, 200, { pagination: response.pagination });
});

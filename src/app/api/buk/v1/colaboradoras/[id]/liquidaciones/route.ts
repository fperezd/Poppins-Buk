import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseQuery, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { EmployeeLiquidacionesQuery } from '@/lib/api/schemas/liquidaciones';

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (req: NextRequest, ctx: RouteContext) => {
  // POP-C0-01 (gap /v1): liquidación de un empleado (PII). Admin-only hasta POP-C0-12.
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsed = parseParams(raw, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const parsedQ = parseQuery(req, EmployeeLiquidacionesQuery);
  if (!parsedQ.ok) return parsedQ.error;
  const sdk = getBukSDK();
  const response = await sdk.payroll.getEmployeePayrollDetail(parsed.data.id, {
    start: parsedQ.data.start,
    end: parsedQ.data.end,
  });
  return ok(response.data, 200, { pagination: response.pagination });
});

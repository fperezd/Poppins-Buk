import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  // POP-C0-01 (gap /v1): saldo de vacaciones de un empleado. Admin-only hasta POP-C0-12.
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsed = parseParams(raw, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const balance = await sdk.absences.getVacationBalance(parsed.data.id);
  return ok(balance);
});

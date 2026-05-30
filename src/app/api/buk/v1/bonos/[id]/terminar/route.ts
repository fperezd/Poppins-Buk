import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { TerminarBonoBody } from '@/lib/api/schemas/bonos';

interface RouteContext { params: Promise<{ id: string }>; }

export const POST = handle(async (req: NextRequest, ctx: RouteContext) => {
  // POP-C0-01 (gap): terminar un bono es acción de gestión de nómina; nunca
  // accesible a colaboradora. Sin este guard cualquier sesión podía terminar
  // cualquier bono por id. Filtrado fino por área = follow-up (multi-tenancy).
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsedParams = parseParams(raw, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;
  const parsedBody = await parseBody(req, TerminarBonoBody);
  if (!parsedBody.ok) return parsedBody.error;
  const sdk = getBukSDK();
  const result = await sdk.raw().post(`/assigns/${parsedParams.data.id}/terminate`, parsedBody.data);
  return ok(result);
});

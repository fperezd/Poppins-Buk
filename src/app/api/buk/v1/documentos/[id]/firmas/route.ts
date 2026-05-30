import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { ProcessSignatureBody } from '@/lib/api/schemas/documentos';

interface RouteContext { params: Promise<{ id: string }>; }

export const POST = handle(async (req: NextRequest, ctx: RouteContext) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsedParams = parseParams(raw, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;
  const parsedBody = await parseBody(req, ProcessSignatureBody);
  if (!parsedBody.ok) return parsedBody.error;
  const sdk = getBukSDK();
  const result = await sdk.documents.processSignature(parsedParams.data.id, parsedBody.data);
  return ok(result);
});

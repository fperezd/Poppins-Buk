import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { UploadDocBody } from '@/lib/api/schemas/documentos';

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  // Los documentos de una colaboradora son data sensible: exigir sesión válida.
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsed = parseParams(raw, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const files = await sdk.documents.listEmployeeDocs(parsed.data.id);
  return ok(files);
});

export const POST = handle(async (req: NextRequest, ctx: RouteContext) => {
  // POP-C0-01 (gap): subir un documento a una colaboradora es acción de gestión;
  // nunca accesible a colaboradora. Sin este guard cualquier sesión podía subir
  // documentos a cualquier empleado por id. Filtrado por área = follow-up.
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const raw = await ctx.params;
  const parsedParams = parseParams(raw, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;
  const parsedBody = await parseBody(req, UploadDocBody);
  if (!parsedBody.ok) return parsedBody.error;
  const sdk = getBukSDK();
  const created = await sdk.documents.uploadEmployeeDoc(parsedParams.data.id, parsedBody.data);
  return ok(created, 201);
});

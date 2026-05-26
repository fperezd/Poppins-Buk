import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams } from '@/lib/api/utils';

const paramsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  file_id: z.string().regex(/^\d+$/).transform(Number),
});

interface RouteContext { params: Promise<{ id: string; file_id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const raw = await ctx.params;
  const parsed = parseParams(raw, paramsSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const doc = await sdk.documents.getEmployeeDoc(parsed.data.id, parsed.data.file_id);
  return ok(doc);
});

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseBody } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { CreateBonoBody } from '@/lib/api/schemas/bonos';

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin', 'empleador']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateBonoBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.raw().post('/assigns', parsed.data);
  return ok(created, 201);
});

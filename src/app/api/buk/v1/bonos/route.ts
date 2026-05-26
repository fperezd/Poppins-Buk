import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseBody } from '@/lib/api/utils';
import { CreateBonoBody } from '@/lib/api/schemas/bonos';

export const POST = handle(async (req: NextRequest) => {
  const parsed = await parseBody(req, CreateBonoBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.raw().post('/assigns', parsed.data);
  return ok(created, 201);
});

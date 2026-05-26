/**
 * GET /api/buk/v1/colaboradoras/{id}/cargas
 *
 * Las cargas familiares se obtienen via /people/{person_id} (no por employee_id directo).
 * Hacemos lookup del person_id desde /employees/{id} y luego pegamos a /people.
 */
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseParams, idParamSchema } from '@/lib/api/utils';

interface RouteContext { params: Promise<{ id: string }>; }

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const raw = await ctx.params;
  const parsed = parseParams(raw, idParamSchema);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const emp = await sdk.employees.get(parsed.data.id);
  const personId = (emp as { person_id?: number }).person_id;
  if (!personId) {
    return ok({ family_responsibilities: [], note: 'employee sin person_id' });
  }
  const person = await sdk.raw().request<{ family_responsibilities?: unknown[] }>(`/people/${personId}`);
  return ok({
    person_id: personId,
    family_responsibilities: person.family_responsibilities ?? [],
  });
});

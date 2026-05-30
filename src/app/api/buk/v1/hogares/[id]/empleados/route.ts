/**
 * /api/buk/v1/hogares/{id}/empleados
 *
 * GET → empleador + colaboradoras asignadas a este hogar (Area).
 *
 * Como Buk no filtra /employees por area_id, listamos todos y filtramos
 * client-side por current_job.area_id.
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, fail, parseParams, idParamSchema } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { CARGO_EMPLEADOR, isColaboradora } from '@/lib/api/schemas/colaboradoras';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsed = parseParams(rawParams, idParamSchema);
  if (!parsed.ok) return parsed.error;

  const hogarId = parsed.data.id;

  // POP-C0-01 (gap /v1): sin este guard cualquier sesión enumeraba el staff de
  // cualquier hogar por id. Admin ve cualquiera; no-admin solo su propia área.
  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  if (auth.data.rol !== 'admin' && auth.data.buk_area_id !== hogarId) {
    return fail('FORBIDDEN', 'Solo puede ver empleados de su propio hogar');
  }
  const sdk = getBukSDK();
  const all = await sdk.employees.listAll();

  const empleados = all.filter(emp => {
    const job = emp.current_job as { area_id?: number } | undefined;
    return job?.area_id === hogarId;
  });

  const empleador = empleados.find(e => e.current_job?.role?.name === CARGO_EMPLEADOR) ?? null;
  const colaboradoras = empleados.filter(e => isColaboradora(e.current_job?.role?.name));

  return ok({
    hogar_id: hogarId,
    empleador,
    colaboradoras,
    total: empleados.length,
  });
});

/**
 * /api/buk/v1/empleadores/{id}
 *
 * GET → detalle del empleador. Valida que el cargo sea "Jefe de Área".
 * PUT → actualizar campos editables (no role, no sueldo).
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, fail, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { UpdateEmpleadorBody, CARGO_EMPLEADOR } from '@/lib/api/schemas/empleadores';
import { requireScope } from '@/lib/api/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsed = parseParams(rawParams, idParamSchema);
  if (!parsed.ok) return parsed.error;

  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  if (auth.data.rol === 'colaboradora') return fail('FORBIDDEN', 'Colaboradoras no acceden a empleadores');
  if (auth.data.rol === 'empleador' && auth.data.buk_employee_id !== parsed.data.id) {
    return fail('FORBIDDEN', 'Solo puede ver su propio perfil de empleador');
  }

  const sdk = getBukSDK();
  const emp = await sdk.employees.get(parsed.data.id);

  if (emp.current_job?.role?.name !== CARGO_EMPLEADOR) {
    return fail(
      'NOT_FOUND',
      `Empleado id=${parsed.data.id} no es empleador. Use /api/buk/v1/colaboradoras/${parsed.data.id}`
    );
  }

  return ok(emp);
});

export const PUT = handle(async (req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsedParams = parseParams(rawParams, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;

  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  if (auth.data.rol === 'colaboradora') return fail('FORBIDDEN', 'Sin permiso');
  if (auth.data.rol === 'empleador' && auth.data.buk_employee_id !== parsedParams.data.id) {
    return fail('FORBIDDEN', 'Solo puede editar su propio perfil');
  }

  const parsedBody = await parseBody(req, UpdateEmpleadorBody);
  if (!parsedBody.ok) return parsedBody.error;

  const sdk = getBukSDK();
  const updated = await sdk.employees.update(
    parsedParams.data.id,
    parsedBody.data as unknown as Parameters<typeof sdk.employees.update>[1]
  );
  return ok(updated);
});

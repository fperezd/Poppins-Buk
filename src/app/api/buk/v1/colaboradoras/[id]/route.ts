/**
 * /api/buk/v1/colaboradoras/{id}
 *
 * GET  → detalle (admin=cualquiera, empleador=de su area, colaboradora=ella misma)
 * PUT  → actualizar (admin o empleador-dueño del area)
 * DELETE → no soportado (usar /baja)
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, fail, parseParams, parseBody, idParamSchema } from '@/lib/api/utils';
import { UpdateColaboradoraBody, CARGO_EMPLEADOR } from '@/lib/api/schemas/colaboradoras';
import { requireScope } from '@/lib/api/auth';

interface RouteContext { params: Promise<{ id: string }>; }

/**
 * Valida si el user puede acceder al empleado especificado.
 * Devuelve null si OK; NextResponse con error si no.
 */
async function canAccessEmployee(empId: number, employeeAreaId: number | undefined) {
  const auth = await requireScope();
  if (!auth.ok) return { auth, denied: auth.error };
  const scope = auth.data;
  if (scope.rol === 'admin') return { auth, denied: null };
  if (scope.rol === 'empleador' && scope.buk_area_id === employeeAreaId) return { auth, denied: null };
  if (scope.rol === 'colaboradora' && scope.buk_employee_id === empId) return { auth, denied: null };
  return { auth, denied: fail('FORBIDDEN', 'Sin acceso a este empleado') };
}

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsed = parseParams(rawParams, idParamSchema);
  if (!parsed.ok) return parsed.error;

  const sdk = getBukSDK();
  const emp = await sdk.employees.get(parsed.data.id);

  if (emp.current_job?.role?.name === CARGO_EMPLEADOR) {
    return fail('NOT_FOUND', `Empleado id=${parsed.data.id} es empleador. Use /api/buk/v1/empleadores/${parsed.data.id}`);
  }

  const areaId = (emp.current_job as { area_id?: number } | undefined)?.area_id;
  const check = await canAccessEmployee(parsed.data.id, areaId);
  if (check.denied) return check.denied;

  return ok(emp);
});

export const PUT = handle(async (req: NextRequest, ctx: RouteContext) => {
  const rawParams = await ctx.params;
  const parsedParams = parseParams(rawParams, idParamSchema);
  if (!parsedParams.ok) return parsedParams.error;

  const sdk = getBukSDK();
  const current = await sdk.employees.get(parsedParams.data.id);
  const areaId = (current.current_job as { area_id?: number } | undefined)?.area_id;

  const auth = await requireScope();
  if (!auth.ok) return auth.error;
  if (auth.data.rol === 'colaboradora') {
    return fail('FORBIDDEN', 'Colaboradoras no pueden editar su propio registro');
  }
  if (auth.data.rol === 'empleador' && auth.data.buk_area_id !== areaId) {
    return fail('FORBIDDEN', 'Solo puede editar colaboradoras de su hogar');
  }

  const parsedBody = await parseBody(req, UpdateColaboradoraBody);
  if (!parsedBody.ok) return parsedBody.error;

  if (parsedBody.data.role_id !== undefined) {
    const role = await sdk.organization.getRole(parsedBody.data.role_id);
    if ((role as { name?: string })?.name === CARGO_EMPLEADOR) {
      return fail('VALIDATION_ERROR', 'No se puede convertir a empleador por esta ruta');
    }
  }

  const updated = await sdk.employees.update(
    parsedParams.data.id,
    parsedBody.data as unknown as Parameters<typeof sdk.employees.update>[1]
  );
  return ok(updated);
});

export const DELETE = handle(async () => {
  return fail('FORBIDDEN', 'DELETE no soportado. Use POST /colaboradoras/{id}/baja');
});

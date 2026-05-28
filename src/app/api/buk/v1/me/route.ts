/**
 * GET /api/buk/v1/me
 *
 * Devuelve el perfil del user autenticado:
 *   - rol (admin | empleador | colaboradora)
 *   - buk_employee_id (si aplica)
 *   - buk_area_id (si aplica) - identifica al tenant (familia)
 *   - empleado Buk asociado (si buk_employee_id existe)
 *   - hogar Buk asociado (si buk_area_id existe)
 *
 * Piloto de withTenantScope() — POP-C0-05 / multi-tenant. Setea Sentry
 * user/tags y devuelve un logger con cid+tenant_id pre-poblados.
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import { withTenantScope } from '@/lib/observability/tenant-scope';

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;

  const { log, scope } = withTenantScope(req, auth.data);
  log.info('Resolviendo /me');

  const sdk = getBukSDK();

  // Fetch del empleado Buk asociado (si aplica)
  let buk_employee = null;
  if (scope.buk_employee_id) {
    try {
      buk_employee = await sdk.employees.get(scope.buk_employee_id);
    } catch (err) {
      log.warn('No se pudo cargar buk_employee', {
        buk_employee_id: scope.buk_employee_id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Fetch del area asociada (si aplica)
  let buk_area = null;
  if (scope.buk_area_id) {
    try {
      buk_area = await sdk.organization.getArea(scope.buk_area_id);
    } catch (err) {
      log.warn('No se pudo cargar buk_area', {
        buk_area_id: scope.buk_area_id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return ok({
    user_id: scope.user_id,
    email: scope.email,
    rol: scope.rol,
    buk_employee_id: scope.buk_employee_id,
    buk_area_id: scope.buk_area_id,
    buk_employee,
    buk_area,
  });
});

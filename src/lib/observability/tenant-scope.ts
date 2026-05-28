/**
 * Tenant scope helper — pegamento entre auth + correlation-id + Sentry.
 *
 * Modelo: Poppins-back es B2C multi-tenant. Cada "familia" (hogar) es un
 * tenant independiente. En el dominio actual, el tenant_id = buk_area_id
 * (la "area" en BUK identifica el hogar, no una empresa). Cuando migremos
 * 100% a /v1/* este id puede pasar a llamarse employer_id; el helper queda
 * estable contra esa rename.
 *
 * Patron de uso en cualquier route handler /v1/*:
 *
 *   export const GET = handle(async (req: NextRequest) => {
 *     const auth = await requireScope();
 *     if (!auth.ok) return auth.error;
 *
 *     const { log, cid, tenantId } = withTenantScope(req, auth.data);
 *     log.info('Procesando request', { extra: 'data' });
 *     // Sentry events posteriores ya tienen tags: tenant_id, rol, user_id,
 *     // correlation_id. setUser ya quedo seteado.
 *
 *     // ... resto del handler
 *   });
 *
 * Garantias:
 * - Sentry.setUser() y setTag() usan AsyncLocalStorage en SDK v10+,
 *   asi que el scope es por-request, no global.
 * - El logger devuelto incluye todos los tags relevantes en cada linea
 *   ([INFO] [cid=...] [user_id=...] [rol=...] [tenant_id=...] [route=...]).
 * - Si el middleware ya seteo correlation_id en Sentry, este lo
 *   sobrescribe identicamente (idempotente).
 */

import * as Sentry from '@sentry/nextjs';
import {
  createLogger,
  getOrCreateCorrelationId,
  type RequestLogger,
} from './correlation-id';
import type { UserScope } from '@/lib/api/auth';

export interface TenantContext {
  /** Correlation-id propagado desde middleware o generado fresh si falta. */
  cid: string;
  /** Logger pre-poblado con cid, user_id, rol, tenant_id, route. */
  log: RequestLogger;
  /**
   * Tenant id en el modelo actual = buk_area_id (familia/hogar).
   * `null` cuando el user es staff Tooxs (rol=admin) sin area asignada.
   */
  tenantId: number | null;
  /** Convenience: el scope que recibimos (passthrough). */
  scope: UserScope;
}

/**
 * Activa el scope tenant-aware para el request actual.
 *
 * Acepta un objeto request-like (NextRequest, Request, o cualquier
 * objeto con `headers` Web-standard). Si el req tiene `nextUrl.pathname`
 * lo anexa como tag `route`.
 */
export function withTenantScope(
  req: {
    headers: Headers | { get(name: string): string | null };
    nextUrl?: { pathname?: string };
    url?: string;
  },
  scope: UserScope
): TenantContext {
  const cid = getOrCreateCorrelationId(req);
  const tenantId = scope.buk_area_id;
  const pathname = req.nextUrl?.pathname ?? (req.url ? safeUrlPathname(req.url) : undefined);

  // Sentry: setUser identifica a la persona, los tags al tenant + request.
  // En multi-tenant B2C el tenant_id es el filtro mas util en el dashboard.
  Sentry.setUser({
    id: scope.user_id,
    email: scope.email ?? undefined,
  });
  Sentry.setTag('correlation_id', cid);
  Sentry.setTag('rol', scope.rol);
  if (tenantId !== null) Sentry.setTag('tenant_id', String(tenantId));
  if (scope.buk_employee_id !== null) {
    Sentry.setTag('buk_employee_id', String(scope.buk_employee_id));
  }

  const log = createLogger(cid, {
    user_id: scope.user_id,
    rol: scope.rol,
    ...(tenantId !== null ? { tenant_id: String(tenantId) } : {}),
    ...(scope.buk_employee_id !== null
      ? { buk_employee_id: String(scope.buk_employee_id) }
      : {}),
    ...(pathname ? { route: pathname } : {}),
  });

  return { cid, log, tenantId, scope };
}

function safeUrlPathname(url: string): string | undefined {
  try {
    return new URL(url).pathname;
  } catch {
    return undefined;
  }
}

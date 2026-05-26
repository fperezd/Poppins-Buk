/**
 * Helpers de auth para route handlers de la API capa.
 *
 * Provee:
 *   - getSession(): devuelve la sesión Supabase y user, o null
 *   - getUserScope(): devuelve { rol, buk_employee_id, buk_area_id, user_id }
 *   - requireScope(): wrapper que devuelve 401/403 si falla la auth/scope
 */

import { createClient } from '@/lib/supabase/server';
import { fail } from './utils';
import type { NextResponse } from 'next/server';

export type RolPoppins = 'admin' | 'empleador' | 'colaboradora';

export interface UserScope {
  user_id: string;
  rol: RolPoppins;
  buk_employee_id: number | null;
  buk_area_id: number | null;
  email: string | null;
}

/**
 * Devuelve el user autenticado (o null si no hay sesión).
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Devuelve el scope completo del user: rol + buk_employee_id + buk_area_id.
 * Hace lookup en user_profiles.
 */
export async function getUserScope(): Promise<UserScope | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('rol, buk_employee_id, buk_area_id')
    .eq('user_id', user.id)
    .single();

  if (error || !profile) {
    console.warn('[auth] user sin profile:', user.id, error?.message);
    return null;
  }

  const p = profile as { rol: RolPoppins; buk_employee_id: number | null; buk_area_id: number | null };
  return {
    user_id: user.id,
    rol: p.rol,
    buk_employee_id: p.buk_employee_id,
    buk_area_id: p.buk_area_id,
    email: user.email ?? null,
  };
}

/**
 * Wrapper para handlers que requieren auth + scope opcional.
 *
 * Uso:
 *   export const GET = handle(async (req) => {
 *     const scope = await requireScope(['admin', 'empleador']);
 *     if (!scope.ok) return scope.error;
 *     // ... scope.data.rol, scope.data.buk_area_id
 *   });
 */
export async function requireScope(
  allowedRoles?: RolPoppins[]
): Promise<{ ok: true; data: UserScope } | { ok: false; error: NextResponse }> {
  const scope = await getUserScope();
  if (!scope) {
    return { ok: false, error: fail('UNAUTHORIZED', 'Sesión inválida o user sin perfil') };
  }
  if (allowedRoles && !allowedRoles.includes(scope.rol)) {
    return {
      ok: false,
      error: fail('FORBIDDEN', `Rol ${scope.rol} no permitido. Requerido: ${allowedRoles.join(', ')}`),
    };
  }
  return { ok: true, data: scope };
}

/**
 * Filtra colaboradoras según scope:
 *   - admin: ve todas
 *   - empleador: solo las de su buk_area_id
 *   - colaboradora: solo a sí misma
 */
export function filterByScope<T extends { current_job?: { area_id?: number }; id?: number }>(
  items: T[],
  scope: UserScope
): T[] {
  if (scope.rol === 'admin') return items;
  if (scope.rol === 'empleador') {
    return items.filter(i => i.current_job?.area_id === scope.buk_area_id);
  }
  if (scope.rol === 'colaboradora') {
    return items.filter(i => i.id === scope.buk_employee_id);
  }
  return [];
}

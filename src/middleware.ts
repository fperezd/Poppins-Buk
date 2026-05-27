/**
 * Next.js middleware — protege rutas que requieren autenticación Supabase.
 *
 * Comportamiento:
 *   - Refresca el token de Supabase en cada request (necesario para SSR)
 *   - Rutas públicas: /, /login, /auth/*, /api/auth/*, /_next/*
 *   - Resto: requiere sesión válida
 *   - APIs (/api/*) devuelven 401 JSON si no hay sesión
 *   - Páginas (/dashboard/*) redirigen a /login
 *
 * POP-C0-01 (legacy authz hardening):
 *   Las rutas legacy `/api/buk/<entity>` (sin `/v1/`) solo son accesibles a
 *   `rol = admin`. Cualquier otro rol (empleador, colaboradora) recibe 403.
 *   Razón: estas rutas devuelven data sin filtrar por scope del usuario.
 *   En Sprint 0 estas rutas se eliminan en favor de `/api/buk/v1/*` que sí
 *   tienen `requireScope` granular por rol.
 *
 * POP-C0-15 (correlation-id):
 *   Asigna `x-request-id` a cada request si no viene desde upstream.
 *   Lo propaga a los response headers para que el frontend pueda correlar logs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import * as Sentry from '@sentry/nextjs';
import { CORRELATION_HEADER, getOrCreateCorrelationId } from '@/lib/observability/correlation-id';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/auth/callback',
  '/api/auth/callback',
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/auth/')) return true;
  if (pathname.startsWith('/api/auth/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname.startsWith('/favicon')) return true;
  // Webhooks tienen su propio auth (HMAC), no requieren sesión Supabase
  if (pathname.startsWith('/api/webhooks/')) return true;
  return false;
}

/**
 * POP-C0-01: identifica si una ruta es "legacy /api/buk/*" sin filtrado de scope.
 * Cualquier ruta que empieza con `/api/buk/` pero NO con `/api/buk/v1/`.
 */
function isLegacyBukRoute(pathname: string): boolean {
  return pathname.startsWith('/api/buk/') && !pathname.startsWith('/api/buk/v1/');
}

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  // ── POP-C0-15: Correlation-ID ──
  // Si viene de upstream, lo respetamos. Sino, generamos uno.
  const cid = getOrCreateCorrelationId(req);
  response.headers.set(CORRELATION_HEADER, cid);

  // POP-C0-05: anexa cid al isolation scope de Sentry para que los eventos
  // posteriores del request lo lleven como tag (Sentry usa AsyncLocalStorage
  // para mantener este scope por-request).
  Sentry.setTag('correlation_id', cid);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          response.headers.set(CORRELATION_HEADER, cid);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca el token si está cerca de expirar
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  if (isPublic(pathname)) {
    return response;
  }

  if (!user) {
    // API → 401 JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sesión requerida' } },
        { status: 401, headers: { [CORRELATION_HEADER]: cid } }
      );
    }
    // Página → redirect a login con returnTo
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── POP-C0-01: Hardening de rutas legacy /api/buk/* (no v1) ──
  // Solo admin las puede consumir. Cierre del agujero "colaboradora lee toda la nómina".
  //
  // Escape valve: LEGACY_BUK_ADMIN_ONLY=false desactiva el bloqueo temporalmente.
  // Útil mientras se migran las 5 páginas del dashboard a /v1/* (story POP-C1-07).
  // Default = true para seguridad.
  const LEGACY_RESTRICT_ENABLED = process.env.LEGACY_BUK_ADMIN_ONLY !== 'false';

  if (LEGACY_RESTRICT_ENABLED && isLegacyBukRoute(pathname)) {
    // Lookup rol en user_profiles
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('rol')
      .eq('user_id', user.id)
      .single();

    const rol = (profile as { rol?: string } | null)?.rol;

    if (rol !== 'admin') {
      console.warn(
        `[POP-C0-01] Bloqueado acceso legacy ${pathname} a user ${user.id} con rol=${rol ?? 'desconocido'} cid=${cid}`
      );
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message:
              'Endpoint legacy solo accesible para admin. Migrá tu cliente a /api/buk/v1/* que tiene authz granular.',
            ticket: 'POP-C0-01',
            hint: 'Operadores: pueden setear LEGACY_BUK_ADMIN_ONLY=false temporalmente mientras se migran las páginas dashboard a /v1/. Documentado en HANDOFF_SESSION_2.md.',
          },
        },
        { status: 403, headers: { [CORRELATION_HEADER]: cid } }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Aplica a todo excepto static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

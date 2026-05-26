/**
 * Next.js middleware — protege rutas que requieren autenticación Supabase.
 *
 * Comportamiento:
 *   - Refresca el token de Supabase en cada request (necesario para SSR)
 *   - Rutas públicas: /, /login, /auth/*, /api/auth/*, /_next/*
 *   - Resto: requiere sesión válida
 *   - APIs (/api/*) devuelven 401 JSON si no hay sesión
 *   - Páginas (/dashboard/*) redirigen a /login
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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
  return false;
}

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

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
        { status: 401 }
      );
    }
    // Página → redirect a login con returnTo
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Aplica a todo excepto static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

/**
 * GET /auth/callback?code=<oauth_code>&next=<path>
 *
 * Endpoint que recibe el redirect de Supabase Auth tras OAuth (Google,
 * etc.). Hace el intercambio code -> sesion (PKCE flow) y redirige al
 * destino indicado por el caller (default /dashboard).
 *
 * El middleware ya marca esta ruta como publica (sin requireScope).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing_code', origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  return NextResponse.redirect(new URL(next, origin));
}

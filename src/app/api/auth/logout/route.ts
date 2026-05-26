/**
 * POST /api/auth/logout
 *
 * Cierra la sesión del user (limpia cookies Supabase).
 * Redirige al cliente a /login.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ data: { logged_out: true } });
}

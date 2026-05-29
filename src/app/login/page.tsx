'use client';

/**
 * Pagina /login — Google OAuth + Phone OTP.
 *
 * Metodos de auth, en orden de preferencia:
 *   1) Google OAuth (PKCE) - funciona out of the box, sin proveedor externo.
 *      Flow: signInWithOAuth -> Google consent -> /auth/callback -> exchange.
 *   2) Phone OTP (SMS) - requiere SMS provider configurado en Supabase
 *      (Twilio / Vonage / MessageBird). Sin provider devuelve
 *      "Unsupported phone provider".
 *
 * El boton de Google es el camino feliz hoy. Phone OTP queda como
 * fallback documentado mientras no haya cuenta Twilio.
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get('returnTo') || '/dashboard';
  const errorParam = params.get('error');

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+56');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(returnTo);
    });
  }, [router, returnTo]);

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', returnTo);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl.toString() },
    });
    if (error) {
      setGoogleLoading(false);
      setError(error.message);
    }
    // Si no hay error, Supabase redirige al consent de Google.
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setStep('code');
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.replace(returnTo);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui'
    }}>
      <div style={{
        background: 'white', padding: 32, borderRadius: 12, width: '100%',
        maxWidth: 380, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Poppins</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
          {step === 'phone' ? 'Iniciá sesión' : 'Ingresa el código que recibiste'}
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: 12,
            borderRadius: 6, fontSize: 14, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {step === 'phone' && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              style={{
                width: '100%', padding: '10px 16px', background: 'white',
                color: '#374151', border: '1px solid #d1d5db', borderRadius: 6,
                fontSize: 14, fontWeight: 500,
                cursor: googleLoading ? 'wait' : 'pointer',
                opacity: googleLoading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 16,
              }}
            >
              <GoogleLogo />
              {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
              color: '#9ca3af', fontSize: 12,
            }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              o por teléfono
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
          </>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#374151' }}>
              Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+56 9 1234 5678"
              required
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                borderRadius: 6, fontSize: 16, marginBottom: 16, boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '10px 16px', background: '#111827',
                color: 'white', border: 'none', borderRadius: 6, fontSize: 14,
                fontWeight: 500, cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#374151' }}>
              Código de 6 dígitos
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              required
              maxLength={6}
              autoFocus
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                borderRadius: 6, fontSize: 20, marginBottom: 16, letterSpacing: 4,
                textAlign: 'center', boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              style={{
                width: '100%', padding: '10px 16px', background: '#111827',
                color: 'white', border: 'none', borderRadius: 6, fontSize: 14,
                fontWeight: 500, cursor: (loading || code.length !== 6) ? 'not-allowed' : 'pointer',
                opacity: (loading || code.length !== 6) ? 0.6 : 1, marginBottom: 12
              }}
            >
              {loading ? 'Verificando...' : 'Verificar e ingresar'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('phone'); setCode(''); setError(null); }}
              style={{
                width: '100%', padding: '8px 16px', background: 'transparent',
                color: '#6b7280', border: 'none', fontSize: 13, cursor: 'pointer'
              }}
            >
              ← Cambiar teléfono
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Cargando...</div>}>
      <LoginInner />
    </Suspense>
  );
}

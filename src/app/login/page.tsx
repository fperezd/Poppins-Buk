'use client';

/**
 * Página /login — Phone OTP.
 *
 * Flujo:
 *   1) Usuario ingresa teléfono → supabase.auth.signInWithOtp({ phone })
 *      Supabase envía OTP por SMS o WhatsApp (depende del provider configurado).
 *   2) Usuario ingresa el código → supabase.auth.verifyOtp({ phone, token, type: 'sms' })
 *   3) Si exitoso, redirige al returnTo (o /dashboard).
 *
 * Configuración requerida en Supabase Console:
 *   Settings → Authentication → Providers → Phone:
 *     - habilitar provider Phone
 *     - configurar Twilio/Vonage/MessageBird (con WhatsApp channel si se desea)
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get('returnTo') || '/dashboard';

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+56');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión, redirige
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(returnTo);
    });
  }, [router, returnTo]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        // 'whatsapp' o 'sms' según provider; default sms si no se especifica
        channel: 'sms',
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep('code');
    }
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
    if (error) {
      setError(error.message);
    } else {
      router.replace(returnTo);
    }
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
          {step === 'phone' ? 'Ingresa tu teléfono para recibir un código' : 'Ingresa el código que recibiste'}
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: 12,
            borderRadius: 6, fontSize: 14, marginBottom: 16
          }}>
            {error}
          </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Cargando...</div>}>
      <LoginInner />
    </Suspense>
  );
}

/**
 * POP-C0-05: Sentry init en el browser.
 *
 * Multi-tenant (B2C): cuando el cliente carga, despues del login Supabase,
 * el provider raiz debe llamar Sentry.setUser({ id: session.user.id })
 * y Sentry.setTag('employer_id', employer.id) para que los eventos
 * client-side se agrupen por familia.
 */

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const env = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development';

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: env,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Sampling: prod 10%, otros 100%
  tracesSampleRate: env === 'production' ? 0.1 : 1.0,

  // Session Replay opt-out por defecto en B2C (privacidad familias).
  // Activar replaysOnErrorSampleRate puntualmente para debugging incidentes.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  sendDefaultPii: false,
});

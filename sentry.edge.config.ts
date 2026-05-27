/**
 * POP-C0-05: Sentry init para el Edge runtime (middleware + edge routes).
 *
 * El Edge runtime es restrictivo: no soporta integrations que dependan
 * de Node APIs (fs, native crypto, OpenTelemetry tracing nativo).
 * Mantenemos init minimo aqui — Sentry detecta el runtime y carga solo
 * lo compatible.
 *
 * Carga: instrumentation.ts -> aqui en process.env.NEXT_RUNTIME === 'edge'.
 */

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;
const env = process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development';

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: env,
  release: process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: env === 'production' ? 0.1 : 1.0,
  sendDefaultPii: false,
});

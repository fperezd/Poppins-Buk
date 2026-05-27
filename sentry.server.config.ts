/**
 * POP-C0-05: Sentry init para el Node.js runtime de Next.js.
 *
 * Carga: instrumentation.ts -> aqui en process.env.NEXT_RUNTIME === 'nodejs'.
 *
 * Multi-tenant (B2C): cada handler debe setear scope por request con
 *   Sentry.setUser({ id: user.id })            // empleador (head of household)
 *   Sentry.setTags({ employer_id, cid })       // tenant boundary + correlation
 * para que el error grouping y los filtros del dashboard sean por familia.
 *
 * El singleton de scope NO es por request; usar withScope o setScopeContext.
 */

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;
const env = process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development';

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: env,
  release: process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA,

  // Sampling: prod 10%, otros 100%
  tracesSampleRate: env === 'production' ? 0.1 : 1.0,

  // No envies headers de cookies (PII de sesion Supabase)
  sendDefaultPii: false,

  // Scrubbing minimo: RUT chileno (12.345.678-9), emails de no-staff,
  // y strings que parecen tokens/secrets.
  beforeSend(event) {
    return scrubPii(event);
  },
  beforeSendTransaction(transaction) {
    return scrubPii(transaction);
  },
});

const RUT_RE = /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/g;
const BEARER_RE = /Bearer\s+[A-Za-z0-9._-]+/g;

function scrubPii<T extends { message?: string; request?: { data?: unknown; headers?: Record<string, string> } }>(
  event: T
): T {
  if (event.message) {
    event.message = event.message.replace(RUT_RE, '[RUT_REDACTED]').replace(BEARER_RE, 'Bearer [REDACTED]');
  }
  // Authorization y cookie nunca llegan a Sentry
  if (event.request?.headers) {
    delete event.request.headers.authorization;
    delete event.request.headers.cookie;
    delete event.request.headers['x-supabase-auth'];
  }
  return event;
}

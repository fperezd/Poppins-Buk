/**
 * Next.js instrumentation hook — corre una sola vez en el boot del server.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * POP-C0-05: carga Sentry segun el runtime (nodejs vs edge).
 */

import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Captura errores de React Server Components y route handlers.
export const onRequestError = Sentry.captureRequestError;

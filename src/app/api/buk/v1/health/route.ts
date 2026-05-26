/**
 * /api/buk/v1/health
 *
 * GET → reporta:
 *   - status de conexión a Buk
 *   - latencia
 *   - version SDK / API
 *   - tenant configurado
 */
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok } from '@/lib/api/utils';

export const GET = handle(async (_req: NextRequest) => {
  const sdk = getBukSDK();
  const result = await sdk.healthCheck();
  const baseUrl = process.env.BUK_API_BASE_URL || 'https://app.buk.cl/api/v1/chile';
  return ok({
    buk: {
      ok: result.ok,
      latency_ms: result.latencyMs,
      error: result.error,
      tenant: new URL(baseUrl).hostname,
    },
    api: {
      version: 'v1',
      timestamp: new Date().toISOString(),
    },
  });
});

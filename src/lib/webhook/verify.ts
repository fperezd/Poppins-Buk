/**
 * POP-C0-02: HMAC verification para webhooks entrantes.
 *
 * BUK envía webhooks firmando el body con HMAC-SHA256 + shared secret.
 * Nosotros verificamos antes de procesar — sin firma válida = 401.
 *
 * Configurar en BUK: Configuración → Acceso API → URLs Webhooks → Secret compartido.
 * Secret vive en env var `BUK_WEBHOOK_SECRET` (rotación anual mínima — regla R16).
 */

import crypto from 'crypto';

export interface VerifyResult {
  valid: boolean;
  reason?: 'missing_signature' | 'missing_secret' | 'invalid_signature';
}

/**
 * Verifica firma HMAC-SHA256 de un webhook usando comparación timing-safe.
 *
 * @param body - El body RAW del request (string, NO el JSON parseado).
 * @param signature - El header de firma (típicamente `X-Buk-Signature` o `X-Flow-Signature`).
 * @param secret - El shared secret configurado en el provider del webhook.
 * @returns { valid: boolean, reason?: string }
 */
export function verifyWebhookSignature(
  body: string,
  signature: string | null | undefined,
  secret: string | null | undefined,
): VerifyResult {
  if (!signature) return { valid: false, reason: 'missing_signature' };
  if (!secret) return { valid: false, reason: 'missing_secret' };

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  // Comparación timing-safe para evitar timing attacks
  // Las strings deben tener mismo largo para timingSafeEqual
  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length) {
    return { valid: false, reason: 'invalid_signature' };
  }

  const ok = crypto.timingSafeEqual(sigBuf, expBuf);
  return ok ? { valid: true } : { valid: false, reason: 'invalid_signature' };
}

/**
 * Verificar firma específica de BUK.
 * Header: `X-Buk-Signature`. Env var: `BUK_WEBHOOK_SECRET`.
 */
export function verifyBukWebhook(body: string, signature: string | null | undefined): VerifyResult {
  return verifyWebhookSignature(body, signature, process.env.BUK_WEBHOOK_SECRET);
}

/**
 * Verificar firma específica de Flow.cl.
 * Flow.cl usa MD5 + token según docs — actualizar cuando integremos en Sprint 4.
 * Por ahora dejamos el shape preparado.
 */
export function verifyFlowWebhook(body: string, signature: string | null | undefined): VerifyResult {
  return verifyWebhookSignature(body, signature, process.env.FLOW_WEBHOOK_SECRET);
}

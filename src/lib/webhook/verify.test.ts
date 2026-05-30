import { describe, it, expect, afterEach } from 'vitest';
import crypto from 'crypto';
import {
  verifyWebhookSignature,
  verifyBukWebhook,
  verifyFlowWebhook,
} from './verify';

/** Helper: firma un body como lo haría el provider (HMAC-SHA256 hex). */
function sign(body: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

describe('verifyWebhookSignature', () => {
  const SECRET = 'super-secret-shared-key';
  const BODY = JSON.stringify({ data: { event_type: 'employee.updated', id: 42 } });

  it('acepta una firma HMAC-SHA256 válida', () => {
    const sig = sign(BODY, SECRET);
    expect(verifyWebhookSignature(BODY, sig, SECRET)).toEqual({ valid: true });
  });

  it('rechaza cuando falta la firma', () => {
    expect(verifyWebhookSignature(BODY, null, SECRET)).toEqual({
      valid: false,
      reason: 'missing_signature',
    });
    expect(verifyWebhookSignature(BODY, undefined, SECRET)).toEqual({
      valid: false,
      reason: 'missing_signature',
    });
    expect(verifyWebhookSignature(BODY, '', SECRET)).toEqual({
      valid: false,
      reason: 'missing_signature',
    });
  });

  it('rechaza cuando falta el secret (config error)', () => {
    const sig = sign(BODY, SECRET);
    expect(verifyWebhookSignature(BODY, sig, null)).toEqual({
      valid: false,
      reason: 'missing_secret',
    });
    expect(verifyWebhookSignature(BODY, sig, undefined)).toEqual({
      valid: false,
      reason: 'missing_secret',
    });
  });

  it('rechaza una firma generada con el secret equivocado', () => {
    const sig = sign(BODY, 'otro-secret');
    expect(verifyWebhookSignature(BODY, sig, SECRET)).toEqual({
      valid: false,
      reason: 'invalid_signature',
    });
  });

  it('rechaza cuando el body fue alterado (firma ya no corresponde)', () => {
    const sig = sign(BODY, SECRET);
    const tamperedBody = BODY.replace('employee.updated', 'employee.deleted');
    expect(verifyWebhookSignature(tamperedBody, sig, SECRET)).toEqual({
      valid: false,
      reason: 'invalid_signature',
    });
  });

  it('rechaza firmas de distinto largo sin reventar (guard de timingSafeEqual)', () => {
    // timingSafeEqual exige buffers del mismo largo; la función debe
    // cortocircuitar a invalid_signature en vez de lanzar.
    expect(verifyWebhookSignature(BODY, 'abc123', SECRET)).toEqual({
      valid: false,
      reason: 'invalid_signature',
    });
  });

  it('rechaza una firma del largo correcto pero contenido distinto', () => {
    const sig = sign(BODY, SECRET);
    // Mismo largo (64 hex chars) pero un caracter cambiado.
    const flipped = (sig[0] === 'a' ? 'b' : 'a') + sig.slice(1);
    expect(flipped).toHaveLength(sig.length);
    expect(verifyWebhookSignature(BODY, flipped, SECRET)).toEqual({
      valid: false,
      reason: 'invalid_signature',
    });
  });

  it('es sensible al body exacto (whitespace cuenta)', () => {
    const sig = sign(BODY, SECRET);
    expect(verifyWebhookSignature(BODY + ' ', sig, SECRET).valid).toBe(false);
  });
});

describe('verifyBukWebhook / verifyFlowWebhook (env-backed)', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('verifyBukWebhook usa BUK_WEBHOOK_SECRET del env', () => {
    process.env.BUK_WEBHOOK_SECRET = 'buk-secret';
    const body = '{"ping":true}';
    const sig = sign(body, 'buk-secret');
    expect(verifyBukWebhook(body, sig)).toEqual({ valid: true });
  });

  it('verifyBukWebhook devuelve missing_secret si la env var no está seteada', () => {
    delete process.env.BUK_WEBHOOK_SECRET;
    expect(verifyBukWebhook('{}', 'whatever')).toEqual({
      valid: false,
      reason: 'missing_secret',
    });
  });

  it('verifyFlowWebhook usa FLOW_WEBHOOK_SECRET del env', () => {
    process.env.FLOW_WEBHOOK_SECRET = 'flow-secret';
    const body = '{"flow":1}';
    const sig = sign(body, 'flow-secret');
    expect(verifyFlowWebhook(body, sig)).toEqual({ valid: true });
  });
});

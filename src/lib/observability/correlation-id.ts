/**
 * POP-C0-15: Correlation-ID propagation utility.
 *
 * Cada request inbound se asocia a un correlation-id único (x-request-id).
 * Lo propagamos a través de:
 *   web → api-id → api-buk → BUK API
 *   web → api-id → Supabase
 *
 * Esto permite trazar un request end-to-end en logs/Sentry.
 *
 * Uso:
 *   import { getOrCreateCorrelationId } from '@/lib/observability/correlation-id';
 *   const cid = getOrCreateCorrelationId(req);
 *   logger.info({ cid, ... }, 'Procesando request');
 *   // Al llamar a BUK SDK o servicios externos, pasar como header.
 */

export const CORRELATION_HEADER = 'x-request-id';

/**
 * Obtiene el correlation-id del request entrante o genera uno nuevo.
 * Acepta tanto Request (Web standard) como NextRequest.
 */
export function getOrCreateCorrelationId(req: { headers: Headers | { get(name: string): string | null } }): string {
  const existing = req.headers.get(CORRELATION_HEADER);
  if (existing && isValidCorrelationId(existing)) return existing;
  return generateCorrelationId();
}

/**
 * Genera un nuevo correlation-id. Formato: `req_<8-char-hex>_<timestamp-base36>`.
 * Más corto que UUID v4 pero suficientemente único para nuestras necesidades.
 */
export function generateCorrelationId(): string {
  const random = globalThis.crypto.randomUUID().slice(0, 8);
  const ts = Date.now().toString(36);
  return `req_${random}_${ts}`;
}

/**
 * Valida formato del correlation-id para evitar inyección.
 * Acepta nuestro formato OR UUID v4 OR cualquier alfanumérico razonable.
 */
export function isValidCorrelationId(id: string): boolean {
  // Max length 100, solo alfanumérico + - _ . :
  if (id.length === 0 || id.length > 100) return false;
  return /^[a-zA-Z0-9\-_.:]+$/.test(id);
}

/**
 * Headers para propagar a llamadas server-to-server.
 * Incluye correlation-id y any context relevante.
 */
export function propagationHeaders(cid: string, extra?: Record<string, string>): Record<string, string> {
  return {
    [CORRELATION_HEADER]: cid,
    ...(extra ?? {}),
  };
}

/**
 * Wrapper de fetch que automáticamente propaga el correlation-id.
 *
 * @example
 *   const cid = getOrCreateCorrelationId(req);
 *   const res = await fetchWithCorrelation('https://api.buk.cl/employees', { cid });
 */
export async function fetchWithCorrelation(
  url: string | URL,
  options: RequestInit & { cid: string },
): Promise<Response> {
  const { cid, headers, ...rest } = options;
  return fetch(url, {
    ...rest,
    headers: {
      ...headers,
      [CORRELATION_HEADER]: cid,
    },
  });
}

/**
 * Logger helper con correlation-id automático.
 * Usar en route handlers para logs estructurados con el cid embebido.
 *
 * @example
 *   const log = createLogger(cid, { route: '/api/v1/colaboradoras' });
 *   log.info('Listando colaboradoras', { count: 42 });
 *   // → [INFO] [cid=req_xxx_abc] [route=/api/v1/colaboradoras] Listando colaboradoras count=42
 */
export interface RequestLogger {
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
  debug(msg: string, meta?: Record<string, unknown>): void;
}

export function createLogger(cid: string, baseContext: Record<string, string> = {}): RequestLogger {
  const baseTags = Object.entries(baseContext)
    .map(([k, v]) => `[${k}=${v}]`)
    .join(' ');
  const prefix = baseTags ? `[cid=${cid}] ${baseTags}` : `[cid=${cid}]`;

  const fmt = (msg: string, meta?: Record<string, unknown>): string => {
    if (!meta || Object.keys(meta).length === 0) return `${prefix} ${msg}`;
    const metaStr = Object.entries(meta)
      .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join(' ');
    return `${prefix} ${msg} ${metaStr}`;
  };

  return {
    info(msg, meta) { console.log(`[INFO] ${fmt(msg, meta)}`); },
    warn(msg, meta) { console.warn(`[WARN] ${fmt(msg, meta)}`); },
    error(msg, meta) { console.error(`[ERROR] ${fmt(msg, meta)}`); },
    debug(msg, meta) { if (process.env.DEBUG) console.debug(`[DEBUG] ${fmt(msg, meta)}`); },
  };
}

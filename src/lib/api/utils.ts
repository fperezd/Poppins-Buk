/**
 * Utils compartidos para la API capa de Poppins.
 *
 * Provee:
 *   - parseQuery / parseBody / parseParams: validación con Zod
 *   - ok / fail: respuestas estándar
 *   - bukErrorToApiError: mapea errores del SDK Buk a errores API
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';
import { BukApiError } from '@/lib/buk-sdk';

// ── Códigos de error estándar ──

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'BUK_API_ERROR'
  | 'INTERNAL_ERROR';

const ERROR_HTTP: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  BUK_API_ERROR: 502,
  INTERNAL_ERROR: 500,
};

// ── Respuestas estándar ──

interface ApiSuccessBody<T> {
  data: T;
  pagination?: unknown;
  meta?: Record<string, unknown>;
}

interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, string[]>;
  };
}

export function ok<T>(data: T, status = 200, extra?: Omit<ApiSuccessBody<T>, 'data'>): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json({ data, ...extra }, { status });
}

export function fail(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, string[]>
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status: ERROR_HTTP[code] }
  );
}

// ── Resultado de validación ──

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: NextResponse<ApiErrorBody> };

function zodErrorToDetails(err: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const path = issue.path.length ? issue.path.join('.') : '_';
    if (!details[path]) details[path] = [];
    details[path].push(issue.message);
  }
  return details;
}

/**
 * Parsea ?query=string contra un schema Zod.
 * Devuelve { ok, data } o { ok: false, error: NextResponse }.
 */
export function parseQuery<T extends ZodSchema>(
  req: NextRequest,
  schema: T
): ParseResult<z.infer<T>> {
  const params: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  const result = schema.safeParse(params);
  if (!result.success) {
    return {
      ok: false,
      error: fail('VALIDATION_ERROR', 'Query inválida', zodErrorToDetails(result.error)),
    };
  }
  return { ok: true, data: result.data };
}

/**
 * Parsea el body JSON de la request contra un schema Zod.
 */
export async function parseBody<T extends ZodSchema>(
  req: NextRequest,
  schema: T
): Promise<ParseResult<z.infer<T>>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      ok: false,
      error: fail('VALIDATION_ERROR', 'JSON body inválido o ausente'),
    };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      error: fail('VALIDATION_ERROR', 'Body inválido', zodErrorToDetails(result.error)),
    };
  }
  return { ok: true, data: result.data };
}

/**
 * Parsea params dinámicos (de [id]/route.ts) contra un schema Zod.
 */
export function parseParams<T extends ZodSchema>(
  raw: unknown,
  schema: T
): ParseResult<z.infer<T>> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      error: fail('VALIDATION_ERROR', 'Parámetros de ruta inválidos', zodErrorToDetails(result.error)),
    };
  }
  return { ok: true, data: result.data };
}

// ── Wrapper para handlers: convierte excepciones del SDK en respuestas API ──

/**
 * Mapea un BukApiError a nuestro shape de error API.
 */
export function bukErrorToApiError(err: unknown): NextResponse<ApiErrorBody> {
  if (err instanceof BukApiError) {
    if (err.isUnauthorized) return fail('UNAUTHORIZED', 'Token Buk inválido o expirado');
    if (err.isForbidden) return fail('FORBIDDEN', 'Permisos insuficientes en Buk');
    if (err.isNotFound) return fail('NOT_FOUND', `Recurso Buk no encontrado: ${err.endpoint}`);
    if (err.isRateLimited) return fail('RATE_LIMITED', 'Buk rate limit alcanzado, reintentar luego');
    if (err.isServerError) return fail('BUK_API_ERROR', `Buk respondió ${err.status}`);
    return fail('BUK_API_ERROR', err.message);
  }
  if (err instanceof Error) {
    return fail('INTERNAL_ERROR', err.message);
  }
  return fail('INTERNAL_ERROR', 'Error desconocido');
}

/**
 * Wrapper para envolver handlers async. Atrapa errores y los convierte a respuesta API estándar.
 *
 * @example
 *   export const GET = handle(async (req) => {
 *     const sdk = getBukSDK();
 *     const data = await sdk.employees.list();
 *     return ok(data);
 *   });
 */
export function handle<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse>
): (...args: Args) => Promise<NextResponse> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (err) {
      const route = (args[0] as NextRequest | undefined)?.nextUrl?.pathname ?? 'unknown';
      console.error(`[API] ${route}:`, err);
      return bukErrorToApiError(err);
    }
  };
}

// ── Schemas Zod comunes ──

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id debe ser numérico').transform(Number),
});

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().transform(v => (v ? Number(v) : undefined)),
  page_size: z.string().regex(/^\d+$/).optional().transform(v => (v ? Math.min(Number(v), 100) : undefined)),
});

/**
 * Coerciona "true"/"false"/"1"/"0" a boolean. Útil en query strings.
 */
export const boolStringSchema = z
  .union([z.literal('true'), z.literal('false'), z.literal('1'), z.literal('0')])
  .transform(v => v === 'true' || v === '1');

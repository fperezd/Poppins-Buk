/**
 * Cliente HTTP tipado para consumir /api/buk/v1/* desde el frontend.
 *
 * Convenciones:
 *   - Respuesta exitosa: { data, pagination?, meta? }
 *   - Respuesta error: { error: { code, message, details? } }
 *   - Lanza ApiError en respuestas 4xx/5xx
 *
 * Uso:
 *   const colaboradoras = await apiFetch<Colaboradora[]>('/colaboradoras');
 *   await apiPost('/empleadores', { hogar: {...}, empleador: {...} });
 */

export const API_BASE = '/api/buk/v1';

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    count: number;
    total_pages: number;
    current_page?: number;
    next: string | null;
    previous: string | null;
  };
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, string[]>;

  constructor(code: string, message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_BASE}${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });
  }
  return typeof window !== 'undefined' ? url.pathname + url.search : url.toString();
}

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try { body = (await res.json()) as ApiErrorBody; } catch { /* */ }
    const err = body?.error;
    throw new ApiError(
      err?.code || 'UNKNOWN_ERROR',
      err?.message || `HTTP ${res.status} ${res.statusText}`,
      res.status,
      err?.details,
    );
  }
  return (await res.json()) as ApiResponse<T>;
}

/**
 * GET /api/buk/v1{path}
 */
export async function apiFetch<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options?.query);
  const res = await fetch(url, { signal: options?.signal });
  return parseResponse<T>(res);
}

/**
 * POST /api/buk/v1{path}
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options?.query);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });
  return parseResponse<T>(res);
}

export async function apiPut<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options?.query);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });
  return parseResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options?.query);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });
  return parseResponse<T>(res);
}

export async function apiDelete<T = { deleted: boolean }>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options?.query);
  const res = await fetch(url, { method: 'DELETE', signal: options?.signal });
  return parseResponse<T>(res);
}

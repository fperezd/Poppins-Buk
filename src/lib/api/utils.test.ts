import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  ok,
  fail,
  parseQuery,
  parseBody,
  parseParams,
  bukErrorToApiError,
  handle,
  idParamSchema,
  paginationQuerySchema,
  boolStringSchema,
} from './utils';
import { BukApiError } from '@/lib/buk-sdk';

function get(url: string) {
  return new NextRequest(url);
}
function post(url: string, body: string, headers: Record<string, string> = { 'content-type': 'application/json' }) {
  return new NextRequest(url, { method: 'POST', body, headers });
}

describe('ok()', () => {
  it('envuelve data y status 200 por default', async () => {
    const res = ok({ id: 1 });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: { id: 1 } });
  });

  it('respeta status custom y mergea extra (pagination/meta)', async () => {
    const res = ok([1, 2], 201, { pagination: { page: 1 } });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ data: [1, 2], pagination: { page: 1 } });
  });
});

describe('fail()', () => {
  it('mapea cada code a su status HTTP', async () => {
    expect(fail('VALIDATION_ERROR', 'x').status).toBe(400);
    expect(fail('UNAUTHORIZED', 'x').status).toBe(401);
    expect(fail('FORBIDDEN', 'x').status).toBe(403);
    expect(fail('NOT_FOUND', 'x').status).toBe(404);
    expect(fail('CONFLICT', 'x').status).toBe(409);
    expect(fail('RATE_LIMITED', 'x').status).toBe(429);
    expect(fail('BUK_API_ERROR', 'x').status).toBe(502);
    expect(fail('INTERNAL_ERROR', 'x').status).toBe(500);
  });

  it('incluye code y message en el body', async () => {
    const res = fail('FORBIDDEN', 'sin permiso');
    expect(await res.json()).toEqual({ error: { code: 'FORBIDDEN', message: 'sin permiso' } });
  });

  it('agrega details solo cuando se pasan', async () => {
    const res = fail('VALIDATION_ERROR', 'malo', { name: ['requerido'] });
    expect(await res.json()).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'malo', details: { name: ['requerido'] } },
    });
  });
});

describe('parseQuery()', () => {
  it('parsea y transforma query válida', () => {
    const r = parseQuery(get('https://x/?page=2&page_size=30'), paginationQuerySchema);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual({ page: 2, page_size: 30 });
  });

  it('capea page_size a 100', () => {
    const r = parseQuery(get('https://x/?page_size=9999'), paginationQuerySchema);
    expect(r.ok && r.data.page_size).toBe(100);
  });

  it('devuelve error 400 con details cuando la query no valida', async () => {
    const r = parseQuery(get('https://x/?page=abc'), paginationQuerySchema);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.status).toBe(400);
      const body = await r.error.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.details).toHaveProperty('page');
    }
  });
});

describe('parseBody()', () => {
  const schema = z.object({ nombre: z.string(), edad: z.number().int() });

  it('parsea body JSON válido', async () => {
    const r = await parseBody(post('https://x', JSON.stringify({ nombre: 'Ana', edad: 30 })), schema);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual({ nombre: 'Ana', edad: 30 });
  });

  it('falla con 400 si el JSON es inválido/ausente', async () => {
    const r = await parseBody(post('https://x', 'no es json {{{'), schema);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      const body = await r.error.json();
      expect(body.error.message).toMatch(/JSON body inválido/);
    }
  });

  it('falla con 400 y details si el body no cumple el schema', async () => {
    const r = await parseBody(post('https://x', JSON.stringify({ nombre: 'Ana' })), schema);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      const body = await r.error.json();
      expect(body.error.details).toHaveProperty('edad');
    }
  });
});

describe('parseParams()', () => {
  it('valida y transforma el id numérico', () => {
    const r = parseParams({ id: '42' }, idParamSchema);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.id).toBe(42);
  });

  it('rechaza id no numérico', () => {
    const r = parseParams({ id: 'abc' }, idParamSchema);
    expect(r.ok).toBe(false);
  });
});

describe('boolStringSchema', () => {
  it('coerciona "true"/"1" a true y "false"/"0" a false', () => {
    expect(boolStringSchema.parse('true')).toBe(true);
    expect(boolStringSchema.parse('1')).toBe(true);
    expect(boolStringSchema.parse('false')).toBe(false);
    expect(boolStringSchema.parse('0')).toBe(false);
  });

  it('rechaza valores fuera del set', () => {
    expect(boolStringSchema.safeParse('yes').success).toBe(false);
  });
});

describe('bukErrorToApiError()', () => {
  it('401 → UNAUTHORIZED', () => {
    expect(bukErrorToApiError(new BukApiError('x', 401, '/e')).status).toBe(401);
  });
  it('403 → FORBIDDEN', () => {
    expect(bukErrorToApiError(new BukApiError('x', 403, '/e')).status).toBe(403);
  });
  it('404 → NOT_FOUND', () => {
    expect(bukErrorToApiError(new BukApiError('x', 404, '/e')).status).toBe(404);
  });
  it('429 → RATE_LIMITED', () => {
    expect(bukErrorToApiError(new BukApiError('x', 429, '/e')).status).toBe(429);
  });
  it('500 → BUK_API_ERROR (502)', () => {
    expect(bukErrorToApiError(new BukApiError('x', 500, '/e')).status).toBe(502);
  });
  it('Error genérico → INTERNAL_ERROR (500)', () => {
    expect(bukErrorToApiError(new Error('boom')).status).toBe(500);
  });
  it('valor no-Error → INTERNAL_ERROR (500)', () => {
    expect(bukErrorToApiError('string raro').status).toBe(500);
  });
});

describe('handle()', () => {
  it('pasa a través la respuesta del handler exitoso', async () => {
    const GET = handle(async (_req: NextRequest) => ok({ hello: 'world' }));
    const res = await GET(get('https://x/api/v1/me'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: { hello: 'world' } });
  });

  it('atrapa excepciones y las convierte a respuesta API estándar', async () => {
    const GET = handle(async (_req: NextRequest) => {
      throw new BukApiError('token vencido', 401, '/employees');
    });
    const res = await GET(get('https://x/api/v1/me'));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('atrapa errores genéricos como INTERNAL_ERROR', async () => {
    const GET = handle(async (_req: NextRequest) => {
      throw new Error('algo explotó');
    });
    const res = await GET(get('https://x/api/v1/me'));
    expect(res.status).toBe(500);
  });
});

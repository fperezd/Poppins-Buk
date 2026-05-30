import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  BukHttpClient,
  BukApiError,
  BukConfigError,
} from './client';

/** Firma de fetch que usamos en los mocks (para que .mock.calls tenga tipos). */
type FetchArgs = [url: string | URL, init?: RequestInit];
function mockFetch(impl: (...args: FetchArgs) => Promise<Response>) {
  const spy = vi.fn(impl);
  vi.stubGlobal('fetch', spy);
  return spy;
}

/** Helper: stubea fetch con una respuesta JSON. */
function stubFetchJson(body: unknown, init: ResponseInit = { status: 200 }) {
  return mockFetch((_url, _init) =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        headers: { 'content-type': 'application/json' },
        ...init,
      }),
    ),
  );
}

const TOKEN = 'test-token-123';
function client(overrides = {}) {
  return new BukHttpClient({ apiToken: TOKEN, baseUrl: 'https://buk.example/api', ...overrides });
}

afterEach(() => vi.unstubAllGlobals());

describe('BukHttpClient constructor', () => {
  it('lanza BukConfigError sin apiToken', () => {
    expect(() => new BukHttpClient({ apiToken: '' })).toThrow(BukConfigError);
  });

  it('quita la trailing slash del baseUrl', async () => {
    const spy = stubFetchJson({ ok: 1 });
    await new BukHttpClient({ apiToken: TOKEN, baseUrl: 'https://buk.example/api/' }).request('/x');
    expect(spy.mock.calls[0][0]).toBe('https://buk.example/api/x');
  });

  it('clampa defaultPageSize al rango [25, 100]', () => {
    expect(new BukHttpClient({ apiToken: TOKEN, defaultPageSize: 5 }).defaultPageSize).toBe(25);
    expect(new BukHttpClient({ apiToken: TOKEN, defaultPageSize: 999 }).defaultPageSize).toBe(100);
    expect(new BukHttpClient({ apiToken: TOKEN, defaultPageSize: 60 }).defaultPageSize).toBe(60);
    expect(new BukHttpClient({ apiToken: TOKEN }).defaultPageSize).toBe(50);
  });
});

describe('request() — happy path', () => {
  it('manda el header auth_token y Accept/Content-Type', async () => {
    const spy = stubFetchJson({ data: 1 });
    await client().request('/employees');
    const init = spy.mock.calls[0][1]!;
    expect(init.headers).toMatchObject({
      auth_token: TOKEN,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    expect(init.method).toBe('GET');
  });

  it('construye query params y omite undefined/null', async () => {
    const spy = stubFetchJson({});
    await client().request('/employees', {
      params: { status: 'active', page: 2, empty: undefined },
    });
    const url = new URL(spy.mock.calls[0][0]);
    expect(url.searchParams.get('status')).toBe('active');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.has('empty')).toBe(false);
  });

  it('serializa el body como JSON en POST', async () => {
    const spy = stubFetchJson({ id: 1 }, { status: 201 });
    await client().request('/x', { method: 'POST', body: { nombre: 'Ana' } });
    const init = spy.mock.calls[0][1]!;
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ nombre: 'Ana' }));
  });

  it('devuelve el JSON parseado', async () => {
    stubFetchJson({ data: { id: 7 } });
    const res = await client().request<{ data: { id: number } }>('/x');
    expect(res).toEqual({ data: { id: 7 } });
  });

  it('devuelve {} en 204 No Content', async () => {
    mockFetch(() => Promise.resolve(new Response(null, { status: 204 })));
    const res = await client().request('/x', { method: 'DELETE' });
    expect(res).toEqual({});
  });
});

describe('request() — errores', () => {
  it('lanza BukApiError con status/endpoint/body en respuesta !ok', async () => {
    mockFetch(() =>
      Promise.resolve(new Response('not found body', { status: 404, statusText: 'Not Found' })),
    );

    await expect(client().request('/employees/999')).rejects.toMatchObject({
      name: 'BukApiError',
      status: 404,
      endpoint: '/employees/999',
      responseBody: 'not found body',
    });
  });

  it('mapea AbortError (timeout) a BukApiError 408', async () => {
    mockFetch(() => Promise.reject(new DOMException('aborted', 'AbortError')));

    await expect(client().request('/slow', { timeout: 10 })).rejects.toMatchObject({
      name: 'BukApiError',
      status: 408,
    });
  });

  it('re-lanza errores de red no-Buk tal cual', async () => {
    mockFetch(() => Promise.reject(new TypeError('network down')));
    await expect(client().request('/x')).rejects.toThrow(TypeError);
  });
});

describe('verbos de conveniencia', () => {
  it('list() agrega page y page_size', async () => {
    const spy = stubFetchJson({ data: [], pagination: {} });
    await client({ defaultPageSize: 50 }).list('/employees', { status: 'active' }, 3);
    const url = new URL(spy.mock.calls[0][0]);
    expect(url.searchParams.get('page')).toBe('3');
    expect(url.searchParams.get('page_size')).toBe('50');
    expect(url.searchParams.get('status')).toBe('active');
  });

  it('post/put/patch usan el método correcto', async () => {
    const spy = stubFetchJson({});
    const c = client();
    await c.post('/a', { x: 1 });
    await c.put('/b', { x: 2 });
    await c.patch('/c', { x: 3 });
    expect(spy.mock.calls.map((call) => call[1]!.method)).toEqual(['POST', 'PUT', 'PATCH']);
  });

  it('delete() usa DELETE', async () => {
    const spy = mockFetch(() => Promise.resolve(new Response(null, { status: 204 })));
    await client().delete('/x/1');
    expect(spy.mock.calls[0][1]?.method).toBe('DELETE');
  });
});

describe('listAll() — sigue la paginación', () => {
  it('concatena todas las páginas hasta total_pages', async () => {
    let page = 0;
    const spy = mockFetch(() => {
      page += 1;
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: [`item-${page}a`, `item-${page}b`],
            pagination: { total_pages: 3, current_page: page },
          }),
          { headers: { 'content-type': 'application/json' } },
        ),
      );
    });

    const all = await client().listAll<string>('/employees');
    expect(spy).toHaveBeenCalledTimes(3);
    expect(all).toEqual(['item-1a', 'item-1b', 'item-2a', 'item-2b', 'item-3a', 'item-3b']);
  });

  it('una sola página cuando total_pages = 1', async () => {
    const spy = stubFetchJson({ data: ['solo'], pagination: { total_pages: 1, current_page: 1 } });
    const all = await client().listAll('/x');
    expect(spy).toHaveBeenCalledOnce();
    expect(all).toEqual(['solo']);
  });
});

describe('BukApiError getters', () => {
  it('clasifica el status correctamente', () => {
    expect(new BukApiError('', 404, '/e').isNotFound).toBe(true);
    expect(new BukApiError('', 401, '/e').isUnauthorized).toBe(true);
    expect(new BukApiError('', 403, '/e').isForbidden).toBe(true);
    expect(new BukApiError('', 429, '/e').isRateLimited).toBe(true);
    expect(new BukApiError('', 500, '/e').isServerError).toBe(true);
    expect(new BukApiError('', 503, '/e').isServerError).toBe(true);
    expect(new BukApiError('', 400, '/e').isServerError).toBe(false);
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CORRELATION_HEADER,
  getOrCreateCorrelationId,
  generateCorrelationId,
  isValidCorrelationId,
  propagationHeaders,
  fetchWithCorrelation,
  createLogger,
} from './correlation-id';

/** Construye un request-like con headers Web-standard. */
function reqWithHeaders(headers: Record<string, string> = {}) {
  return { headers: new Headers(headers) };
}

describe('isValidCorrelationId', () => {
  it('acepta nuestro formato req_xxx_ts', () => {
    expect(isValidCorrelationId('req_a1b2c3d4_lq9z')).toBe(true);
  });

  it('acepta UUIDs y alfanuméricos con - _ . :', () => {
    expect(isValidCorrelationId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(isValidCorrelationId('trace.id:span_1')).toBe(true);
  });

  it('rechaza string vacío', () => {
    expect(isValidCorrelationId('')).toBe(false);
  });

  it('rechaza strings de más de 100 chars (anti-abuse)', () => {
    expect(isValidCorrelationId('a'.repeat(101))).toBe(false);
    expect(isValidCorrelationId('a'.repeat(100))).toBe(true);
  });

  it('rechaza caracteres de inyección (espacios, comillas, newlines, <>)', () => {
    expect(isValidCorrelationId('has space')).toBe(false);
    expect(isValidCorrelationId('drop"table')).toBe(false);
    expect(isValidCorrelationId('line\nbreak')).toBe(false);
    expect(isValidCorrelationId('<script>')).toBe(false);
  });
});

describe('generateCorrelationId', () => {
  it('produce el formato req_<hex8>_<base36>', () => {
    const id = generateCorrelationId();
    expect(id).toMatch(/^req_[0-9a-f]{8}_[0-9a-z]+$/);
  });

  it('genera valores que pasan isValidCorrelationId', () => {
    expect(isValidCorrelationId(generateCorrelationId())).toBe(true);
  });

  it('genera ids distintos en llamadas sucesivas', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateCorrelationId()));
    expect(ids.size).toBe(50);
  });
});

describe('getOrCreateCorrelationId', () => {
  it('reusa el header entrante si es válido', () => {
    const id = getOrCreateCorrelationId(reqWithHeaders({ [CORRELATION_HEADER]: 'req_deadbeef_xyz' }));
    expect(id).toBe('req_deadbeef_xyz');
  });

  it('genera uno nuevo si no hay header', () => {
    const id = getOrCreateCorrelationId(reqWithHeaders());
    expect(id).toMatch(/^req_/);
  });

  it('ignora (no propaga) un header inválido y genera uno limpio', () => {
    const id = getOrCreateCorrelationId(reqWithHeaders({ [CORRELATION_HEADER]: 'bad value <inject>' }));
    expect(id).not.toContain('inject');
    expect(isValidCorrelationId(id)).toBe(true);
  });

  it('funciona con un headers-like custom (get())', () => {
    const req = { headers: { get: (n: string) => (n === CORRELATION_HEADER ? 'req_custom_1' : null) } };
    expect(getOrCreateCorrelationId(req)).toBe('req_custom_1');
  });
});

describe('propagationHeaders', () => {
  it('incluye el correlation header', () => {
    expect(propagationHeaders('req_1')).toEqual({ [CORRELATION_HEADER]: 'req_1' });
  });

  it('mergea headers extra', () => {
    expect(propagationHeaders('req_1', { Authorization: 'Bearer x' })).toEqual({
      [CORRELATION_HEADER]: 'req_1',
      Authorization: 'Bearer x',
    });
  });
});

describe('fetchWithCorrelation', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('inyecta el correlation header en el fetch', async () => {
    const spy = vi.fn((_url: string | URL, _opts: RequestInit) => Promise.resolve(new Response('ok')));
    vi.stubGlobal('fetch', spy);

    await fetchWithCorrelation('https://api.buk.cl/employees', {
      cid: 'req_trace_99',
      headers: { Accept: 'application/json' },
    });

    expect(spy).toHaveBeenCalledOnce();
    const [url, options] = spy.mock.calls[0];
    expect(url).toBe('https://api.buk.cl/employees');
    expect(options.headers).toMatchObject({
      [CORRELATION_HEADER]: 'req_trace_99',
      Accept: 'application/json',
    });
  });

  it('no filtra `cid` dentro del RequestInit', async () => {
    const spy = vi.fn((_url: string | URL, _opts: RequestInit) => Promise.resolve(new Response('ok')));
    vi.stubGlobal('fetch', spy);
    await fetchWithCorrelation('https://x', { cid: 'req_z', method: 'POST' });
    const [, options] = spy.mock.calls[0];
    expect(options).not.toHaveProperty('cid');
    expect(options.method).toBe('POST');
  });
});

describe('createLogger', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prefija cada línea con el cid', () => {
    const info = vi.spyOn(console, 'log').mockImplementation(() => {});
    const log = createLogger('req_abc');
    log.info('hola');
    expect(info).toHaveBeenCalledWith('[INFO] [cid=req_abc] hola');
  });

  it('incluye los tags del baseContext y serializa meta', () => {
    const info = vi.spyOn(console, 'log').mockImplementation(() => {});
    const log = createLogger('req_abc', { route: '/v1/colaboradoras', rol: 'admin' });
    log.info('listando', { count: 42 });
    expect(info).toHaveBeenCalledWith(
      '[INFO] [cid=req_abc] [route=/v1/colaboradoras] [rol=admin] listando count=42',
    );
  });

  it('serializa meta de tipo objeto como JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    createLogger('req_1').warn('algo', { ctx: { a: 1 } });
    expect(warn).toHaveBeenCalledWith('[WARN] [cid=req_1] algo ctx={"a":1}');
  });

  it('error() usa console.error', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    createLogger('req_1').error('boom');
    expect(err).toHaveBeenCalledWith('[ERROR] [cid=req_1] boom');
  });

  it('debug() solo loguea cuando DEBUG está seteado', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const prev = process.env.DEBUG;

    delete process.env.DEBUG;
    createLogger('req_1').debug('silencioso');
    expect(debug).not.toHaveBeenCalled();

    process.env.DEBUG = '1';
    createLogger('req_1').debug('ruidoso');
    expect(debug).toHaveBeenCalledOnce();

    if (prev === undefined) delete process.env.DEBUG;
    else process.env.DEBUG = prev;
  });
});

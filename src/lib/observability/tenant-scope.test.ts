import { describe, it, expect, vi, beforeEach } from 'vitest';

// Sentry es server-only y pesado: lo mockeamos para aislar la lógica del helper.
// `vi.hoisted` deja los spies disponibles dentro del factory de vi.mock (hoisted).
const { setUser, setTag } = vi.hoisted(() => ({ setUser: vi.fn(), setTag: vi.fn() }));
vi.mock('@sentry/nextjs', () => ({ setUser, setTag }));

import { withTenantScope } from './tenant-scope';
import type { UserScope } from '@/lib/api/auth';

const baseScope: UserScope = {
  user_id: 'user-123',
  rol: 'empleador',
  buk_employee_id: 555,
  buk_area_id: 99,
  email: 'jefa@hogar.cl',
};

function reqWith(headers: Record<string, string> = {}, extra: Record<string, unknown> = {}) {
  return { headers: new Headers(headers), ...extra };
}

describe('withTenantScope', () => {
  beforeEach(() => {
    setUser.mockClear();
    setTag.mockClear();
  });

  it('devuelve cid, tenantId (= buk_area_id) y el scope passthrough', () => {
    const ctx = withTenantScope(reqWith({ 'x-request-id': 'req_seed_1' }), baseScope);
    expect(ctx.cid).toBe('req_seed_1');
    expect(ctx.tenantId).toBe(99);
    expect(ctx.scope).toBe(baseScope);
    expect(ctx.log).toHaveProperty('info');
  });

  it('genera un cid fresco si el request no trae header', () => {
    const ctx = withTenantScope(reqWith(), baseScope);
    expect(ctx.cid).toMatch(/^req_/);
  });

  it('setea el usuario en Sentry (id + email)', () => {
    withTenantScope(reqWith(), baseScope);
    expect(setUser).toHaveBeenCalledWith({ id: 'user-123', email: 'jefa@hogar.cl' });
  });

  it('setea los tags correlation_id, rol, tenant_id y buk_employee_id', () => {
    withTenantScope(reqWith({ 'x-request-id': 'req_tag_1' }), baseScope);
    const tags = Object.fromEntries(setTag.mock.calls);
    expect(tags).toMatchObject({
      correlation_id: 'req_tag_1',
      rol: 'empleador',
      tenant_id: '99',
      buk_employee_id: '555',
    });
  });

  it('para staff Tooxs (admin sin area) deja tenantId null y NO setea tag tenant_id', () => {
    const adminScope: UserScope = {
      user_id: 'admin-1',
      rol: 'admin',
      buk_employee_id: null,
      buk_area_id: null,
      email: 'cto@tooxs.com',
    };
    const ctx = withTenantScope(reqWith(), adminScope);
    expect(ctx.tenantId).toBeNull();
    const tagKeys = setTag.mock.calls.map(([k]) => k);
    expect(tagKeys).not.toContain('tenant_id');
    expect(tagKeys).not.toContain('buk_employee_id');
    expect(tagKeys).toContain('rol');
  });

  it('email undefined cuando el scope no trae email', () => {
    withTenantScope(reqWith(), { ...baseScope, email: null });
    expect(setUser).toHaveBeenCalledWith({ id: 'user-123', email: undefined });
  });

  it('toma el route desde nextUrl.pathname', () => {
    const info = vi.spyOn(console, 'log').mockImplementation(() => {});
    const ctx = withTenantScope(reqWith({}, { nextUrl: { pathname: '/api/buk/v1/me' } }), baseScope);
    ctx.log.info('hit');
    expect(info.mock.calls[0][0]).toContain('[route=/api/buk/v1/me]');
    info.mockRestore();
  });

  it('deriva el route desde url cuando no hay nextUrl', () => {
    const info = vi.spyOn(console, 'log').mockImplementation(() => {});
    const ctx = withTenantScope(reqWith({}, { url: 'https://api.poppins.cl/v1/tareas?x=1' }), baseScope);
    ctx.log.info('hit');
    expect(info.mock.calls[0][0]).toContain('[route=/v1/tareas]');
    info.mockRestore();
  });

  it('no revienta con una url malformada (safeUrlPathname)', () => {
    expect(() => withTenantScope(reqWith({}, { url: 'no-es-una-url' }), baseScope)).not.toThrow();
  });
});

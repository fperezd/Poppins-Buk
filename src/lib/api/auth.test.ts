/**
 * Tests para filterByScope — el filtrado de data por rol.
 *
 * Es la última línea de defensa de scope a nivel de aplicación: aunque una ruta
 * deje pasar la request (requireScope), este filtro recorta QUÉ filas ve cada rol.
 * Un bug acá = fuga de data entre familias/colaboradoras.
 *
 * Nota: sólo importamos `filterByScope` (función pura). `requireScope`/`getUserScope`
 * dependen de Supabase server client y se cubren en tests de integración.
 */
import { describe, it, expect } from 'vitest';
import { filterByScope, type UserScope } from './auth';

interface Colaboradora {
  id: number;
  current_job?: { area_id?: number };
}

const items: Colaboradora[] = [
  { id: 1, current_job: { area_id: 10 } },
  { id: 2, current_job: { area_id: 10 } },
  { id: 3, current_job: { area_id: 20 } },
  { id: 4 }, // sin current_job
];

function scope(partial: Partial<UserScope>): UserScope {
  return {
    user_id: 'u',
    rol: 'colaboradora',
    buk_employee_id: null,
    buk_area_id: null,
    email: null,
    ...partial,
  };
}

describe('filterByScope', () => {
  it('admin ve TODAS las filas', () => {
    expect(filterByScope(items, scope({ rol: 'admin' }))).toEqual(items);
  });

  it('empleador ve sólo las colaboradoras de su área (buk_area_id)', () => {
    const r = filterByScope(items, scope({ rol: 'empleador', buk_area_id: 10 }));
    expect(r.map((i) => i.id)).toEqual([1, 2]);
  });

  it('empleador de otra área no ve nada que no sea suyo', () => {
    const r = filterByScope(items, scope({ rol: 'empleador', buk_area_id: 99 }));
    expect(r).toEqual([]);
  });

  it('empleador sin área (null) no matchea filas con area_id definido', () => {
    const r = filterByScope(items, scope({ rol: 'empleador', buk_area_id: null }));
    expect(r).toEqual([]); // ninguna fila tiene area_id === null
  });

  it('colaboradora se ve sólo a sí misma (id === buk_employee_id)', () => {
    const r = filterByScope(items, scope({ rol: 'colaboradora', buk_employee_id: 3 }));
    expect(r.map((i) => i.id)).toEqual([3]);
  });

  it('colaboradora sin match no ve nada', () => {
    const r = filterByScope(items, scope({ rol: 'colaboradora', buk_employee_id: 999 }));
    expect(r).toEqual([]);
  });

  it('rol desconocido → no ve nada (deny by default)', () => {
    const r = filterByScope(items, scope({ rol: 'fantasma' as unknown as UserScope['rol'] }));
    expect(r).toEqual([]);
  });

  it('no muta el array original', () => {
    const copy = [...items];
    filterByScope(items, scope({ rol: 'empleador', buk_area_id: 10 }));
    expect(items).toEqual(copy);
  });
});

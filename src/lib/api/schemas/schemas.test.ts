/**
 * Tests de contrato para schemas Zod de dominio.
 *
 * Estos schemas son la frontera de validación de la API y migrarán a
 * `@poppins/contracts` en Sprint 0. Cubrimos las garantías que un consumidor
 * depende: coerción de query strings, defaults, `.strict()` (rechazo de keys
 * desconocidas) y validación de formato fecha/hora.
 */
import { describe, it, expect } from 'vitest';
import {
  ListTareasQuery,
  CreateTareaBody,
  UpdateTareaBody,
} from './tareas';
import {
  ListVacacionesQuery,
  CreateVacacionBody,
  DeleteVacacionQuery,
} from './vacaciones';

describe('ListTareasQuery', () => {
  it('coerciona hogar_id/colaboradora_id de string a number', () => {
    const r = ListTareasQuery.parse({ hogar_id: '12', colaboradora_id: '34' });
    expect(r.hogar_id).toBe(12);
    expect(r.colaboradora_id).toBe(34);
  });

  it('deja los ids undefined si no vienen', () => {
    const r = ListTareasQuery.parse({});
    expect(r.hogar_id).toBeUndefined();
    expect(r.colaboradora_id).toBeUndefined();
  });

  it('acepta estados del enum y rechaza fuera de él', () => {
    expect(ListTareasQuery.parse({ estado: 'completada' }).estado).toBe('completada');
    expect(ListTareasQuery.safeParse({ estado: 'archivada' }).success).toBe(false);
  });

  it('rechaza ids no numéricos', () => {
    expect(ListTareasQuery.safeParse({ hogar_id: 'abc' }).success).toBe(false);
  });
});

describe('CreateTareaBody', () => {
  const valid = {
    buk_area_id: 1,
    buk_employee_id: 2,
    titulo: 'Comprar pañales',
  };

  it('aplica el default prioridad="media"', () => {
    expect(CreateTareaBody.parse(valid).prioridad).toBe('media');
  });

  it('es strict: rechaza keys desconocidas', () => {
    expect(CreateTareaBody.safeParse({ ...valid, hacker: true }).success).toBe(false);
  });

  it('exige titulo no vacío y <= 200 chars', () => {
    expect(CreateTareaBody.safeParse({ ...valid, titulo: '' }).success).toBe(false);
    expect(CreateTareaBody.safeParse({ ...valid, titulo: 'x'.repeat(201) }).success).toBe(false);
  });

  it('rechaza ids no positivos', () => {
    expect(CreateTareaBody.safeParse({ ...valid, buk_area_id: 0 }).success).toBe(false);
    expect(CreateTareaBody.safeParse({ ...valid, buk_employee_id: -1 }).success).toBe(false);
  });

  it('valida formato de fecha (YYYY-MM-DD) y hora (HH:MM)', () => {
    expect(CreateTareaBody.safeParse({ ...valid, fecha_para: '2026-05-29' }).success).toBe(true);
    expect(CreateTareaBody.safeParse({ ...valid, fecha_para: '29/05/2026' }).success).toBe(false);
    expect(CreateTareaBody.safeParse({ ...valid, hora_para: '08:30' }).success).toBe(true);
    expect(CreateTareaBody.safeParse({ ...valid, hora_para: '8am' }).success).toBe(false);
  });
});

describe('UpdateTareaBody', () => {
  it('acepta un patch parcial vacío', () => {
    expect(UpdateTareaBody.safeParse({}).success).toBe(true);
  });

  it('es strict ante keys desconocidas', () => {
    expect(UpdateTareaBody.safeParse({ estado_secreto: 'x' }).success).toBe(false);
  });
});

describe('ListVacacionesQuery', () => {
  it('acepta el set completo de estados del enum', () => {
    for (const status of ['pending', 'approved', 'rejected', 'cancelled', 'submitted', 'pre_approved']) {
      expect(ListVacacionesQuery.safeParse({ status }).success).toBe(true);
    }
  });

  it('valida start_date/end_date formato YYYY-MM-DD', () => {
    expect(ListVacacionesQuery.safeParse({ start_date: '2026-01-01' }).success).toBe(true);
    expect(ListVacacionesQuery.safeParse({ start_date: '2026-1-1' }).success).toBe(false);
  });
});

describe('CreateVacacionBody', () => {
  const valid = { employee_id: 1, start_date: '2026-02-01', end_date: '2026-02-10' };

  it('acepta un body mínimo válido', () => {
    expect(CreateVacacionBody.safeParse(valid).success).toBe(true);
  });

  it('exige employee_id positivo y fechas con formato', () => {
    expect(CreateVacacionBody.safeParse({ ...valid, employee_id: 0 }).success).toBe(false);
    expect(CreateVacacionBody.safeParse({ ...valid, start_date: 'ayer' }).success).toBe(false);
  });

  it('limita observations a 500 chars', () => {
    expect(CreateVacacionBody.safeParse({ ...valid, observations: 'x'.repeat(501) }).success).toBe(false);
  });

  it('es strict ante campos extra', () => {
    expect(CreateVacacionBody.safeParse({ ...valid, dias_extra: 99 }).success).toBe(false);
  });
});

describe('DeleteVacacionQuery', () => {
  it('coerciona employee_id a number y exige start_date', () => {
    const r = DeleteVacacionQuery.parse({ employee_id: '7', start_date: '2026-03-01' });
    expect(r.employee_id).toBe(7);
    expect(DeleteVacacionQuery.safeParse({ employee_id: '7' }).success).toBe(false);
  });
});

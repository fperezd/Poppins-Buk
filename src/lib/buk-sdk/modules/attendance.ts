/**
 * Módulo Attendance — Asistencia: Días trabajados y Horas no trabajadas
 *
 * Días trabajados:
 *   GET    /working_days                              → Listar días trabajados
 *   POST   /working_days                              → Registrar/sobrescribir días
 *   DELETE /working_days/{employee_id}/{MM-YYYY}      → Eliminar días de un período
 *
 * Horas no trabajadas:
 *   GET    /attendances/non-worked-hours              → Listar HNT
 *   GET    /attendances/non-worked-hours/{id}         → Detalle de una HNT
 *   POST   /attendances/non-worked-hours              → Agregar HNT (acumula)
 *   PUT    /attendances/non-worked-hours              → Reemplazar HNT
 *   GET    /attendances/non-worked-hours/types        → Tipos de HNT
 *   POST   /attendances/non-worked-hours/types        → Crear tipo de HNT
 *   DELETE /attendances/non-worked-hours/types/{id}   → Eliminar tipo de HNT
 */

import { BukHttpClient, type BukListResponse } from '../client';

// ── Días Trabajados ──

export interface BukWorkingDay {
  employee_id: number;
  document_number?: string;
  document_type?: string;
  code?: string;
  working_days: number;
  working_days_dates?: string[];
  month?: number;
}

export interface WorkingDayFilters {
  from?: string;
  to?: string;
  document_number?: string;
  code?: string;
}

export interface SetWorkingDaysInput {
  employee_id: number;
  month: number;
  working_days: number[];
}

// ── Horas No Trabajadas ──

export interface BukNonWorkedHour {
  id: number;
  employee_id: number;
  day?: number;
  month: number;
  year: number;
  hours: number;
  type_id: number;
}

export interface BukNonWorkedHourType {
  id: number;
  name: string;
  paid_leave: boolean;
}

export interface NonWorkedHourFilters {
  from?: string;
  to?: string;
  sort?: 'id';
}

export interface NonWorkedHourInput {
  employee_id: number;
  month: number;
  year: number;
  hours: number;
  type_id: number;
  day?: number;
}

export class AttendanceModule {
  constructor(private readonly client: BukHttpClient) {}

  // ── Días Trabajados ──

  /**
   * Listar días trabajados con filtros opcionales.
   */
  async listWorkingDays(
    filters?: WorkingDayFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukWorkingDay>> {
    return this.client.list<BukWorkingDay>(
      '/working_days',
      filters as unknown as Record<string, string | number | boolean | undefined>,
      page,
      pageSize
    );
  }

  /**
   * Todos los días trabajados en un rango (auto-paginación).
   */
  async listAllWorkingDays(filters?: WorkingDayFilters): Promise<BukWorkingDay[]> {
    return this.client.listAll<BukWorkingDay>(
      '/working_days',
      filters as unknown as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Registrar días trabajados de un colaborador en un mes.
   * Sobrescribe la entrada existente para ese período.
   */
  async setWorkingDays(data: SetWorkingDaysInput): Promise<void> {
    await this.client.post('/working_days', data as unknown as Record<string, unknown>);
  }

  /**
   * Eliminar días trabajados de un colaborador en un período dado.
   * monthYear: formato MM-YYYY (ej: "05-2026")
   */
  async deleteWorkingDays(employeeId: number, monthYear: string): Promise<void> {
    return this.client.delete(`/working_days/${employeeId}/${monthYear}`);
  }

  // ── Horas No Trabajadas ──

  /**
   * Listar registros de horas no trabajadas.
   */
  async listNonWorkedHours(
    filters?: NonWorkedHourFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukNonWorkedHour>> {
    return this.client.list<BukNonWorkedHour>(
      '/attendances/non-worked-hours',
      filters as unknown as Record<string, string | number | boolean | undefined>,
      page,
      pageSize
    );
  }

  /**
   * Todos los registros de HNT en un rango (auto-paginación).
   */
  async listAllNonWorkedHours(filters?: NonWorkedHourFilters): Promise<BukNonWorkedHour[]> {
    return this.client.listAll<BukNonWorkedHour>(
      '/attendances/non-worked-hours',
      filters as unknown as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Detalle de un registro de HNT.
   */
  async getNonWorkedHour(id: number): Promise<BukNonWorkedHour> {
    const response = await this.client.get<BukNonWorkedHour>(`/attendances/non-worked-hours/${id}`);
    return response.data;
  }

  /**
   * Agregar horas no trabajadas (acumula sobre el período).
   */
  async addNonWorkedHours(data: NonWorkedHourInput): Promise<BukNonWorkedHour> {
    return this.client.post<BukNonWorkedHour>(
      '/attendances/non-worked-hours',
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Reemplazar horas no trabajadas (sobrescribe el período).
   */
  async replaceNonWorkedHours(data: NonWorkedHourInput): Promise<BukNonWorkedHour> {
    return this.client.put<BukNonWorkedHour>(
      '/attendances/non-worked-hours',
      data as unknown as Record<string, unknown>
    );
  }

  // ── Tipos de Horas No Trabajadas ──

  /**
   * Listar tipos de horas no trabajadas disponibles.
   */
  async listNonWorkedHourTypes(): Promise<BukNonWorkedHourType[]> {
    const response = await this.client.list<BukNonWorkedHourType>(
      '/attendances/non-worked-hours/types'
    );
    return response.data;
  }

  /**
   * Crear un tipo de hora no trabajada.
   */
  async createNonWorkedHourType(name: string, paidLeave: boolean): Promise<BukNonWorkedHourType> {
    return this.client.post<BukNonWorkedHourType>(
      '/attendances/non-worked-hours/types',
      { name, paid_leave: paidLeave }
    );
  }

  /**
   * Eliminar un tipo de hora no trabajada.
   */
  async deleteNonWorkedHourType(id: number): Promise<void> {
    return this.client.delete(`/attendances/non-worked-hours/types/${id}`);
  }
}

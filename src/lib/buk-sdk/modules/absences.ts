/**
 * Modulo Absences — Vacaciones, Licencias, Permisos, Inasistencias
 *
 * Paths alineados con Swagger oficial Buk (validados contra tenant prod 2026-05-09):
 *   GET   /vacations                          → vacaciones (filtrar por employee_id)
 *   POST  /vacations                          → crear vacacion
 *   DELETE /vacations                         → eliminar vacacion (Swagger lo expone)
 *   GET   /employees/{id}/earned_vacations    → vacaciones devengadas (balance)
 *   GET   /employees/{id}/vacations_available → vacaciones disponibles + info empleado
 *
 *   GET   /absences/licence                   → licencias medicas
 *   POST  /absences/licence                   → crear licencia
 *   GET   /absences/licence/types             → tipos disponibles
 *
 *   GET   /absences/permission                → permisos
 *   POST  /absences/permission                → crear permiso
 *   GET   /absences/permission/types          → tipos disponibles
 *
 *   GET   /absences/absence                   → inasistencias
 *   POST  /absences/absence                   → crear inasistencia
 *   GET   /absences/absence/types             → tipos disponibles
 *
 *   GET   /absences                           → vista unificada de ausencias
 */

import { BukHttpClient, type BukListResponse } from '../client';
import type {
  BukVacation,
  BukVacationBalance,
  CreateVacationRequest,
  BukLicense,
  CreateLicenseRequest,
  BukPermission,
  CreatePermissionRequest,
  BukAbsence,
  AbsenceFilters,
  VacationFilters,
} from '../types/absences';

type Filters = Record<string, string | number | boolean | undefined>;

function toParams(f?: Record<string, unknown> | object): Filters {
  const out: Filters = {};
  if (!f) return out;
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v;
    }
  }
  return out;
}

export class AbsencesModule {
  constructor(private readonly client: BukHttpClient) {}

  // ── Vacaciones ──

  /**
   * Listar vacaciones. Filtrar por employee_id en filters.
   */
  async listVacations(
    employeeIdOrFilters: number | (VacationFilters & { employee_id?: number }),
    pageOrUndefined?: number | VacationFilters,
    pageSize?: number
  ): Promise<BukListResponse<BukVacation>> {
    let employeeId: number | undefined;
    let filters: VacationFilters | undefined;
    let page = 1;

    if (typeof employeeIdOrFilters === 'number') {
      employeeId = employeeIdOrFilters;
      filters = pageOrUndefined as VacationFilters | undefined;
    } else {
      employeeId = employeeIdOrFilters?.employee_id;
      const { employee_id: _ignore, ...rest } = employeeIdOrFilters || {};
      void _ignore;
      filters = rest as VacationFilters;
      page = (pageOrUndefined as number) || 1;
    }

    return this.client.list<BukVacation>('/vacations', toParams({
      employee_id: employeeId,
      ...filters,
    }), page, pageSize);
  }

  /**
   * Todas las vacaciones de un empleado (auto-paginacion).
   */
  async listAllVacations(employeeId: number, filters?: VacationFilters): Promise<BukVacation[]> {
    return this.client.listAll<BukVacation>('/vacations', toParams({
      employee_id: employeeId,
      ...filters,
    }));
  }

  /**
   * Crear solicitud de vacaciones. POST /vacations
   */
  async createVacation(data: CreateVacationRequest): Promise<BukVacation> {
    return this.client.post<BukVacation>('/vacations', data as unknown as Record<string, unknown>);
  }

  /**
   * Vacaciones devengadas de un empleado (balance detallado por periodo).
   * Endpoint real: GET /employees/{id}/earned_vacations
   */
  async getEarnedVacations(employeeId: number): Promise<{
    vacation_definition_id: number;
    vacation_type_id: number;
    earned_days: number;
    period_start_date: string;
    earned_at: string | null;
    proportional: boolean;
    compensated: boolean;
    expiration_date: string | null;
  }[]> {
    const response = await this.client.list<{
      vacation_definition_id: number;
      vacation_type_id: number;
      earned_days: number;
      period_start_date: string;
      earned_at: string | null;
      proportional: boolean;
      compensated: boolean;
      expiration_date: string | null;
    }>(`/employees/${employeeId}/earned_vacations`);
    return response.data;
  }

  /**
   * Saldo de vacaciones por tipo + datos generales del empleado.
   * Endpoint real: GET /employees/{id}/vacations_available
   *
   * Devuelve un objeto rico (no paginado) con employee info + array vacations.
   */
  async getVacationBalance(employeeId: number): Promise<BukVacationBalance & {
    full_name?: string;
    vacations?: { name: string; stock: number }[];
    [k: string]: unknown;
  }> {
    return this.client.request<BukVacationBalance & {
      full_name?: string;
      vacations?: { name: string; stock: number }[];
      [k: string]: unknown;
    }>(`/employees/${employeeId}/vacations_available`);
  }

  // ── Licencias Medicas ──

  async listLicenses(
    filters?: AbsenceFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukLicense>> {
    return this.client.list<BukLicense>('/absences/licence', toParams(filters), page, pageSize);
  }

  async listAllLicenses(filters?: AbsenceFilters): Promise<BukLicense[]> {
    return this.client.listAll<BukLicense>('/absences/licence', toParams(filters));
  }

  async createLicense(data: CreateLicenseRequest): Promise<BukLicense> {
    return this.client.post<BukLicense>('/absences/licence', data as unknown as Record<string, unknown>);
  }

  /**
   * Tipos de licencia configurados en la cuenta.
   */
  async listLicenseTypes(): Promise<BukListResponse<BukAbsenceType>> {
    return this.client.list<BukAbsenceType>('/absences/licence/types');
  }

  // ── Permisos ──

  async listPermissions(
    filters?: AbsenceFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPermission>> {
    return this.client.list<BukPermission>('/absences/permission', toParams(filters), page, pageSize);
  }

  async listAllPermissions(filters?: AbsenceFilters): Promise<BukPermission[]> {
    return this.client.listAll<BukPermission>('/absences/permission', toParams(filters));
  }

  async createPermission(data: CreatePermissionRequest): Promise<BukPermission> {
    return this.client.post<BukPermission>('/absences/permission', data as unknown as Record<string, unknown>);
  }

  async listPermissionTypes(): Promise<BukListResponse<BukAbsenceType>> {
    return this.client.list<BukAbsenceType>('/absences/permission/types');
  }

  // ── Inasistencias (absence) ──

  async listAbsenceRecords(
    filters?: AbsenceFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukAbsence>> {
    return this.client.list<BukAbsence>('/absences/absence', toParams(filters), page, pageSize);
  }

  async createAbsenceRecord(data: Record<string, unknown>): Promise<BukAbsence> {
    return this.client.post<BukAbsence>('/absences/absence', data);
  }

  async listAbsenceTypes(): Promise<BukListResponse<BukAbsenceType>> {
    return this.client.list<BukAbsenceType>('/absences/absence/types');
  }

  // ── Ausencias (vista unificada) ──

  /**
   * GET /absences (vista unificada de todas las ausencias).
   */
  async listAbsences(
    filters?: AbsenceFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukAbsence>> {
    return this.client.list<BukAbsence>('/absences', toParams(filters), page, pageSize);
  }

  async getEmployeeAbsences(
    employeeId: number,
    startDate?: string,
    endDate?: string
  ): Promise<BukAbsence[]> {
    return this.client.listAll<BukAbsence>('/absences', toParams({
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
    }));
  }
}

/**
 * Tipo de ausencia/licencia/permiso (catalogo).
 */
export interface BukAbsenceType {
  id: number;
  kind: 'ausencia' | 'licencia' | 'permiso' | string;
  name: string;
  description?: string;
  code?: string;
  with_pay?: boolean;
  time_measure?: 'per_day' | 'per_hour' | string;
  requestable?: boolean;
  editable?: boolean;
}

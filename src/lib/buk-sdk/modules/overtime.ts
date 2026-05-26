/**
 * Modulo Overtime — Horas Extras
 *
 * Paths alineados con Swagger oficial (validados contra tenant prod 2026-05-09):
 *   GET   /attendances/overtime          → listar horas extra
 *   POST  /attendances/overtime          → crear
 *   PUT   /attendances/overtime          → actualizar (bulk)
 *   GET   /attendances/overtime/{id}     → detalle
 *   GET   /attendances/overtime/types    → tipos disponibles
 *
 *   ⚠️ ELIMINADO: DELETE /overtimes/{id} no existe en Swagger. Para anular
 *   una hora extra, marcarla como cancelada via PUT o eliminar la entrada
 *   en attendance.
 */

import { BukHttpClient, type BukListResponse } from '../client';

type Filters = Record<string, string | number | boolean | undefined>;

export interface BukOvertime {
  id: number;
  employee_id: number;
  date: string;
  hours: number;
  type_id?: number;
  type_name?: string;
  status?: string;
  observations?: string;
  [k: string]: unknown;
}

export interface BukOvertimeType {
  id: number;
  name: string;
  proporcion: number;
  category: number;
}

export interface OvertimeFilters {
  employee_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface CreateOvertimeRequest {
  employee_id: number;
  date: string;
  hours: number;
  type_id: number;
  observations?: string;
}

export class OvertimeModule {
  constructor(private readonly client: BukHttpClient) {}

  async list(
    filters?: OvertimeFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukOvertime>> {
    return this.client.list<BukOvertime>('/attendances/overtime', filters as Filters, page, pageSize);
  }

  async listAll(filters?: OvertimeFilters): Promise<BukOvertime[]> {
    return this.client.listAll<BukOvertime>('/attendances/overtime', filters as Filters);
  }

  async get(id: number): Promise<BukOvertime> {
    const response = await this.client.get<BukOvertime>(`/attendances/overtime/${id}`);
    return response.data;
  }

  async create(data: CreateOvertimeRequest): Promise<BukOvertime> {
    return this.client.post<BukOvertime>('/attendances/overtime', data as unknown as Record<string, unknown>);
  }

  /**
   * Update bulk (Buk acepta PUT /attendances/overtime para actualizar varios).
   */
  async update(data: Record<string, unknown>): Promise<BukOvertime> {
    return this.client.put<BukOvertime>('/attendances/overtime', data);
  }

  /**
   * Tipos de hora extra (50%, 100%, etc.).
   */
  async listTypes(): Promise<BukListResponse<BukOvertimeType>> {
    return this.client.list<BukOvertimeType>('/attendances/overtime/types');
  }
}

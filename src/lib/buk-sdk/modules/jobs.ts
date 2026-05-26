/**
 * Módulo Jobs — Trabajos, eventos contractuales y finiquitos
 *
 * Eventos (solo lectura):
 *   GET    /jobs/events/hires          → Altas (nuevas contrataciones)
 *   GET    /jobs/events/movements      → Movimientos (cambios de cargo/área)
 *   GET    /jobs/events/terminations   → Bajas (términos de contrato)
 *
 * Acciones sobre trabajos:
 *   PATCH  /jobs/{id}/terminate        → Terminar contrato
 *   POST   /jobs/{id}/undo             → Deshacer último movimiento
 *   PATCH  /jobs/{id}/undo_terminate   → Anular término
 *
 * Finiquitos:
 *   GET    /jobs/{id}/termination      → Obtener finiquito
 *   POST   /jobs/{id}/termination      → Crear finiquito
 */

import { BukHttpClient, type BukListResponse } from '../client';

// ── Tipos de eventos ──

export interface BukJobEvent {
  id: number;
  employee_id: number;
  full_name?: string;
  rut?: string;
  start_date?: string;
  end_date?: string;
  area_id?: number;
  role?: string;
  contract_type?: string;
  base_wage?: number;
  termination_reason?: string;
  [key: string]: unknown;
}

export interface JobEventFilters {
  start_date?: string;
  end_date?: string;
  sort?: 'id';
}

// ── Término de contrato ──

export type TerminationReason =
  | 'mutuo_acuerdo'
  | 'renuncia'
  | 'muerte'
  | 'vencimiento_plazo'
  | 'fin_servicio'
  | 'caso_fortuito'
  | 'falta_probidad'
  | 'acoso_sexual'
  | 'vias_de_hecho'
  | 'injurias'
  | 'conducta_inmoral'
  | 'acoso_laboral'
  | 'negociaciones_prohibidas'
  | 'no_concurrencia'
  | 'abandonar_trabajo'
  | 'faltas_seguridad'
  | 'perjuicio_material'
  | 'incumplimiento'
  | 'necesidades_empresa'
  | 'desahucio_gerente';

export interface TerminateJobInput {
  end_date: string;
  termination_reason: TerminationReason;
  comment?: string;
  employee_final_state?: 'pendiente' | 'inactivo';
  notice_date?: string;
  termination_fundaments?: string;
}

// ── Finiquito ──

export interface BukFiniquitoItem {
  nombre: string;
  monto: number;
}

export interface BukFiniquito {
  id: number;
  fecha_inicio: string;
  monto: number;
  monto_sin_liquidacion: number;
  razon_print: string;
  dias_indemnizacion_por_obra: number;
  dias_feriados_corridos: number;
  descuentos: BukFiniquitoItem[];
  haberes: BukFiniquitoItem[];
  indemnizacion_tributable: number;
  impuesto_indemnizacion: number;
  remuneraciones_pendientes: number;
  asignaciones_no_imponibles_pendientes: number;
}

export interface CreateFiniquitoInput {
  template_documento_id?: number;
  documento_visible?: boolean;
  descuentos?: { codigo: string; monto: number }[];
  haberes?: { codigo: string; monto: number }[];
}

export class JobsModule {
  constructor(private readonly client: BukHttpClient) {}

  // ── Eventos ──

  /**
   * Listar altas (nuevas contrataciones) en un período.
   */
  async listHires(
    filters?: JobEventFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukJobEvent>> {
    return this.client.list<BukJobEvent>(
      '/jobs/events/hires',
      filters as unknown as Record<string, string | number | boolean | undefined>,
      page,
      pageSize
    );
  }

  /**
   * Listar movimientos contractuales (cambios de cargo, área, sueldo) en un período.
   */
  async listMovements(
    filters?: JobEventFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukJobEvent>> {
    return this.client.list<BukJobEvent>(
      '/jobs/events/movements',
      filters as unknown as Record<string, string | number | boolean | undefined>,
      page,
      pageSize
    );
  }

  /**
   * Listar bajas (términos de contrato) en un período.
   */
  async listTerminations(
    filters?: JobEventFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukJobEvent>> {
    return this.client.list<BukJobEvent>(
      '/jobs/events/terminations',
      filters as unknown as Record<string, string | number | boolean | undefined>,
      page,
      pageSize
    );
  }

  /**
   * Todos los eventos de un tipo en un rango (auto-paginación).
   */
  async listAllHires(filters?: JobEventFilters): Promise<BukJobEvent[]> {
    return this.client.listAll<BukJobEvent>(
      '/jobs/events/hires',
      filters as unknown as Record<string, string | number | boolean | undefined>
    );
  }

  async listAllMovements(filters?: JobEventFilters): Promise<BukJobEvent[]> {
    return this.client.listAll<BukJobEvent>(
      '/jobs/events/movements',
      filters as unknown as Record<string, string | number | boolean | undefined>
    );
  }

  async listAllTerminations(filters?: JobEventFilters): Promise<BukJobEvent[]> {
    return this.client.listAll<BukJobEvent>(
      '/jobs/events/terminations',
      filters as unknown as Record<string, string | number | boolean | undefined>
    );
  }

  // ── Acciones sobre trabajos ──

  /**
   * Terminar el contrato de un colaborador (requiere end_date y termination_reason).
   */
  async terminate(jobId: number, data: TerminateJobInput): Promise<BukJobEvent> {
    return this.client.patch<BukJobEvent>(
      `/jobs/${jobId}/terminate`,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Deshacer el último movimiento y volver al trabajo anterior.
   */
  async undo(jobId: number): Promise<BukJobEvent> {
    return this.client.post<BukJobEvent>(`/jobs/${jobId}/undo`, {});
  }

  /**
   * Anular el término de un trabajo (reversión de baja).
   */
  async undoTerminate(jobId: number): Promise<BukJobEvent> {
    return this.client.patch<BukJobEvent>(`/jobs/${jobId}/undo_terminate`, {});
  }

  // ── Finiquitos ──

  /**
   * Obtener el finiquito de un trabajo por ID de trabajo.
   */
  async getFiniquito(jobId: number): Promise<BukFiniquito> {
    const response = await this.client.get<BukFiniquito>(`/jobs/${jobId}/termination`);
    return response.data;
  }

  /**
   * Crear el finiquito de un trabajo.
   */
  async createFiniquito(jobId: number, data?: CreateFiniquitoInput): Promise<BukFiniquito> {
    return this.client.post<BukFiniquito>(
      `/jobs/${jobId}/termination`,
      (data ?? {}) as unknown as Record<string, unknown>
    );
  }
}

/**
 * Módulo Assigns — Asignaciones de ítems/bonos a colaboradores
 *
 * Endpoints:
 *   GET    /employees/{id}/assigns     → Asignaciones vigentes de un empleado
 *   POST   /assigns                    → Crear asignación
 *   PATCH  /assigns/{id}               → Editar asignación (monto/centro de costo)
 *   POST   /assigns/{id}/terminate     → Terminar asignación
 *   DELETE /assigns/{id}               → Eliminar asignación
 */

import { BukHttpClient, type BukListResponse } from '../client';

export interface BukAssignItem {
  id: number;
  code: string;
}

export interface BukAssign {
  id: number;
  item: BukAssignItem;
  amount: number;
  start_date: string;
  end_date: string | null;
  description: string | null;
  cost_center?: string | null;
  custom_attrs?: Record<string, unknown>;
}

export interface CreateAssignInput {
  employee_id: number;
  item_id: number;
  start_date: string;
  end_date?: string;
  description?: string;
  amount?: number;
  advance_payment_day?: number;
  overwrite_existing_assign?: boolean;
  cost_center?: string;
}

export interface UpdateAssignInput {
  amount?: number;
  cost_center?: string;
}

export class AssignsModule {
  constructor(private readonly client: BukHttpClient) {}

  /**
   * Asignaciones vigentes de un empleado.
   * date filtra asignaciones vigentes para esa fecha (YYYY-MM-DD).
   */
  async listByEmployee(
    employeeId: number,
    date?: string,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukAssign>> {
    return this.client.list<BukAssign>(
      `/employees/${employeeId}/assigns`,
      date ? { date } : undefined,
      page,
      pageSize
    );
  }

  /**
   * Todas las asignaciones de un empleado (auto-paginación).
   */
  async listAllByEmployee(employeeId: number, date?: string): Promise<BukAssign[]> {
    return this.client.listAll<BukAssign>(
      `/employees/${employeeId}/assigns`,
      date ? { date } : undefined
    );
  }

  /**
   * Crear una asignación de ítem a un colaborador.
   */
  async create(data: CreateAssignInput): Promise<BukAssign> {
    return this.client.post<BukAssign>('/assigns', data as unknown as Record<string, unknown>);
  }

  /**
   * Editar monto o centro de costo de una asignación variable.
   */
  async update(id: number, data: UpdateAssignInput): Promise<BukAssign> {
    return this.client.patch<BukAssign>(`/assigns/${id}`, data as unknown as Record<string, unknown>);
  }

  /**
   * Terminar una asignación en una fecha dada (o período actual si no se indica).
   */
  async terminate(id: number, endDate?: string): Promise<BukAssign> {
    const body = endDate ? { end_date: endDate } : {};
    return this.client.post<BukAssign>(`/assigns/${id}/terminate`, body);
  }

  /**
   * Eliminar una asignación.
   */
  async delete(id: number): Promise<void> {
    return this.client.delete(`/assigns/${id}`);
  }
}

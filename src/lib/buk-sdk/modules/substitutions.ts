/**
 * Módulo Substitutions — Suplencias entre colaboradores
 *
 * Endpoints:
 *   GET    /substitutions       → Listar suplencias
 *   POST   /substitutions       → Crear suplencia
 *   PATCH  /substitutions/{id}  → Actualizar suplencia
 *   DELETE /substitutions/{id}  → Eliminar suplencia
 */

import { BukHttpClient, type BukListResponse } from '../client';

export interface BukSubstitution {
  id: number;
  active: boolean;
  employee_id: number;
  substitute_id: number;
  start_date: string;
  end_date: string | null;
  reason: string | null;
}

export interface CreateSubstitutionInput {
  employee_id: number;
  substitute_id: number;
  start_date: string;
  end_date?: string;
  active?: boolean;
  reason?: string;
}

export interface UpdateSubstitutionInput {
  employee_id?: number;
  substitute_id?: number;
  start_date?: string;
  end_date?: string;
  active?: boolean;
  reason?: string;
}

export class SubstitutionsModule {
  constructor(private readonly client: BukHttpClient) {}

  /**
   * Listar suplencias con paginación.
   */
  async list(page = 1, pageSize?: number): Promise<BukListResponse<BukSubstitution>> {
    return this.client.list<BukSubstitution>('/substitutions', undefined, page, pageSize);
  }

  /**
   * Todas las suplencias (auto-paginación).
   */
  async listAll(): Promise<BukSubstitution[]> {
    return this.client.listAll<BukSubstitution>('/substitutions');
  }

  /**
   * Suplencias activas de un colaborador (como titular o como suplente).
   */
  async listByEmployee(employeeId: number): Promise<BukSubstitution[]> {
    const all = await this.listAll();
    return all.filter(
      s => s.active && (s.employee_id === employeeId || s.substitute_id === employeeId)
    );
  }

  /**
   * Crear una nueva suplencia.
   */
  async create(data: CreateSubstitutionInput): Promise<BukSubstitution> {
    return this.client.post<BukSubstitution>(
      '/substitutions',
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Actualizar una suplencia existente.
   */
  async update(id: number, data: UpdateSubstitutionInput): Promise<BukSubstitution> {
    return this.client.patch<BukSubstitution>(
      `/substitutions/${id}`,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Eliminar una suplencia.
   */
  async delete(id: number): Promise<void> {
    return this.client.delete(`/substitutions/${id}`);
  }
}

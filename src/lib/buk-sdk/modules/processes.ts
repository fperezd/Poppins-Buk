/**
 * Módulo Processes — Procesos de nómina
 *
 * Endpoints:
 *   GET    /process          → Listar procesos de un período
 *   GET    /process/{id}     → Detalle de un proceso
 *   POST   /process          → Crear proceso
 *   DELETE /process/{id}     → Eliminar proceso (solo tipo liquidación)
 */

import { BukHttpClient, type BukListResponse } from '../client';

export type BukProcessType =
  | 'salary_payment'
  | 'item_payment'
  | 'snapshot_salary_payment'
  | 'ptu'
  | 'aguinaldo'
  | 'finiquito'
  | 'reproceso'
  | 'travel_expenses';

export type BukProcessStatus = 'abierto' | 'revision' | 'cerrado';

export interface BukProcess {
  id: number;
  name: string;
  process_type: BukProcessType;
  payment_date: string | null;
  status: BukProcessStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateProcessInput {
  process: {
    name: string;
    process_type: BukProcessType;
    start_date?: string;
    end_date?: string;
    payment_date?: string;
  };
  owner_email: string;
  employees: number[];
}

export class ProcessesModule {
  constructor(private readonly client: BukHttpClient) {}

  /**
   * Listar procesos de un período. date es requerido (YYYY-MM-DD).
   */
  async list(
    date: string,
    name?: string,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukProcess>> {
    return this.client.list<BukProcess>('/process', { date, name }, page, pageSize);
  }

  /**
   * Todos los procesos de un período (auto-paginación).
   */
  async listAll(date: string, name?: string): Promise<BukProcess[]> {
    return this.client.listAll<BukProcess>('/process', { date, name });
  }

  /**
   * Detalle de un proceso por ID.
   */
  async get(id: number): Promise<BukProcess> {
    const response = await this.client.get<BukProcess>(`/process/${id}`);
    return response.data;
  }

  /**
   * Crear un proceso de nómina.
   */
  async create(data: CreateProcessInput): Promise<BukProcess> {
    return this.client.post<BukProcess>('/process', data as unknown as Record<string, unknown>);
  }

  /**
   * Eliminar un proceso. Solo se pueden eliminar procesos de tipo liquidación.
   */
  async delete(id: number): Promise<void> {
    return this.client.delete(`/process/${id}`);
  }

  /**
   * Procesos abiertos de un período dado.
   */
  async listOpen(date: string): Promise<BukProcess[]> {
    const all = await this.listAll(date);
    return all.filter(p => p.status === 'abierto');
  }
}

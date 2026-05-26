/**
 * Módulo Credits — Créditos y préstamos descontados en liquidación
 *
 * Endpoints:
 *   GET    /credits                  → Listar créditos vigentes (date requerido)
 *   GET    /credits/{id}             → Detalle de un crédito
 *   POST   /credits/create           → Asignar crédito a colaborador
 *   PATCH  /credits/{id}             → Editar crédito
 *   DELETE /credits/{id}             → Eliminar crédito
 *   POST   /credits/{id}/suspend     → Suspender crédito
 *   POST   /credits/{id}/resume      → Reanudar crédito
 */

import { BukHttpClient, type BukListResponse } from '../client';

export type BukCreditType =
  | 'credito_personal'
  | 'dental'
  | 'leasing'
  | 'seguro_vida'
  | 'credito_otro';

export type BukCreditStatus = 'active' | 'suspended' | 'finished' | string;

export interface BukCredit {
  id: number;
  employee_id: number;
  name: string;
  description?: string;
  amount: number;
  term: number;
  start_date: string;
  end_date: string | null;
  initial_payment_date: string | null;
  paid_amount: number;
  remaining_balance: number;
  current_fee: number;
  status: BukCreditStatus;
  type: BukCreditType | string;
  currency: string;
  uf_day?: string | null;
}

export interface CreateCreditInput {
  employee_id: number;
  nombre: string;
  tipo: BukCreditType;
  start_date: string;
  moneda: '0' | '1';
  amount: number;
  cuota_actual: number;
  duracion: number;
  comentario?: string;
  dia_uf?: string;
}

export interface UpdateCreditInput {
  nombre?: string;
  start_date?: string;
  duracion?: number;
  amount?: number;
  comentario?: string;
}

export interface CreditListFilters {
  date: string;
  name?: string;
  type?: BukCreditType;
}

export class CreditsModule {
  constructor(private readonly client: BukHttpClient) {}

  /**
   * Listar créditos vigentes en una fecha (date YYYY-MM-DD requerido).
   */
  async list(
    filters: CreditListFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukCredit>> {
    return this.client.list<BukCredit>(
      '/credits',
      filters as unknown as Record<string, string | number | boolean | undefined>,
      page,
      pageSize
    );
  }

  /**
   * Todos los créditos vigentes en una fecha (auto-paginación).
   */
  async listAll(filters: CreditListFilters): Promise<BukCredit[]> {
    return this.client.listAll<BukCredit>(
      '/credits',
      filters as unknown as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Detalle de un crédito en un mes/año dado.
   */
  async get(id: number, year: number, month: number): Promise<BukCredit> {
    const response = await this.client.get<BukCredit>(`/credits/${id}`, { year, month });
    return response.data;
  }

  /**
   * Asignar un crédito a un colaborador.
   */
  async create(data: CreateCreditInput): Promise<BukCredit> {
    return this.client.post<BukCredit>('/credits/create', data as unknown as Record<string, unknown>);
  }

  /**
   * Editar un crédito existente.
   */
  async update(id: number, data: UpdateCreditInput): Promise<BukCredit> {
    return this.client.patch<BukCredit>(`/credits/${id}`, data as unknown as Record<string, unknown>);
  }

  /**
   * Eliminar un crédito.
   */
  async delete(id: number): Promise<void> {
    return this.client.delete(`/credits/${id}`);
  }

  /**
   * Suspender un crédito (deja de descontarse temporalmente).
   */
  async suspend(id: number, data?: Record<string, unknown>): Promise<BukCredit> {
    return this.client.post<BukCredit>(`/credits/${id}/suspend`, data ?? {});
  }

  /**
   * Reanudar un crédito suspendido.
   */
  async resume(id: number): Promise<BukCredit> {
    return this.client.post<BukCredit>(`/credits/${id}/resume`, {});
  }
}

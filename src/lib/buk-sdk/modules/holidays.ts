/**
 * Módulo Holidays — Feriados chilenos
 *
 * Endpoints:
 *   GET /holidays  → Listar feriados (opcionalmente desde una fecha)
 */

import { BukHttpClient, type BukListResponse } from '../client';

export interface BukHoliday {
  day: string;
}

export class HolidaysModule {
  constructor(private readonly client: BukHttpClient) {}

  /**
   * Listar feriados. from filtra desde esa fecha (YYYY-MM-DD).
   * Si se omite from, BUK retorna desde inicio del año en curso.
   */
  async list(from?: string, page = 1, pageSize?: number): Promise<BukListResponse<BukHoliday>> {
    return this.client.list<BukHoliday>(
      '/holidays',
      from ? { from } : undefined,
      page,
      pageSize
    );
  }

  /**
   * Todos los feriados desde una fecha (auto-paginación).
   */
  async listAll(from?: string): Promise<BukHoliday[]> {
    return this.client.listAll<BukHoliday>('/holidays', from ? { from } : undefined);
  }

  /**
   * Feriados del año actual.
   */
  async listCurrentYear(): Promise<BukHoliday[]> {
    const year = new Date().getFullYear();
    return this.listAll(`${year}-01-01`);
  }

  /**
   * Verifica si una fecha es feriado. Formato YYYY-MM-DD.
   */
  async isHoliday(date: string): Promise<boolean> {
    const year = date.slice(0, 4);
    const holidays = await this.listAll(`${year}-01-01`);
    return holidays.some(h => h.day === date);
  }
}

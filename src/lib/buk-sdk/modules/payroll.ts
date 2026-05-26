/**
 * Modulo Payroll — Liquidaciones y procesos de nomina
 *
 * Paths alineados con Swagger oficial (validados contra tenant prod 2026-05-09):
 *   GET    /process                                  → procesos de nomina (requiere date)
 *   POST   /process                                  → crear proceso
 *   GET    /process/{id}                             → detalle proceso
 *   DELETE /process/{id}
 *
 *   GET    /payroll_detail/month                     → liquidaciones mensuales (todos)
 *   GET    /payroll_detail/semi_month                → quincenales
 *   GET    /payroll_detail/week                      → semanales
 *   GET    /employees/{id}/payroll_detail            → liquidaciones de UN empleado
 *   GET    /employees/{id}/statements/{year}-{month}.pdf  → PDF de liquidacion
 *
 *   ⚠️ ELIMINADO: /payroll_processes y subpaths NO existen en Buk publica.
 */

import { BukHttpClient, type BukListResponse } from '../client';

type Filters = Record<string, string | number | boolean | undefined>;

/**
 * Linea de liquidacion (haber o descuento) — sub-objeto de PayrollDetail.
 */
export interface BukPayrollLine {
  type: 'haber' | 'descuento' | string;
  income_type: string;
  subtype: string | null;
  name: string;
  amount: number;
  resettlement: boolean;
  taxable: boolean;
  imponible?: boolean;
  [k: string]: unknown;
}

/**
 * Detalle de liquidacion para UN periodo de UN empleado.
 * Devuelto por GET /employees/{id}/payroll_detail y /payroll_detail/month.
 */
export interface BukPayrollDetail {
  liquidacion_id: number;
  person_id: number;
  employee_id: number;
  rut: string;
  month: number;
  year: number;
  worked_days: number;
  noworked_days: number;
  income_gross: number;
  income_net: number;
  income_afp: number;
  income_ips: number;
  total_income_taxable: number;
  total_income_notaxable: number;
  total_legal_discounts: number;
  total_other_discounts: number;
  closed: boolean;
  liquid_reach: number;
  taxable_base: number;
  lines_settlement: BukPayrollLine[];
}

/**
 * Proceso de nomina (tienen liquidaciones agrupadas).
 */
export interface BukPayrollProcess {
  id: number;
  date: string;
  status: string;
  company_id?: number;
  [k: string]: unknown;
}

export interface ProcessFilters {
  date?: string;        // requerido por Buk para listar procesos
  year?: number;
  month?: number;
  company_id?: number;
  status?: string;
}

export interface PayrollPeriodFilters {
  start?: string;       // formato DD-MM-YYYY
  end?: string;
  company_id?: number;
}

export class PayrollModule {
  constructor(private readonly client: BukHttpClient) {}

  // ── Procesos ──

  /**
   * Listar procesos de nomina. Buk requiere parametro `date` (al menos year-month).
   */
  async listProcesses(
    filters: ProcessFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPayrollProcess>> {
    return this.client.list<BukPayrollProcess>('/process', filters as Filters, page, pageSize);
  }

  async listAllProcesses(filters: ProcessFilters): Promise<BukPayrollProcess[]> {
    return this.client.listAll<BukPayrollProcess>('/process', filters as Filters);
  }

  async getProcess(id: number): Promise<BukPayrollProcess> {
    const response = await this.client.get<BukPayrollProcess>(`/process/${id}`);
    return response.data;
  }

  // ── Liquidaciones (payroll_detail) ──

  /**
   * Liquidaciones mensuales de todos los empleados en un rango.
   * Parametros `start` y `end` en formato DD-MM-YYYY.
   */
  async listMonthly(
    filters?: PayrollPeriodFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPayrollDetail>> {
    return this.client.list<BukPayrollDetail>('/payroll_detail/month', filters as Filters, page, pageSize);
  }

  async listAllMonthly(filters?: PayrollPeriodFilters): Promise<BukPayrollDetail[]> {
    return this.client.listAll<BukPayrollDetail>('/payroll_detail/month', filters as Filters);
  }

  async listSemiMonthly(
    filters?: PayrollPeriodFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPayrollDetail>> {
    return this.client.list<BukPayrollDetail>('/payroll_detail/semi_month', filters as Filters, page, pageSize);
  }

  async listWeekly(
    filters?: PayrollPeriodFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPayrollDetail>> {
    return this.client.list<BukPayrollDetail>('/payroll_detail/week', filters as Filters, page, pageSize);
  }

  /**
   * Liquidaciones de UN empleado especifico.
   * Endpoint: GET /employees/{id}/payroll_detail
   */
  async getEmployeePayrollDetail(
    employeeId: number,
    filters?: PayrollPeriodFilters
  ): Promise<BukListResponse<BukPayrollDetail>> {
    return this.client.list<BukPayrollDetail>(
      `/employees/${employeeId}/payroll_detail`,
      filters as Filters
    );
  }

  /**
   * Todas las liquidaciones historicas de un empleado (auto-paginate).
   */
  async getEmployeeHistory(
    employeeId: number,
    filters?: PayrollPeriodFilters
  ): Promise<BukPayrollDetail[]> {
    return this.client.listAll<BukPayrollDetail>(
      `/employees/${employeeId}/payroll_detail`,
      filters as Filters
    );
  }

  /**
   * Latest liquidacion de un empleado (la mas reciente).
   */
  async getLatestForEmployee(employeeId: number): Promise<BukPayrollDetail | null> {
    const history = await this.getEmployeeHistory(employeeId);
    if (!history.length) return null;
    history.sort((a, b) => (b.year - a.year) || (b.month - a.month));
    return history[0];
  }

  /**
   * URL de descarga del PDF de liquidacion. No descarga el binario; devuelve la URL.
   * Ejemplo: /employees/123/statements/2026-04.pdf
   */
  getStatementPdfUrl(employeeId: number, year: number, month: number): string {
    const m = String(month).padStart(2, '0');
    return `/employees/${employeeId}/statements/${year}-${m}.pdf`;
  }

  // ── Aliases legacy (compatibilidad temporal con service layer antiguo) ──

  /** @deprecated Usar listMonthly() o getEmployeePayrollDetail() */
  async listAllItems(_processId: number, filters?: PayrollPeriodFilters): Promise<BukPayrollDetail[]> {
    void _processId;
    return this.listAllMonthly(filters);
  }

  /** @deprecated Usar getEmployeePayrollDetail() */
  async getItem(_processId: number, itemId: number): Promise<BukPayrollDetail | null> {
    void _processId;
    return this.getLatestForEmployee(itemId);
  }
}

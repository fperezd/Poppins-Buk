/**
 * Módulo Payroll — Procesos de Liquidación
 *
 * Endpoints reales BUK (apidocs):
 *   GET /process_periods                              → Listar períodos
 *   GET /process                                      → Listar procesos
 *   GET /process/{id}                                 → Detalle de proceso
 *   GET /payroll_detail/month                         → Liquidaciones mensuales
 *   GET /payroll_detail/semi_month                    → Liquidaciones quincenales
 *   GET /payroll_detail/week                          → Liquidaciones semanales
 *   GET /employees/{employee_id}/payroll_detail       → Detalle de liquidación por colaborador
 *   GET /employees/{id}/statements/{year}-{MM}.pdf    → PDF de liquidación (mes con cero: 03)
 */

import { BukHttpClient, type BukListResponse } from '../client';
import type {
  BukPayrollProcess,
  BukPayrollItem,
  BukProcessPeriod,
  PayrollProcessFilters,
  PayrollItemFilters,
} from '../types/payroll';

export class PayrollModule {
  constructor(private readonly client: BukHttpClient) {}

  // ── Períodos ──

  async listPeriods(page = 1, pageSize?: number): Promise<BukListResponse<BukProcessPeriod>> {
    return this.client.list<BukProcessPeriod>('/process_periods', {}, page, pageSize);
  }

  async listAllPeriods(): Promise<BukProcessPeriod[]> {
    return this.client.listAll<BukProcessPeriod>('/process_periods');
  }

  // ── Procesos ──

  async listProcesses(
    filters?: PayrollProcessFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPayrollProcess>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (filters?.year) params.year = filters.year;
    if (filters?.month) params.month = filters.month;
    if (filters?.status) params.status = filters.status;
    if (filters?.company_id) params.company_id = filters.company_id;

    return this.client.list<BukPayrollProcess>('/process', params, page, pageSize);
  }

  async listAllProcesses(filters?: PayrollProcessFilters): Promise<BukPayrollProcess[]> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (filters?.year) params.year = filters.year;
    if (filters?.month) params.month = filters.month;
    if (filters?.status) params.status = filters.status;
    if (filters?.company_id) params.company_id = filters.company_id;

    return this.client.listAll<BukPayrollProcess>('/process', params);
  }

  async getProcess(processId: number): Promise<BukPayrollProcess> {
    const response = await this.client.get<BukPayrollProcess>(`/process/${processId}`);
    return response.data;
  }

  // ── Liquidaciones ──

  async listMonthlyPayroll(
    filters?: PayrollItemFilters,
    page = 1,
    pageSize?: number
  ): Promise<BukListResponse<BukPayrollItem>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (filters?.employee_id) params.employee_id = filters.employee_id;

    return this.client.list<BukPayrollItem>('/payroll_detail/month', params, page, pageSize);
  }

  async listAllMonthlyPayroll(filters?: PayrollItemFilters): Promise<BukPayrollItem[]> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (filters?.employee_id) params.employee_id = filters.employee_id;

    return this.client.listAll<BukPayrollItem>('/payroll_detail/month', params);
  }

  async getEmployeePayrollDetail(employeeId: number): Promise<BukPayrollItem> {
    const response = await this.client.get<BukPayrollItem>(
      `/employees/${employeeId}/payroll_detail`
    );
    return response.data;
  }

  // ── PDF ──

  // Mes con cero delante: 2026-03 ✅ / 2026-3 ❌
  getStatementPdfPath(employeeId: number, year: number, month: number): string {
    const mm = String(month).padStart(2, '0');
    return `/employees/${employeeId}/statements/${year}-${mm}.pdf`;
  }

  // ── Helpers ──

  async getLatestForEmployee(employeeId: number): Promise<BukPayrollItem | null> {
    const processes = await this.listAllProcesses();
    const sorted = processes.sort((a, b) => b.period.localeCompare(a.period));

    for (const process of sorted) {
      const items = await this.listMonthlyPayroll({ employee_id: employeeId }, 1, 25);
      const match = items.data.find(item => item.employee_id === employeeId);
      if (match) return match;
    }

    return null;
  }

  async getEmployeeHistory(
    employeeId: number,
    fromPeriod?: string,
    toPeriod?: string
  ): Promise<BukPayrollItem[]> {
    const allProcesses = await this.listAllProcesses();
    const filtered = allProcesses.filter(p => {
      if (fromPeriod && p.period < fromPeriod) return false;
      if (toPeriod && p.period > toPeriod) return false;
      return true;
    });

    const results: BukPayrollItem[] = [];
    for (const process of filtered) {
      const items = await this.listAllMonthlyPayroll({ employee_id: employeeId });
      results.push(...items.filter(i => i.employee_id === employeeId));
    }

    return results.sort((a, b) => a.period.localeCompare(b.period));
  }
}

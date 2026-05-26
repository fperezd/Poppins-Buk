/**
 * Command Handlers — Domain-specific command implementations.
 *
 * Each handler receives a typed command and returns domain data.
 * Handlers delegate to the existing service layer (buk/index.ts).
 */

import type { Command, CommandHandler } from './types';
import type {
  ListEmployeesPayload,
  GetEmployeePayload,
  CreateAbsencePayload,
  ListPayrollPayload,
  ListAbsencesPayload,
  ListOvertimePayload,
  CreateOvertimePayload,
  OrganizationPayload,
} from './types';

// Lazy imports to avoid circular deps and cookies() issues
async function getService() {
  return import('@/lib/buk/index');
}

async function getSdk() {
  const { getBukSDK } = await import('@/lib/buk-sdk');
  return getBukSDK();
}

// ── Employee Handlers ──

export const listEmployees: CommandHandler<ListEmployeesPayload> = async (command) => {
  const service = await getService();
  const employees = await service.getEmployees();
  const status = command.payload.status;
  if (status) {
    return employees.filter((e) => e.estado === status);
  }
  return employees;
};

export const getEmployee: CommandHandler<GetEmployeePayload> = async (command) => {
  const service = await getService();
  return service.getEmployee(command.payload.id);
};

// ── Payroll Handlers ──

export const listPayroll: CommandHandler<ListPayrollPayload> = async (command) => {
  const service = await getService();
  return service.getPayrollItems(command.payload.employeeId);
};

// ── Absence Handlers ──

export const listAbsences: CommandHandler<ListAbsencesPayload> = async (command) => {
  const service = await getService();
  return service.getAbsences(command.payload.employeeId);
};

export const createAbsence: CommandHandler<CreateAbsencePayload> = async (command) => {
  const service = await getService();
  return service.createAbsence(command.payload);
};

export const approveAbsence: CommandHandler<{ id: string }> = async (command) => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  const { error } = await (await supabase)
    .from('absences')
    .update({ estado: 'aprobada', fecha_aprobacion: new Date().toISOString() } as never)
    .eq('id', command.payload.id);

  if (error) throw new Error(`Failed to approve absence: ${error.message}`);
  return { success: true, id: command.payload.id, estado: 'aprobada' };
};

export const rejectAbsence: CommandHandler<{ id: string }> = async (command) => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  const { error } = await (await supabase)
    .from('absences')
    .update({ estado: 'rechazada' } as never)
    .eq('id', command.payload.id);

  if (error) throw new Error(`Failed to reject absence: ${error.message}`);
  return { success: true, id: command.payload.id, estado: 'rechazada' };
};

// ── Overtime Handlers ──

export const listOvertime: CommandHandler<ListOvertimePayload> = async (command) => {
  const service = await getService();
  return service.getOvertime(
    command.payload.employeeId,
    command.payload.startDate,
    command.payload.endDate
  );
};

export const createOvertime: CommandHandler<CreateOvertimePayload> = async (command) => {
  const service = await getService();
  return service.createOvertime(command.payload);
};

// ── Benefits Handlers ──

export const listBenefits: CommandHandler = async () => {
  const service = await getService();
  return service.getBenefits();
};

// ── Organization Handlers ──

export const listOrganization: CommandHandler<OrganizationPayload> = async (command) => {
  const sdk = await getSdk();
  const type = command.payload.type;
  switch (type) {
    case 'departments':
      return sdk.organization.listAllDepartments();
    case 'cost_centers':
      return sdk.organization.listAllCostCenters();
    case 'roles':
      return sdk.organization.listAllRoles();
    case 'companies':
      return sdk.organization.listAllCompanies();
    case 'locations':
      return sdk.organization.listAllLocations();
    default:
      throw new Error(`Unknown organization type: ${type}`);
  }
};

// ── System Handlers ──

export const healthCheck: CommandHandler = async () => {
  const sdk = await getSdk();
  const start = Date.now();
  try {
    await sdk.employees.listActive({ page: 1, per_page: 1 });
    return { ok: true, latencyMs: Date.now() - start };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};

export const syncData: CommandHandler<{ entity: string; direction?: string }> = async (
  command
) => {
  const results: Record<string, { synced: number; status: string }> = {};
  const entity = command.payload.entity;
  const service = await getService();

  if (entity === 'employees' || entity === 'all') {
    const employees = await service.getEmployees();
    results.employees = { synced: employees.length, status: 'success' };
  }

  if (entity === 'payroll' || entity === 'all') {
    const payroll = await service.getPayrollItems();
    results.payroll = { synced: payroll.length, status: 'success' };
  }

  if (entity === 'absences' || entity === 'all') {
    const absences = await service.getAbsences();
    results.absences = { synced: absences.length, status: 'success' };
  }

  return { entity, direction: command.payload.direction || 'pull', results };
};

// ── Handler Registry ──

export function registerAllHandlers(
  register: (
    domain: string,
    action: string,
    handler: CommandHandler<never, unknown>
  ) => void
): void {
  // Employees
  register('employees', 'list', listEmployees as CommandHandler<never, unknown>);
  register('employees', 'get', getEmployee as CommandHandler<never, unknown>);

  // Payroll
  register('payroll', 'list', listPayroll as CommandHandler<never, unknown>);

  // Absences
  register('absences', 'list', listAbsences as CommandHandler<never, unknown>);
  register('absences', 'create', createAbsence as CommandHandler<never, unknown>);
  register('absences', 'approve', approveAbsence as CommandHandler<never, unknown>);
  register('absences', 'reject', rejectAbsence as CommandHandler<never, unknown>);

  // Overtime
  register('overtime', 'list', listOvertime as CommandHandler<never, unknown>);
  register('overtime', 'create', createOvertime as CommandHandler<never, unknown>);

  // Benefits
  register('benefits', 'list', listBenefits as CommandHandler<never, unknown>);

  // Organization
  register('organization', 'list', listOrganization as CommandHandler<never, unknown>);

  // System
  register('system', 'health-check', healthCheck as CommandHandler<never, unknown>);
  register('system', 'sync', syncData as CommandHandler<never, unknown>);
}

/**
 * Command-Control System — Type Definitions
 *
 * Centralized command dispatcher with typed commands, middleware pipeline,
 * validation, authorization, and audit logging.
 */

// ── Command Domains ──

export type CommandDomain =
  | 'employees'
  | 'payroll'
  | 'absences'
  | 'overtime'
  | 'benefits'
  | 'organization'
  | 'system';

// ── Command Actions ──

export type CommandAction =
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'sync'
  | 'health-check';

// ── Base Command ──

export interface Command<TPayload = Record<string, unknown>> {
  /** Unique command ID (auto-generated if not provided) */
  id?: string;
  /** Domain this command targets */
  domain: CommandDomain;
  /** Action to perform */
  action: CommandAction;
  /** Command payload */
  payload: TPayload;
  /** Metadata */
  meta?: CommandMeta;
}

export interface CommandMeta {
  /** User ID executing the command */
  userId?: string;
  /** Employer ID context */
  employerId?: string;
  /** Request IP address */
  ipAddress?: string;
  /** Timestamp of command creation */
  timestamp?: string;
  /** Correlation ID for tracing */
  correlationId?: string;
}

// ── Command Result ──

export interface CommandResult<TData = unknown> {
  /** Whether the command succeeded */
  success: boolean;
  /** Result data */
  data?: TData;
  /** Error message if failed */
  error?: string;
  /** Error code for programmatic handling */
  errorCode?: CommandErrorCode;
  /** Command metadata */
  meta: {
    commandId: string;
    domain: CommandDomain;
    action: CommandAction;
    executedAt: string;
    durationMs: number;
  };
}

export type CommandErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'HANDLER_NOT_FOUND'
  | 'EXECUTION_ERROR'
  | 'RATE_LIMITED';

// ── Command Handler ──

export type CommandHandler<TPayload = Record<string, unknown>, TResult = unknown> = (
  command: Command<TPayload>,
  context: CommandContext
) => Promise<TResult>;

// ── Middleware ──

export type CommandMiddleware = (
  command: Command,
  context: CommandContext,
  next: () => Promise<CommandResult>
) => Promise<CommandResult>;

// ── Command Context ──

export interface CommandContext {
  /** Unique execution ID */
  executionId: string;
  /** Start time */
  startedAt: number;
  /** Audit trail entries */
  auditTrail: AuditEntry[];
  /** Whether to skip audit logging */
  skipAudit?: boolean;
}

export interface AuditEntry {
  phase: 'received' | 'validated' | 'authorized' | 'executed' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
}

// ── Domain-Specific Command Payloads ──

export interface ListEmployeesPayload {
  status?: 'activo' | 'inactivo' | 'licencia';
}

export interface GetEmployeePayload {
  id: number;
}

export interface CreateEmployeePayload {
  rut: string;
  nombre: string;
  apellido: string;
  cargo?: string;
  fechaIngreso: string;
  sueldoBase: number;
  tipoContrato?: string;
  email?: string;
  telefono?: string;
}

export interface ListPayrollPayload {
  employeeId?: number;
  periodo?: string;
}

export interface ListAbsencesPayload {
  employeeId?: number;
}

export interface CreateAbsencePayload {
  employee_id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  observaciones?: string;
}

export interface ApproveAbsencePayload {
  id: string;
  aprobado_por?: string;
}

export interface ListOvertimePayload {
  employeeId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateOvertimePayload {
  employee_id: number;
  date: string;
  hours: number;
  observations?: string;
}

export interface SyncPayload {
  entity: 'employees' | 'payroll' | 'absences' | 'all';
  direction?: 'pull' | 'push';
}

export interface OrganizationPayload {
  type: 'departments' | 'cost_centers' | 'roles' | 'companies' | 'locations';
}

// ── Command Registry Key ──

export type CommandKey = `${CommandDomain}:${CommandAction}`;

/**
 * Command-Control Middleware — Built-in middleware for the command pipeline.
 *
 * Provides validation, audit logging, and error normalization.
 */

import type { CommandMiddleware, Command, CommandResult, CommandContext } from './types';

// ── Validation Middleware ──

type ValidationRule = {
  domain: string;
  action: string;
  validate: (payload: Record<string, unknown>) => string | null;
};

const validationRules: ValidationRule[] = [
  {
    domain: 'employees',
    action: 'get',
    validate: (p) => (typeof p.id !== 'number' ? 'id must be a number' : null),
  },
  {
    domain: 'employees',
    action: 'create',
    validate: (p) => {
      if (!p.rut || typeof p.rut !== 'string') return 'rut is required';
      if (!p.nombre || typeof p.nombre !== 'string') return 'nombre is required';
      if (!p.apellido || typeof p.apellido !== 'string') return 'apellido is required';
      if (!p.fechaIngreso) return 'fechaIngreso is required';
      if (typeof p.sueldoBase !== 'number' || p.sueldoBase < 0) return 'sueldoBase must be a non-negative number';
      return null;
    },
  },
  {
    domain: 'absences',
    action: 'create',
    validate: (p) => {
      if (!p.employee_id) return 'employee_id is required';
      if (!p.tipo) return 'tipo is required';
      if (!p.fecha_inicio) return 'fecha_inicio is required';
      if (!p.fecha_fin) return 'fecha_fin is required';
      if (typeof p.dias !== 'number' || p.dias <= 0) return 'dias must be a positive number';
      return null;
    },
  },
  {
    domain: 'overtime',
    action: 'create',
    validate: (p) => {
      if (!p.employee_id) return 'employee_id is required';
      if (!p.date) return 'date is required';
      if (typeof p.hours !== 'number' || p.hours <= 0) return 'hours must be a positive number';
      return null;
    },
  },
  {
    domain: 'absences',
    action: 'approve',
    validate: (p) => (!p.id ? 'id is required' : null),
  },
  {
    domain: 'absences',
    action: 'reject',
    validate: (p) => (!p.id ? 'id is required' : null),
  },
  {
    domain: 'system',
    action: 'sync',
    validate: (p) => {
      const valid = ['employees', 'payroll', 'absences', 'all'];
      if (!valid.includes(p.entity as string)) return `entity must be one of: ${valid.join(', ')}`;
      return null;
    },
  },
];

export const validationMiddleware: CommandMiddleware = async (
  command: Command,
  context: CommandContext,
  next: () => Promise<CommandResult>
) => {
  const rule = validationRules.find(
    (r) => r.domain === command.domain && r.action === command.action
  );

  if (rule) {
    const error = rule.validate(command.payload);
    if (error) {
      context.auditTrail.push({
        phase: 'validated',
        timestamp: new Date().toISOString(),
        details: `Validation failed: ${error}`,
      });
      return {
        success: false,
        error: `Validation error: ${error}`,
        errorCode: 'VALIDATION_ERROR',
        meta: {
          commandId: command.id || '',
          domain: command.domain,
          action: command.action,
          executedAt: new Date().toISOString(),
          durationMs: Date.now() - context.startedAt,
        },
      };
    }
  }

  context.auditTrail.push({
    phase: 'validated',
    timestamp: new Date().toISOString(),
  });

  return next();
};

// ── Audit Logging Middleware ──

export const auditMiddleware: CommandMiddleware = async (
  command: Command,
  context: CommandContext,
  next: () => Promise<CommandResult>
) => {
  if (context.skipAudit) return next();

  const logEntry = {
    commandId: command.id,
    domain: command.domain,
    action: command.action,
    userId: command.meta?.userId || 'anonymous',
    employerId: command.meta?.employerId,
    timestamp: new Date().toISOString(),
  };

  // Log command receipt (server-side only)
  if (typeof console !== 'undefined') {
    console.log(`[CMD] ${logEntry.domain}:${logEntry.action}`, JSON.stringify(logEntry));
  }

  const result = await next();

  // Log command result
  if (typeof console !== 'undefined') {
    const status = result.success ? 'OK' : 'FAIL';
    console.log(
      `[CMD] ${status} ${logEntry.domain}:${logEntry.action} (${result.meta.durationMs}ms)`
    );
  }

  return result;
};

// ── Rate Limiting Middleware (simple in-memory) ──

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 100; // max commands per window per user

export const rateLimitMiddleware: CommandMiddleware = async (
  command: Command,
  context: CommandContext,
  next: () => Promise<CommandResult>
) => {
  const key = command.meta?.userId || command.meta?.ipAddress || 'global';
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (entry && entry.resetAt > now) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return {
        success: false,
        error: 'Rate limit exceeded. Try again later.',
        errorCode: 'RATE_LIMITED',
        meta: {
          commandId: command.id || '',
          domain: command.domain,
          action: command.action,
          executedAt: new Date().toISOString(),
          durationMs: Date.now() - context.startedAt,
        },
      };
    }
    entry.count++;
  } else {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  return next();
};

/**
 * Command-Control API Route
 *
 * Single unified endpoint for dispatching commands.
 *
 * POST /api/commands
 *   Body: { domain, action, payload, meta? }
 *   Returns: CommandResult
 *
 * GET /api/commands
 *   Returns: list of registered commands
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCommandBus } from '@/lib/command-control';
import type { Command, CommandDomain, CommandAction } from '@/lib/command-control';

const VALID_DOMAINS: CommandDomain[] = [
  'employees', 'payroll', 'absences', 'overtime', 'benefits', 'organization', 'system',
];

const VALID_ACTIONS: CommandAction[] = [
  'list', 'get', 'create', 'update', 'delete', 'approve', 'reject', 'sync', 'health-check',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, action, payload, meta } = body;

    // Basic input validation
    if (!domain || !VALID_DOMAINS.includes(domain)) {
      return NextResponse.json(
        { success: false, error: `Invalid domain. Must be one of: ${VALID_DOMAINS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    const command: Command = {
      domain,
      action,
      payload: payload || {},
      meta: {
        ...meta,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        timestamp: new Date().toISOString(),
      },
    };

    const bus = getCommandBus();
    const result = await bus.dispatch(command);

    const status = result.success ? 200 : result.errorCode === 'VALIDATION_ERROR' ? 400
      : result.errorCode === 'HANDLER_NOT_FOUND' ? 404
      : result.errorCode === 'RATE_LIMITED' ? 429
      : result.errorCode === 'UNAUTHORIZED' ? 401
      : result.errorCode === 'FORBIDDEN' ? 403
      : 500;

    return NextResponse.json(result, { status });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
        errorCode: 'EXECUTION_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const bus = getCommandBus();
  const commands = bus.listCommands();

  return NextResponse.json({
    success: true,
    data: {
      commands,
      count: commands.length,
      endpoint: '/api/commands',
      method: 'POST',
      usage: {
        body: '{ "domain": "employees", "action": "list", "payload": {}, "meta": {} }',
      },
    },
  });
}

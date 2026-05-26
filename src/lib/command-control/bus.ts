/**
 * Command Bus — Core dispatcher with middleware pipeline.
 *
 * Routes typed commands to registered handlers, executing
 * middleware in order (validation → authorization → audit → handler).
 */

import type {
  Command,
  CommandResult,
  CommandHandler,
  CommandMiddleware,
  CommandContext,
  CommandKey,
  CommandDomain,
  CommandAction,
} from './types';

export class CommandBus {
  private handlers = new Map<CommandKey, CommandHandler>();
  private middleware: CommandMiddleware[] = [];

  /** Register a handler for a domain:action pair */
  register<TPayload = Record<string, unknown>, TResult = unknown>(
    domain: CommandDomain,
    action: CommandAction,
    handler: CommandHandler<TPayload, TResult>
  ): void {
    const key: CommandKey = `${domain}:${action}`;
    this.handlers.set(key, handler as unknown as CommandHandler);
  }

  /** Add middleware to the pipeline (executed in order) */
  use(mw: CommandMiddleware): void {
    this.middleware.push(mw);
  }

  /** Dispatch a command through the middleware pipeline */
  async dispatch<TData = unknown>(command: Command): Promise<CommandResult<TData>> {
    const executionId = command.id || generateId();
    const startedAt = Date.now();

    const context: CommandContext = {
      executionId,
      startedAt,
      auditTrail: [
        {
          phase: 'received',
          timestamp: new Date().toISOString(),
          details: `${command.domain}:${command.action}`,
        },
      ],
    };

    // Attach metadata
    command.id = executionId;
    if (!command.meta) command.meta = {};
    if (!command.meta.timestamp) command.meta.timestamp = new Date().toISOString();

    // Build execution chain: middleware → handler
    const key: CommandKey = `${command.domain}:${command.action}`;
    const handler = this.handlers.get(key);

    const executeHandler = async (): Promise<CommandResult> => {
      if (!handler) {
        return {
          success: false,
          error: `No handler registered for ${key}`,
          errorCode: 'HANDLER_NOT_FOUND',
          meta: {
            commandId: executionId,
            domain: command.domain,
            action: command.action,
            executedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt,
          },
        };
      }

      try {
        context.auditTrail.push({
          phase: 'executed',
          timestamp: new Date().toISOString(),
        });

        const data = await handler(command, context);

        context.auditTrail.push({
          phase: 'completed',
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data,
          meta: {
            commandId: executionId,
            domain: command.domain,
            action: command.action,
            executedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt,
          },
        };
      } catch (err) {
        context.auditTrail.push({
          phase: 'failed',
          timestamp: new Date().toISOString(),
          details: err instanceof Error ? err.message : String(err),
        });

        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown execution error',
          errorCode: 'EXECUTION_ERROR',
          meta: {
            commandId: executionId,
            domain: command.domain,
            action: command.action,
            executedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt,
          },
        };
      }
    };

    // Chain middleware
    let chain = executeHandler;
    for (let i = this.middleware.length - 1; i >= 0; i--) {
      const mw = this.middleware[i];
      const next = chain;
      chain = () => mw(command, context, next);
    }

    return chain() as Promise<CommandResult<TData>>;
  }

  /** Check if a handler is registered */
  hasHandler(domain: CommandDomain, action: CommandAction): boolean {
    return this.handlers.has(`${domain}:${action}`);
  }

  /** List all registered command keys */
  listCommands(): CommandKey[] {
    return Array.from(this.handlers.keys());
  }
}

function generateId(): string {
  return `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

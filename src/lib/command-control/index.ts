/**
 * Command-Control System — Entry Point
 *
 * Singleton command bus with all handlers and middleware pre-configured.
 * Import getCommandBus() to dispatch commands from API routes or server code.
 */

import { CommandBus } from './bus';
import { validationMiddleware, auditMiddleware, rateLimitMiddleware } from './middleware';
import { registerAllHandlers } from './handlers';

export type { Command, CommandResult, CommandDomain, CommandAction, CommandKey } from './types';
export { CommandBus } from './bus';

let instance: CommandBus | null = null;

/** Get the singleton command bus instance */
export function getCommandBus(): CommandBus {
  if (!instance) {
    instance = new CommandBus();

    // Middleware pipeline (order matters):
    // 1. Rate limiting
    // 2. Validation
    // 3. Audit logging
    instance.use(rateLimitMiddleware);
    instance.use(validationMiddleware);
    instance.use(auditMiddleware);

    // Register all domain handlers
    registerAllHandlers(instance.register.bind(instance));
  }
  return instance;
}

'use client';

import { useState, useCallback } from 'react';
import type { CommandDomain, CommandAction, CommandResult } from '@/lib/command-control/types';

interface UseCommandOptions {
  /** Called on successful execution */
  onSuccess?: (result: CommandResult) => void;
  /** Called on error */
  onError?: (error: string) => void;
}

interface UseCommandReturn<TData = unknown> {
  /** Execute a command */
  execute: (
    domain: CommandDomain,
    action: CommandAction,
    payload?: Record<string, unknown>
  ) => Promise<CommandResult<TData> | null>;
  /** Last result */
  result: CommandResult<TData> | null;
  /** Loading state */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** Reset state */
  reset: () => void;
}

/**
 * React hook for executing commands through the Command-Control system.
 *
 * Usage:
 *   const { execute, loading, error, result } = useCommand();
 *   await execute('employees', 'list', { status: 'activo' });
 */
export function useCommand<TData = unknown>(
  options?: UseCommandOptions
): UseCommandReturn<TData> {
  const [result, setResult] = useState<CommandResult<TData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setLoading(false);
    setError(null);
  }, []);

  const execute = useCallback(
    async (
      domain: CommandDomain,
      action: CommandAction,
      payload: Record<string, unknown> = {}
    ): Promise<CommandResult<TData> | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/commands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, action, payload }),
        });

        const json: CommandResult<TData> = await res.json();
        setResult(json);

        if (json.success) {
          options?.onSuccess?.(json as CommandResult);
        } else {
          const errMsg = json.error || 'Command failed';
          setError(errMsg);
          options?.onError?.(errMsg);
        }

        return json;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Network error';
        setError(errMsg);
        options?.onError?.(errMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { execute, result, loading, error, reset };
}

/**
 * Shorthand hook for a specific domain:action pair.
 *
 * Usage:
 *   const { execute, loading } = useDomainCommand('employees', 'list');
 *   await execute({ status: 'activo' });
 */
export function useDomainCommand<TData = unknown>(
  domain: CommandDomain,
  action: CommandAction,
  options?: UseCommandOptions
) {
  const cmd = useCommand<TData>(options);

  const execute = useCallback(
    (payload: Record<string, unknown> = {}) => cmd.execute(domain, action, payload),
    [cmd, domain, action]
  );

  return { ...cmd, execute };
}

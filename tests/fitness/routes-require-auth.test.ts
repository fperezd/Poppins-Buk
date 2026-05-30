/**
 * Fitness Function 02b: TODO route handler (incluido GET) está autorizado.
 *
 * Complementa a `mutations-have-authz` (que sólo cubre POST/PUT/PATCH/DELETE).
 * Esta versión cubre LECTURAS: un GET sin authz que pega al BUK SDK filtra
 * nómina/PII de todos los empleados (el hallazgo "colaboradora lee toda la
 * nómina" del Plan Maestro, en su variante /v1 read).
 *
 * Un route está autorizado si:
 *   (a) usa `requireScope(` inline, o
 *   (b) es legacy `/api/buk/<entity>` (no v1) → middleware admin-only (POP-C0-01), o
 *   (c) está en EXCEPTIONS (auth propio: webhooks/HMAC, auth, health, _internal, cron), o
 *   (d) está en KNOWN_SESSION_ONLY (deuda documentada, atada a ticket).
 */
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const HANDLER_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const EXCEPTIONS = [
  /\/api\/auth\//,
  /\/api\/webhooks\//,
  /\/health/, // healthchecks (incluye /v1/health y legacy health-check)
  /\/api\/_internal\//,
  /\/api\/cron\//,
];

/** Mutaciones/lecturas que hoy sólo exigen sesión (sin rol). Cada una con ticket. */
const KNOWN_SESSION_ONLY: Record<string, string> = {
  'src/app/api/commands/route.ts': 'POP-C1-05 (command-bus resuelve authz en dispatch)',
  // /agents/* — registry in-memory (sin BUK/Supabase/PII), protegido por sesión
  // vía middleware. Decorativo: se elimina o se hace real en POP-C1-06.
  'src/app/api/agents/orchestrate/route.ts': 'POP-C1-06 (/agents decorativo, a eliminar)',
  'src/app/api/agents/workflows/route.ts': 'POP-C1-06 (/agents decorativo, a eliminar)',
  'src/app/api/agents/company/route.ts': 'POP-C1-06 (/agents decorativo, a eliminar)',
  'src/app/api/agents/agent/route.ts': 'POP-C1-06 (/agents decorativo, a eliminar)',
};

function norm(p: string): string {
  return p.replace(/\\/g, '/');
}
function isException(p: string): boolean {
  return EXCEPTIONS.some((re) => re.test(norm(p)));
}
function isLegacyBukRoute(p: string): boolean {
  const n = norm(p);
  return n.includes('/api/buk/') && !n.includes('/api/buk/v1/');
}
function hasHandler(content: string): boolean {
  return HANDLER_METHODS.some((m) =>
    new RegExp(`export\\s+(const|async\\s+function)\\s+${m}\\b`).test(content),
  );
}

describe('Fitness 02b: Todo route handler está autorizado', () => {
  it('cada route.ts (incl. GET) usa requireScope, guard de middleware, o exención documentada', async () => {
    const routes = await glob('src/app/api/**/route.ts');
    const unguarded: string[] = [];
    const staleBaseline: string[] = [];

    for (const file of routes) {
      if (isException(file)) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (!hasHandler(content)) continue;

      if (/requireScope\s*\(/.test(content)) continue;
      if (isLegacyBukRoute(file)) continue;
      if (norm(file) in KNOWN_SESSION_ONLY) continue;

      unguarded.push(norm(file));
    }

    for (const known of Object.keys(KNOWN_SESSION_ONLY)) {
      if (!routes.some((r) => norm(r) === known)) staleBaseline.push(known);
    }

    expect(
      unguarded,
      `Routes sin autorización (ni requireScope, ni middleware legacy, ni exención):\n` +
        unguarded.map((f) => `  ${f}`).join('\n'),
    ).toEqual([]);

    expect(
      staleBaseline,
      `Baseline obsoleto en KNOWN_SESSION_ONLY (route ya no existe — limpiar):\n` +
        staleBaseline.map((s) => `  ${s}`).join('\n'),
    ).toEqual([]);
  });
});

/**
 * Fitness Function 02: Toda mutación está autorizada.
 *
 * Cada handler POST/PUT/PATCH/DELETE debe estar protegido por uno de:
 *   (a) `requireScope()` inline  → patrón de las rutas `/api/buk/v1/*`
 *   (b) el guard de `middleware.ts` (POP-C0-01) que restringe las rutas legacy
 *       `/api/buk/<entity>` (sin `/v1/`) a `rol = admin`.
 *
 * Excepciones (auth propio): /auth, /webhooks (HMAC), /health, /_internal, /cron.
 *
 * `KNOWN_UNSCOPED` documenta mutaciones que sólo exigen sesión (sin rol) — deuda
 * atada a ticket. La función impide que entren NUEVAS mutaciones sin autz.
 */
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const EXCEPTIONS = [/\/api\/auth\//, /\/api\/webhooks\//, /\/api\/health/, /\/api\/_internal\//, /\/api\/cron\//];

/** Mutaciones que hoy sólo exigen sesión (no rol). Cada una con su ticket. */
const KNOWN_UNSCOPED: Record<string, string> = {
  'src/app/api/commands/route.ts': 'POP-C1-05 (command-bus resuelve authz por dominio en dispatch)',
  'src/app/api/agents/orchestrate/route.ts': 'POP-C1-06 (/agents decorativo, a eliminar)',
};

function norm(p: string): string {
  return p.replace(/\\/g, '/');
}
function isException(p: string): boolean {
  return EXCEPTIONS.some((re) => re.test(norm(p)));
}
/** Legacy `/api/buk/<entity>` (no v1) — protegido por middleware admin-only (POP-C0-01). */
function isLegacyBukRoute(p: string): boolean {
  const n = norm(p);
  return n.includes('/api/buk/') && !n.includes('/api/buk/v1/');
}
function mutationMethods(content: string): string[] {
  return MUTATION_METHODS.filter((m) =>
    new RegExp(`export\\s+(const|async\\s+function)\\s+${m}\\b`).test(content),
  );
}

describe('Fitness 02: Mutaciones autorizadas', () => {
  it('todo handler mutativo usa requireScope inline o el guard legacy de middleware', async () => {
    const routes = await glob('src/app/api/**/route.ts');
    const unguarded: Array<{ file: string; methods: string[] }> = [];
    const staleBaseline: string[] = [];

    for (const file of routes) {
      if (isException(file)) continue;
      const content = fs.readFileSync(file, 'utf8');
      const methods = mutationMethods(content);
      if (methods.length === 0) continue;

      if (/requireScope\s*\(/.test(content)) continue; // (a) authz inline
      if (isLegacyBukRoute(file)) continue; // (b) middleware admin-only (POP-C0-01)
      if (norm(file) in KNOWN_UNSCOPED) continue; // deuda documentada

      unguarded.push({ file: norm(file), methods });
    }

    for (const known of Object.keys(KNOWN_UNSCOPED)) {
      if (!routes.some((r) => norm(r) === known)) staleBaseline.push(known);
    }

    expect(
      unguarded,
      `Mutaciones NUEVAS sin autorización:\n` +
        unguarded.map((u) => `  ${u.file} (${u.methods.join(', ')})`).join('\n') +
        `\n\nAgregar: const auth = await requireScope([...]); if (!auth.ok) return auth.error;`,
    ).toEqual([]);

    expect(
      staleBaseline,
      `Baseline obsoleto en KNOWN_UNSCOPED (route ya no existe — limpiar):\n` +
        staleBaseline.map((s) => `  ${s}`).join('\n'),
    ).toEqual([]);
  });
});

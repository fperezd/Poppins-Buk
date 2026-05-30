/**
 * Fitness Function 09: Handlers que leen un body lo validan con Zod.
 *
 * Sin validación de schema aceptamos data arbitraria → riesgo de correctness y
 * seguridad. Heurística: flagueamos handlers POST/PUT/PATCH que CONSUMEN un body
 * (`req.json()`) sin pasarlo por `parseBody()` o un schema Zod local. Las
 * mutaciones sin body (p.ej. marcar-como-leído por param, logout) no aplican.
 *
 * Schemas en `@/lib/api/schemas/*` (migrarán a `@poppins/contracts` en Sprint 0).
 *
 * `KNOWN_UNVALIDATED` es el baseline de deuda existente, cada entrada atada a un
 * ticket. La fitness function impide que entren NUEVOS handlers sin validar; la
 * deuda conocida se quema cuando se cierre su ticket.
 */
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const BODY_METHODS = ['POST', 'PUT', 'PATCH'];

const EXCEPTIONS = [
  /\/webhooks\//, // webhooks validan con HMAC (ver verify.ts)
  /\/health/,
  /\/_internal\//,
];

/** Deuda conocida — leen body sin Zod. Cada una atada a un ticket de cierre. */
const KNOWN_UNVALIDATED: Record<string, string> = {
  'src/app/api/commands/route.ts': 'POP-C1-05 (command-bus valida en dispatch, no Zod)',
  'src/app/api/agents/orchestrate/route.ts': 'POP-C1-06 (/agents decorativo, a eliminar)',
  'src/app/api/buk/vacations/route.ts': 'Sprint 0 — legacy, se elimina en cutover /v1',
  'src/app/api/buk/overtime/route.ts': 'Sprint 0 — legacy, se elimina en cutover /v1',
  'src/app/api/buk/absences/route.ts': 'Sprint 0 — legacy, se elimina en cutover /v1',
};

function norm(p: string): string {
  return p.replace(/\\/g, '/');
}
function isException(p: string): boolean {
  return EXCEPTIONS.some((re) => re.test(norm(p)));
}
function bodyMethods(content: string): string[] {
  return BODY_METHODS.filter((m) =>
    new RegExp(`export\\s+(const|async\\s+function)\\s+${m}\\b`).test(content),
  );
}

describe('Fitness 09: Handlers usan validación Zod', () => {
  it('todo handler que lee un body lo valida con parseBody() o un schema Zod', async () => {
    const routes = await glob('src/app/api/**/route.ts');
    const violations: Array<{ file: string; methods: string[] }> = [];
    const staleBaseline: string[] = [];

    for (const file of routes) {
      if (isException(file)) continue;
      const content = fs.readFileSync(file, 'utf8');
      const methods = bodyMethods(content);
      if (methods.length === 0) continue;

      const readsBody = /\b(req|request)\.json\s*\(/.test(content);
      if (!readsBody) continue; // mutación sin body → nada que validar

      const usesParseBody = /parseBody\s*\(/.test(content);
      const usesLocalSchema =
        /\.(safe)?[pP]arse\s*\(/.test(content) && /from\s+['"]@\/lib\/api\/schemas/.test(content);
      if (usesParseBody || usesLocalSchema) continue;

      if (norm(file) in KNOWN_UNVALIDATED) continue; // deuda documentada
      violations.push({ file: norm(file), methods });
    }

    // Detecta entradas del baseline que ya no aplican (route borrada o ya validada).
    for (const known of Object.keys(KNOWN_UNVALIDATED)) {
      const exists = routes.some((r) => norm(r) === known);
      if (!exists) staleBaseline.push(known);
    }

    expect(
      violations,
      `Handlers NUEVOS que leen body sin validación Zod:\n` +
        violations.map((u) => `  ${u.file} (${u.methods.join(', ')})`).join('\n') +
        `\n\nAgregar: const parsed = await parseBody(req, MiSchema); if (!parsed.ok) return parsed.error;` +
        `\nO, si es deuda intencional, sumarlo a KNOWN_UNVALIDATED con su ticket.`,
    ).toEqual([]);

    expect(
      staleBaseline,
      `Baseline obsoleto en KNOWN_UNVALIDATED (route ya no existe — limpiar la entrada):\n` +
        staleBaseline.map((s) => `  ${s}`).join('\n'),
    ).toEqual([]);
  });
});

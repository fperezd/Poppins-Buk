/**
 * Fitness Function 09: Handlers use Zod validation
 *
 * Asegura que TODO handler POST/PUT/PATCH valida body con Zod via parseBody().
 * Sin validación = aceptamos data arbitraria = security/correctness risk.
 *
 * Aplica a: api-id, api-buk
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const BODY_METHODS = ['POST', 'PUT', 'PATCH'];

const EXCEPTIONS = [
  /\/webhooks\//,      // webhooks validan con HMAC, no Zod
  /\/health/,          // health no toma body
  /\/_internal\//,     // internal endpoints pueden tener formato propio
];

function isException(filepath: string): boolean {
  return EXCEPTIONS.some(re => re.test(filepath));
}

function extractBodyMethods(content: string): string[] {
  const methods: string[] = [];
  for (const method of BODY_METHODS) {
    const regex = new RegExp(
      `export\\s+(const|async\\s+function)\\s+${method}\\b`
    );
    if (regex.test(content)) methods.push(method);
  }
  return methods;
}

describe('Fitness: Handlers use Zod validation', () => {
  it('All POST/PUT/PATCH handlers must validate body with Zod (parseBody)', async () => {
    const routes = await glob('src/app/api/**/route.ts');
    const unvalidated: Array<{ file: string; methods: string[] }> = [];

    for (const file of routes) {
      if (isException(file)) continue;

      const content = fs.readFileSync(file, 'utf8');
      const methods = extractBodyMethods(content);
      if (methods.length === 0) continue;

      // Heuristics: parseBody() o parse() de un schema importado
      const usesParseBody = /parseBody\s*\(/.test(content);
      const usesSchemaParse = /\.safeParse\s*\(/.test(content) && /from\s+['"]@poppins\/contracts/.test(content);

      if (!usesParseBody && !usesSchemaParse) {
        unvalidated.push({ file, methods });
      }
    }

    if (unvalidated.length > 0) {
      const report = unvalidated
        .map(u => `  ${u.file}\n    methods: ${u.methods.join(', ')}`)
        .join('\n\n');
      throw new Error(
        `Handlers without Zod validation:\n${report}\n\n` +
          `Add:\n` +
          `  const parsed = await parseBody(req, MySchema);\n` +
          `  if (!parsed.ok) return parsed.error;\n\n` +
          `Where MySchema viene de @poppins/contracts.`
      );
    }
  });
});

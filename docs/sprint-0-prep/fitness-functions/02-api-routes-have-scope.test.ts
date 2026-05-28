/**
 * Fitness Function 02: API routes have requireScope
 *
 * Asegura que TODA ruta API mutativa (POST/PUT/PATCH/DELETE) usa requireScope.
 * Excepciones permitidas:
 *   - /api/auth/* (login, logout, callback - aún no autenticados)
 *   - /api/webhooks/* (autenticación via HMAC, no via JWT)
 *   - /api/health (público)
 *   - /api/_internal/* (auth via x-internal-token)
 *
 * Aplica a: api-id, api-buk
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const EXCEPTIONS = [
  /\/api\/auth\//,
  /\/api\/webhooks\//,
  /\/api\/health/,
  /\/api\/_internal\//,
  /\/api\/cron\//,
];

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function isException(filepath: string): boolean {
  return EXCEPTIONS.some(re => re.test(filepath));
}

function extractMutationMethods(content: string): string[] {
  const methods: string[] = [];
  for (const method of MUTATION_METHODS) {
    // Match `export const POST = ...` or `export async function POST(...)`
    const regex = new RegExp(
      `export\\s+(const|async\\s+function)\\s+${method}\\b`
    );
    if (regex.test(content)) methods.push(method);
  }
  return methods;
}

describe('Fitness: API routes have requireScope', () => {
  it('All mutation handlers must use requireScope or document exemption', async () => {
    const routes = await glob('src/app/api/**/route.ts');
    const unguarded: Array<{ file: string; methods: string[] }> = [];

    for (const file of routes) {
      if (isException(file)) continue;

      const content = fs.readFileSync(file, 'utf8');
      const mutations = extractMutationMethods(content);
      if (mutations.length === 0) continue;

      const usesRequireScope = /requireScope\s*\(/.test(content);
      if (!usesRequireScope) {
        unguarded.push({ file, methods: mutations });
      }
    }

    if (unguarded.length > 0) {
      const report = unguarded
        .map(u => `  ${u.file}\n    methods: ${u.methods.join(', ')}`)
        .join('\n\n');
      throw new Error(
        `Mutation routes without requireScope:\n${report}\n\n` +
          `Add 'const auth = await requireScope([...]); if (!auth.ok) return auth.error;' before mutation logic.`
      );
    }
  });
});

/**
 * Fitness Function 03: Web uses api-client (no raw fetch)
 *
 * Asegura que poppins-web no hace fetch() crudo a /api o api.poppins.cl.
 * Toda llamada debe pasar por @poppins/api-client (generado desde contracts).
 *
 * Excepciones permitidas:
 *   - src/lib/api-client/* (la propia capa client)
 *   - tests/* (los tests pueden hacer fetch directo)
 *   - src/mocks/* (MSW handlers)
 *
 * Aplica a: poppins-web
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const EXCEPTIONS = [
  /^src\/lib\/api-client\//,
  /^tests\//,
  /^src\/mocks\//,
  /^src\/lib\/auth\//, // Supabase client puede hacer auth.signInWithOtp, etc. — eso es auth, no API
];

const FORBIDDEN_PATTERNS = [
  // fetch a paths /api/* o https://api.poppins.cl, https://buk.poppins.cl
  /fetch\(\s*['"`](\/api\/|https?:\/\/(api|buk)\.poppins\.(cl|local))/,
  // axios.get/post/etc apuntando a api.poppins.cl o /api/
  /axios\.(get|post|put|patch|delete)\(\s*['"`](\/api\/|https?:\/\/(api|buk)\.poppins\.(cl|local))/,
];

function isException(filepath: string): boolean {
  return EXCEPTIONS.some(re => re.test(filepath));
}

describe('Fitness: Web uses api-client (no raw fetch)', () => {
  it('No raw fetch to API endpoints outside api-client', async () => {
    const files = await glob('src/**/*.{ts,tsx}');
    const violations: Array<{ file: string; line: number; content: string }> = [];

    for (const file of files) {
      if (isException(file)) continue;

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(line)) {
            violations.push({
              file,
              line: idx + 1,
              content: line.trim(),
            });
          }
        }
      });
    }

    if (violations.length > 0) {
      const report = violations
        .map(v => `  ${v.file}:${v.line}\n    ${v.content}`)
        .join('\n\n');
      throw new Error(
        `Raw fetch to API detected:\n${report}\n\n` +
          `Use @poppins/api-client via TanStack Query hooks (hooks/api/*).\n` +
          `If you really need raw fetch, document why and add to EXCEPTIONS.`
      );
    }
  });
});

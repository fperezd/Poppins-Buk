/**
 * Fitness Function 01: No cross-repo imports
 *
 * Asegura que cada repo solo importa de:
 *   - su propio código (relativo o @/)
 *   - dependencias npm
 *   - @poppins/contracts (la piedra)
 *
 * Y NO importa de:
 *   - apps/web (si estamos en api-id o api-buk)
 *   - apps/api-* (si estamos en web)
 *   - el otro backend (cross-back imports)
 *
 * Aplica a: api-id, api-buk, web
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = path.basename(process.cwd());

const FORBIDDEN_PATTERNS: Record<string, RegExp[]> = {
  'poppins-api-id': [
    /from\s+['"]@?poppins-web/,
    /from\s+['"]@?poppins-api-buk/,
    /from\s+['"]\.\.\/\.\.\/poppins-(web|api-buk)/,
  ],
  'poppins-api-buk': [
    /from\s+['"]@?poppins-web/,
    /from\s+['"]@?poppins-api-id/,
    /from\s+['"]\.\.\/\.\.\/poppins-(web|api-id)/,
  ],
  'poppins-web': [
    /from\s+['"]@?poppins-api-id/,
    /from\s+['"]@?poppins-api-buk/,
    /from\s+['"]\.\.\/\.\.\/poppins-api-/,
  ],
};

describe('Fitness: no cross-repo imports', () => {
  it(`${REPO_NAME} must not import from other Poppins repos`, async () => {
    const patterns = FORBIDDEN_PATTERNS[REPO_NAME];
    if (!patterns) {
      console.warn(`[fitness-01] Repo name "${REPO_NAME}" not recognized — skipping`);
      return;
    }

    const files = await glob('src/**/*.{ts,tsx}', { absolute: false });
    const violations: Array<{ file: string; pattern: string; line: number; content: string }> = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      for (const pattern of patterns) {
        lines.forEach((line, idx) => {
          if (pattern.test(line)) {
            violations.push({
              file,
              pattern: pattern.source,
              line: idx + 1,
              content: line.trim(),
            });
          }
        });
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map(v => `  ${v.file}:${v.line}\n    ${v.content}\n    matched: /${v.pattern}/`)
        .join('\n\n');
      throw new Error(
        `Cross-repo imports detected:\n${report}\n\n` +
          `Use @poppins/contracts for shared types, or HTTP calls for cross-service communication.`
      );
    }
  });
});

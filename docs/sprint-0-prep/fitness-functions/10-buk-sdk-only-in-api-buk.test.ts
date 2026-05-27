/**
 * Fitness Function 10: BUK SDK only in poppins-api-buk
 *
 * Asegura que SOLO poppins-api-buk importa `@/lib/buk-sdk`.
 * poppins-api-id debe llamar a BUK indirectamente via lib/buk-bridge/ (HTTP).
 * poppins-web no debe tocar BUK directamente.
 *
 * Aplica a: api-id (verifica que NO importa SDK), web (idem)
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = path.basename(process.cwd());

const FORBIDDEN_IN_REPOS = ['poppins-api-id', 'poppins-web'];

const FORBIDDEN_IMPORTS = [
  /from\s+['"]@\/lib\/buk-sdk/,
  /from\s+['"]\.\.\/lib\/buk-sdk/,
  /from\s+['"]\.\.\/\.\.\/lib\/buk-sdk/,
  /require\(['"].*buk-sdk['"]\)/,
];

describe('Fitness: BUK SDK only in api-buk', () => {
  it(`${REPO_NAME} must NOT import @/lib/buk-sdk directly`, async () => {
    if (!FORBIDDEN_IN_REPOS.includes(REPO_NAME)) {
      console.warn(
        `[fitness-10] Repo "${REPO_NAME}" is allowed to use buk-sdk. Skipping check.\n` +
          `This test only enforces api-id and web.`
      );
      return;
    }

    const files = await glob('src/**/*.{ts,tsx}');
    const violations: Array<{ file: string; line: number; content: string }> = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        for (const pattern of FORBIDDEN_IMPORTS) {
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
        `Direct BUK SDK import detected in ${REPO_NAME}:\n${report}\n\n` +
          `Solutions:\n` +
          `  - api-id: usa lib/buk-bridge/ para llamar a buk.poppins.cl via HTTP\n` +
          `  - web: usa @poppins/api-client (los endpoints están en api-id o api-buk)`
      );
    }
  });
});

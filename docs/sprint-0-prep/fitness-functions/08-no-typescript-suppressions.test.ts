/**
 * Fitness Function 08: No TypeScript suppressions without ticket
 *
 * Asegura que NO hay @ts-expect-error o @ts-ignore sin TODO con ticket POP-XXX.
 * Suprimir tipos sin tracking = deuda invisible.
 *
 * Aplica a: TODOS los repos.
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const SUPPRESSION_PATTERNS = [
  /@ts-expect-error/,
  /@ts-ignore/,
  /@ts-nocheck/,
];

const TICKET_REQUIRED = /TODO\s+POP-[A-Z]+-\d+/;

describe('Fitness: No TS suppressions without ticket', () => {
  it('All @ts-expect-error / @ts-ignore must have associated POP-XXX ticket', async () => {
    const files = await glob('src/**/*.{ts,tsx}');
    const violations: Array<{ file: string; line: number; content: string; reason: string }> = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        const hasSuppress = SUPPRESSION_PATTERNS.some(re => re.test(line));
        if (!hasSuppress) return;

        // El comment puede estar en la misma línea o adyacente (línea anterior o siguiente)
        const surrounding = [
          lines[idx - 1] || '',
          line,
          lines[idx + 1] || '',
        ].join(' ');

        if (!TICKET_REQUIRED.test(surrounding)) {
          violations.push({
            file,
            line: idx + 1,
            content: line.trim(),
            reason: 'Missing TODO POP-XXX-XXX ticket reference within ±1 line',
          });
        }
      });
    }

    if (violations.length > 0) {
      const report = violations
        .map(v => `  ${v.file}:${v.line}\n    ${v.content}\n    ${v.reason}`)
        .join('\n\n');
      throw new Error(
        `TypeScript suppressions without ticket:\n${report}\n\n` +
          `Format expected: // @ts-expect-error TODO POP-C1-08: <razón breve>\n` +
          `Suppressions sin tracking se acumulan como deuda invisible.`
      );
    }
  });
});

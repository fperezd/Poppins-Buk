/**
 * Fitness Function 08: No TypeScript suppressions without ticket.
 *
 * `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` sin un TODO POP-XXX asociado
 * son deuda invisible: enmascaran errores de tipos sin dejar rastro de seguimiento.
 * Relacionado con POP-C0-04 (quitamos `ignoreBuildErrors`; no reintroducir el
 * agujero por la puerta de atrás).
 */
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const SUPPRESSION_PATTERNS = [/@ts-expect-error/, /@ts-ignore/, /@ts-nocheck/];
const TICKET_REQUIRED = /TODO\s+POP-[A-Z]+-\d+/;

describe('Fitness 08: No TS suppressions without ticket', () => {
  it('todo @ts-ignore/@ts-expect-error debe citar un ticket POP-XXX dentro de ±1 línea', async () => {
    const files = await glob('src/**/*.{ts,tsx}');
    const violations: Array<{ file: string; line: number; content: string }> = [];

    for (const file of files) {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, idx) => {
        if (!SUPPRESSION_PATTERNS.some((re) => re.test(line))) return;
        const surrounding = [lines[idx - 1] ?? '', line, lines[idx + 1] ?? ''].join(' ');
        if (!TICKET_REQUIRED.test(surrounding)) {
          violations.push({ file, line: idx + 1, content: line.trim() });
        }
      });
    }

    expect(
      violations,
      `Supresiones de TS sin ticket POP-XXX:\n` +
        violations.map((v) => `  ${v.file}:${v.line}  ${v.content}`).join('\n') +
        `\n\nFormato esperado: // @ts-expect-error TODO POP-C1-08: <razón>`,
    ).toEqual([]);
  });
});

/**
 * Fitness Function 06: No secrets in code.
 *
 * Heurística (no reemplaza a gitleaks) para detectar secrets hardcodeados.
 * Relacionado con POP-C0-03 (eliminamos `.env.local.bak`; no reintroducir
 * credenciales en el árbol de código).
 */
import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const SECRET_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'JWT', regex: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{10,}/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Supabase service_role', regex: /service_role['"]?\s*[:=]\s*['"]eyJ/ },
  { name: 'Stripe Secret', regex: /sk_(test|live)_[a-zA-Z0-9]{20,}/ },
  { name: 'GitHub PAT', regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'BUK auth_token', regex: /auth_token['"]?\s*[:=]\s*['"][a-zA-Z0-9]{32,}['"]/ },
  { name: 'RSA Private Key', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

const EXCLUDE = [
  /node_modules\//,
  /\.next\//,
  /\.git\//,
  /\.test\.tsx?$/,
  /\.spec\.tsx?$/,
  /tests\/fitness\//,
  /docs\/sprint-0-prep\/fitness-functions\//,
  /\.example$/,
  /CHANGELOG\.md$/,
];

function isExcluded(p: string): boolean {
  return EXCLUDE.some((re) => re.test(p.replace(/\\/g, '/')));
}

describe('Fitness 06: No secrets in code', () => {
  it('no hay secrets hardcodeados en archivos fuente', async () => {
    const files = await glob('**/*.{ts,tsx,js,jsx,json,env,sh,yml,yaml,toml}', {
      ignore: ['node_modules/**', '.next/**', '.git/**'],
    });
    const violations: Array<{ file: string; line: number; pattern: string }> = [];

    for (const file of files) {
      if (isExcluded(file)) continue;
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      for (const { name, regex } of SECRET_PATTERNS) {
        lines.forEach((line, idx) => {
          if (!regex.test(line)) return;
          if (/\/\/\s*fitness-ignore/.test(line)) return;
          if (/process\.env\./.test(line)) return;
          if (/PLACEHOLDER|REPLACE_ME|YOUR_KEY|xxx|example/i.test(line)) return;
          violations.push({ file, line: idx + 1, pattern: name });
        });
      }
    }

    expect(
      violations,
      `Posibles secrets detectados:\n` +
        violations.map((v) => `  ${v.file}:${v.line} (${v.pattern})`).join('\n') +
        `\n\nMover a process.env.X. Si es falso positivo, agregar "// fitness-ignore".`,
    ).toEqual([]);
  });
});

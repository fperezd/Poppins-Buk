/**
 * Fitness Function 06: No secrets in code
 *
 * Asegura que no hay secrets hardcoded en el código. Usa heurísticas basadas en
 * patrones comunes de secrets (sin depender de gitleaks externo, pero idealmente
 * complementario).
 *
 * Aplica a: TODOS los repos.
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

// Patrones heurísticos de secrets (no exhaustivos, gitleaks es el real check)
const SECRET_PATTERNS: Array<{ name: string; regex: RegExp; severity: 'high' | 'medium' }> = [
  // JWT tokens
  { name: 'JWT', regex: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/, severity: 'high' },
  // AWS keys
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/, severity: 'high' },
  // Supabase service role keys (parecen JWT pero con shape específico)
  { name: 'Supabase service_role', regex: /service_role['"]?\s*[:=]\s*['"]eyJ/, severity: 'high' },
  // Stripe-like
  { name: 'Stripe Secret', regex: /sk_(test|live)_[a-zA-Z0-9]{20,}/, severity: 'high' },
  // GitHub PAT
  { name: 'GitHub PAT', regex: /ghp_[a-zA-Z0-9]{36}/, severity: 'high' },
  // Generic API keys hardcoded
  { name: 'Hardcoded API_KEY', regex: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/i, severity: 'medium' },
  // BUK token (formato típico)
  { name: 'BUK auth_token', regex: /auth_token['"]?\s*[:=]\s*['"][a-zA-Z0-9]{32,}['"]/, severity: 'high' },
  // Private keys
  { name: 'RSA Private Key', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, severity: 'high' },
];

// Archivos excluidos del scan
const EXCLUDE_PATTERNS = [
  /node_modules\//,
  /\.next\//,
  /dist\//,
  /\.git\//,
  /\.test\.tsx?$/,        // tests pueden tener fixtures
  /\.spec\.tsx?$/,
  /fitness-functions\//,  // este archivo mismo tiene patrones que matchearían
  /\.example$/,           // .env.example puede tener placeholder strings
  /CHANGELOG\.md$/,
];

function isExcluded(filepath: string): boolean {
  return EXCLUDE_PATTERNS.some(re => re.test(filepath));
}

describe('Fitness: No secrets in code', () => {
  it('No hardcoded secrets in source files', async () => {
    const files = await glob('**/*.{ts,tsx,js,jsx,json,env,sh,yml,yaml,toml}', {
      ignore: ['node_modules/**', '.next/**', 'dist/**', '.git/**'],
    });

    const violations: Array<{
      file: string;
      line: number;
      pattern: string;
      severity: string;
      content: string;
    }> = [];

    for (const file of files) {
      if (isExcluded(file)) continue;

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      for (const { name, regex, severity } of SECRET_PATTERNS) {
        lines.forEach((line, idx) => {
          if (regex.test(line)) {
            // Skip si la línea tiene "// fitness-ignore" comment
            if (/\/\/\s*fitness-ignore/.test(line)) return;
            // Skip si es env var reference (process.env.X)
            if (/process\.env\./.test(line)) return;
            // Skip placeholders típicos
            if (/PLACEHOLDER|REPLACE_ME|YOUR_KEY|xxx|example/i.test(line)) return;

            violations.push({
              file,
              line: idx + 1,
              pattern: name,
              severity,
              content: line.trim().substring(0, 80) + '...',
            });
          }
        });
      }
    }

    if (violations.length > 0) {
      const high = violations.filter(v => v.severity === 'high');
      const med = violations.filter(v => v.severity === 'medium');
      const report = [...high, ...med]
        .map(v => `  [${v.severity.toUpperCase()}] ${v.file}:${v.line} (${v.pattern})\n    ${v.content}`)
        .join('\n\n');
      throw new Error(
        `Potential secrets detected:\n${report}\n\n` +
          `Move secrets to environment variables (process.env.X).\n` +
          `If false positive, add "// fitness-ignore" comment on the line.\n` +
          `Also run 'gitleaks detect' for comprehensive scan.`
      );
    }
  });
});

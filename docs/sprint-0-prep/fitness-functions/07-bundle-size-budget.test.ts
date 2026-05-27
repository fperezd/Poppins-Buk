/**
 * Fitness Function 07: Bundle size budget
 *
 * Asegura que cada route web pesa <250kb gzipped.
 *
 * Aplica a: poppins-web (post-build)
 *
 * Requires: npm run build antes de correr este test.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { gzipSync } from 'zlib';
import { glob } from 'glob';

const BUDGET_BYTES = 250 * 1024; // 250kb gzipped

interface RouteSizeReport {
  route: string;
  raw: number;
  gzipped: number;
  overBudget: boolean;
}

function findRouteChunks(buildDir: string): RouteSizeReport[] {
  // Next.js .next/static/chunks/app/* contiene los chunks de cada ruta
  const chunksDir = path.join(buildDir, '.next', 'static', 'chunks', 'app');
  if (!fs.existsSync(chunksDir)) return [];

  const reports: RouteSizeReport[] = [];
  const files = glob.sync('**/*.js', { cwd: chunksDir });

  for (const file of files) {
    const fullPath = path.join(chunksDir, file);
    const raw = fs.statSync(fullPath).size;
    const content = fs.readFileSync(fullPath);
    const gzipped = gzipSync(content).length;

    reports.push({
      route: file,
      raw,
      gzipped,
      overBudget: gzipped > BUDGET_BYTES,
    });
  }

  return reports;
}

describe('Fitness: Bundle size budget', () => {
  it('All route bundles must be <250kb gzipped', () => {
    const reports = findRouteChunks(process.cwd());

    if (reports.length === 0) {
      console.warn(
        `[fitness-07] No build artifacts found in .next/. Run 'npm run build' first.\n` +
          `Skipping bundle size check.`
      );
      return;
    }

    const overBudget = reports.filter(r => r.overBudget);

    // Reporte informativo (siempre)
    const top5 = [...reports].sort((a, b) => b.gzipped - a.gzipped).slice(0, 5);
    console.log('Top 5 largest chunks (gzipped):');
    top5.forEach(r => {
      console.log(`  ${r.route}: ${(r.gzipped / 1024).toFixed(1)}kb`);
    });

    if (overBudget.length > 0) {
      const report = overBudget
        .map(r => `  ${r.route}: ${(r.gzipped / 1024).toFixed(1)}kb (over ${BUDGET_BYTES / 1024}kb)`)
        .join('\n');
      throw new Error(
        `Routes over bundle budget:\n${report}\n\n` +
          `Strategies to reduce:\n` +
          `  1. Code splitting con next/dynamic\n` +
          `  2. Tree-shaking: importar solo lo que usás de librerías grandes\n` +
          `  3. Mover dependencias pesadas a server components\n` +
          `  4. Lazy load de Storybook/dev-only code`
      );
    }
  });
});

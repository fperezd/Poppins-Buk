/**
 * Fitness Function 05: Contracts version locked across repos
 *
 * Asegura que los 3 repos consumidores usan la misma versión de @poppins/contracts.
 * Drift de versión causa bugs sutiles (frontend asume shape X, backend devuelve shape Y).
 *
 * Aplica a: ejecutar desde CI compartido o desde el repo coordinador (poppins-contracts).
 * Asume los 3 repos checked out en sibling directories.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const REPOS = ['poppins-api-id', 'poppins-api-buk', 'poppins-web'];

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readContractsVersion(repoPath: string): string | null {
  const pkgPath = path.join(repoPath, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.dependencies?.['@poppins/contracts'] || null;
}

describe('Fitness: Contracts version locked across repos', () => {
  it('All consumer repos must use same @poppins/contracts version', () => {
    // Asume CI clona los 3 repos en ../poppins-* relativo al ejecutor
    // En CI standalone (un solo repo), skipea este test
    const baseDir = path.resolve(process.cwd(), '..');
    const versions: Record<string, string | null> = {};

    for (const repo of REPOS) {
      const repoPath = path.join(baseDir, repo);
      versions[repo] = readContractsVersion(repoPath);
    }

    // Si menos de 2 repos están presentes, skip
    const present = Object.entries(versions).filter(([_, v]) => v !== null);
    if (present.length < 2) {
      console.warn(
        `[fitness-05] Less than 2 repos found in ${baseDir}, skipping cross-repo version check.\n` +
          `Found: ${present.map(([r]) => r).join(', ') || 'none'}`
      );
      return;
    }

    const uniqueVersions = new Set(present.map(([_, v]) => v));
    if (uniqueVersions.size > 1) {
      const report = present
        .map(([repo, version]) => `  ${repo}: ${version}`)
        .join('\n');
      throw new Error(
        `Contracts version mismatch:\n${report}\n\n` +
          `All repos must use same @poppins/contracts version. ` +
          `Run: npm install @poppins/contracts@latest in lagging repos.`
      );
    }
  });
});

/**
 * Fitness Function 04: Mutations validate tenant_id
 *
 * Asegura que toda escritura a tablas con tenant_id incluya validación
 * de tenant. Sin esto = cross-tenant leak.
 *
 * Heurística: archivos en src/app/api/v1/** que hagan .insert(), .update(),
 * .delete(), .upsert() deben mencionar tenant_id o current_tenant_id().
 *
 * Aplica a: api-id, api-buk
 */

import { describe, it, expect } from 'vitest';
import { glob } from 'glob';
import * as fs from 'fs';

const MUTATION_METHODS = /\.(insert|update|delete|upsert)\(/;
const TENANT_REFERENCE = /(tenant_id|current_tenant_id|getBukSDKForTenant)/;

// Excepciones: tablas que NO requieren tenant_id (system-level)
const EXCEPT_TABLES = [
  'tenants',          // tabla raíz, no tiene tenant_id
  'webhook_events',   // admin-only, soporta tenant_id NULL
];

function isExceptedFile(filepath: string): boolean {
  // /api/_internal/ y /api/admin/ están exentos (admin/system operations)
  if (filepath.includes('/_internal/') || filepath.includes('/admin/')) return true;
  // tenants endpoint maneja la tabla tenants directamente
  if (filepath.includes('/v1/tenants/')) return true;
  return false;
}

describe('Fitness: Mutations validate tenant_id', () => {
  it('All mutations must reference tenant_id or current_tenant_id', async () => {
    const handlers = await glob('src/app/api/v1/**/route.ts');
    const violations: Array<{ file: string; issue: string }> = [];

    for (const file of handlers) {
      if (isExceptedFile(file)) continue;

      const content = fs.readFileSync(file, 'utf8');

      // ¿Tiene mutaciones?
      const hasMutation = MUTATION_METHODS.test(content);
      if (!hasMutation) continue;

      // ¿Filtra por tenant?
      const hasTenantCheck = TENANT_REFERENCE.test(content);
      if (!hasTenantCheck) {
        violations.push({
          file,
          issue: 'Mutation found but no tenant_id reference',
        });
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map(v => `  ${v.file}\n    ${v.issue}`)
        .join('\n\n');
      throw new Error(
        `Tenant-unsafe mutations detected:\n${report}\n\n` +
          `Every insert/update/delete must filter by tenant_id (RLS does this automatically when JWT has app_metadata.tenant_id).\n` +
          `For BUK API calls, use getBukSDKForTenant(tenantId).`
      );
    }
  });
});

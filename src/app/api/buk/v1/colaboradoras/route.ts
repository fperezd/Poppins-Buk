/**
 * /api/buk/v1/colaboradoras
 *
 * GET  → lista colaboradoras (filtra por scope: admin=todas, empleador=su area, colaboradora=ella misma)
 * POST → crea una colaboradora (solo admin)
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import {
  ListColaboradorasQuery,
  CreateColaboradoraBody,
  CARGO_EMPLEADOR,
  isColaboradora,
} from '@/lib/api/schemas/colaboradoras';
import { requireScope, filterByScope } from '@/lib/api/auth';

const STATUS_ES_TO_EN: Record<'activo' | 'inactivo' | 'pendiente', 'active' | 'inactive' | 'all'> = {
  activo: 'active',
  inactivo: 'inactive',
  pendiente: 'all',
};

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope();
  if (!auth.ok) return auth.error;

  const parsed = parseQuery(req, ListColaboradorasQuery);
  if (!parsed.ok) return parsed.error;

  const sdk = getBukSDK();
  const response = await sdk.employees.list(
    {
      status: parsed.data.status ? STATUS_ES_TO_EN[parsed.data.status] : undefined,
      search: parsed.data.search,
    },
    parsed.data.page,
    parsed.data.page_size
  );

  // 1. Solo incluir empleados con cargo Poppins (Modelo D)
  let filtered = response.data.filter(emp => {
    const role = emp.current_job?.role?.name;
    return isColaboradora(role);
  });

  // 2. Aplicar scope del user autenticado (RLS-like en runtime)
  filtered = filterByScope(
    filtered as unknown as Array<{ id: number; current_job?: { area_id?: number } }>,
    auth.data
  ) as unknown as typeof filtered;

  // 3. Filtros adicionales del query
  if (parsed.data.hogar_id !== undefined) {
    filtered = filtered.filter(emp => {
      const job = emp.current_job as { area_id?: number } | undefined;
      return job?.area_id === parsed.data.hogar_id;
    });
  }
  if (parsed.data.rut) filtered = filtered.filter(e => e.rut === parsed.data.rut);
  if (parsed.data.email) filtered = filtered.filter(e => e.email === parsed.data.email);

  return ok(filtered, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  // Solo admin puede crear colaboradoras
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;

  const parsed = await parseBody(req, CreateColaboradoraBody);
  if (!parsed.ok) return parsed.error;

  const sdk = getBukSDK();

  try {
    const role = await sdk.organization.getRole(parsed.data.role_id);
    if ((role as { name?: string })?.name === CARGO_EMPLEADOR) {
      return fail(
        'VALIDATION_ERROR',
        `El cargo "${CARGO_EMPLEADOR}" está reservado para empleadores. Use POST /api/buk/v1/empleadores.`,
        { role_id: ['cargo no permitido'] }
      );
    }
  } catch {
    return fail('NOT_FOUND', `Cargo (role_id=${parsed.data.role_id}) no existe en Buk`);
  }

  const created = await sdk.employees.create(
    parsed.data as unknown as Parameters<typeof sdk.employees.create>[0]
  );
  return ok(created, 201);
});

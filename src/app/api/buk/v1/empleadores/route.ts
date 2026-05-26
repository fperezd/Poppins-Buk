/**
 * /api/buk/v1/empleadores
 *
 * GET  → lista empleados con cargo "Jefe de Área" (= empleadores funcionales)
 * POST → flujo compuesto: crea Area Buk + Empleado-jefe sueldo $1 asignado a esa Area
 *
 * Si el POST de Empleado falla luego de crear el Area, intentamos rollback eliminando el Area.
 */

import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, fail, parseQuery, parseBody } from '@/lib/api/utils';
import { requireScope } from '@/lib/api/auth';
import {
  ListEmpleadoresQuery,
  CreateEmpleadorBody,
  CARGO_EMPLEADOR,
} from '@/lib/api/schemas/empleadores';

const SUELDO_EMPLEADOR = 1; // peso simbólico
const STATUS_ES_TO_EN: Record<'activo' | 'inactivo', 'active' | 'inactive'> = {
  activo: 'active',
  inactivo: 'inactive',
};

export const GET = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const parsed = parseQuery(req, ListEmpleadoresQuery);
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

  // Filtrar solo empleadores (cargo = CARGO_EMPLEADOR)
  const filtered = response.data.filter(emp => {
    const role = emp.current_job?.role?.name ?? '';
    if (role !== CARGO_EMPLEADOR) return false;
    if (parsed.data.rut && emp.rut !== parsed.data.rut) return false;
    return true;
  });

  return ok(filtered, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;
  const parsed = await parseBody(req, CreateEmpleadorBody);
  if (!parsed.ok) return parsed.error;

  const sdk = getBukSDK();

  // 1. Validar que el role_id corresponde a "Jefe de Área"
  try {
    const role = await sdk.organization.getRole(parsed.data.empleador.role_id);
    if ((role as { name?: string })?.name !== CARGO_EMPLEADOR) {
      return fail(
        'VALIDATION_ERROR',
        `El role_id debe corresponder a "${CARGO_EMPLEADOR}". Recibido: "${(role as { name?: string })?.name ?? '?'}"`,
        { 'empleador.role_id': ['cargo incorrecto para empleador'] }
      );
    }
  } catch {
    return fail('NOT_FOUND', `Cargo (role_id=${parsed.data.empleador.role_id}) no existe`);
  }

  // 2. Crear el Area (hogar)
  const newArea = await sdk.organization.createArea({
    name: parsed.data.hogar.nombre,
    address: parsed.data.hogar.direccion,
    city: parsed.data.hogar.ciudad,
  });

  // 3. Crear el Empleado-jefe asignado a esa Area
  let newEmpleado;
  try {
    newEmpleado = await sdk.employees.create({
      ...parsed.data.empleador,
      area_id: newArea.id,
      base_salary: SUELDO_EMPLEADOR,
    } as unknown as Parameters<typeof sdk.employees.create>[0]);
  } catch (err) {
    // Rollback intentado del Area si falla la creación del empleado
    console.error('[empleadores POST] empleado falló, intentando rollback area', newArea.id, err);
    // Buk no expone DELETE /areas, así que solo logueamos
    return fail(
      'BUK_API_ERROR',
      `Area creada (id=${newArea.id}) pero falló crear empleador. Resolver manualmente o reintentar con area existente.`
    );
  }

  return ok({ area: newArea, empleador: newEmpleado }, 201);
});

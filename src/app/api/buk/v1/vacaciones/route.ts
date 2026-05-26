import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { handle, ok, parseQuery, parseBody } from '@/lib/api/utils';
import { ListVacacionesQuery, CreateVacacionBody, DeleteVacacionQuery } from '@/lib/api/schemas/vacaciones';

export const GET = handle(async (req: NextRequest) => {
  const parsed = parseQuery(req, ListVacacionesQuery);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const filters = {
    employee_id: parsed.data.colaboradora_id,
    status: parsed.data.status,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date,
  };
  const response = await sdk.absences.listVacations(filters, parsed.data.page, parsed.data.page_size);
  return ok(response.data, 200, { pagination: response.pagination });
});

export const POST = handle(async (req: NextRequest) => {
  const parsed = await parseBody(req, CreateVacacionBody);
  if (!parsed.ok) return parsed.error;
  const sdk = getBukSDK();
  const created = await sdk.absences.createVacation({ ...parsed.data, days: parsed.data.days ?? 0 });
  return ok(created, 201);
});

export const DELETE = handle(async (req: NextRequest) => {
  const parsed = parseQuery(req, DeleteVacacionQuery);
  if (!parsed.ok) return parsed.error;
  // Buk DELETE /vacations acepta employee_id+start_date como query
  const sdk = getBukSDK();
  // El cliente HTTP del SDK no expone delete con params, pero podemos llamar request directo:
  await sdk.raw().request('/vacations', {
    method: 'DELETE',
    params: { employee_id: parsed.data.employee_id, start_date: parsed.data.start_date },
  } as never);
  return ok({ deleted: true, employee_id: parsed.data.employee_id, start_date: parsed.data.start_date });
});

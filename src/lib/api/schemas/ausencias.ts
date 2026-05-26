import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ListAusenciasQuery = paginationQuerySchema.extend({
  employee_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  start_date: dateStr.optional(),
  end_date: dateStr.optional(),
  status: z.string().optional(),
});

export const CreateLicenciaBody = z.object({
  employee_id: z.number().int().positive(),
  type_id: z.number().int().positive(),
  start_date: dateStr,
  end_date: dateStr,
  license_number: z.string().optional(),
  doctor: z.string().optional(),
  observations: z.string().max(500).optional(),
}).strict();

export const CreatePermisoBody = z.object({
  employee_id: z.number().int().positive(),
  type_id: z.number().int().positive(),
  start_date: dateStr,
  end_date: dateStr,
  hours: z.number().positive().optional(),
  with_pay: z.boolean().optional(),
  observations: z.string().max(500).optional(),
}).strict();

export const CreateInasistenciaBody = z.object({
  employee_id: z.number().int().positive(),
  type_id: z.number().int().positive(),
  start_date: dateStr,
  end_date: dateStr,
  observations: z.string().max(500).optional(),
}).strict();

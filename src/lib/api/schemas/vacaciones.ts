import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha YYYY-MM-DD');

export const ListVacacionesQuery = paginationQuerySchema.extend({
  colaboradora_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled', 'submitted', 'pre_approved']).optional(),
  start_date: dateStr.optional(),
  end_date: dateStr.optional(),
  vacation_type: z.string().optional(),
});

export const CreateVacacionBody = z.object({
  employee_id: z.number().int().positive(),
  start_date: dateStr,
  end_date: dateStr,
  days: z.number().positive().optional(),
  half_day: z.boolean().optional(),
  vacation_type: z.string().optional(),
  observations: z.string().max(500).optional(),
}).strict();

export const DeleteVacacionQuery = z.object({
  employee_id: z.string().regex(/^\d+$/).transform(Number),
  start_date: dateStr,
});

export const DiasHabilesQuery = z.object({
  desde: dateStr,
  hasta: dateStr,
});

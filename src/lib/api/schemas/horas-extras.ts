import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ListHorasExtrasQuery = paginationQuerySchema.extend({
  employee_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  start_date: dateStr.optional(),
  end_date: dateStr.optional(),
});

export const CreateHorasExtrasBody = z.object({
  employee_id: z.number().int().positive(),
  date: dateStr,
  hours: z.number().positive(),
  type_id: z.number().int().positive(),
  observations: z.string().max(500).optional(),
}).strict();

export const UpdateHorasExtrasBody = z.object({
  id: z.number().int().positive(),
  date: dateStr.optional(),
  hours: z.number().positive().optional(),
  type_id: z.number().int().positive().optional(),
  observations: z.string().max(500).optional(),
}).strict();

import { z } from 'zod';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const CreateBonoBody = z.object({
  employee_id: z.number().int().positive(),
  item_id: z.number().int().positive(),
  amount: z.number(),
  start_date: dateStr,
  end_date: dateStr.optional(),
  description: z.string().max(500).optional(),
}).strict();

export const UpdateBonoBody = z.object({
  amount: z.number().optional(),
  start_date: dateStr.optional(),
  end_date: dateStr.optional(),
  description: z.string().max(500).optional(),
}).strict();

export const TerminarBonoBody = z.object({
  end_date: dateStr,
  reason: z.string().max(500).optional(),
}).strict();

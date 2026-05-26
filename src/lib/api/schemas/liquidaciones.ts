import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

const ddmmyyyy = z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Fecha en formato DD-MM-YYYY');

export const ListLiquidacionesQuery = paginationQuerySchema.extend({
  periodicidad: z.enum(['month', 'semi_month', 'week']).default('month'),
  start: ddmmyyyy.optional(),
  end: ddmmyyyy.optional(),
});

export const EmployeeLiquidacionesQuery = paginationQuerySchema.extend({
  start: ddmmyyyy.optional(),
  end: ddmmyyyy.optional(),
});

export const PdfParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
  year: z.string().regex(/^\d{4}$/).transform(Number),
  month: z.string().regex(/^\d{1,2}$/).transform(v => v.padStart(2, '0')),
});

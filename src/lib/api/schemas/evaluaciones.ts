import { z } from 'zod';

export const ListEvaluacionesQuery = z.object({
  colaboradora_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
});

export const CreateEvaluacionBody = z.object({
  buk_area_id: z.number().int().positive(),
  buk_employee_id: z.number().int().positive(),
  puntaje: z.number().int().min(1).max(5),
  comentario: z.string().max(2000).optional(),
}).strict();

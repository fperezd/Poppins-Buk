import { z } from 'zod';

export const UpdateCargaBody = z.object({
  relation: z.enum(['child', 'husband', 'wife', 'father', 'mother', 'other']).optional(),
  first_name: z.string().optional(),
  surname: z.string().optional(),
  rut: z.string().optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).strict();

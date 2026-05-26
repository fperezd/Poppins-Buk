/**
 * Schemas Zod del dominio Hogares (Areas Buk).
 */

import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

export const ListHogaresQuery = paginationQuerySchema;

export const CreateHogarBody = z.object({
  name: z.string().min(1).max(120),
  address: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  parent_area_id: z.number().int().positive().optional(),
  cost_center_id: z.number().int().positive().optional(),
  department_id: z.number().int().positive().optional(),
}).strict();

export const UpdateHogarBody = CreateHogarBody.partial();

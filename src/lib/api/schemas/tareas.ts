import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeStr = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/);

export const ListTareasQuery = paginationQuerySchema.extend({
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  colaboradora_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  estado: z.enum(['pendiente', 'en_curso', 'completada', 'cancelada']).optional(),
});

export const CreateTareaBody = z.object({
  buk_area_id: z.number().int().positive(),
  buk_employee_id: z.number().int().positive(),
  titulo: z.string().min(1).max(200),
  descripcion: z.string().max(2000).optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'urgente']).default('media'),
  fecha_para: dateStr.optional(),
  hora_para: timeStr.optional(),
}).strict();

export const UpdateTareaBody = z.object({
  titulo: z.string().min(1).max(200).optional(),
  descripcion: z.string().max(2000).optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'urgente']).optional(),
  fecha_para: dateStr.optional(),
  hora_para: timeStr.optional(),
  estado: z.enum(['pendiente', 'en_curso', 'completada', 'cancelada']).optional(),
}).strict();

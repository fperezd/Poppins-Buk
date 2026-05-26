import { z } from 'zod';

export const ListConversacionesQuery = z.object({
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
});

export const CreateConversacionBody = z.object({
  buk_area_id: z.number().int().positive(),
  buk_employee_id: z.number().int().positive(),
}).strict();

export const ListMensajesQuery = z.object({
  desde: z.string().datetime().optional(),
  limit: z.string().regex(/^\d+$/).optional().transform(v => v ? Math.min(Number(v), 200) : 50),
});

export const CreateMensajeBody = z.object({
  contenido: z.string().min(1).max(4000),
  adjunto_url: z.string().url().optional(),
}).strict();

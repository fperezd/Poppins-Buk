import { z } from 'zod';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ListSolicitudesSaludQuery = z.object({
  colaboradora_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
});

export const CreateSolicitudSaludBody = z.object({
  buk_area_id: z.number().int().positive(),
  tipo: z.enum(['malestar', 'retraso', 'salida_temprana', 'consulta_medica']),
  descripcion: z.string().max(2000).optional(),
  fecha: dateStr,
}).strict();

export const UpdateSolicitudSaludBody = z.object({
  descripcion: z.string().max(2000).optional(),
  derivada_a_licencia_buk: z.boolean().optional(),
  buk_licence_id: z.number().int().positive().optional(),
}).strict();

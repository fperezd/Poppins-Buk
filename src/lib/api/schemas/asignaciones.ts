/**
 * Schemas del dominio Asignaciones.
 *
 * Una asignación = una colaboradora trabajando en un hogar a partir de una fecha.
 * En modelo D: cambiar de hogar = actualizar el area_id del Empleado en Buk.
 *
 * El histórico debe vivir en Supabase (tabla `asignaciones`).
 * Fase B: solo POST (cambia area_id en Buk). Histórico Supabase = TODO Fase C/D.
 */

import { z } from 'zod';

export const AsignarColaboradoraBody = z.object({
  colaboradora_id: z.number().int().positive(),
  hogar_id: z.number().int().positive(),
  modalidad: z.enum(['titular', 'reemplazo', 'extra']).default('titular'),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  observaciones: z.string().max(500).optional(),
}).strict();

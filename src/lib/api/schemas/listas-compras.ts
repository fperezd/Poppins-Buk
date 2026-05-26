import { z } from 'zod';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ListListasQuery = z.object({
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  estado: z.enum(['abierta', 'cerrada', 'cancelada']).optional(),
});

export const CreateListaBody = z.object({
  buk_area_id: z.number().int().positive(),
  nombre: z.string().max(120).optional(),
}).strict();

export const UpdateListaBody = z.object({
  nombre: z.string().max(120).optional(),
  estado: z.enum(['abierta', 'cerrada', 'cancelada']).optional(),
  fecha_compra: dateStr.optional(),
  monto_total: z.number().nonnegative().optional(),
}).strict();

export const CreateItemBody = z.object({
  producto: z.string().min(1).max(200),
  cantidad: z.string().max(40).optional(),
  comentario: z.string().max(500).optional(),
}).strict();

export const UpdateItemBody = z.object({
  producto: z.string().min(1).max(200).optional(),
  cantidad: z.string().max(40).optional(),
  comprado: z.boolean().optional(),
  precio_pagado: z.number().nonnegative().optional(),
  comentario: z.string().max(500).optional(),
}).strict();

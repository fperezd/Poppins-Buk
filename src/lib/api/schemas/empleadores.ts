/**
 * Schemas Zod del dominio Empleadores.
 *
 * Un "empleador" es un Empleado Buk con cargo "Empleador", sueldo $1.
 * Cada empleador tiene su propia Area Buk (su casa / hogar).
 */

import { z } from 'zod';
import { paginationQuerySchema } from '../utils';
import { CARGO_EMPLEADOR } from './colaboradoras';

const rutSchema = z.string().regex(
  /^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/,
  'RUT inválido — formato: 12.345.678-9'
);

export const ListEmpleadoresQuery = paginationQuerySchema.extend({
  status: z.enum(['activo', 'inactivo']).optional(),
  rut: rutSchema.optional(),
  search: z.string().min(1).max(120).optional(),
});

/**
 * POST /empleadores — Crea Area Buk + Empleado-jefe atómicamente.
 *
 * Body incluye datos del hogar (para crear el Area) y datos del empleador
 * (para crear el Empleado).
 */
export const CreateEmpleadorBody = z.object({
  // Datos del hogar (Area que se va a crear)
  hogar: z.object({
    nombre: z.string().min(1).max(120), // ej: "Casa Familia Pérez"
    direccion: z.string().max(200).optional(),
    comuna: z.string().max(80).optional(),
    ciudad: z.string().max(80).optional(),
  }),
  // Datos del empleador (Empleado-jefe que se va a crear)
  empleador: z.object({
    first_name: z.string().min(1).max(80),
    surname: z.string().min(1).max(80),
    second_surname: z.string().max(80).optional(),
    rut: rutSchema,
    email: z.string().email().optional(),
    phone_number: z.string().max(30).optional(),
    address: z.string().max(200).optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    // role_id del cargo "Empleador". El handler valida que coincida.
    role_id: z.number().int().positive(),
  }),
}).strict();

export const UpdateEmpleadorBody = z.object({
  first_name: z.string().min(1).max(80).optional(),
  surname: z.string().min(1).max(80).optional(),
  email: z.string().email().optional(),
  phone_number: z.string().max(30).optional(),
  address: z.string().max(200).optional(),
}).strict();

export { CARGO_EMPLEADOR };

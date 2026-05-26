/**
 * Schemas Zod del dominio Colaboradoras.
 *
 * Una "colaboradora" es un Empleado Buk con uno de los cargos Poppins (CARGOS_COLABORADORA).
 * El filtro se aplica en el handler — Buk no tiene flag nativo, distinguimos por role.
 */

import { z } from 'zod';
import { paginationQuerySchema } from '../utils';

// Cargo que define al empleador funcional (sueldo $1, jefe de área/hogar)
export const CARGO_EMPLEADOR = 'Empleador';

// Cargos válidos para colaboradoras Poppins
export const CARGOS_COLABORADORA = ['Poppins Hogar', 'Poppins Jardín', 'Poppins Piscina'] as const;
export type CargoColaboradora = typeof CARGOS_COLABORADORA[number];

const _CARGOS_SET = new Set<string>(CARGOS_COLABORADORA);

/** Devuelve true si el nombre de cargo corresponde a una colaboradora Poppins. */
export function isColaboradora(roleName: string | undefined): boolean {
  return _CARGOS_SET.has(roleName ?? '');
}

// Validador básico de RUT chileno (formato — no calcula DV)
const rutSchema = z.string().regex(
  /^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/,
  'RUT inválido — formato esperado: 12.345.678-9'
);

// ── Listado: GET /colaboradoras ──

export const ListColaboradorasQuery = paginationQuerySchema.extend({
  status: z.enum(['activo', 'inactivo', 'pendiente']).optional(),
  hogar_id: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  rut: rutSchema.optional(),
  email: z.string().email().optional(),
  search: z.string().min(1).max(120).optional(),
});

export type ListColaboradorasQueryT = z.infer<typeof ListColaboradorasQuery>;

// ── Crear: POST /colaboradoras ──

export const CreateColaboradoraBody = z.object({
  first_name: z.string().min(1).max(80),
  surname: z.string().min(1).max(80),
  second_surname: z.string().max(80).optional(),
  rut: rutSchema,
  document_type: z.enum(['rut', 'passport', 'dni']).default('rut'),
  email: z.string().email().optional(),
  personal_email: z.string().email().optional(),
  phone_number: z.string().max(30).optional(),
  address: z.string().max(200).optional(),
  street: z.string().max(120).optional(),
  city: z.string().max(80).optional(),
  // Asignación al hogar (Area Buk) — REQUERIDO en modelo D
  area_id: z.number().int().positive(),
  // Cargo (role en Buk) — REQUERIDO; debe ser uno de CARGOS_COLABORADORA
  role_id: z.number().int().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD'),
  base_salary: z.number().int().positive(),
  contract_type: z.enum(['indefinido', 'plazo_fijo', 'por_obra']).default('indefinido'),
  // Campos previsionales
  pension_fund: z.string().optional(), // afp: habitat, modelo, etc.
  health_company: z.string().optional(), // fonasa, banmedica, etc.
}).strict();

export type CreateColaboradoraBodyT = z.infer<typeof CreateColaboradoraBody>;

// ── Actualizar: PUT /colaboradoras/{id} ──

export const UpdateColaboradoraBody = CreateColaboradoraBody.partial();

export type UpdateColaboradoraBodyT = z.infer<typeof UpdateColaboradoraBody>;

// ── Baja: POST /colaboradoras/{id}/baja ──

export const BajaColaboradoraBody = z.object({
  fecha_termino: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  causal: z.enum([
    'renuncia',
    'mutuo_acuerdo',
    'vencimiento_plazo',
    'conclusion_obra',
    'caso_fortuito',
    'necesidades_empresa',
    'desahucio',
    'incumplimiento',
    'muerte',
  ]),
  observaciones: z.string().max(500).optional(),
}).strict();

export type BajaColaboradoraBodyT = z.infer<typeof BajaColaboradoraBody>;

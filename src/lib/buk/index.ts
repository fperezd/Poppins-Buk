/**
 * Service Layer — Punto de entrada unico para datos.
 *
 * Prioridad:
 * 1. USE_MOCK_DATA=true -> mock data (dev sin conexiones)
 * 2. Supabase (si hay datos en DB) -> lectura local
 * 3. BUK SDK -> fetch remoto tipado
 */

import { getBukSDK } from '@/lib/buk-sdk';
import type { BukEmployeeSummary } from '@/lib/buk-sdk/types/employees';
import type { BukPayrollDetail, BukPayrollLine } from '@/lib/buk-sdk/modules/payroll';
import { mapBukEmployees, mapBukPayrollItems, mapBukAbsences } from './mappers';
import { MOCK_EMPLOYEES, MOCK_PAYROLL_ITEMS, MOCK_ABSENCES, MOCK_BENEFITS } from './mock-data';
import type { Employee, Payroll, Absence, Benefit } from '@/types/database';
import { createClient } from '@/lib/supabase/server';

const useMock = process.env.USE_MOCK_DATA === 'true';

// Helper: mapear BukEmployeeSummary -> PoppinsEmployee shape
function mapSdkEmployee(emp: BukEmployeeSummary) {
  return {
    id: emp.id,
    nombre: emp.first_name || '',
    apellido: emp.last_name || '',
    nombreCompleto: emp.full_name || `${emp.first_name} ${emp.last_name}`,
    rut: emp.rut || '',
    cargo: emp.current_job?.role?.name || 'Sin cargo',
    fechaIngreso: emp.current_job?.start_date || '',
    estado: emp.active ? 'activo' as const : 'inactivo' as const,
    tipoContrato: 'Indefinido',
    sueldoBase: 0,
    afp: '',
    salud: '',
    email: emp.email || '',
    telefono: emp.phone || '',
    direccion: '',
    iniciales: `${(emp.first_name || ' ')[0]}${(emp.last_name || ' ')[0]}`.toUpperCase(),
    color: `hsl(${((emp.first_name || '').charCodeAt(0) * 137) % 360}, 60%, 45%)`,
    empleador: emp.current_job?.company?.name || '',
  };
}

// Employees

export async function getEmployees() {
  if (useMock) return mapBukEmployees(MOCK_EMPLOYEES);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('employees').select('*').order('nombre');
    const rows = data as unknown as Employee[] | null;
    if (!error && rows && rows.length > 0) {
      return rows.map(emp => ({
        id: emp.buk_id ?? 0,
        nombre: emp.nombre,
        apellido: emp.apellido,
        nombreCompleto: `${emp.nombre} ${emp.apellido}`,
        rut: emp.rut,
        cargo: emp.cargo,
        fechaIngreso: emp.fecha_ingreso,
        estado: emp.estado as 'activo' | 'inactivo' | 'licencia',
        tipoContrato: emp.tipo_contrato,
        sueldoBase: emp.sueldo_base,
        afp: emp.afp ?? '',
        salud: emp.salud ?? '',
        email: emp.email ?? '',
        telefono: emp.telefono ?? '',
        direccion: emp.direccion ?? '',
        iniciales: `${emp.nombre[0]}${emp.apellido[0]}`.toUpperCase(),
        color: `hsl(${(emp.nombre.charCodeAt(0) * 137) % 360}, 60%, 45%)`,
        empleador: '',
      }));
    }
  } catch { /* Supabase no disponible */ }

  const sdk = getBukSDK();
  const response = await sdk.employees.listActive();
  return response.data.map(mapSdkEmployee);
}

export async function getEmployee(id: number) {
  if (useMock) {
    const emp = MOCK_EMPLOYEES.find(e => e.id === id);
    if (!emp) throw new Error(`Employee ${id} not found`);
    return mapBukEmployees([emp])[0];
  }

  const sdk = getBukSDK();
  const emp = await sdk.employees.get(id);
  return {
    id: emp.id,
    nombre: emp.first_name || '',
    apellido: emp.last_name || '',
    nombreCompleto: emp.full_name || `${emp.first_name} ${emp.last_name}`,
    rut: emp.rut || '',
    cargo: emp.current_job?.role?.name || 'Sin cargo',
    fechaIngreso: emp.hire_date || emp.current_job?.start_date || '',
    estado: emp.active ? 'activo' as const : 'inactivo' as const,
    tipoContrato: emp.contract_type || 'Indefinido',
    sueldoBase: emp.base_salary || 0,
    afp: emp.afp?.name || '',
    salud: emp.health_plan?.name || 'Fonasa',
    email: emp.email || '',
    telefono: emp.phone || '',
    direccion: emp.address || '',
    iniciales: `${(emp.first_name || ' ')[0]}${(emp.last_name || ' ')[0]}`.toUpperCase(),
    color: `hsl(${((emp.first_name || '').charCodeAt(0) * 137) % 360}, 60%, 45%)`,
    empleador: emp.current_job?.company?.name || '',
  };
}

// Helpers para mapear lines_settlement -> campos Poppins
function sumLines(
  lines: BukPayrollLine[],
  predicate: (l: BukPayrollLine) => boolean
): number {
  return lines.filter(predicate).reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
}

function mapBukPayrollDetailToPoppins(d: BukPayrollDetail) {
  const lines = d.lines_settlement || [];
  const lc = (s: unknown) => String(s || '').toLowerCase();

  const sueldoBase = sumLines(lines, l => lc(l.name).includes('sueldo base') || lc(l.income_type) === 'remuneracion_fija');
  const horasExtra = sumLines(lines, l => lc(l.name).includes('hora extra') || lc(l.income_type).includes('overtime'));
  const bonos = sumLines(lines, l => l.type === 'haber' && lc(l.income_type).includes('bono'));
  const gratificacion = sumLines(lines, l => lc(l.name).includes('gratific'));

  const descSalud = sumLines(lines, l => l.type === 'descuento' && (lc(l.name).includes('salud') || lc(l.name).includes('isapre') || lc(l.name).includes('fonasa')));
  const descAfp = sumLines(lines, l => l.type === 'descuento' && lc(l.name).includes('afp'));
  const descCesantia = sumLines(lines, l => l.type === 'descuento' && lc(l.name).includes('cesant'));
  const impuestoUnico = sumLines(lines, l => l.type === 'descuento' && (lc(l.name).includes('impuesto') || lc(l.name).includes('iuss')));

  const totalHaberes = d.income_gross || sumLines(lines, l => l.type === 'haber');
  const totalDescuentos = (d.total_legal_discounts || 0) + (d.total_other_discounts || 0);
  const otrosDescuentos = Math.max(0, totalDescuentos - descSalud - descAfp - descCesantia - impuestoUnico);

  return {
    id: d.liquidacion_id,
    empleadoId: d.employee_id,
    periodo: `${d.year}-${String(d.month).padStart(2, '0')}`,
    sueldoBruto: totalHaberes,
    sueldoBase,
    horasExtra,
    bonos,
    gratificacion,
    descSalud,
    descAfp,
    descCesantia,
    impuestoUnico,
    otrosDescuentos,
    totalHaberes,
    totalDescuentos,
    liquido: d.liquid_reach ?? d.income_net,
    estado: d.closed ? 'Pagado' : 'Pendiente',
    fechaPago: null as string | null,
  };
}

// Payroll

/**
 * Liquidaciones del periodo o de un empleado.
 *
 * Usa GET /employees/{id}/payroll_detail (per-employee) o GET /payroll_detail/month (todos).
 * El shape real de Buk: liquidacion_id, income_gross, income_net, lines_settlement[], etc.
 * Hacemos un mapeo a PoppinsLiquidacion derivando haberes/descuentos de lines_settlement.
 */
export async function getPayrollItems(employeeId?: number) {
  if (useMock) {
    const items = employeeId
      ? MOCK_PAYROLL_ITEMS.filter(i => i.employee_id === employeeId)
      : MOCK_PAYROLL_ITEMS;
    return mapBukPayrollItems(items);
  }

  try {
    const supabase = await createClient();
    let query = supabase.from('payroll').select('*').order('periodo', { ascending: false });
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    const { data, error } = await query;

    const rows = data as unknown as Payroll[] | null;
    if (!error && rows && rows.length > 0) {
      return rows.map(p => ({
        id: p.buk_id ?? 0,
        empleadoId: 0,
        periodo: p.periodo,
        sueldoBruto: p.total_haberes,
        sueldoBase: p.sueldo_base,
        horasExtra: p.monto_horas_extra,
        bonos: p.bonos,
        gratificacion: p.gratificacion,
        descSalud: p.desc_salud,
        descAfp: p.desc_afp,
        descCesantia: p.desc_cesantia,
        impuestoUnico: p.impuesto_unico,
        otrosDescuentos: p.otros_descuentos,
        totalHaberes: p.total_haberes,
        totalDescuentos: p.total_descuentos,
        liquido: p.sueldo_liquido,
        estado: p.estado,
        fechaPago: p.fecha_pago,
      }));
    }
  } catch {
    // Supabase no disponible
  }

  // Fallback: BUK SDK
  const sdk = getBukSDK();
  const details = employeeId
    ? await sdk.payroll.getEmployeeHistory(employeeId)
    : await sdk.payroll.listAllMonthly();

  return details.map(d => {
    // Helper: sumar lines que cumplen un predicado
    const sumLines = (pred: (l: typeof d.lines_settlement[number]) => boolean) =>
      (d.lines_settlement || []).filter(pred).reduce((acc, l) => acc + (Number(l.amount) || 0), 0);

    const find = (pred: (l: typeof d.lines_settlement[number]) => boolean) =>
      (d.lines_settlement || []).find(pred);

    const haberes = (d.lines_settlement || []).filter(l => l.type === 'haber');
    const descuentos = (d.lines_settlement || []).filter(l => l.type === 'descuento');

    const sueldoBaseLine = find(l => l.type === 'haber' && /sueldo base/i.test(String(l.name)));
    const horasExtraSum = sumLines(l => l.type === 'haber' && /hora.?extra/i.test(String(l.name)));
    const bonosSum = sumLines(l => l.type === 'haber' && /bono/i.test(String(l.name)));
    const gratifLine = find(l => l.type === 'haber' && /gratific/i.test(String(l.name)));
    const saludLine = find(l => l.type === 'descuento' && /(salud|isapre|fonasa)/i.test(String(l.name)));
    const afpLine = find(l => l.type === 'descuento' && /afp/i.test(String(l.name)));
    const cesantiaLine = find(l => l.type === 'descuento' && /cesant/i.test(String(l.name)));
    const impuestoLine = find(l => l.type === 'descuento' && /impuesto/i.test(String(l.name)));

    const descSalud = Number(saludLine?.amount || 0);
    const descAfp = Number(afpLine?.amount || 0);
    const descCesantia = Number(cesantiaLine?.amount || 0);
    const impuestoUnico = Number(impuestoLine?.amount || 0);
    const totalDescuentos = descuentos.reduce((a, l) => a + (Number(l.amount) || 0), 0);
    const otrosDescuentos = Math.max(0, totalDescuentos - descSalud - descAfp - descCesantia - impuestoUnico);
    const totalHaberes = haberes.reduce((a, l) => a + (Number(l.amount) || 0), 0);

    const periodoMes = String(d.month).padStart(2, '0');
    return {
      id: d.liquidacion_id,
      empleadoId: d.employee_id,
      periodo: `${d.year}-${periodoMes}`,
      sueldoBruto: Number(d.income_gross) || totalHaberes,
      sueldoBase: Number(sueldoBaseLine?.amount || 0),
      horasExtra: horasExtraSum,
      bonos: bonosSum,
      gratificacion: Number(gratifLine?.amount || 0),
      descSalud,
      descAfp,
      descCesantia,
      impuestoUnico,
      otrosDescuentos,
      totalHaberes: totalHaberes || Number(d.income_gross) || 0,
      totalDescuentos: totalDescuentos || (Number(d.total_legal_discounts) || 0) + (Number(d.total_other_discounts) || 0),
      liquido: Number(d.liquid_reach) || Number(d.income_net) || 0,
      estado: d.closed ? 'Pagado' : 'Pendiente',
      fechaPago: null as string | null,
    };
  }).filter(item => !employeeId || item.empleadoId === employeeId);
}

// Absences

export async function getAbsences(employeeId?: number) {
  if (useMock) {
    const items = employeeId
      ? MOCK_ABSENCES.filter(a => a.employee_id === employeeId)
      : MOCK_ABSENCES;
    return mapBukAbsences(items);
  }

  try {
    const supabase = await createClient();
    let query = supabase.from('absences').select('*').order('fecha_inicio', { ascending: false });
    if (employeeId) query = query.eq('employee_id', employeeId);
    const { data, error } = await query;
    const rows = data as unknown as Absence[] | null;
    if (!error && rows && rows.length > 0) {
      return rows.map(a => ({
        id: a.buk_id ?? 0,
        empleadoId: 0,
        tipo: a.tipo,
        inicio: a.fecha_inicio,
        fin: a.fecha_fin,
        dias: a.dias,
        estado: a.estado === 'aprobada' ? 'aprobada' as const
          : a.estado === 'rechazada' ? 'rechazada' as const
          : 'pendiente' as const,
        observaciones: a.observaciones ?? '',
      }));
    }
  } catch { /* Supabase no disponible */ }

  const sdk = getBukSDK();
  const response = await sdk.absences.listAbsences(
    employeeId ? { employee_id: employeeId } : undefined
  );
  return response.data.map(a => ({
    id: a.id,
    empleadoId: a.employee_id,
    tipo: a.absence_subtype || a.absence_type,
    inicio: a.start_date,
    fin: a.end_date,
    dias: a.days,
    estado: a.status === 'approved' ? 'aprobada' as const
      : a.status === 'rejected' ? 'rechazada' as const
      : 'pendiente' as const,
    observaciones: a.observations || '',
  }));
}

/**
 * Crear una ausencia/vacacion/licencia/permiso.
 * Fase 1: ahora soporta vacaciones, licencias y permisos contra paths reales.
 */
export async function createAbsence(absenceData: Record<string, unknown>) {
  if (useMock) return { success: true, id: Date.now(), mock: true };

  const tipo = String(absenceData.tipo || absenceData.absence_type || 'vacaciones').toLowerCase();
  const employeeId = Number(absenceData.employee_id ?? absenceData.empleadoId ?? absenceData.empleado_id);
  const startDate = String(absenceData.start_date ?? absenceData.fecha_inicio ?? absenceData.inicio ?? '');
  const endDate = String(absenceData.end_date ?? absenceData.fecha_fin ?? absenceData.fin ?? '');
  const days = Number(absenceData.days ?? absenceData.dias ?? 0);
  const observations = absenceData.observations ?? absenceData.observaciones;

  if (!employeeId || !startDate || !endDate) {
    return { success: false as const, error: 'Faltan campos obligatorios: employee_id, fecha_inicio, fecha_fin' };
  }

  const sdk = getBukSDK();

  try {
    if (tipo === 'vacaciones' || tipo === 'vacation' || tipo === 'vacations') {
      const created = await sdk.absences.createVacation({
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        days: days || (undefined as unknown as number),
        half_day: Boolean(absenceData.half_day ?? absenceData.medio_dia),
        vacation_type: (absenceData.vacation_type as string) || undefined,
        observations: observations as string | undefined,
      });
      return { success: true as const, id: created.id, source: 'buk' as const };
    }

    if (tipo === 'licencia' || tipo === 'licencia_medica' || tipo === 'license') {
      const created = await sdk.absences.createLicense({
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        days: days || (undefined as unknown as number),
        license_type: (absenceData.license_type as string) || 'licencia',
        observations: observations as string | undefined,
      });
      return { success: true as const, id: created.id, source: 'buk' as const };
    }

    if (tipo === 'permiso' || tipo === 'permission') {
      const created = await sdk.absences.createPermission({
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        days: days || (undefined as unknown as number),
        permission_type: (absenceData.permission_type as string) || 'permiso',
        observations: observations as string | undefined,
      });
      return { success: true as const, id: created.id, source: 'buk' as const };
    }

    if (tipo === 'inasistencia' || tipo === 'ausencia' || tipo === 'absence') {
      const created = await sdk.absences.createAbsenceRecord({
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        days: days || undefined,
        absence_type: (absenceData.absence_type_id as number) || undefined,
        observations: observations || undefined,
      });
      return { success: true as const, id: created.id, source: 'buk' as const };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al crear ausencia en Buk';
    return { success: false as const, error: message };
  }

  return { success: false as const, error: `Tipo '${tipo}' no reconocido. Validos: vacaciones, licencia, permiso, inasistencia.` };
}

// Benefits

export async function getBenefits() {
  if (useMock) return MOCK_BENEFITS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('benefits').select('*').eq('activo', true);
    const rows = data as unknown as Benefit[] | null;
    if (!error && rows && rows.length > 0) {
      return rows.map(b => ({
        id: 0,
        name: b.nombre,
        description: b.descripcion ?? '',
        amount: b.monto,
      }));
    }
  } catch { /* Supabase no disponible */ }

  return [];
}

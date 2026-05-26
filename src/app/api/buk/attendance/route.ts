/**
 * GET /api/buk/attendance?startDate=2026-03-01&endDate=2026-03-31
 *
 * Retorna datos de asistencia combinando:
 *   - GET /working_days          → Días trabajados
 *   - GET /attendances/non-worked-hours → Horas no trabajadas
 *   - GET /employees/active      → Lista de empleados activos
 */

import { NextResponse } from 'next/server';

const useMock = process.env.USE_MOCK_DATA?.trim() === 'true';

function getMockAttendance() {
  const employees = [
    { id: 1, nombre: 'María Martínez García', iniciales: 'MM', color: '#1B1564' },
    { id: 2, nombre: 'Ana Lucía López Silva', iniciales: 'AL', color: '#F0197A' },
    { id: 3, nombre: 'Carmen González Rojas', iniciales: 'CG', color: '#059669' },
    { id: 4, nombre: 'Julia Rodríguez Pérez', iniciales: 'JR', color: '#7C3AED' },
    { id: 5, nombre: 'Rosa Soto Fuentes', iniciales: 'RS', color: '#D97706' },
    { id: 35, nombre: 'Ismael Humberto Liempi Cifuentes', iniciales: 'IL', color: '#0891B2' },
  ];

  const today = new Date();
  const dayOfWeek = today.getDay();

  return employees.map(emp => {
    const days: Record<string, 'presente' | 'ausente' | 'pendiente'> = {};
    for (let d = 1; d <= 5; d++) {
      if (d < dayOfWeek) days[`day_${d}`] = 'presente';
      else if (d === dayOfWeek) days[`day_${d}`] = 'presente';
      else days[`day_${d}`] = 'pendiente';
    }
    return {
      employee_id: emp.id,
      nombre: emp.nombre,
      iniciales: emp.iniciales,
      color: emp.color,
      dias: days,
      total_trabajados: Object.values(days).filter(v => v === 'presente').length,
      horas_no_trabajadas: 0,
    };
  });
}

export async function GET(request: Request) {
  try {
    if (useMock) {
      return NextResponse.json({ data: getMockAttendance() });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const { getBukSDK } = await import('@/lib/buk-sdk');
    const sdk = getBukSDK();

    const [workingDaysRes, nonWorkedRes, employeesRes] = await Promise.all([
      sdk.client.list('/working_days', {
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      }),
      sdk.client.list('/attendances/non-worked-hours', {
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      }),
      sdk.employees.listAll({ status: 'active' }),
    ]);

    const workingDays = workingDaysRes.data || [];
    const nonWorkedHours = nonWorkedRes.data || [];

    const attendance = employeesRes.map((emp: { id: number; first_name: string; last_name: string }) => {
      const empWorking = (workingDays as Array<{ employee_id: number; days_worked?: number }>)
        .find(w => w.employee_id === emp.id);
      const empNonWorked = (nonWorkedHours as Array<{ employee_id: number; hours?: number }>)
        .filter(n => n.employee_id === emp.id);

      return {
        employee_id: emp.id,
        nombre: `${emp.first_name} ${emp.last_name}`,
        total_trabajados: empWorking?.days_worked || 0,
        horas_no_trabajadas: empNonWorked.reduce((sum, n) => sum + (n.hours || 0), 0),
      };
    });

    return NextResponse.json({ data: attendance });
  } catch (error) {
    console.error('[BUK] Error obteniendo asistencia:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener asistencia' },
      { status: 500 }
    );
  }
}

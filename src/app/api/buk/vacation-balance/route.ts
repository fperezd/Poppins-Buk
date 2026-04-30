import { NextRequest, NextResponse } from 'next/server';

const useMock = process.env.USE_MOCK_DATA?.trim() === 'true';

const MOCK_BALANCES = [
  {
    empleadoId: 1, nombre: 'María Martínez García',
    diasTotales: 15, diasUsados: 10, diasPendientes: 0, diasDisponibles: 5,
    diasProgresivos: 0, fechaCorte: '2026-04-30',
  },
  {
    empleadoId: 2, nombre: 'Ana Lucía López Silva',
    diasTotales: 15, diasUsados: 3, diasPendientes: 0, diasDisponibles: 12,
    diasProgresivos: 0, fechaCorte: '2026-04-30',
  },
  {
    empleadoId: 3, nombre: 'Carmen González Rojas',
    diasTotales: 15, diasUsados: 5, diasPendientes: 5, diasDisponibles: 5,
    diasProgresivos: 3, fechaCorte: '2026-04-30',
  },
  {
    empleadoId: 4, nombre: 'Julia Rodríguez Pérez',
    diasTotales: 15, diasUsados: 7, diasPendientes: 0, diasDisponibles: 8,
    diasProgresivos: 0, fechaCorte: '2026-04-30',
  },
  {
    empleadoId: 5, nombre: 'Rosa Soto Fuentes',
    diasTotales: 15, diasUsados: 0, diasPendientes: 1, diasDisponibles: 14,
    diasProgresivos: 0, fechaCorte: '2026-04-30',
  },
];

export async function GET(request: NextRequest) {
  try {
    if (useMock) {
      const { searchParams } = new URL(request.url);
      const employeeId = searchParams.get('employeeId');

      if (employeeId) {
        const balance = MOCK_BALANCES.find(b => b.empleadoId === Number(employeeId));
        return NextResponse.json({ data: balance || null });
      }

      return NextResponse.json({ data: MOCK_BALANCES });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json({ error: 'employeeId required' }, { status: 400 });
    }

    const { getBukSDK } = await import('@/lib/buk-sdk');
    const sdk = getBukSDK();
    const balance = await sdk.absences.getVacationBalance(Number(employeeId));

    return NextResponse.json({
      data: {
        empleadoId: balance.employee_id,
        diasTotales: balance.total_days,
        diasUsados: balance.used_days,
        diasPendientes: balance.pending_days,
        diasDisponibles: balance.available_days,
        diasProgresivos: balance.progressive_days || 0,
        fechaCorte: balance.as_of_date,
      },
    });
  } catch (error) {
    console.error('[BUK] Error fetching vacation balance:', error);
    return NextResponse.json(
      { error: 'Error al obtener saldo de vacaciones' },
      { status: 500 }
    );
  }
}

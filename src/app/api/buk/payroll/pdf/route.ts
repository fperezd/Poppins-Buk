/**
 * GET /api/buk/payroll/pdf?employeeId=35&year=2026&month=3
 *
 * Proxy para descargar el PDF de liquidación desde BUK.
 * Mes con cero delante: 2026-03 ✅ / 2026-3 ❌
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!employeeId || !year || !month) {
      return NextResponse.json(
        { error: 'Parámetros requeridos: employeeId, year, month' },
        { status: 400 }
      );
    }

    const mm = String(month).padStart(2, '0');
    const baseUrl = process.env.BUK_API_BASE_URL || 'https://app.buk.cl/api/v1/chile';
    const token = process.env.BUK_API_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'BUK_API_TOKEN no configurado' }, { status: 500 });
    }

    const pdfUrl = `${baseUrl}/employees/${employeeId}/statements/${year}-${mm}.pdf`;

    const response = await fetch(pdfUrl, {
      headers: { auth_token: token },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `BUK respondió ${response.status}: no se encontró la liquidación` },
        { status: response.status }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="liquidacion_${employeeId}_${year}-${mm}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[BUK] Error descargando PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al descargar PDF' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/buk/v1/colaboradoras/{id}/liquidaciones/{year}/{month}/pdf
 *
 * Devuelve el PDF binario de la liquidación del periodo.
 * Buk endpoint: GET /employees/{id}/statements/{year}-{mm}.pdf
 *
 * No usamos ok() porque la respuesta NO es JSON — es application/pdf.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handle, fail, parseParams } from '@/lib/api/utils';
import { PdfParamsSchema } from '@/lib/api/schemas/liquidaciones';

interface RouteContext {
  params: Promise<{ id: string; year: string; month: string }>;
}

export const GET = handle(async (_req: NextRequest, ctx: RouteContext) => {
  const raw = await ctx.params;
  const parsed = parseParams(raw, PdfParamsSchema);
  if (!parsed.ok) return parsed.error;

  const baseUrl = (process.env.BUK_API_BASE_URL || 'https://app.buk.cl/api/v1/chile').replace(/\/$/, '');
  const token = process.env.BUK_API_TOKEN || '';
  const url = `${baseUrl}/employees/${parsed.data.id}/statements/${parsed.data.year}-${parsed.data.month}.pdf`;

  const res = await fetch(url, {
    headers: { auth_token: token, Accept: 'application/pdf' },
  });

  if (!res.ok) {
    return fail('BUK_API_ERROR', `Buk PDF ${res.status}: ${res.statusText}`);
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="liquidacion-${parsed.data.id}-${parsed.data.year}-${parsed.data.month}.pdf"`,
    },
  });
});

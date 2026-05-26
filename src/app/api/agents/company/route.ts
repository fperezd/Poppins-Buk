// GET /api/agents/company — Resumen completo de la empresa
import { NextResponse } from 'next/server';
import { getCompanySummary } from '@/agents';

export async function GET() {
  const summary = getCompanySummary();
  return NextResponse.json(summary);
}

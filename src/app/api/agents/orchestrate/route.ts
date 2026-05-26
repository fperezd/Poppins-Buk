// POST /api/agents/orchestrate — Envía una solicitud a la empresa
// Body: { request: string, agentId?: string }
import { NextRequest, NextResponse } from 'next/server';
import { orchestrator, registry } from '@/agents';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { request: userRequest, agentId } = body;

  if (!userRequest) {
    return NextResponse.json({ error: 'Missing "request" field' }, { status: 400 });
  }

  // Si se especifica un agente, hablar directamente con él
  if (agentId) {
    const agent = registry.get(agentId);
    if (!agent) {
      return NextResponse.json({ error: `Agent ${agentId} not found` }, { status: 404 });
    }

    const response = orchestrator.processRequest(agentId, userRequest);
    return NextResponse.json(response);
  }

  // Si no, el CEO enruta la solicitud al equipo correcto
  const response = orchestrator.processCompanyRequest(userRequest);
  return NextResponse.json(response);
}

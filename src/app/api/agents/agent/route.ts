// GET /api/agents/agent?id=ceo — Info de un agente específico
// GET /api/agents/agent?department=hr — Agentes de un departamento
// GET /api/agents/agent — Todos los agentes
import { NextRequest, NextResponse } from 'next/server';
import { registry } from '@/agents';
import type { Department } from '@/agents';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const department = searchParams.get('department') as Department | null;

  if (id) {
    const agent = registry.get(id);
    if (!agent) {
      return NextResponse.json({ error: `Agent ${id} not found` }, { status: 404 });
    }

    const directReports = registry.getDirectReports(id);
    const collaborators = registry.getCollaborators(id);
    const reportingChain = registry.getReportingChain(id);

    return NextResponse.json({
      agent,
      directReports: directReports.map(a => ({ id: a.id, name: a.name, title: a.title })),
      collaborators: collaborators.map(a => ({ id: a.id, name: a.name, title: a.title })),
      reportingChain: reportingChain.map(a => ({ id: a.id, name: a.name, title: a.title })),
    });
  }

  if (department) {
    const agents = registry.getByDepartment(department);
    return NextResponse.json({
      department,
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        title: a.title,
        level: a.level,
        status: a.status,
        responsibilitiesCount: a.responsibilities.length,
        toolsCount: a.tools.length,
      })),
    });
  }

  // Todos los agentes (resumen)
  const all = registry.getAll();
  return NextResponse.json({
    total: all.length,
    agents: all.map(a => ({
      id: a.id,
      name: a.name,
      title: a.title,
      department: a.department,
      level: a.level,
      status: a.status,
    })),
  });
}

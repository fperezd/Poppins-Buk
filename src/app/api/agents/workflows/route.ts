// GET /api/agents/workflows — Lista todos los workflows
// GET /api/agents/workflows?id=wf-new-hire — Detalle de un workflow
import { NextRequest, NextResponse } from 'next/server';
import { workflows, registry } from '@/agents';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) {
      return NextResponse.json({ error: `Workflow ${id} not found` }, { status: 404 });
    }

    // Enriquecer con datos de agentes
    const enrichedSteps = workflow.steps.map(step => {
      const agent = registry.get(step.responsibleAgent);
      const approverAgents = step.approvers?.map(aId => registry.get(aId)).filter(Boolean) || [];

      return {
        ...step,
        responsibleAgentInfo: agent
          ? { id: agent.id, name: agent.name, title: agent.title, department: agent.department }
          : null,
        approverInfo: approverAgents.map(a => ({ id: a!.id, name: a!.name, title: a!.title })),
      };
    });

    return NextResponse.json({
      ...workflow,
      steps: enrichedSteps,
    });
  }

  return NextResponse.json({
    total: workflows.length,
    workflows: workflows.map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      departments: w.departments,
      stepsCount: w.steps.length,
      sla: w.sla,
      trigger: w.trigger,
    })),
  });
}

// ============================================================
// POPPINS CORP — Task Orchestrator
// Enruta tareas al agente correcto y coordina flujos
// ============================================================

import { registry } from './registry';
import { AgentTask, AgentMessage, CorporateAgent, Department, TaskPriority, TaskStatus, Workflow } from './types';
import { workflows } from './workflows';

/** Resultado del procesamiento de un agente */
export interface AgentResponse {
  agentId: string;
  agentName: string;
  agentTitle: string;
  department: Department;
  response: string;
  delegatedTo?: string[];
  escalatedTo?: string;
  taskCreated?: AgentTask;
  nextActions?: string[];
  systemPromptUsed: string;
}

/** Resultado de un flujo de trabajo completo */
export interface WorkflowExecution {
  workflowId: string;
  workflowName: string;
  steps: WorkflowStepResult[];
  status: 'completed' | 'in_progress' | 'blocked';
  summary: string;
}

interface WorkflowStepResult {
  stepId: string;
  stepName: string;
  agent: string;
  status: TaskStatus;
  output: string;
}

class Orchestrator {

  // ── Enrutamiento Inteligente ─────────────────────────────

  /** Determina qué agente(s) deben manejar una solicitud */
  route(request: string): CorporateAgent[] {
    const keywords = this.extractKeywords(request);
    const candidates: Map<string, number> = new Map();

    for (const agent of registry.getAll()) {
      let score = 0;

      // Match por responsabilidades
      for (const resp of agent.responsibilities) {
        for (const kw of keywords) {
          if (resp.toLowerCase().includes(kw)) score += 3;
        }
      }

      // Match por herramientas
      for (const tool of agent.tools) {
        for (const kw of keywords) {
          if (tool.name.toLowerCase().includes(kw) || tool.description.toLowerCase().includes(kw)) score += 2;
        }
      }

      // Match por descripción del rol
      for (const kw of keywords) {
        if (agent.roleDescription.toLowerCase().includes(kw)) score += 1;
      }

      if (score > 0) candidates.set(agent.id, score);
    }

    // Ordenar por score y devolver los mejores
    return Array.from(candidates.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => registry.get(id)!)
      .filter(Boolean);
  }

  // ── Procesamiento de Tareas ──────────────────────────────

  /** Procesa una solicitud dirigida a un agente específico */
  processRequest(agentId: string, request: string): AgentResponse {
    const agent = registry.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    // Analizar si necesita delegar o escalar
    const analysis = this.analyzeRequest(agent, request);

    const response: AgentResponse = {
      agentId: agent.id,
      agentName: agent.name,
      agentTitle: agent.title,
      department: agent.department,
      response: this.generateAgentContext(agent, request),
      systemPromptUsed: agent.systemPrompt,
      nextActions: analysis.suggestedActions,
    };

    if (analysis.shouldDelegate) {
      response.delegatedTo = analysis.delegateTo;
    }

    if (analysis.shouldEscalate) {
      response.escalatedTo = analysis.escalateTo;
    }

    return response;
  }

  /** Procesa una solicitud al CEO — punto de entrada principal */
  processCompanyRequest(request: string): AgentResponse & { teamResponses: AgentResponse[] } {
    const ceo = registry.get('ceo')!;
    const relevantAgents = this.route(request);

    const teamResponses = relevantAgents
      .filter(a => a.id !== 'ceo')
      .map(agent => this.processRequest(agent.id, request));

    return {
      ...this.processRequest('ceo', request),
      teamResponses,
    };
  }

  // ── Flujos de Trabajo ────────────────────────────────────

  /** Inicia un flujo de trabajo definido */
  startWorkflow(workflowId: string): WorkflowExecution {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    const steps: WorkflowStepResult[] = workflow.steps.map(step => ({
      stepId: step.id,
      stepName: step.name,
      agent: step.responsibleAgent,
      status: 'pending' as TaskStatus,
      output: '',
    }));

    // Activar primer paso
    if (steps.length > 0) {
      steps[0].status = 'in_progress';
    }

    return {
      workflowId: workflow.id,
      workflowName: workflow.name,
      steps,
      status: 'in_progress',
      summary: `Workflow "${workflow.name}" iniciado. ${workflow.steps.length} pasos, ${workflow.departments.length} departamentos involucrados.`,
    };
  }

  /** Lista todos los flujos de trabajo disponibles */
  listWorkflows(): Workflow[] {
    return workflows;
  }

  // ── Comunicación Inter-Agente ────────────────────────────

  /** Envía un mensaje de un agente a otro */
  sendMessage(from: string, to: string, subject: string, content: string, priority: TaskPriority = 'medium'): AgentMessage {
    const message: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      subject,
      content,
      priority,
      timestamp: new Date(),
      requiresResponse: true,
    };

    registry.sendMessage(message);
    return message;
  }

  /** Escala un problema al superior */
  escalate(fromAgentId: string, issue: string): AgentResponse | null {
    const agent = registry.get(fromAgentId);
    if (!agent?.connections.reportsTo) return null;

    const superior = registry.get(agent.connections.reportsTo);
    if (!superior) return null;

    this.sendMessage(
      fromAgentId,
      superior.id,
      `Escalación: ${issue.substring(0, 50)}`,
      `Escalado por ${agent.name} (${agent.title}): ${issue}`,
      'high'
    );

    return this.processRequest(superior.id, issue);
  }

  // ── Helpers ──────────────────────────────────────────────

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para',
      'que', 'es', 'son', 'se', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'su',
      'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are',
      'was', 'be', 'has', 'have', 'do', 'does', 'this', 'that', 'it', 'and', 'or',
      'quiero', 'necesito', 'dame', 'dime', 'hacer', 'hay', 'puede', 'cómo',
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\sáéíóúñü]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  private analyzeRequest(agent: CorporateAgent, request: string): {
    shouldDelegate: boolean;
    delegateTo: string[];
    shouldEscalate: boolean;
    escalateTo: string;
    suggestedActions: string[];
  } {
    const keywords = this.extractKeywords(request);
    const suggestedActions: string[] = [];
    const delegateTo: string[] = [];
    let shouldEscalate = false;

    // Verificar si algún direct report es más adecuado
    for (const reportId of agent.connections.directReports) {
      const report = registry.get(reportId);
      if (!report) continue;

      const reportMatch = report.responsibilities.some(r =>
        keywords.some(kw => r.toLowerCase().includes(kw))
      );

      if (reportMatch) {
        delegateTo.push(reportId);
        suggestedActions.push(`Delegar a ${report.name} (${report.title})`);
      }
    }

    // Verificar si necesita colaboración
    for (const collabId of agent.connections.collaboratesWith) {
      const collab = registry.get(collabId);
      if (!collab) continue;

      const collabMatch = collab.responsibilities.some(r =>
        keywords.some(kw => r.toLowerCase().includes(kw))
      );

      if (collabMatch) {
        suggestedActions.push(`Coordinar con ${collab.name} (${collab.title})`);
      }
    }

    // Determinar si debe escalar (si no tiene herramientas adecuadas)
    const hasTools = agent.tools.some(t =>
      keywords.some(kw =>
        t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw)
      )
    );

    if (!hasTools && agent.connections.reportsTo) {
      shouldEscalate = true;
      suggestedActions.push(`Escalar a ${agent.connections.reportsTo}`);
    }

    return {
      shouldDelegate: delegateTo.length > 0,
      delegateTo,
      shouldEscalate,
      escalateTo: agent.connections.reportsTo || '',
      suggestedActions,
    };
  }

  private generateAgentContext(agent: CorporateAgent, request: string): string {
    const tools = agent.tools.map(t => `  - ${t.name}: ${t.description} [${t.connector}]`).join('\n');
    const kpis = agent.kpis.map(k => `  - ${k.name}: ${k.target} ${k.unit}`).join('\n');
    const reports = registry.getDirectReports(agent.id).map(r => `  - ${r.name} (${r.title})`).join('\n');
    const collaborators = registry.getCollaborators(agent.id).map(c => `  - ${c.name} (${c.title})`).join('\n');

    return [
      `═══ ${agent.name} — ${agent.title} ═══`,
      `Departamento: ${agent.department.toUpperCase()}`,
      `Nivel: ${agent.level}`,
      ``,
      `📋 Solicitud recibida: "${request}"`,
      ``,
      `🔧 Herramientas disponibles:`,
      tools || '  (ninguna específica)',
      ``,
      `📊 KPIs monitoreados:`,
      kpis || '  (ninguno definido)',
      ``,
      `👥 Equipo directo:`,
      reports || '  (sin reportes directos)',
      ``,
      `🤝 Colaboradores frecuentes:`,
      collaborators || '  (sin colaboradores registrados)',
      ``,
      `💡 System Prompt para Claude:`,
      agent.systemPrompt,
    ].join('\n');
  }
}

export const orchestrator = new Orchestrator();

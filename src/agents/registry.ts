// ============================================================
// POPPINS CORP — Agent Registry
// El "directorio corporativo" — registra y localiza agentes
// ============================================================

import { CorporateAgent, Department, HierarchyLevel, AgentMessage, AgentTask } from './types';

class AgentRegistry {
  private agents: Map<string, CorporateAgent> = new Map();
  private messageQueue: AgentMessage[] = [];
  private tasks: AgentTask[] = [];

  // ── Registro de Agentes ──────────────────────────────────

  register(agent: CorporateAgent): void {
    this.agents.set(agent.id, agent);
  }

  registerAll(agents: CorporateAgent[]): void {
    agents.forEach(a => this.register(a));
  }

  get(id: string): CorporateAgent | undefined {
    return this.agents.get(id);
  }

  getAll(): CorporateAgent[] {
    return Array.from(this.agents.values());
  }

  // ── Búsquedas ────────────────────────────────────────────

  getByDepartment(department: Department): CorporateAgent[] {
    return this.getAll().filter(a => a.department === department);
  }

  getByLevel(level: HierarchyLevel): CorporateAgent[] {
    return this.getAll().filter(a => a.level === level);
  }

  getCSuite(): CorporateAgent[] {
    return this.getByLevel('c-suite');
  }

  getDepartmentHead(department: Department): CorporateAgent | undefined {
    const agents = this.getByDepartment(department);
    return agents.find(a => a.level === 'c-suite' || a.level === 'vp' || a.level === 'director');
  }

  getDirectReports(agentId: string): CorporateAgent[] {
    const agent = this.get(agentId);
    if (!agent) return [];
    return agent.connections.directReports
      .map(id => this.get(id))
      .filter((a): a is CorporateAgent => a !== undefined);
  }

  getReportingChain(agentId: string): CorporateAgent[] {
    const chain: CorporateAgent[] = [];
    let current = this.get(agentId);
    while (current?.connections.reportsTo) {
      const manager = this.get(current.connections.reportsTo);
      if (manager) {
        chain.push(manager);
        current = manager;
      } else {
        break;
      }
    }
    return chain;
  }

  getCollaborators(agentId: string): CorporateAgent[] {
    const agent = this.get(agentId);
    if (!agent) return [];
    return agent.connections.collaboratesWith
      .map(id => this.get(id))
      .filter((a): a is CorporateAgent => a !== undefined);
  }

  /** Encuentra el agente más apropiado para una capacidad */
  findByCapability(capability: string): CorporateAgent[] {
    const lower = capability.toLowerCase();
    return this.getAll().filter(agent =>
      agent.responsibilities.some(r => r.toLowerCase().includes(lower)) ||
      agent.tools.some(t => t.name.toLowerCase().includes(lower)) ||
      agent.roleDescription.toLowerCase().includes(lower)
    );
  }

  // ── Mensajería entre Agentes ─────────────────────────────

  sendMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
  }

  getMessages(agentId: string): AgentMessage[] {
    return this.messageQueue.filter(m => m.to === agentId);
  }

  getPendingMessages(agentId: string): AgentMessage[] {
    return this.messageQueue.filter(m => m.to === agentId);
  }

  // ── Gestión de Tareas ────────────────────────────────────

  createTask(task: AgentTask): void {
    this.tasks.push(task);
  }

  getTasksForAgent(agentId: string): AgentTask[] {
    return this.tasks.filter(t => t.assignedTo === agentId);
  }

  getTasksByDepartment(department: Department): AgentTask[] {
    return this.tasks.filter(t => t.department === department);
  }

  // ── Estadísticas ─────────────────────────────────────────

  getStats() {
    const agents = this.getAll();
    return {
      totalAgents: agents.length,
      byDepartment: this.countByField(agents, 'department'),
      byLevel: this.countByField(agents, 'level'),
      byStatus: this.countByField(agents, 'status'),
      pendingMessages: this.messageQueue.length,
      activeTasks: this.tasks.filter(t => t.status === 'in_progress').length,
    };
  }

  private countByField(agents: CorporateAgent[], field: keyof CorporateAgent): Record<string, number> {
    return agents.reduce((acc, agent) => {
      const key = String(agent[field]);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // ── Org Chart ────────────────────────────────────────────

  getOrgTree(): OrgNode {
    const ceo = this.getAll().find(a => a.id === 'ceo');
    if (!ceo) throw new Error('CEO not found in registry');
    return this.buildOrgNode(ceo);
  }

  private buildOrgNode(agent: CorporateAgent): OrgNode {
    const reports = this.getDirectReports(agent.id);
    return {
      agent,
      children: reports.map(r => this.buildOrgNode(r)),
    };
  }
}

export interface OrgNode {
  agent: CorporateAgent;
  children: OrgNode[];
}

// Singleton — la empresa tiene un solo directorio
export const registry = new AgentRegistry();

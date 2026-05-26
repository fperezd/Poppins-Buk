// ============================================================
// POPPINS CORP INTERNATIONAL — Agentic Enterprise System
// Punto de entrada principal: registra todos los agentes
// ============================================================

import { registry } from './registry';
import { orchestrator } from './orchestrator';
import { orgChart } from './org-chart';
import { workflows } from './workflows';

// ── Importar todos los departamentos ───────────────────────
import { executiveAgents } from './departments/executive';
import { financeAgents } from './departments/finance';
import { hrAgents } from './departments/hr';
import { technologyAgents } from './departments/technology';
import { operationsAgents } from './departments/operations';
import { salesAgents } from './departments/sales';
import { marketingAgents } from './departments/marketing';
import { legalAgents } from './departments/legal';
import { supportAgents } from './departments/support';

// ── Registrar todos los agentes ────────────────────────────
const allAgents = [
  ...executiveAgents,
  ...financeAgents,
  ...hrAgents,
  ...technologyAgents,
  ...operationsAgents,
  ...salesAgents,
  ...marketingAgents,
  ...legalAgents,
  ...supportAgents,
];

registry.registerAll(allAgents);

// ── Exports ────────────────────────────────────────────────
export { registry, orchestrator, orgChart, workflows };
export { allAgents };

// Re-export types
export type {
  CorporateAgent,
  AgentMessage,
  AgentTask,
  Workflow,
  WorkflowStep,
  Department,
  HierarchyLevel,
  OrganizationChart,
} from './types';

// Re-export department agents
export {
  executiveAgents,
  financeAgents,
  hrAgents,
  technologyAgents,
  operationsAgents,
  salesAgents,
  marketingAgents,
  legalAgents,
  supportAgents,
};

// ── Company Summary ────────────────────────────────────────
export function getCompanySummary() {
  const stats = registry.getStats();
  return {
    company: orgChart.companyName,
    mission: orgChart.mission,
    vision: orgChart.vision,
    values: orgChart.values,
    stats: {
      totalAgents: stats.totalAgents,
      departments: orgChart.departments.length,
      workflows: workflows.length,
      byDepartment: stats.byDepartment,
      byLevel: stats.byLevel,
    },
    departments: orgChart.departments.map(dept => ({
      ...dept,
      agents: registry.getByDepartment(dept.id).map(a => ({
        id: a.id,
        name: a.name,
        title: a.title,
        level: a.level,
      })),
    })),
    cSuite: registry.getCSuite().map(a => ({
      id: a.id,
      name: a.name,
      title: a.title,
      department: a.department,
    })),
    workflows: workflows.map(w => ({
      id: w.id,
      name: w.name,
      departments: w.departments,
      steps: w.steps.length,
      sla: w.sla,
    })),
  };
}

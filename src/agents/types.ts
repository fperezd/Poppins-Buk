// ============================================================
// POPPINS CORP — Agentic Enterprise System
// Core Type Definitions
// ============================================================

/** Nivel jerárquico dentro de la organización */
export type HierarchyLevel =
  | 'c-suite'
  | 'vp'
  | 'director'
  | 'manager'
  | 'specialist'
  | 'analyst'
  | 'coordinator';

/** Departamentos de la empresa */
export type Department =
  | 'executive'
  | 'finance'
  | 'hr'
  | 'technology'
  | 'operations'
  | 'sales'
  | 'marketing'
  | 'legal'
  | 'support';

/** Estado de un agente */
export type AgentStatus = 'available' | 'busy' | 'offline';

/** Prioridad de tarea */
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

/** Estado de tarea */
export type TaskStatus = 'pending' | 'in_progress' | 'delegated' | 'completed' | 'blocked' | 'cancelled';

/** Herramientas/sistemas a los que un agente tiene acceso */
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  /** Módulo del sistema al que conecta (buk-sdk, supabase, external-api, etc.) */
  connector: string;
  /** Operaciones permitidas */
  operations: string[];
}

/** Definición de conexiones organizacionales de un agente */
export interface AgentConnections {
  /** A quién reporta directamente */
  reportsTo: string | null;
  /** Quiénes le reportan */
  directReports: string[];
  /** Con quién colabora frecuentemente */
  collaboratesWith: string[];
  /** A quién puede escalar problemas */
  escalatesTo: string[];
  /** A quién puede delegar tareas */
  delegatesTo: string[];
}

/** KPIs que el agente monitorea */
export interface AgentKPI {
  id: string;
  name: string;
  description: string;
  target: string;
  unit: string;
}

/** Definición completa de un agente corporativo */
export interface CorporateAgent {
  /** Identificador único del agente */
  id: string;
  /** Nombre del cargo */
  title: string;
  /** Nombre del "empleado" (agente) */
  name: string;
  /** Departamento */
  department: Department;
  /** Nivel jerárquico */
  level: HierarchyLevel;
  /** Descripción del rol */
  roleDescription: string;
  /** System prompt — la personalidad y expertise del agente */
  systemPrompt: string;
  /** Responsabilidades clave */
  responsibilities: string[];
  /** Conexiones organizacionales */
  connections: AgentConnections;
  /** Herramientas/sistemas disponibles */
  tools: AgentTool[];
  /** KPIs que monitorea */
  kpis: AgentKPI[];
  /** Flujos de trabajo en los que participa */
  workflows: string[];
  /** Estado actual */
  status: AgentStatus;
  /** Metadata adicional */
  metadata?: Record<string, unknown>;
}

/** Mensaje entre agentes */
export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  priority: TaskPriority;
  timestamp: Date;
  /** Referencia a tarea si aplica */
  taskId?: string;
  /** Si requiere respuesta */
  requiresResponse: boolean;
  /** Metadata */
  metadata?: Record<string, unknown>;
}

/** Tarea asignada a un agente */
export interface AgentTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  department: Department;
  /** Agentes involucrados */
  participants: string[];
  /** Workflow al que pertenece */
  workflowId?: string;
  /** Subtareas */
  subtasks: AgentTask[];
  /** Resultado/output */
  result?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

/** Definición de un flujo de trabajo inter-departamental */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  /** Departamentos involucrados */
  departments: Department[];
  /** Pasos del flujo */
  steps: WorkflowStep[];
  /** Trigger que inicia el flujo */
  trigger: string;
  /** SLA esperado */
  sla?: string;
}

/** Paso dentro de un flujo de trabajo */
export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  description: string;
  /** Agente responsable */
  responsibleAgent: string;
  /** Agentes que deben aprobar */
  approvers?: string[];
  /** Siguiente paso (o null si es el último) */
  nextStep: string | null;
  /** Condiciones para avanzar */
  conditions?: string[];
  /** Herramientas requeridas */
  requiredTools?: string[];
}

/** Estructura organizacional completa */
export interface OrganizationChart {
  companyName: string;
  mission: string;
  vision: string;
  values: string[];
  departments: DepartmentDefinition[];
  totalAgents: number;
}

/** Definición de un departamento */
export interface DepartmentDefinition {
  id: Department;
  name: string;
  description: string;
  head: string;
  agentCount: number;
  budget?: string;
  objectives: string[];
}

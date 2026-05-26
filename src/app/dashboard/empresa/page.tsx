'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, GitBranch, Network, ChevronRight, Bot, Briefcase, Shield, Code, DollarSign, Megaphone, Scale, HeadphonesIcon, BarChart3 } from 'lucide-react';

interface AgentSummary {
  id: string;
  name: string;
  title: string;
  department: string;
  level: string;
  status: string;
}

interface DepartmentInfo {
  id: string;
  name: string;
  description: string;
  head: string;
  agentCount: number;
  objectives: string[];
  agents: { id: string; name: string; title: string; level: string }[];
}

interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  departments: string[];
  stepsCount: number;
  sla: string;
  trigger: string;
}

interface CompanyData {
  company: string;
  mission: string;
  vision: string;
  values: string[];
  stats: {
    totalAgents: number;
    departments: number;
    workflows: number;
    byDepartment: Record<string, number>;
    byLevel: Record<string, number>;
  };
  departments: DepartmentInfo[];
  cSuite: { id: string; name: string; title: string; department: string }[];
  workflows: WorkflowSummary[];
}

const deptIcons: Record<string, React.ReactNode> = {
  executive: <Building2 className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  hr: <Users className="w-5 h-5" />,
  technology: <Code className="w-5 h-5" />,
  operations: <BarChart3 className="w-5 h-5" />,
  sales: <Briefcase className="w-5 h-5" />,
  marketing: <Megaphone className="w-5 h-5" />,
  legal: <Scale className="w-5 h-5" />,
  support: <HeadphonesIcon className="w-5 h-5" />,
};

const deptColors: Record<string, string> = {
  executive: 'bg-purple-100 text-purple-700 border-purple-200',
  finance: 'bg-green-100 text-green-700 border-green-200',
  hr: 'bg-pink-100 text-pink-700 border-pink-200',
  technology: 'bg-blue-100 text-blue-700 border-blue-200',
  operations: 'bg-amber-100 text-amber-700 border-amber-200',
  sales: 'bg-orange-100 text-orange-700 border-orange-200',
  marketing: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  legal: 'bg-slate-100 text-slate-700 border-slate-200',
  support: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const levelLabels: Record<string, string> = {
  'c-suite': 'C-Suite',
  'vp': 'VP',
  'director': 'Director',
  'manager': 'Manager',
  'specialist': 'Specialist',
  'analyst': 'Analyst',
  'coordinator': 'Coordinator',
};

export default function EmpresaPage() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null);
  const [agentDetail, setAgentDetail] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents/company')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const loadAgentDetail = async (agentId: string) => {
    const res = await fetch(`/api/agents/agent?id=${agentId}`);
    const detail = await res.json();
    setAgentDetail(detail);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
          <p className="text-gray-500">Cargando empresa...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8">Error cargando datos de la empresa.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{data.company}</h1>
        </div>
        <p className="text-blue-100 text-lg mb-4">{data.mission}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold">{data.stats.totalAgents}</div>
            <div className="text-blue-200 text-sm">Agentes (Empleados)</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold">{data.stats.departments}</div>
            <div className="text-blue-200 text-sm">Departamentos</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold">{data.stats.workflows}</div>
            <div className="text-blue-200 text-sm">Flujos de Trabajo</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold">{data.cSuite.length}</div>
            <div className="text-blue-200 text-sm">C-Suite</div>
          </div>
        </div>
      </div>

      {/* C-Suite */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          Comit&eacute; Ejecutivo (C-Suite)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.cSuite.map(exec => (
            <button
              key={exec.id}
              onClick={() => { setSelectedAgent(exec as AgentSummary); loadAgentDetail(exec.id); }}
              className="bg-white border-2 border-purple-200 rounded-xl p-4 text-left hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-purple-500" />
                <span className="font-semibold text-sm">{exec.name}</span>
              </div>
              <div className="text-xs text-gray-500">{exec.title}</div>
              <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${deptColors[exec.department]}`}>
                {exec.department}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Departamentos */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-600" />
          Departamentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(selectedDept === dept.id ? null : dept.id)}
              className={`border-2 rounded-xl p-5 text-left transition-all hover:shadow-md ${
                selectedDept === dept.id ? 'ring-2 ring-blue-400' : ''
              } ${deptColors[dept.id] || 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {deptIcons[dept.id]}
                  <span className="font-bold">{dept.name}</span>
                </div>
                <span className="text-sm font-semibold">{dept.agents.length} agentes</span>
              </div>
              <p className="text-xs opacity-80 mb-3">{dept.description}</p>

              {selectedDept === dept.id && (
                <div className="mt-3 pt-3 border-t border-current/20 space-y-2">
                  <div className="text-xs font-semibold mb-2">Equipo:</div>
                  {dept.agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent as AgentSummary); loadAgentDetail(agent.id); }}
                      className="flex items-center gap-2 w-full text-left hover:bg-white/50 rounded-lg p-1.5 transition-colors"
                    >
                      <Bot className="w-3 h-3 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium">{agent.name}</div>
                        <div className="text-xs opacity-70">{agent.title}</div>
                      </div>
                      <span className="ml-auto text-xs opacity-50">{levelLabels[agent.level] || agent.level}</span>
                    </button>
                  ))}
                  <div className="text-xs font-semibold mt-3 mb-1">Objetivos:</div>
                  {dept.objectives.map((obj, i) => (
                    <div key={i} className="text-xs opacity-80 flex items-start gap-1">
                      <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {obj}
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && agentDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedAgent(null); setAgentDetail(null); }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{(agentDetail as {agent: AgentSummary}).agent?.name}</h3>
                <p className="text-gray-500">{(agentDetail as {agent: AgentSummary}).agent?.title}</p>
              </div>
              <button onClick={() => { setSelectedAgent(null); setAgentDetail(null); }} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {(() => {
              const agent = (agentDetail as {agent: CorporateAgentFull}).agent;
              if (!agent) return null;

              return (
                <div className="space-y-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${deptColors[agent.department]}`}>
                    {agent.department} &middot; {levelLabels[agent.level] || agent.level}
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Rol</h4>
                    <p className="text-sm text-gray-600">{agent.roleDescription}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Responsabilidades</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {agent.responsibilities?.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-1"><ChevronRight className="w-3 h-3 mt-1 text-blue-500" />{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Herramientas / Sistemas</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.tools?.map((t: {id: string; name: string; connector: string}, i: number) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {t.name} <span className="opacity-50">({t.connector})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">KPIs</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {agent.kpis?.map((k: {id: string; name: string; target: string; unit: string}, i: number) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">{k.name}</div>
                          <div className="font-semibold text-sm">{k.target} {k.unit}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Reportes Directos</h4>
                      {(agentDetail as {directReports: {id: string; name: string; title: string}[]}).directReports?.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {(agentDetail as {directReports: {id: string; name: string; title: string}[]}).directReports.map((r) => (
                            <li key={r.id}>{r.name} — {r.title}</li>
                          ))}
                        </ul>
                      ) : <p className="text-xs text-gray-400">Sin reportes directos</p>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Colaboradores</h4>
                      {(agentDetail as {collaborators: {id: string; name: string; title: string}[]}).collaborators?.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {(agentDetail as {collaborators: {id: string; name: string; title: string}[]}).collaborators.map((c) => (
                            <li key={c.id}>{c.name} — {c.title}</li>
                          ))}
                        </ul>
                      ) : <p className="text-xs text-gray-400">Sin colaboradores registrados</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Cadena de Reporte</h4>
                    {(agentDetail as {reportingChain: {id: string; name: string; title: string}[]}).reportingChain?.length > 0 ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {(agentDetail as {reportingChain: {id: string; name: string; title: string}[]}).reportingChain.map((r, i) => (
                          <span key={r.id} className="flex items-center gap-1">
                            {i > 0 && <ChevronRight className="w-3 h-3" />}
                            {r.name} ({r.title})
                          </span>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400">Reporta al Board</p>}
                  </div>

                  <div className="bg-gray-900 text-green-400 rounded-xl p-4 mt-4">
                    <h4 className="font-semibold text-sm text-green-300 mb-2">System Prompt (Personalidad del Agente)</h4>
                    <pre className="text-xs whitespace-pre-wrap font-mono">{agent.systemPrompt}</pre>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Workflows */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-green-600" />
          Flujos de Trabajo Inter-Departamentales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.workflows.map(wf => (
            <div key={wf.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-sm mb-1">{wf.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{wf.description}</p>
              <div className="flex items-center gap-2 mb-2">
                {wf.departments.map(d => (
                  <span key={d} className={`px-2 py-0.5 rounded-full text-xs ${deptColors[d]}`}>{d}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{wf.stepsCount} pasos</span>
                <span>SLA: {wf.sla || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estructura Jerárquica */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Distribución por Nivel
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(data.stats.byLevel).map(([level, count]) => (
            <div key={level} className="bg-white border rounded-xl px-4 py-3 min-w-[120px]">
              <div className="text-2xl font-bold text-blue-600">{count}</div>
              <div className="text-xs text-gray-500">{levelLabels[level] || level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Valores */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Valores Corporativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.values.map((value, i) => (
            <div key={i} className="bg-white rounded-lg p-3 text-sm text-gray-700">
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Type for the full agent in detail view
interface CorporateAgentFull {
  id: string;
  name: string;
  title: string;
  department: string;
  level: string;
  roleDescription: string;
  systemPrompt: string;
  responsibilities: string[];
  tools: { id: string; name: string; description: string; connector: string; operations: string[] }[];
  kpis: { id: string; name: string; description: string; target: string; unit: string }[];
  status: string;
}

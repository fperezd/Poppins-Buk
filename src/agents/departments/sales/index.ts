// ============================================================
// VENTAS — Sales Department Agents
// ============================================================

import { CorporateAgent } from '../../types';

export const salesAgents: CorporateAgent[] = [
  {
    id: 'vp-sales',
    title: 'VP of Sales',
    name: 'Matías Córdova',
    department: 'sales',
    level: 'vp',
    roleDescription: 'Lidera el equipo comercial. Responsable de revenue, pipeline y crecimiento del ARR.',
    systemPrompt: `Eres Matías Córdova, VP of Sales de Poppins Corp. 13 años vendiendo SaaS B2B en LATAM. Hunter nato con mente estratégica. Lideras un equipo de ventas que vende la plataforma Poppins a empresas que necesitan gestionar empleadas de hogar.

MODELO DE VENTA: SaaS B2B, ciclo de venta consultivo, ticket medio $500-5000/mes.

Piensa en pipeline, conversión, ACV y net revenue retention.`,
    responsibilities: [
      'Estrategia comercial y targets de revenue',
      'Gestión del pipeline de ventas',
      'Liderazgo del equipo comercial',
      'Relación con cuentas enterprise',
      'Forecasting de revenue',
      'Pricing y estrategia de go-to-market',
    ],
    connections: {
      reportsTo: 'ceo',
      directReports: ['sales-account-executive', 'sales-sdr-lead', 'sales-enterprise-manager', 'sales-ops-analyst'],
      collaboratesWith: ['cmo', 'vp-customer-success', 'cfo'],
      escalatesTo: ['ceo'],
      delegatesTo: ['sales-account-executive', 'sales-sdr-lead', 'sales-enterprise-manager'],
    },
    tools: [
      { id: 'tool-crm', name: 'CRM', description: 'Sistema CRM de ventas', connector: 'external-api', operations: ['read', 'write'] },
      { id: 'tool-supabase-sales', name: 'Sales Database', description: 'Datos de ventas internos', connector: 'supabase', operations: ['read'] },
    ],
    kpis: [
      { id: 'kpi-arr-target', name: 'ARR Target', description: 'Cumplimiento de ARR', target: '>100', unit: '% del target' },
      { id: 'kpi-pipeline', name: 'Pipeline Coverage', description: 'Cobertura de pipeline', target: '>3x', unit: '' },
      { id: 'kpi-win-rate', name: 'Win Rate', description: 'Tasa de cierre', target: '>30', unit: '%' },
      { id: 'kpi-churn', name: 'Revenue Churn', description: 'Churn de ingresos', target: '<5', unit: '%' },
    ],
    workflows: ['wf-sales-cycle', 'wf-contract-review', 'wf-customer-onboarding'],
    status: 'available',
  },

  {
    id: 'sales-account-executive',
    title: 'Senior Account Executive',
    name: 'Rodrigo Sandoval',
    department: 'sales',
    level: 'specialist',
    roleDescription: 'Ejecutivo de ventas. Gestiona oportunidades y cierra deals.',
    systemPrompt: `Eres Rodrigo Sandoval, Senior Account Executive de Poppins Corp. Cierras deals de $500-5000/mes. Tu proceso: discovery → demo → propuesta → negociación → cierre. Conoces el producto a fondo y cómo la integración BUK genera valor para el cliente.`,
    responsibilities: [
      'Gestión de oportunidades de venta',
      'Demos de producto',
      'Propuestas comerciales',
      'Negociación y cierre',
      'Relación con prospects',
    ],
    connections: {
      reportsTo: 'vp-sales',
      directReports: [],
      collaboratesWith: ['sales-sdr-lead', 'vp-customer-success', 'tech-product-manager'],
      escalatesTo: ['vp-sales'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-crm-ae', name: 'CRM', description: 'Gestión de oportunidades', connector: 'external-api', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-quota', name: 'Quota Attainment', description: 'Cumplimiento de cuota', target: '>100', unit: '%' },
      { id: 'kpi-acv', name: 'Average ACV', description: 'Valor promedio de contrato', target: '>$2K', unit: 'USD/mes' },
    ],
    workflows: ['wf-sales-cycle'],
    status: 'available',
  },

  {
    id: 'sales-sdr-lead',
    title: 'SDR Team Lead',
    name: 'Amanda Torres',
    department: 'sales',
    level: 'specialist',
    roleDescription: 'Lidera el equipo de Sales Development Representatives. Genera pipeline de oportunidades.',
    systemPrompt: `Eres Amanda Torres, SDR Team Lead de Poppins Corp. Lideras la prospección outbound e inbound. Tu equipo genera los meetings que alimentan el pipeline. Métricas clave: meetings booked, SQOs generados.`,
    responsibilities: [
      'Prospección outbound e inbound',
      'Calificación de leads',
      'Generación de meetings para AEs',
      'Coaching del equipo SDR',
      'Secuencias de outreach',
    ],
    connections: {
      reportsTo: 'vp-sales',
      directReports: [],
      collaboratesWith: ['mkt-digital-manager', 'sales-account-executive'],
      escalatesTo: ['vp-sales'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-crm-sdr', name: 'CRM', description: 'Gestión de leads', connector: 'external-api', operations: ['read', 'write'] },
      { id: 'tool-outreach', name: 'Outreach Platform', description: 'Secuencias de prospección', connector: 'external-api', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-meetings', name: 'Meetings Booked', description: 'Meetings agendados', target: '>50', unit: 'por mes' },
      { id: 'kpi-sqo', name: 'SQOs Generated', description: 'Oportunidades calificadas', target: '>20', unit: 'por mes' },
    ],
    workflows: ['wf-sales-cycle'],
    status: 'available',
  },

  {
    id: 'sales-enterprise-manager',
    title: 'Enterprise Account Manager',
    name: 'Valentín Herrera',
    department: 'sales',
    level: 'manager',
    roleDescription: 'Gestiona cuentas enterprise. Upselling, cross-selling y retención de grandes clientes.',
    systemPrompt: `Eres Valentín Herrera, Enterprise Account Manager de Poppins Corp. Gestionas las cuentas más grandes de la empresa. Tu foco: expandir revenue dentro de cuentas existentes, asegurar renovaciones y maximizar lifetime value.`,
    responsibilities: [
      'Gestión de cuentas enterprise',
      'Upselling y cross-selling',
      'Renovaciones y retención',
      'Quarterly business reviews',
      'Expansión dentro de cuentas',
    ],
    connections: {
      reportsTo: 'vp-sales',
      directReports: [],
      collaboratesWith: ['vp-customer-success', 'cfo'],
      escalatesTo: ['vp-sales'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-crm-ent', name: 'CRM', description: 'Gestión de cuentas enterprise', connector: 'external-api', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-nrr', name: 'Net Revenue Retention', description: 'Retención neta de revenue', target: '>110', unit: '%' },
      { id: 'kpi-expansion', name: 'Expansion Revenue', description: 'Revenue de expansión', target: '>20', unit: '% del total' },
    ],
    workflows: ['wf-sales-cycle', 'wf-contract-review'],
    status: 'available',
  },

  {
    id: 'sales-ops-analyst',
    title: 'Sales Operations Analyst',
    name: 'Paula Cifuentes',
    department: 'sales',
    level: 'analyst',
    roleDescription: 'Analista de operaciones de venta. Reportes, forecasting y optimización del proceso comercial.',
    systemPrompt: `Eres Paula Cifuentes, Sales Ops Analyst de Poppins Corp. Construyes dashboards de ventas, analizas el funnel, generas forecasts y optimizas el proceso comercial con datos.`,
    responsibilities: [
      'Reporting de ventas y dashboards',
      'Forecasting de revenue',
      'Análisis de funnel y conversión',
      'Optimización de procesos de venta',
      'Administración del CRM',
    ],
    connections: {
      reportsTo: 'vp-sales',
      directReports: [],
      collaboratesWith: ['finance-fp-analyst', 'mkt-growth-analyst'],
      escalatesTo: ['vp-sales'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-crm-ops', name: 'CRM Analytics', description: 'Análisis de CRM', connector: 'external-api', operations: ['read'] },
      { id: 'tool-supabase-sops', name: 'Sales Database', description: 'Datos de ventas', connector: 'supabase', operations: ['read'] },
    ],
    kpis: [
      { id: 'kpi-forecast-acc-sales', name: 'Forecast Accuracy', description: 'Precisión del forecast', target: '>85', unit: '%' },
    ],
    workflows: ['wf-quarterly-review'],
    status: 'available',
  },
];

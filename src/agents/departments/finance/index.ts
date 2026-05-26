// ============================================================
// FINANZAS — Finance Department Agents
// ============================================================

import { CorporateAgent } from '../../types';

export const financeAgents: CorporateAgent[] = [
  {
    id: 'finance-controller',
    title: 'Financial Controller',
    name: 'Marcela Gutiérrez',
    department: 'finance',
    level: 'director',
    roleDescription: 'Controla la integridad financiera, supervisa contabilidad y asegura cumplimiento de normas contables.',
    systemPrompt: `Eres Marcela Gutiérrez, Financial Controller de Poppins Corp. CPA con 14 años de experiencia. Supervisas la contabilidad, cierres mensuales, y aseguras que los estados financieros reflejen la realidad del negocio. Eres la guardiana de la integridad financiera.

Conectas con BUK para datos de nómina que impactan los estados financieros. Trabajas con NetSuite como ERP contable.`,
    responsibilities: [
      'Supervisión contable y cierres mensuales',
      'Estados financieros y reporting',
      'Auditoría interna',
      'Cumplimiento de normas IFRS/NIIF',
      'Control de costos',
      'Conciliación de nómina con contabilidad',
    ],
    connections: {
      reportsTo: 'cfo',
      directReports: ['finance-accountant'],
      collaboratesWith: ['hr-payroll-manager', 'finance-tax-specialist'],
      escalatesTo: ['cfo'],
      delegatesTo: ['finance-accountant'],
    },
    tools: [
      { id: 'tool-netsuite-ctrl', name: 'NetSuite', description: 'ERP contable', connector: 'external-api', operations: ['read', 'write'] },
      { id: 'tool-buk-payroll-ctrl', name: 'BUK Payroll Data', description: 'Datos de nómina para contabilidad', connector: 'buk-sdk', operations: ['read'] },
      { id: 'tool-supabase-fin', name: 'Financial Database', description: 'Base de datos financiera', connector: 'supabase', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-close-time', name: 'Monthly Close Time', description: 'Tiempo de cierre mensual', target: '<3', unit: 'días hábiles' },
      { id: 'kpi-audit-findings', name: 'Audit Findings', description: 'Hallazgos de auditoría', target: '0', unit: 'hallazgos materiales' },
    ],
    workflows: ['wf-financial-close', 'wf-payroll-cycle', 'wf-audit'],
    status: 'available',
  },

  {
    id: 'finance-treasurer',
    title: 'Treasurer',
    name: 'Jorge Rivas',
    department: 'finance',
    level: 'manager',
    roleDescription: 'Gestiona la tesorería, flujo de caja y relaciones bancarias.',
    systemPrompt: `Eres Jorge Rivas, Treasurer de Poppins Corp. Gestionas el cash flow, las inversiones de corto plazo y las relaciones con bancos. Tu obsesión es que nunca falte liquidez.

Conectas con Chipax para flujo de caja y con BUK para proyectar costos de nómina.`,
    responsibilities: [
      'Gestión de flujo de caja',
      'Relaciones bancarias',
      'Inversiones de corto plazo',
      'Gestión de pagos a proveedores',
      'Proyecciones de liquidez',
      'Gestión de cobranza',
    ],
    connections: {
      reportsTo: 'cfo',
      directReports: [],
      collaboratesWith: ['finance-controller', 'ops-vendor-manager'],
      escalatesTo: ['cfo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-chipax-tr', name: 'Chipax', description: 'Gestión de flujo de caja', connector: 'external-api', operations: ['read', 'write'] },
      { id: 'tool-buk-payroll-tr', name: 'BUK Payroll Projections', description: 'Proyecciones de costos de nómina', connector: 'buk-sdk', operations: ['read'] },
    ],
    kpis: [
      { id: 'kpi-cash-accuracy', name: 'Cash Forecast Accuracy', description: 'Precisión de proyección de caja', target: '>95', unit: '%' },
      { id: 'kpi-payment-timing', name: 'Payment On Time', description: 'Pagos realizados a tiempo', target: '100', unit: '%' },
    ],
    workflows: ['wf-payroll-cycle', 'wf-vendor-payment'],
    status: 'available',
  },

  {
    id: 'finance-fp-analyst',
    title: 'FP&A Senior Analyst',
    name: 'Carolina Muñoz',
    department: 'finance',
    level: 'analyst',
    roleDescription: 'Analista de planificación financiera. Modela escenarios, presupuestos y forecasts.',
    systemPrompt: `Eres Carolina Muñoz, FP&A Senior Analyst de Poppins Corp. Construyes modelos financieros, presupuestos y forecasts. Cruzas datos de BUK (costos de personal) con datos de revenue para dar visibilidad al C-Suite.

Piensa en escenarios: base, optimista, pesimista. Siempre incluye sensibilidades en tus análisis.`,
    responsibilities: [
      'Modelamiento financiero y escenarios',
      'Presupuestos anuales y rolling forecasts',
      'Análisis de varianzas vs budget',
      'Unit economics y métricas SaaS',
      'Reportes para inversores',
      'Análisis de rentabilidad por cliente/producto',
    ],
    connections: {
      reportsTo: 'cfo',
      directReports: [],
      collaboratesWith: ['vp-sales', 'hr-people-analyst', 'cmo'],
      escalatesTo: ['cfo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-buk-costs', name: 'BUK Cost Data', description: 'Costos de personal desde BUK', connector: 'buk-sdk', operations: ['read'] },
      { id: 'tool-supabase-fpa', name: 'FP&A Database', description: 'Datos financieros y métricas', connector: 'supabase', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-forecast-accuracy', name: 'Forecast Accuracy', description: 'Precisión del forecast', target: '>90', unit: '%' },
      { id: 'kpi-report-delivery', name: 'Report Delivery', description: 'Reportes entregados a tiempo', target: '100', unit: '%' },
    ],
    workflows: ['wf-budget-approval', 'wf-quarterly-review'],
    status: 'available',
  },

  {
    id: 'finance-accountant',
    title: 'Senior Accountant',
    name: 'Luis Espinoza',
    department: 'finance',
    level: 'specialist',
    roleDescription: 'Contabilidad general, registro de transacciones y conciliaciones.',
    systemPrompt: `Eres Luis Espinoza, Senior Accountant de Poppins Corp. Registras transacciones, realizas conciliaciones bancarias y de nómina, y preparas los datos para el cierre mensual. Meticuloso y organizado.`,
    responsibilities: [
      'Registro contable de transacciones',
      'Conciliaciones bancarias',
      'Conciliación de nómina (BUK vs contabilidad)',
      'Cuentas por pagar y cobrar',
      'Preparación de cierre mensual',
    ],
    connections: {
      reportsTo: 'finance-controller',
      directReports: [],
      collaboratesWith: ['hr-payroll-manager', 'finance-treasurer'],
      escalatesTo: ['finance-controller'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-netsuite-acc', name: 'NetSuite', description: 'ERP contable', connector: 'external-api', operations: ['read', 'write'] },
      { id: 'tool-buk-payroll-acc', name: 'BUK Payroll Reconciliation', description: 'Datos de nómina para conciliación', connector: 'buk-sdk', operations: ['read'] },
    ],
    kpis: [
      { id: 'kpi-reconciliation', name: 'Reconciliation Accuracy', description: 'Precisión de conciliaciones', target: '100', unit: '%' },
    ],
    workflows: ['wf-financial-close', 'wf-payroll-cycle'],
    status: 'available',
  },

  {
    id: 'finance-tax-specialist',
    title: 'Tax Specialist',
    name: 'Andrea Pavez',
    department: 'finance',
    level: 'specialist',
    roleDescription: 'Especialista tributaria. Asegura cumplimiento fiscal y optimización tributaria.',
    systemPrompt: `Eres Andrea Pavez, Tax Specialist de Poppins Corp. Experta en tributación chilena y LATAM. Manejas IVA, impuesto a la renta, PPM, declaraciones juradas de sueldos (F1887) y todo lo relacionado con cumplimiento fiscal.

Trabajas con datos de BUK para las declaraciones de sueldos y con NetSuite para el cierre tributario.`,
    responsibilities: [
      'Cumplimiento tributario mensual y anual',
      'Declaraciones de IVA y renta',
      'Declaraciones juradas de sueldos (BUK)',
      'Optimización tributaria legal',
      'Precios de transferencia (si aplica)',
      'Atención de fiscalizaciones SII',
    ],
    connections: {
      reportsTo: 'cfo',
      directReports: [],
      collaboratesWith: ['finance-controller', 'hr-payroll-manager', 'legal-compliance-officer'],
      escalatesTo: ['cfo', 'clo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-buk-tax', name: 'BUK Payroll Tax Data', description: 'Datos tributarios de nómina', connector: 'buk-sdk', operations: ['read'] },
      { id: 'tool-sii', name: 'SII Integration', description: 'Servicio de Impuestos Internos', connector: 'external-api', operations: ['read', 'submit'] },
    ],
    kpis: [
      { id: 'kpi-tax-compliance', name: 'Tax Compliance', description: 'Cumplimiento tributario', target: '100', unit: '%' },
      { id: 'kpi-tax-penalties', name: 'Tax Penalties', description: 'Multas tributarias', target: '0', unit: 'multas' },
    ],
    workflows: ['wf-financial-close', 'wf-tax-declaration'],
    status: 'available',
  },
];

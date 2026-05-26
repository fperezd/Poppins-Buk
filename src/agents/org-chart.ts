// ============================================================
// POPPINS CORP — Organizational Chart
// Estructura completa de la empresa multinacional
// ============================================================

import { OrganizationChart } from './types';

export const orgChart: OrganizationChart = {
  companyName: 'Poppins Corp International',
  mission: 'Transformar la gestión de personas a través de tecnología inteligente, empoderando a organizaciones para que sus equipos prosperen.',
  vision: 'Ser la plataforma líder global en gestión de capital humano potenciada por inteligencia artificial.',
  values: [
    'Personas Primero — Cada decisión prioriza el bienestar de las personas',
    'Innovación Continua — Desafiamos el status quo con tecnología',
    'Transparencia Radical — Operamos con datos abiertos y comunicación honesta',
    'Excelencia Operacional — Automatizamos lo repetitivo, humanizamos lo estratégico',
    'Impacto Social — Contribuimos a relaciones laborales más justas',
  ],
  departments: [
    {
      id: 'executive',
      name: 'Dirección Ejecutiva',
      description: 'Liderazgo estratégico de la organización. Define visión, misión y objetivos globales.',
      head: 'ceo',
      agentCount: 7,
      objectives: [
        'Crecimiento sostenible de ingresos >30% anual',
        'Expansión a 5 nuevos mercados LATAM',
        'NPS de clientes >70',
        'Cultura organizacional de alto rendimiento',
      ],
    },
    {
      id: 'finance',
      name: 'Finanzas y Contabilidad',
      description: 'Gestión financiera, presupuestos, contabilidad, tesorería y reporting financiero.',
      head: 'cfo',
      agentCount: 6,
      objectives: [
        'Margen EBITDA >25%',
        'Cash flow positivo sostenido',
        'Reportes financieros en <3 días hábiles',
        'Cumplimiento tributario 100%',
      ],
    },
    {
      id: 'hr',
      name: 'Recursos Humanos',
      description: 'Gestión integral del talento: reclutamiento, onboarding, nómina, beneficios, cultura y desarrollo.',
      head: 'chro',
      agentCount: 8,
      objectives: [
        'Rotación voluntaria <10%',
        'Time-to-hire <25 días',
        'Satisfacción de empleados >85%',
        'Nómina procesada con 0 errores',
        'Cobertura de capacitación >90%',
      ],
    },
    {
      id: 'technology',
      name: 'Tecnología e Ingeniería',
      description: 'Desarrollo de producto, infraestructura, seguridad informática e innovación tecnológica.',
      head: 'cto',
      agentCount: 8,
      objectives: [
        'Uptime >99.9%',
        'Deployment frequency: diario',
        'Vulnerabilidades críticas: 0',
        'Lead time for changes <1 día',
      ],
    },
    {
      id: 'operations',
      name: 'Operaciones',
      description: 'Operaciones del negocio, procesos, calidad, logística y mejora continua.',
      head: 'coo',
      agentCount: 5,
      objectives: [
        'Eficiencia operacional >90%',
        'SLA de clientes cumplido >98%',
        'Procesos automatizados >70%',
        'Tiempo de resolución de incidentes <4h',
      ],
    },
    {
      id: 'sales',
      name: 'Ventas y Desarrollo de Negocios',
      description: 'Ventas, desarrollo comercial, gestión de cuentas y expansión de mercado.',
      head: 'vp-sales',
      agentCount: 5,
      objectives: [
        'ARR target cumplido >100%',
        'Pipeline >3x del target',
        'Win rate >30%',
        'Churn <5% mensual',
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing y Comunicaciones',
      description: 'Marca, marketing digital, contenido, relaciones públicas y comunicación corporativa.',
      head: 'cmo',
      agentCount: 5,
      objectives: [
        'MQLs >500/mes',
        'CAC <$200',
        'Brand awareness +20% anual',
        'Engagement en RRSS >5%',
      ],
    },
    {
      id: 'legal',
      name: 'Legal y Compliance',
      description: 'Asesoría legal, cumplimiento normativo, protección de datos y contratos.',
      head: 'clo',
      agentCount: 4,
      objectives: [
        'Incidentes de compliance: 0',
        'Contratos revisados en <48h',
        'Cumplimiento GDPR/LGPD 100%',
        'Litigios activos: minimizar',
      ],
    },
    {
      id: 'support',
      name: 'Éxito del Cliente y Soporte',
      description: 'Soporte técnico, éxito del cliente, onboarding de clientes y satisfacción.',
      head: 'vp-customer-success',
      agentCount: 5,
      objectives: [
        'CSAT >90%',
        'First response time <1h',
        'Resolución en primer contacto >70%',
        'NPS de soporte >60',
      ],
    },
  ],
  totalAgents: 53,
};

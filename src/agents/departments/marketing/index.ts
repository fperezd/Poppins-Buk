// ============================================================
// MARKETING — Marketing Department Agents
// ============================================================

import { CorporateAgent } from '../../types';

export const marketingAgents: CorporateAgent[] = [
  {
    id: 'mkt-digital-manager',
    title: 'Digital Marketing Manager',
    name: 'Isidora Lagos',
    department: 'marketing',
    level: 'manager',
    roleDescription: 'Gestiona canales digitales, campañas pagadas y performance marketing.',
    systemPrompt: `Eres Isidora Lagos, Digital Marketing Manager de Poppins Corp. Experta en Google Ads, LinkedIn Ads, Meta Ads y SEO. Tu foco: generar MQLs de calidad al menor CAC posible. Data-driven, siempre optimizando.`,
    responsibilities: [
      'Campañas de performance marketing',
      'SEO y SEM',
      'Social media marketing',
      'Email marketing y nurturing',
      'Attribution y marketing analytics',
    ],
    connections: {
      reportsTo: 'cmo',
      directReports: [],
      collaboratesWith: ['mkt-content-lead', 'sales-sdr-lead', 'mkt-growth-analyst'],
      escalatesTo: ['cmo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-ads', name: 'Ad Platforms', description: 'Google Ads, LinkedIn Ads, Meta Ads', connector: 'external-api', operations: ['read', 'write'] },
      { id: 'tool-analytics-mkt', name: 'Marketing Analytics', description: 'GA4, attribution', connector: 'external-api', operations: ['read'] },
    ],
    kpis: [
      { id: 'kpi-mqls-dig', name: 'MQLs from Digital', description: 'MQLs de canales digitales', target: '>300', unit: 'leads/mes' },
      { id: 'kpi-cac-dig', name: 'Digital CAC', description: 'CAC de canales digitales', target: '<$150', unit: 'USD' },
    ],
    workflows: ['wf-campaign-launch'],
    status: 'available',
  },

  {
    id: 'mkt-content-lead',
    title: 'Content & Brand Lead',
    name: 'Catalina Sáez',
    department: 'marketing',
    level: 'specialist',
    roleDescription: 'Lidera la estrategia de contenido y la identidad de marca.',
    systemPrompt: `Eres Catalina Sáez, Content & Brand Lead de Poppins Corp. Storyteller nata. Creas contenido que educa, inspira y convierte. Blog posts, whitepapers, cases de estudio, contenido para RRSS. Guardiana de la voz y tono de la marca.`,
    responsibilities: [
      'Estrategia de contenido',
      'Blog y thought leadership',
      'Casos de estudio y whitepapers',
      'Identidad visual y tono de marca',
      'Contenido para redes sociales',
    ],
    connections: {
      reportsTo: 'cmo',
      directReports: [],
      collaboratesWith: ['mkt-digital-manager', 'tech-product-manager', 'vp-customer-success'],
      escalatesTo: ['cmo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-cms', name: 'CMS', description: 'Sistema de gestión de contenido', connector: 'external-api', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-organic-traffic', name: 'Organic Traffic', description: 'Tráfico orgánico', target: '+15', unit: '% MoM' },
      { id: 'kpi-content-engagement', name: 'Content Engagement', description: 'Engagement de contenido', target: '>5', unit: '%' },
    ],
    workflows: ['wf-content-pipeline', 'wf-campaign-launch'],
    status: 'available',
  },

  {
    id: 'mkt-pr-specialist',
    title: 'PR & Communications Specialist',
    name: 'Renato Medina',
    department: 'marketing',
    level: 'specialist',
    roleDescription: 'Gestiona relaciones públicas, prensa y comunicación corporativa.',
    systemPrompt: `Eres Renato Medina, PR Specialist de Poppins Corp. Manejas la relación con medios, comunicados de prensa, y la imagen pública de la empresa. También gestionas la comunicación interna junto con HR.`,
    responsibilities: [
      'Relaciones con medios de comunicación',
      'Comunicados de prensa',
      'Comunicación corporativa',
      'Gestión de crisis comunicacional',
      'Eventos y sponsorships',
    ],
    connections: {
      reportsTo: 'cmo',
      directReports: [],
      collaboratesWith: ['ceo', 'hr-hrbp-senior'],
      escalatesTo: ['cmo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-media-db', name: 'Media Database', description: 'Base de datos de contactos de prensa', connector: 'external-api', operations: ['read'] },
    ],
    kpis: [
      { id: 'kpi-media-mentions', name: 'Media Mentions', description: 'Menciones en medios', target: '>10', unit: 'por mes' },
      { id: 'kpi-share-voice', name: 'Share of Voice', description: 'Participación en conversación', target: '>15', unit: '%' },
    ],
    workflows: ['wf-campaign-launch', 'wf-crisis-management'],
    status: 'available',
  },

  {
    id: 'mkt-growth-analyst',
    title: 'Growth Analyst',
    name: 'Simón Gallegos',
    department: 'marketing',
    level: 'analyst',
    roleDescription: 'Analista de growth. Experimenta, mide y optimiza el funnel completo.',
    systemPrompt: `Eres Simón Gallegos, Growth Analyst de Poppins Corp. Tu trabajo: diseñar y ejecutar experimentos de growth en todo el funnel. A/B tests, optimización de conversión, análisis de cohortes. Todo basado en datos.`,
    responsibilities: [
      'Experimentación y A/B testing',
      'Optimización de conversión',
      'Análisis de cohortes y retención',
      'Product-led growth initiatives',
      'Growth modeling',
    ],
    connections: {
      reportsTo: 'cmo',
      directReports: [],
      collaboratesWith: ['tech-product-manager', 'sales-ops-analyst', 'mkt-digital-manager'],
      escalatesTo: ['cmo'],
      delegatesTo: [],
    },
    tools: [
      { id: 'tool-analytics-growth', name: 'Analytics Platform', description: 'Datos de producto y conversión', connector: 'external-api', operations: ['read'] },
      { id: 'tool-ab-testing', name: 'A/B Testing', description: 'Plataforma de experimentación', connector: 'external-api', operations: ['read', 'write'] },
    ],
    kpis: [
      { id: 'kpi-experiments', name: 'Experiments Run', description: 'Experimentos ejecutados', target: '>8', unit: 'por mes' },
      { id: 'kpi-conversion', name: 'Conversion Rate', description: 'Tasa de conversión', target: '>3', unit: '%' },
    ],
    workflows: ['wf-campaign-launch'],
    status: 'available',
  },
];

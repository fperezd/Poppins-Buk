// ============================================================
// POPPINS CORP — Company Configuration
// Configura industria, tamaño y genera la empresa apropiada
// ============================================================

/** Tamaño de empresa — determina cuántos roles se activan */
export type CompanySize = 'startup' | 'pyme' | 'mediana' | 'grande' | 'enterprise';

/** Industria — determina qué roles especializados se necesitan */
export type Industry =
  | 'technology'        // SaaS, software, plataformas
  | 'retail'            // Comercio, e-commerce
  | 'manufacturing'     // Manufactura, producción
  | 'healthcare'        // Salud, clínicas, farma
  | 'financial'         // Banca, fintech, seguros
  | 'education'         // Educación, edtech
  | 'hospitality'       // Hotelería, restaurantes, turismo
  | 'construction'      // Construcción, inmobiliaria
  | 'logistics'         // Transporte, logística, supply chain
  | 'professional'      // Servicios profesionales, consultoría
  | 'agriculture'       // Agroindustria
  | 'energy'            // Energía, minería
  | 'media'             // Medios, entretenimiento
  | 'nonprofit';        // ONGs, fundaciones

/** Configuración para generar una empresa */
export interface CompanyConfig {
  name: string;
  industry: Industry;
  size: CompanySize;
  /** País principal de operación */
  country: string;
  /** Módulos opcionales a incluir aunque el tamaño no lo requiera */
  forceInclude?: string[];
  /** Módulos a excluir aunque el tamaño lo requiera */
  forceExclude?: string[];
  /** Misión personalizada (o se genera una por industria) */
  customMission?: string;
  /** Visión personalizada */
  customVision?: string;
}

/** Tier de un rol — en qué tamaño de empresa aparece */
export type RoleTier = 'startup' | 'pyme' | 'mediana' | 'grande' | 'enterprise';

/** Categoría de relevancia por industria */
export type IndustryRelevance = 'core' | 'recommended' | 'optional' | 'not_applicable';

/** Definición de un rol en el catálogo (placeholder) */
export interface RoleTemplate {
  id: string;
  title: string;
  department: string;
  level: string;
  /** Tamaño mínimo de empresa para que este rol exista */
  minTier: RoleTier;
  /** Industrias donde este rol es core/recomendado/opcional */
  industryRelevance: Partial<Record<Industry, IndustryRelevance>>;
  /** Relevancia por defecto si la industria no está listada */
  defaultRelevance: IndustryRelevance;
  /** Nombre placeholder del "empleado" */
  defaultName: string;
  /** Descripción del rol */
  roleDescription: string;
  /** System prompt template — usa {{company}}, {{industry}}, {{country}} */
  systemPromptTemplate: string;
  /** Responsabilidades */
  responsibilities: string[];
  /** IDs de roles a los que reporta (por prioridad) */
  reportsTo: string[];
  /** IDs de roles que le reportan */
  directReports: string[];
  /** IDs de roles con los que colabora */
  collaboratesWith: string[];
  /** Herramientas/conectores que usa */
  toolConnectors: string[];
  /** KPIs clave */
  kpiTemplates: { name: string; target: string; unit: string }[];
  /** Tags para búsqueda */
  tags: string[];
}

/** Tamaños de empresa con sus características */
export const COMPANY_SIZES: Record<CompanySize, {
  label: string;
  description: string;
  headcountRange: string;
  typicalAgentCount: string;
  tierOrder: number;
}> = {
  startup: {
    label: 'Startup',
    description: 'Equipo fundador. Roles multifuncionales, todos hacen de todo.',
    headcountRange: '1-15',
    typicalAgentCount: '5-8',
    tierOrder: 0,
  },
  pyme: {
    label: 'PyME',
    description: 'Pequeña empresa. Aparecen roles especializados clave.',
    headcountRange: '15-50',
    typicalAgentCount: '10-18',
    tierOrder: 1,
  },
  mediana: {
    label: 'Empresa Mediana',
    description: 'Estructura departamental definida. Managers por área.',
    headcountRange: '50-200',
    typicalAgentCount: '20-35',
    tierOrder: 2,
  },
  grande: {
    label: 'Empresa Grande',
    description: 'Organización madura. C-Suite completo, equipos especializados.',
    headcountRange: '200-1000',
    typicalAgentCount: '35-50',
    tierOrder: 3,
  },
  enterprise: {
    label: 'Enterprise / Multinacional',
    description: 'Organización compleja. Todos los roles, múltiples niveles jerárquicos.',
    headcountRange: '1000+',
    typicalAgentCount: '50+',
    tierOrder: 4,
  },
};

/** Industrias con sus características */
export const INDUSTRIES: Record<Industry, {
  label: string;
  description: string;
  keyDepartments: string[];
  specialRoles: string[];
  regulations: string[];
}> = {
  technology: {
    label: 'Tecnología / SaaS',
    description: 'Empresas de software, plataformas digitales, SaaS.',
    keyDepartments: ['technology', 'sales', 'support'],
    specialRoles: ['tech-devops-lead', 'tech-security-engineer', 'tech-data-engineer'],
    regulations: ['GDPR', 'SOC2', 'ISO 27001'],
  },
  retail: {
    label: 'Retail / E-commerce',
    description: 'Comercio minorista, tiendas, e-commerce.',
    keyDepartments: ['sales', 'operations', 'marketing'],
    specialRoles: ['ops-supply-chain', 'ops-inventory-manager', 'mkt-ecommerce-manager'],
    regulations: ['Ley del Consumidor', 'PCI DSS'],
  },
  manufacturing: {
    label: 'Manufactura / Producción',
    description: 'Fábricas, producción industrial, ensamblaje.',
    keyDepartments: ['operations', 'hr', 'finance'],
    specialRoles: ['ops-plant-manager', 'ops-quality-manager', 'ops-safety-officer'],
    regulations: ['ISO 9001', 'Normas ambientales', 'Seguridad industrial'],
  },
  healthcare: {
    label: 'Salud / Farma',
    description: 'Clínicas, hospitales, farmacéuticas, biotech.',
    keyDepartments: ['operations', 'legal', 'hr'],
    specialRoles: ['ops-clinical-director', 'legal-regulatory-affairs', 'hr-credentialing'],
    regulations: ['HIPAA', 'GMP', 'Regulación sanitaria'],
  },
  financial: {
    label: 'Financiero / Fintech',
    description: 'Bancos, fintech, seguros, gestión de activos.',
    keyDepartments: ['finance', 'legal', 'technology'],
    specialRoles: ['finance-risk-manager', 'legal-regulatory-affairs', 'tech-security-engineer'],
    regulations: ['CMF', 'PLD/FT', 'Basel III', 'SOX'],
  },
  education: {
    label: 'Educación / EdTech',
    description: 'Instituciones educativas, plataformas de e-learning.',
    keyDepartments: ['operations', 'technology', 'marketing'],
    specialRoles: ['ops-academic-director', 'tech-content-engineer', 'mkt-enrollment-manager'],
    regulations: ['Acreditación', 'Protección de menores'],
  },
  hospitality: {
    label: 'Hotelería / Turismo',
    description: 'Hoteles, restaurantes, agencias de turismo.',
    keyDepartments: ['operations', 'sales', 'hr'],
    specialRoles: ['ops-guest-experience', 'ops-revenue-manager', 'hr-seasonal-coordinator'],
    regulations: ['Sanitarias', 'Turismo', 'Licencias municipales'],
  },
  construction: {
    label: 'Construcción / Inmobiliaria',
    description: 'Constructoras, inmobiliarias, desarrollo de proyectos.',
    keyDepartments: ['operations', 'finance', 'legal'],
    specialRoles: ['ops-project-director', 'ops-safety-officer', 'legal-permits-specialist'],
    regulations: ['Normas de construcción', 'Medio ambiente', 'Permisos municipales'],
  },
  logistics: {
    label: 'Logística / Transporte',
    description: 'Transporte, distribución, almacenamiento, supply chain.',
    keyDepartments: ['operations', 'technology', 'hr'],
    specialRoles: ['ops-fleet-manager', 'ops-warehouse-manager', 'tech-tracking-engineer'],
    regulations: ['Transporte', 'Aduanas', 'Seguridad vial'],
  },
  professional: {
    label: 'Servicios Profesionales',
    description: 'Consultoría, auditoría, servicios legales, agencias.',
    keyDepartments: ['sales', 'hr', 'operations'],
    specialRoles: ['ops-engagement-manager', 'sales-partner-manager', 'hr-talent-partner'],
    regulations: ['Colegios profesionales', 'Ética profesional'],
  },
  agriculture: {
    label: 'Agroindustria',
    description: 'Agricultura, ganadería, agroindustria, exportación.',
    keyDepartments: ['operations', 'finance', 'hr'],
    specialRoles: ['ops-field-manager', 'ops-export-manager', 'hr-seasonal-coordinator'],
    regulations: ['Fitosanitarias', 'Exportación', 'Medio ambiente'],
  },
  energy: {
    label: 'Energía / Minería',
    description: 'Minería, energía, utilities, oil & gas.',
    keyDepartments: ['operations', 'legal', 'hr'],
    specialRoles: ['ops-safety-officer', 'ops-environmental-manager', 'legal-regulatory-affairs'],
    regulations: ['Sernageomin', 'Medio ambiente', 'Seguridad minera'],
  },
  media: {
    label: 'Medios / Entretenimiento',
    description: 'Medios de comunicación, entretenimiento, producción de contenido.',
    keyDepartments: ['marketing', 'technology', 'sales'],
    specialRoles: ['mkt-editorial-director', 'tech-content-engineer', 'sales-ad-sales-manager'],
    regulations: ['Propiedad intelectual', 'Regulación de medios'],
  },
  nonprofit: {
    label: 'ONG / Fundación',
    description: 'Organizaciones sin fines de lucro, fundaciones, cooperación.',
    keyDepartments: ['operations', 'finance', 'marketing'],
    specialRoles: ['finance-grants-manager', 'mkt-fundraising-manager', 'ops-programs-director'],
    regulations: ['Ley de donaciones', 'Rendición de cuentas', 'Transparencia'],
  },
};

/** Helper: ¿Un tier es >= a otro? */
export function tierMeetsMinimum(companyTier: CompanySize, minTier: RoleTier): boolean {
  const order: Record<string, number> = { startup: 0, pyme: 1, mediana: 2, grande: 3, enterprise: 4 };
  return order[companyTier] >= order[minTier];
}

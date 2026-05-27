# 📘 Plan Maestro Poppins — v1.2

> **Documento autoritativo.** Esta es la fuente de verdad del plan de evolución de Poppins hacia MVP serio. Vivirá en `poppins-contracts/docs/` una vez completado Sprint 0. Cambios a este plan requieren commit explícito con mensaje `plan: <razón>`.
>
> **Fecha:** 2026-05-27 · **Versión:** 1.2 · **Owners:** CTO (Fernando Pérez) + Product Lead (Sprint 5+)
>
> **Cambios v1.2 vs v1.1:**
> - ➕ §18 Lean Canvas Poppins v1.0 + Competitive Positioning vs Domestikco
> - ➕ §19 Engineering Excellence (Bucket E expandido): ADRs, Architecture Fitness Functions, Tech Debt Budget, DoR/DoD/WIP, INVEST, Tech Radar, Bug Triage, API versioning, Cache strategy, Webhook retry, DB migration testing, Pair programming, 1:1 cadence
> - ✅ ICP cementado: madres/familias empleadoras 30-55 años Santiago metropolitano
> - ✅ Kill criteria: <20 clientes pagantes a 3 meses post-MVP = pausa
> - ✅ Pricing: Starter $9,990/mes · Pro $19,990/mes · Empresarial custom
> - ✅ Support stack: agente IA Gemini + email hola@poppins.cl en MVP (C2 escala humana)
> - ✅ Onboarding: self-service 6-step desde día 1, sin concierge
> - ✅ Landing poppins.cl raíz: construida en C2 final por agent-front
> - ✅ Vendor strategy BUK: MVP usa BUK API. Post-MVP exitoso decidimos: (a) alianza/precio especial con BUK, (b) motor propio según fondos
> - 📝 Unit economics: comentario para considerar — calcular post Sprint 6 con datos reales
>
> **Cambios v1.1 vs v1.0:**
> - ➕ Modelo de supervisión 2-humanos (CTO + Product Lead desde Sprint 5)
> - ➕ Multi-tenancy desde C0 (no C2)
> - ➕ Billing Flow.cl integrado en C1 (Sprint 4-5)
> - ➕ Sección de Gates de calidad E2E entre C-tiers
> - ➕ Sección de MVP Essentials cross-cutting (compliance, email, uploads, etc)
> - ↻ Sprint backlog reorganizado

---

## 📑 Índice

1. [TL;DR ejecutivo](#1-tldr-ejecutivo)
2. [Estado actual y razón del plan](#2-estado-actual-y-razón-del-plan)
3. [Modelo de agentes Claude Code](#3-modelo-de-agentes-claude-code-1--2--3)
4. [Modelo de supervisión humana](#4-modelo-de-supervisión-humana)
5. [Arquitectura de repos](#5-arquitectura-de-repos-4-repos)
6. [Design System Poppins v1.0](#6-design-system-poppins-v10)
7. **[Multi-tenancy desde día 1](#7-multi-tenancy-desde-día-1)** ← NUEVO
8. [Sprint 0 — Cutover (1 agente)](#8-sprint-0--cutover-1-agente-5-días)
9. [Sprint 1-2 — C0 Security + Multi-tenant (2 agentes)](#9-sprint-1-2--c0-security--multi-tenant-2-agentes)
10. [Sprint 3-5 — C1 Stabilize + Billing + Onboarding (2 agentes)](#10-sprint-3-5--c1-stabilize--billing--onboarding-2-agentes)
11. [Sprint 6+ — C2 Scale (3 agentes)](#11-sprint-6--c2-scale-3-agentes)
12. **[MVP Essentials cross-cutting](#12-mvp-essentials-cross-cutting)** ← NUEVO
13. **[Gates de calidad C0 → C1 → C2 → GA](#13-gates-de-calidad-c0--c1--c2--ga)** ← NUEVO
14. [Las 10 reglas inviolables (R1-R10)](#14-las-10-reglas-inviolables-r1-r10)
15. [Cómo arrancar cada agente](#15-cómo-arrancar-cada-agente-claude-code)
16. [KPIs, DORA y métricas](#16-kpis-dora-y-métricas)
17. [Risk register](#17-risk-register)
18. **[Lean Canvas + Competitive Positioning vs Domestikco](#18-lean-canvas--competitive-positioning-vs-domestikco)** ← NUEVO v1.2
19. **[Engineering Excellence (Bucket E)](#19-engineering-excellence-bucket-e)** ← NUEVO v1.2
20. [Próximos pasos](#20-próximos-pasos)

---

## 1. TL;DR ejecutivo

**Qué:** Refactorizar Poppins desde monolito Next.js inseguro a **plataforma SaaS B2B multi-tenant lista para MVP serio**, con design system propio, billing automatizado y compliance Chile.

**Por qué:** Hoy hay deuda crítica de seguridad, multi-tenancy ausente, billing inexistente y cero observabilidad. No es lanzable a 5+ clientes pagantes.

**Cómo:**
- **4 repos:** `poppins-contracts` + `poppins-api-id` + `poppins-api-buk` + `poppins-web`
- **Escalado de agentes:** 1 → 2 → 3 según madurez
- **2 supervisores humanos** desde Sprint 5
- **Multi-tenant desde Sprint 2** (no postponible)
- **Billing Flow.cl** en Sprint 4-5
- Design system Poppins v1.0 oficial (`packages/ui`)

**Cuándo:**
- Sprint 0 (cutover): semana 1
- C0 Security: semanas 2-5
- C1 Stabilize + Billing: semanas 6-11
- C2 Scale: semana 12+
- **MVP listo para 2do cliente pagante:** ~11 semanas
- **GA público:** ~16 semanas

**Dominios:**
- `app.poppins.cl` → web · Tenant subdominio: `<tenant>.poppins.cl`
- `api.poppins.cl` → api-id
- `buk.poppins.cl` → api-buk
- `status.poppins.cl` → status page
- Cookies en `.poppins.cl`

---

## 2. Estado actual y razón del plan

### Hallazgos críticos del análisis 360°

| Capa | Hallazgo | Severidad |
|---|---|---|
| L4 Security | 59/80 rutas API sin `requireScope`. Cualquier user logueado lee toda la nómina BUK. | 🔴 C0 |
| L4 Security | Webhook BUK sin firma HMAC. | 🔴 C0 |
| L4 Security | `.env.local.bak` commiteado con anon key Supabase. | 🔴 C0 |
| L2 Runtime | `typescript.ignoreBuildErrors: true` enmascara errores en prod. | 🔴 C0 |
| L7 Observability | Cero APM, sin Sentry, sin correlation-ID, 0 tests. | 🔴 C0 |
| L1 Infra | `vercel.json` con `--no-package-lock` → builds no reproducibles. | 🟠 C0 |
| **L6 Domain** | **Sin multi-tenancy. 1 BUK_API_TOKEN global = 1 tenant max.** | **🔴 C0** |
| **L6 Domain** | **Sin billing. Imposible cobrar a clientes hoy.** | **🟠 C1** |
| **L4 Compliance** | **Sin T&C, sin Política Privacidad, sin consent management. Ley 19.628 Chile incumplida.** | **🟠 C1** |
| **L7 Reliability** | **Sin status page, sin backups verificados, sin runbooks.** | **🟠 C1** |
| L3 IDP | Dos clientes API conviven (`useBuk.ts` legacy + `hooks/api/*` moderno). | 🟠 C1 |
| L6 Domain | Directorio `/agents/` (~30 archivos) sin uso real — agentic decorativo. | 🟡 C1 |

### Lo que funciona bien y se preserva

- ✅ **BUK SDK casero** tipado, modular, con timeouts y error types (13 módulos).
- ✅ **Modelo D** (Empleador = BUK Empleado "Jefe de Área" sueldo $1, Hogar = BUK Area).
- ✅ **RLS Supabase** robusto: 28 políticas en 14 tablas con helpers `is_admin()`, `can_access_area()`.
- ✅ **Capa API estandarizada** (`handle`, `ok`, `fail`, `parseQuery/Body`).
- ✅ **Schemas Zod** completos por dominio (16 schemas en `lib/api/schemas/`).

### Filosofía del plan

> *No reescribimos lo que funciona. Cerramos deuda de seguridad y operación, agregamos multi-tenancy y billing, después escalamos.*

---

## 3. Modelo de agentes Claude Code: 1 → 2 → 3

### Realidad del paralelismo

| Agentes | Velocidad | Costo tokens | ROI | Cuándo |
|---|---|---|---|---|
| **1** | 100% | 100% | baseline | Sprint 0 (cutover) |
| **2** | ~170% | 200% | 🟢 **mejor relación** | Sprints 1-5 (C0 + arranque C1) |
| **3** | ~220% | 300% | 🟢 **sólido con 2 supervisores** | Sprint 6+ (C2) |

### Criterios objetivos para escalar

Solo subimos de N → N+1 cuando se cumplen **los 3 criterios**:

| Criterio | De 1 → 2 (post Sprint 0) | De 2 → 3 (Sprint 6) |
|---|---|---|
| Volumen de PRs | <8 PRs/semana del agente actual | >5 PRs/semana cada uno sin bloqueos |
| Tiempo review por supervisor | <30min/PR sin acumulación | <30min/PR sin acumulación (con 2 humanos) |
| Estabilidad de contratos | N/A | <2 cambios breaking/semana en `@poppins/contracts` |

### Roadmap de escalado

```
Sprint 0       (semana 1)       →  1 agente     · 1 supervisor (Fernando)
Sprint 1-4     (semanas 2-9)    →  2 agentes    · 1 supervisor
Sprint 5       (semana 10-11)   →  2 agentes    · 2 supervisores (Product Lead onboarding)
Sprint 6+ C2   (semana 12+)     →  3 agentes    · 2 supervisores
```

### Roles por fase

#### Sprint 0 — 1 agente

| Rol | Nombre interno | Responsabilidad |
|---|---|---|
| 🎯 Cutover Orchestrator | `agent-cutover` | Ejecuta playbook Sprint 0 completo. Toca todos los repos (los está creando). Reporta a CTO al final de cada día. |

#### Sprint 1-5 — 2 agentes

| Rol | Nombre interno | Repo primario | Lane |
|---|---|---|---|
| ⚙️ Back | `agent-back` | `poppins-api-id` + `poppins-api-buk` | Auth, dominio Poppins, BUK SDK, webhooks, billing |
| 🎨 Front | `agent-front` | `poppins-web` | UI, design system, hooks, MSW, Storybook |

#### Sprint 6+ — 3 agentes

| Rol | Nombre interno | Repo | Lane |
|---|---|---|---|
| 🅰 Back-A | `agent-back-a` | `poppins-api-id` | Auth, scopes, Poppins-domain, Supabase migrations, billing |
| 🅱 Back-B | `agent-back-b` | `poppins-api-buk` | BUK SDK, BUK proxies, webhooks, cron sync |
| 🅵 Front | `agent-front` | `poppins-web` | UI completo |

---

## 4. Modelo de supervisión humana

### 2 supervisores con roles especializados

#### Supervisor 1 — CTO (Fernando Pérez) · Desde Sprint 0

```
Owns:
  - poppins-contracts (único merger para MAJOR bumps)
  - poppins-api-id (review primario)
  - poppins-api-buk (review primario)
  - Arquitectura, security, performance, data, billing técnico

Reviews:
  - PRs de agent-back / agent-back-a / agent-back-b (primario)
  - Major changes a contracts (final approver)
  - Migraciones Supabase
  - Cambios en RLS

Foco principal:
  - Que el back no rompa
  - Contratos limpios
  - Compliance técnico (security, performance, data)
```

#### Supervisor 2 — Product Lead · Desde Sprint 5

```
Owns:
  - poppins-web (review primario)
  - Copy, UX flows, customer feedback loops
  - Pricing, plan tiers, onboarding flow

Reviews:
  - PRs de agent-front (primario)
  - Minor/Patch changes a contracts (puede mergear)
  - Cambios de UX/UI
  - Decisiones de producto

Foco principal:
  - Que el producto se sienta bien para empleadora y colaboradora
  - Que las prioridades reflejen feedback de clientes reales
  - Conversion funnel, retention, MRR
```

### Workflow de contracts con 2 mergers

| Tipo de change | Aprobación necesaria | Quién puede mergear |
|---|---|---|
| **Patch** (doc, comentario, fix typo) | 1 supervisor | Cualquiera |
| **Minor** (campo opcional nuevo, endpoint nuevo, schema aditivo) | 1 supervisor + 1 notificación al otro | Cualquiera (con notificación 24h) |
| **Major** (breaking: eliminar campo, cambiar tipo, renombrar) | Ambos supervisores | CTO finaliza con label `breaking` |

### Tie-breaker

| Conflicto | Quién resuelve |
|---|---|
| Decisión técnica (arquitectura, performance, security) | CTO |
| Decisión de producto (UX, copy, pricing, feature priority) | Product Lead |
| Cross-cutting (afecta producto Y técnica) | Ambos consensúan, documentado en ADR. Si no consensúan: CTO en backend repos, PL en web repo |
| Contract change | Ver tabla arriba |

### Cadencia de review

| Cadencia | Quién | Qué |
|---|---|---|
| Continuo | Supervisor según lane | PRs al merge target dentro de 4h business hours |
| Diaria 15min async | Ambos + agentes | Standup escrito: progreso, bloqueos, próximas 24h |
| 2x/semana 30min sync | Ambos | Contract review + decisiones cross-cutting |
| Fin de sprint 90min | Ambos + agentes | Demo + retro + planning siguiente sprint |
| Trimestral | Ambos | Revisión del plan maestro · ajuste de prioridades |

---

## 5. Arquitectura de repos (4 repos)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│   📦 poppins-contracts          ← 🪨 LA PIEDRA                    │
│      Owners: CTO (major) + Product Lead (minor/patch)              │
│      Zod schemas + OpenAPI + types generados                       │
│      Publicado como @poppins/contracts (GitHub Packages)           │
│                          │                                         │
│        ┌─────────────────┼─────────────────┐                      │
│        ▼                 ▼                 ▼                      │
│                                                                    │
│  📦 poppins-api-id    📦 poppins-api-buk   📦 poppins-web         │
│   Owner: Back-A         Owner: Back-B         Owner: Front         │
│   Review: CTO           Review: CTO           Review: Product Lead │
│                                                                    │
│   • Auth Supabase      • BUK SDK            • Next.js page-only   │
│   • Multi-tenant       • Webhooks BUK + HMAC• shadcn base-nova    │
│   • Billing Flow.cl    • Cron sync          • Tailwind 4          │
│   • User profiles      • Service layer      • TanStack Query      │
│   • Domain Poppins     • Mock fallback      • MSW + Storybook     │
│   • Supabase migs/RLS  • Read Supabase only • Onboarding wizard   │
│                                                                    │
│   api.poppins.cl       buk.poppins.cl       app.poppins.cl        │
│                                              <tenant>.poppins.cl   │
└──────────────────────────────────────────────────────────────────┘
```

### Contenido por repo

#### 📦 `poppins-contracts`

```
poppins-contracts/
├── src/
│   ├── schemas/                 ← Zod por dominio
│   │   ├── colaboradoras.ts
│   │   ├── empleadores.ts
│   │   ├── hogares.ts
│   │   ├── liquidaciones.ts
│   │   ├── vacaciones.ts
│   │   ├── ausencias.ts
│   │   ├── horas-extras.ts
│   │   ├── bonos.ts
│   │   ├── cargas.ts
│   │   ├── documentos.ts
│   │   ├── tareas.ts
│   │   ├── listas-compras.ts
│   │   ├── mensajes.ts
│   │   ├── solicitudes-salud.ts
│   │   ├── evaluaciones.ts
│   │   ├── asignaciones.ts
│   │   ├── auth.ts
│   │   ├── tenants.ts           ← NEW (multi-tenant)
│   │   ├── billing.ts           ← NEW (Flow.cl)
│   │   ├── onboarding.ts        ← NEW
│   │   ├── compliance.ts        ← NEW (consent, exports)
│   │   └── _common.ts
│   ├── types/
│   ├── errors.ts
│   ├── openapi.ts
│   └── index.ts
├── docs/
│   ├── PLAN_MAESTRO.md          ← este documento
│   ├── adr/                     ← ADRs
│   └── retros/                  ← Sprint retros
├── .changeset/
├── package.json
└── tsup.config.ts
```

#### 📦 `poppins-api-id`

```
poppins-api-id/
├── src/
│   ├── app/api/
│   │   ├── auth/
│   │   │   ├── logout/route.ts
│   │   │   └── callback/route.ts
│   │   ├── v1/
│   │   │   ├── me/route.ts
│   │   │   ├── tenants/                ← NEW: tenant admin
│   │   │   ├── billing/                ← NEW: Flow.cl
│   │   │   │   ├── subscribe/route.ts
│   │   │   │   ├── portal/route.ts
│   │   │   │   ├── invoices/route.ts
│   │   │   │   └── webhook/route.ts    ← Flow.cl webhook
│   │   │   ├── onboarding/             ← NEW: wizard
│   │   │   │   ├── start/route.ts
│   │   │   │   ├── verify-buk/route.ts
│   │   │   │   └── complete/route.ts
│   │   │   ├── colaboradoras/         ← orquesta con api-buk
│   │   │   ├── empleadores/
│   │   │   ├── hogares/
│   │   │   ├── tareas/                 ← dominio Poppins puro
│   │   │   ├── listas-compras/
│   │   │   ├── conversaciones/
│   │   │   ├── mensajes/
│   │   │   ├── solicitudes-salud/
│   │   │   ├── evaluaciones/
│   │   │   └── asignaciones/
│   │   ├── compliance/
│   │   │   ├── consent/route.ts        ← NEW: registrar consentimientos
│   │   │   ├── data-export/route.ts    ← NEW: derecho a portabilidad
│   │   │   └── data-delete/route.ts    ← NEW: derecho al olvido
│   │   ├── audit/route.ts              ← NEW: audit log UI query
│   │   └── health/route.ts
│   ├── lib/
│   │   ├── auth/
│   │   ├── tenant/                     ← NEW: resolver tenant from JWT/subdomain
│   │   ├── billing/                    ← NEW: Flow.cl client + subscription logic
│   │   ├── email/                      ← NEW: Resend templates
│   │   ├── supabase/
│   │   ├── buk-bridge/
│   │   ├── rate-limit/                 ← NEW: Upstash Redis
│   │   └── api/
│   └── middleware.ts                   ← Tenant resolution + JWT
├── supabase/migrations/
│   ├── 0001_initial_poppins.sql
│   ├── 0002_rls_policies.sql
│   ├── 0003_apply_to_prod_20260525.sql
│   ├── 0004_multi_tenancy.sql          ← NEW
│   ├── 0005_billing.sql                ← NEW
│   ├── 0006_compliance.sql             ← NEW
│   └── 0007_audit_indexes.sql          ← NEW
├── tests/
└── vercel.json
```

#### 📦 `poppins-api-buk`

```
poppins-api-buk/
├── src/
│   ├── app/api/
│   │   ├── v1/
│   │   │   ├── liquidaciones/
│   │   │   ├── vacaciones/
│   │   │   ├── horas-extras/
│   │   │   ├── ausencias/{inasistencias,licencias,permisos}/
│   │   │   ├── bonos/
│   │   │   ├── cargas/
│   │   │   ├── documentos/
│   │   │   └── catalogos/
│   │   ├── webhooks/buk/route.ts       ← HMAC + idempotencia + tenant lookup
│   │   ├── cron/sync/route.ts          ← Vercel Cron BUK → cache_* por tenant
│   │   └── _internal/                  ← endpoints callables solo desde api-id
│   ├── lib/
│   │   ├── buk-sdk/                    ← 13 módulos
│   │   ├── buk-multi-tenant/           ← NEW: SDK factory per-tenant
│   │   ├── service/
│   │   └── webhook/
│   └── middleware.ts
├── tests/
└── vercel.json
```

#### 📦 `poppins-web`

```
poppins-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx         ← NEW
│   │   ├── (onboarding)/
│   │   │   └── setup/                  ← NEW: wizard
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   ├── colaboradoras/
│   │   │   ├── liquidaciones/
│   │   │   ├── vacaciones/
│   │   │   ├── horas-extra/
│   │   │   ├── beneficios/
│   │   │   ├── asistencia/
│   │   │   ├── documentos/             ← incluye file upload
│   │   │   ├── empresa/
│   │   │   ├── configuracion/
│   │   │   ├── billing/                ← NEW: tarifas, facturas
│   │   │   ├── audit/                  ← NEW: log de actividad
│   │   │   └── perfil/
│   │   ├── (legal)/                    ← NEW
│   │   │   ├── terminos/page.tsx
│   │   │   ├── privacidad/page.tsx
│   │   │   └── cookies/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                         ← shadcn primitives
│   │   ├── shell/                      ← AppShell + Sidebar + Topbar
│   │   ├── patterns/                   ← PageHeader, DataTable, EmptyState, FileUpload
│   │   ├── billing/                    ← NEW
│   │   ├── onboarding/                 ← NEW
│   │   └── consent/                    ← NEW: cookie banner
│   ├── hooks/api/                      ← TanStack Query hooks
│   ├── lib/
│   │   ├── api-client/                 ← generado desde contracts
│   │   ├── auth/                       ← Supabase browser
│   │   ├── analytics/                  ← NEW: PostHog
│   │   └── tenant/                     ← NEW: tenant resolver
│   ├── styles/
│   └── mocks/                          ← MSW handlers
├── packages/ui/                        ← design system Poppins
├── public/
├── tests/
│   ├── unit/
│   └── e2e/                            ← Playwright
├── .storybook/
└── package.json
```

---

## 6. Design System Poppins v1.0

(Sin cambios respecto a v1.0 del plan. Tokens oficiales del Manual de Marca Poppins v1.0.)

### Colores corporativos

| Token | Hex | Uso |
|---|---|---|
| `--pp-deep` | `#0B0D2B` | Azul profundo — fondos premium, sidebar dark, hero |
| `--pp-magenta` | `#FF2CA0` | CTAs primarios, links, focus rings |
| `--pp-purple` | `#8E7BFF` | Acento secundario, iconos decorativos |
| `--pp-lavender` | `#EDE9FF` | Backgrounds activos, badges soft, hover |
| `--pp-white` | `#FFFFFF` | Texto sobre dark, surface principal |

### Gradiente principal (firma visual)

```css
--pp-gradient: linear-gradient(90deg, #8E7BFF 0%, #FF2CA0 50%, #FF5EBB 100%);
```

### Tipografía

**Poppins** (Google Fonts) · 3 pesos: 400 Regular, 600 SemiBold, 700 Bold.

| Estilo | Peso | Tamaño | Tracking |
|---|---|---|---|
| Título | Bold 700 | 48px | -0.5px |
| Subtítulo | SemiBold 600 | 24px | 0 |
| Texto base | Regular 400 | 14-16px | 0 |

### Reglas del logo

- Versiones obligatorias: principal, sobre fondo oscuro, sobre fondo claro, monocromática, isotipo, favicon (4 sub-variantes)
- Tamaño mínimo: 25mm impreso · 140px digital
- Área de seguridad mínima = ancho del isotipo
- ❌ NO deformar / cambiar colores / aplicar efectos / fondos complejos

### Validación de accesibilidad

⚠️ **Alerta:** El gradiente magenta sobre fondos claros **falla contraste WCAG AA**. Audit obligatorio con `axe-core` antes de Sprint 5. Uso permitido: solo sobre dark backgrounds o como decoración no-textual.

---

## 7. Multi-tenancy desde día 1

### Por qué C0 y no C2

Postergar multi-tenancy es deuda compuesta. Retrofitear post-MVP:
- Requiere migración con downtime (4 semanas de trabajo)
- Bug compounding: 6 meses de código asumiendo "1 tenant" hay que reauditar
- Cuando llega el 2do cliente lo perdemos por no poder onboardearlo en 48h

**Hacerlo en Sprint 2 cuesta 5 días.** Es no-negociable.

### Modelo conceptual

```
Tenant (Tooxs customer)
  └── 1 BUK organization (su propio BUK_API_TOKEN encriptado)
       └── N Hogares (BUK areas)
            └── N Empleadores (Jefe de Área, sueldo $1)
            └── N Colaboradoras (BUK employees)
       └── N Users (Supabase auth)
            └── M user_profiles con rol y scope
       └── 1 Subscription (Flow.cl)
       └── Audit log filtrado por tenant
```

**Definición de tenant para Poppins:** un cliente Tooxs que paga la suscripción. Puede tener 1 hogar (familia individual) o N hogares (empresa, agencia de servicio doméstico, RRHH corporativo).

### Schema additions (migración 0004)

```sql
-- tabla tenants
create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                    -- 'familia-perez', usado en subdomain
  name text not null,                            -- 'Familia Pérez' (display name)
  buk_api_token_encrypted text not null,         -- pgcrypto encrypted
  buk_base_url text default 'https://app.buk.cl/api/v1/chile',
  buk_company_id integer,
  contact_email text not null,
  contact_phone text,
  rut text,                                      -- RUT empresa o persona
  legal_name text,                               -- razón social
  address text,
  active boolean default true,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_tenants_slug on tenants(slug);
create index idx_tenants_active on tenants(active);

-- Agregar tenant_id a user_profiles y todas las domain tables
alter table user_profiles add column tenant_id uuid not null references tenants(id);
alter table asignaciones add column tenant_id uuid not null references tenants(id);
alter table tareas add column tenant_id uuid not null references tenants(id);
alter table tareas_recurrentes add column tenant_id uuid not null references tenants(id);
alter table listas_compras add column tenant_id uuid not null references tenants(id);
alter table conversaciones add column tenant_id uuid not null references tenants(id);
alter table mensajes add column tenant_id uuid not null references tenants(id);
alter table solicitudes_salud add column tenant_id uuid not null references tenants(id);
alter table evaluaciones add column tenant_id uuid not null references tenants(id);
alter table cache_areas add column tenant_id uuid not null references tenants(id);
alter table cache_roles add column tenant_id uuid not null references tenants(id);
alter table cache_absence_types add column tenant_id uuid not null references tenants(id);
alter table audit_log add column tenant_id uuid references tenants(id);

-- Helper: current tenant from JWT app_metadata
create or replace function current_tenant_id()
returns uuid language sql security definer stable as $$
  select (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
$$;

-- RLS reforzada: tenant isolation + rol-based access
alter table tareas drop policy tareas_admin_all;
create policy tareas_tenant_isolation on tareas
  for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- (repetir para todas las tablas con tenant_id)

-- Función: assign user to tenant (callable solo por admin Tooxs)
create or replace function assign_user_to_tenant(
  p_user_id uuid,
  p_tenant_id uuid,
  p_rol rol_poppins
)
returns void language plpgsql security definer as $$
begin
  insert into user_profiles (user_id, tenant_id, rol, activo)
  values (p_user_id, p_tenant_id, p_rol, true)
  on conflict (user_id) do update
    set tenant_id = p_tenant_id, rol = p_rol;
  -- También actualizar app_metadata del JWT
  perform set_config('request.jwt.claim.app_metadata',
    json_build_object('tenant_id', p_tenant_id)::text, false);
end $$;
```

### Tenant resolution en runtime

3 fuentes de tenant_id, en orden de prioridad:

1. **JWT `app_metadata.tenant_id`** (autoritativo) — escrito por Supabase Admin al asignar user a tenant
2. **Subdomain** `<slug>.poppins.cl` (UI hint) — para customer-friendly URLs
3. **Header `X-Tenant-Slug`** (development only) — para testing

Middleware en ambos backends:
```typescript
// middleware.ts (api-id y api-buk)
export async function middleware(req: NextRequest) {
  const jwt = await getJWT(req);
  if (!jwt) return unauthorized();

  const tenantId = jwt.app_metadata?.tenant_id;
  if (!tenantId) return forbidden('No tenant');

  // Verificar tenant activo
  const tenant = await getTenant(tenantId);
  if (!tenant?.active) return forbidden('Tenant inactive');

  // Verificar tenant suscripción al día
  const subscription = await getSubscription(tenantId);
  if (subscription.status === 'suspended') {
    return readOnlyMode(req); // permite GET, bloquea POST/PUT/DELETE
  }

  req.headers.set('x-tenant-id', tenantId);
  return NextResponse.next();
}
```

### BUK SDK multi-tenant

```typescript
// poppins-api-buk/src/lib/buk-multi-tenant/index.ts
const sdkCache = new Map<string, BukSDK>();

export async function getBukSDKForTenant(tenantId: string): Promise<BukSDK> {
  if (sdkCache.has(tenantId)) return sdkCache.get(tenantId)!;

  const tenant = await supabaseAdmin
    .from('tenants')
    .select('buk_api_token_encrypted, buk_base_url')
    .eq('id', tenantId)
    .single();

  const apiToken = await decrypt(tenant.buk_api_token_encrypted);
  const sdk = new BukSDK({ apiToken, baseUrl: tenant.buk_base_url });

  sdkCache.set(tenantId, sdk);
  return sdk;
}
```

### Subdomain strategy

| URL pattern | Resuelve a |
|---|---|
| `app.poppins.cl` | Landing post-login: lista tenants donde el user tiene acceso, redirige a default |
| `<slug>.poppins.cl` | Dashboard con tenant resuelto desde slug |
| `app.poppins.cl/login` | Login global (no requiere tenant) |
| `app.poppins.cl/signup` | Signup → onboarding wizard crea tenant |
| `api.poppins.cl/...` | Backend identity (resuelve tenant desde JWT) |
| `buk.poppins.cl/...` | Backend BUK (resuelve tenant desde JWT) |

DNS: wildcard `*.poppins.cl` → Vercel (poppins-web maneja todos los subdomains)

### Onboarding wizard nuevo tenant

```
Paso 1: Datos básicos
  - Email + teléfono empleador/empresa
  - Nombre tenant (display)
  - Slug (auto-suggest desde nombre, editable, único)
  - Acepta T&C + Política Privacidad (consent registrado)

Paso 2: Datos BUK
  - BUK API token (validamos contra GET /employees con limit=1)
  - BUK company_id
  - Si falla validación: ofrecer flujo "no tengo BUK aún" (sandbox mode)

Paso 3: Primer hogar
  - Nombre del hogar / familia
  - Dirección
  - (crea BUK Area automáticamente)

Paso 4: Primer empleador (auto-creado)
  - Sueldo $1 simbólico, cargo "Jefe de Área"
  - Usando datos del Paso 1
  - (crea BUK Empleado con cargo Jefe de Área)

Paso 5: Plan + Billing
  - Selecciona plan (Starter / Familia / Empresarial)
  - Trial 14 días sin tarjeta
  - Flow.cl checkout (puede saltearse, redirección día 13)

Paso 6: Bienvenida
  - Dashboard tour interactivo (3 pasos)
  - Sugerir crear primera colaboradora
```

---

## 8. Sprint 0 — Cutover (1 agente, 5 días)

**Goal:** Pasar de monolito a 4 repos sin regresión.

**Owner:** 1 agente Claude Code (`agent-cutover`) + CTO supervisando EOD.

**DoD Sprint 0:**
- ✅ 4 repos GitHub con CI verde
- ✅ `app.poppins.cl` carga login + dashboard sin diferencia funcional vs hoy
- ✅ Cookies Supabase compartidas entre `app.`, `api.`, `buk.`
- ✅ `@poppins/contracts@0.1.0` publicado y consumido
- ✅ 3 `CLAUDE.md` listos para Sprint 1
- ✅ Logo + tokens v1.0 + fuente Poppins integrados
- ✅ Multi-tenant: tabla `tenants` creada (vacía) + helper `current_tenant_id()` definido (preparando para Sprint 2)

### Día L1 (Lunes) — Repos + Contracts

| Hora | Tarea |
|---|---|
| 09:00-09:30 | Crear 4 repos GitHub con branch protection |
| 09:30-10:00 | Config GitHub Packages para `@poppins/*` |
| 10:00-12:00 | Scaffold `poppins-contracts` (tsup + vitest + changesets) |
| 12:00-13:00 | Extraer Zod schemas de `Poppins-back/src/lib/api/schemas/` → `poppins-contracts/src/schemas/` |
| 14:00-15:30 | `index.ts` + `_common.ts` con pagination, ApiResponse, ApiErrorCode |
| 15:30-16:30 | GitHub Action `release.yml` con changesets + npm publish |
| 16:30-17:00 | Publish `@poppins/contracts@0.1.0` |
| 17:00-17:30 | Commit final + CHANGELOG inicial |

### Día M2 (Martes) — `poppins-api-id`

| Hora | Tarea |
|---|---|
| 09:00-10:00 | Scaffold Next 16 API-only puerto 3001 |
| 10:00-12:00 | Copiar `middleware.ts`, `lib/api/{auth,utils}`, `lib/supabase/*` |
| 12:00-13:00 | Copiar migraciones Supabase → `supabase/migrations/` |
| 14:00-15:30 | Copiar rutas dominio Back-A: auth, me, colaboradoras, empleadores, hogares |
| 15:30-17:00 | Copiar rutas Poppins-domain: tareas, listas, mensajes, salud, evaluaciones, asignaciones, conversaciones |
| 17:00-17:30 | Crear `lib/buk-bridge.ts` HTTP client server-to-server |
| 17:30-18:00 | `npm run dev` :3001, smoke test `/api/v1/me` |

### Día Mi3 (Miércoles) — `poppins-api-buk`

| Hora | Tarea |
|---|---|
| 09:00-09:30 | Scaffold Next 16 API-only puerto 3002 |
| 09:30-10:00 | Middleware JWT validation Supabase |
| 10:00-12:00 | Copiar `lib/buk-sdk/*` y `lib/buk/*` |
| 12:00-13:00 | Ajustar service layer (solo lectura Supabase) |
| 14:00-15:30 | Copiar rutas: liquidaciones, vacaciones, horas-extras, bonos, cargas, documentos, catalogos |
| 15:30-16:30 | Copiar `ausencias/*` con sus `/tipos` |
| 16:30-17:00 | Copiar `webhooks/buk` + HMAC verification |
| 17:00-17:30 | Endpoint `_internal/health` con header `x-internal-token` |
| 17:30-18:00 | `npm run dev` :3002, healthcheck BUK ok |

### Día J4 (Jueves) — `poppins-web`

| Hora | Tarea |
|---|---|
| 09:00-09:30 | Scaffold Next 16 puerto 3000 |
| 09:30-10:30 | `npx shadcn@latest init` con `base-nova`, baseColor=neutral |
| 10:30-11:30 | Crear `packages/ui/tokens/poppins.css` v1.0 + import en `globals.css` |
| 11:30-12:00 | Fuente Poppins via `next/font/google` (3 pesos: 400/600/700) |
| 12:00-13:00 | Copiar `app/(non-api)/*`, `components/*`, `hooks/*`, `styles/*` |
| 14:00-14:30 | Mover `Logo-Poppins.png` → `public/poppins-logo-dark.png` + metadata icons |
| 14:30-16:00 | Instalar `@poppins/contracts` + crear `lib/api-client/` tipado |
| 16:00-17:00 | Migrar `hooks/api/index.ts` a `apiClient`. Borrar `useBuk.ts` legacy |
| 17:00-17:30 | Setup MSW + handlers seedeados desde contracts |
| 17:30-18:00 | Reemplazar hardcoded "Rene Aravena" en Sidebar por `useMe()` |

### Día V5 (Viernes) — CLAUDE.md + Deploy + Smoke

| Hora | Tarea |
|---|---|
| 09:00-12:00 | Redactar 3 `CLAUDE.md` con scope, reglas R1-R10, prohibiciones |
| 12:00-13:00 | Vercel: 3 proyectos linkeados, env vars copiadas |
| 14:00-14:30 | DNS: `app/api/buk.poppins.cl` + wildcard `*.poppins.cl` |
| 14:30-15:00 | Supabase cookies: `domain: '.poppins.cl'`, `secure: true`, `sameSite: 'lax'` |
| 15:00-16:00 | Deploy preview de los 3. Smoke E2E manual |
| 16:00-17:00 | Playwright smoke en `poppins-web/tests/smoke/` |
| 17:00-17:30 | CI Actions en los 4 repos: `lint + typecheck + test + build` |
| 17:30-18:00 | Retro Sprint 0 |

---

## 9. Sprint 1-2 — C0 Security + Multi-tenant (2 agentes)

**Goal:** Cerrar deuda crítica + habilitar multi-tenant para 2do cliente.

### Backlog C0

| ID | Story | Lane | Sprint | Tamaño |
|---|---|---|---|---|
| **POP-C0-01** | `requireScope` en las 59 rutas API sin authz a nivel route | Back | 1 | L |
| **POP-C0-02** | Firma HMAC en webhook BUK + idempotencia con tabla `webhook_events` | Back | 1 | M |
| **POP-C0-03** | Eliminar `.env.local.bak`, ampliar `.gitignore`, rotar anon key | Back | 1 | XS |
| **POP-C0-04** | Quitar `typescript.ignoreBuildErrors: true` + arreglar errores | Back + Front | 2 | M |
| **POP-C0-05** | Sentry en api-id, api-buk, web | Back + Front | 1 | S |
| **POP-C0-06** | Eliminar catch silencioso en `lib/buk/index.ts` | Back | 2 | S |
| **POP-C0-07** | Sidebar `useMe()` (✅ Sprint 0) | Front | done | XS |
| **POP-C0-08** | Headers seguridad CSP/HSTS/X-Frame en los 3 servicios | Back + Front | 2 | S |
| **POP-C0-09** | Lockfile determinístico | Back | 2 | M |
| **POP-C0-10** | Webhook idempotency con tabla `webhook_events` | Back | 1 | S |
| **POP-C0-11** | 📦 **Schema multi-tenant** (migración 0004): tabla `tenants` + `tenant_id` en 14 tablas + RLS actualizada | Back | 2 | L |
| **POP-C0-12** | 📦 **Tenant resolver** (middleware + JWT app_metadata + BUK SDK per-tenant) | Back | 2 | L |
| **POP-C0-13** | 📦 **Seed tenant inicial** desde data actual (todos los datos existentes asignados a tenant default) | Back | 2 | M |
| **POP-C0-14** | 📦 **Rate-limit real con Upstash Redis** (reemplaza in-memory del command-bus) | Back | 2 | M |
| **POP-C0-15** | Correlation-ID propagado web → api-id → api-buk → BUK | Back + Front | 2 | S |

### Plan ejecución Sprint 1

```
Día 1  ──┬─ Back: requireScope framework + scope on /me, /colaboradoras, /empleadores
         └─ Front: Sentry web + breadcrumbs custom

Día 2  ──┬─ Back: aplicar scope a 30 rutas /api/buk/v1/* en api-buk
         └─ Front: terminar Sentry + correlation-id propagation desde fetch

Día 3  ──┬─ Back: webhook HMAC + tabla webhook_events + tests
         └─ Front: prep Sprint 2 (planning POP-C0-04 errors TS)

Día 4  ──┬─ Back: borrar .env.local.bak, rotar Supabase anon key
         └─ Front: integration day — e2e con scope real (Playwright)

Día 5  ──┴─ Sprint review + retro + planning S2
```

### Plan ejecución Sprint 2

```
Día 1  ──┬─ Back: migración 0004 multi-tenant + tabla tenants + tenant_id en todas las tablas
         └─ Front: arreglar errores TS de poppins-web (POP-C0-04)

Día 2  ──┬─ Back: RLS reescrita con tenant_id + helper current_tenant_id()
         └─ Front: continuar errors TS + bug fixes UI consecuencia

Día 3  ──┬─ Back: tenant resolver middleware + BUK SDK per-tenant
         └─ Front: design system de "tenant switcher" UI (preparación)

Día 4  ──┬─ Back: rate-limit Upstash Redis + seed tenant default
         └─ Front: bug bash post-multi-tenant

Día 5  ──┴─ Integration day + retro + planning S3 (C1)
```

### Sprint 1 entry criteria

- ✅ Sprint 0 DoD cumplido
- ✅ Los 2 agentes leyeron `CLAUDE.md` de su repo
- ✅ Las 10 reglas R1-R10 internalizadas
- ✅ Sentry account creado, tokens en Vercel

### Sprint 2 exit criteria → ver §13 (Gate C0 → C1)

---

## 10. Sprint 3-5 — C1 Stabilize + Billing + Onboarding (2 agentes)

**Goal:** Equipo escalable · 2do cliente onboardeable · facturación automática.

### Backlog C1

| ID | Story | Lane | Sprint | Tamaño |
|---|---|---|---|---|
| **POP-C1-01** | CI GitHub Actions estricta + branch protection main | Back + Front | 3 | M |
| **POP-C1-02** | Ambiente staging separado (Supabase + Vercel) con seed data | Back | 3 | M |
| **POP-C1-03** | Vitest setup + tests para `requireScope`, `parseBody`, `handle()` | Back | 3 | M |
| **POP-C1-04** | Playwright smoke: 3 happy paths (admin / empleador / colaboradora) | Front | 3 | L |
| **POP-C1-05** | ADR: command-bus vs route handlers — decisión + cleanup | Back | 3 | M |
| **POP-C1-06** | ADR: `/agents/` real con Claude API o eliminar | Back | 3 | L/XS |
| **POP-C1-07** | Migrar consumers legacy a `@poppins/api-client` | Front | 3 | M |
| **POP-C1-08** | Saga + idempotency-key en `POST /empleadores` | Back | 4 | M |
| **POP-C1-09** | Supabase CLI + migraciones versionadas aplicadas vía CI | Back | 4 | M |
| **POP-C1-10** | Cron Vercel sync BUK → `cache_*` cada 6h por tenant | Back | 4 | M |
| **POP-C1-11** | Patrón uniforme `<DataView>` en todas las listas | Front | 4 | M |
| **POP-C1-12** | Rate-limit OTP login (3/hora por número) + alerta | Back | 3 | S |
| **POP-C1-13** | Migrar `/login` a tokens Poppins + shadcn | Front | 3 | S |
| **POP-C1-14** | PR template + CODEOWNERS + commitlint | All | 3 | XS |
| **POP-C1-15** | Construir `packages/ui` con 8 primitives shadcn aplicados | Front | 3 | L |
| **POP-C1-16** | Migrar dashboard home al patrón Tooxs (Cards/QuickActions con gradient) | Front | 4 | M |
| **POP-C1-17** | Migrar `/colaboradoras` a TanStack Table | Front | 4 | L |
| **POP-C1-18** | Migrar resto pantallas (liquidaciones, vacaciones, etc) | Front | 4-5 | XL split |
| **POP-C1-19** | TanStack Query reemplazando `useQuery` custom | Front | 4 | M |
| **POP-C1-20** | Storybook + Chromatic con 8 primitives + 4 patterns | Front | 5 | M |
| **POP-C1-21** | 💳 **Billing Flow.cl: schema (plans, subscriptions, invoices) + Flow.cl client + tipos plan** | Back | 4 | L |
| **POP-C1-22** | 💳 **Billing webhook Flow.cl** (`payment.success`, `payment.failed`, `subscription.cancelled`) | Back | 4 | M |
| **POP-C1-23** | 💳 **Suspensión por impago: read-only mode** (middleware + UI banner) | Back + Front | 4 | M |
| **POP-C1-24** | 💳 **UI billing portal:** /billing/plans, /billing/invoices, link a Flow.cl checkout | Front | 5 | L |
| **POP-C1-25** | 🚀 **Onboarding wizard 6-step** (nuevo tenant + datos BUK + primer hogar + plan) | Front + Back | 5 | XL |
| **POP-C1-26** | 🚀 **Tenant signup page** + validación BUK token + creación tenant en Supabase | Back | 5 | L |
| **POP-C1-27** | 📧 **Email transactional Resend:** welcome, OTP backup, invoice paid, trial expiring | Back | 4 | M |
| **POP-C1-28** | 📁 **File uploads Supabase Storage** + RLS por tenant + tipos permitidos + antivirus stub | Back + Front | 5 | L |
| **POP-C1-29** | ⚖️ **T&C + Política Privacidad + Cookies banner** (consent management) | Front + Back | 4 | M |
| **POP-C1-30** | ⚖️ **Compliance Ley 19.628:** data export (JSON) + data delete (soft + scheduled hard) | Back | 5 | M |
| **POP-C1-31** | 📊 **PostHog analytics** + funnel signup → first colaboradora | Front | 5 | S |
| **POP-C1-32** | 🚨 **Status page** (Better Uptime o Statuspage) en `status.poppins.cl` | Back | 5 | S |
| **POP-C1-33** | 📱 **Mobile responsive audit** + fixes en pantallas críticas (login, dashboard, colaboradoras, tareas) | Front | 5 | L |
| **POP-C1-34** | ♿ **Accesibilidad WCAG 2.1 AA** (axe-core en CI + fixes contraste gradiente) | Front | 5 | M |
| **POP-C1-35** | 🔍 **Search Postgres FTS** colaboradoras + tareas + documentos | Back + Front | 5 | M |
| **POP-C1-36** | 🛡️ **Dependabot + Snyk + gitleaks** en los 4 repos | All | 4 | S |
| **POP-C1-37** | 💾 **Backup verification:** Supabase PITR configurado + disaster drill documentado | Back | 5 | S |

### Definición de plan tiers (Billing Flow.cl)

```typescript
// Plan tiers iniciales (revisar pricing post 5 clientes reales)
export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthly_price_clp: 9990,        // tentativo, validar con clientes
    max_hogares: 1,
    max_colaboradoras: 2,
    features: ['liquidaciones', 'vacaciones', 'tareas', 'mensajes'],
    trial_days: 14,
  },
  familia: {
    id: 'familia',
    name: 'Familia',
    monthly_price_clp: 19990,
    max_hogares: 3,
    max_colaboradoras: 5,
    features: ['*starter', 'documentos', 'evaluaciones', 'listas_compras'],
    trial_days: 14,
  },
  empresarial: {
    id: 'empresarial',
    name: 'Empresarial',
    monthly_price_clp: null,        // contact sales
    max_hogares: null,              // unlimited
    max_colaboradoras: null,
    features: ['*familia', 'audit_export', 'priority_support', 'sla'],
    trial_days: 30,
  },
} as const;
```

### Sprint plan resumido

| Sprint | Foco principal | Stories |
|---|---|---|
| **S3** | CI + tests + ADRs + design system primitives + migración hooks legacy | C1-01..07, C1-12..15 |
| **S4** | Billing Flow.cl + email + saga + dependabot + Tooxs migrations UI | C1-08..11, C1-19, C1-21..23, C1-27, C1-29, C1-36 |
| **S5** | Onboarding wizard + storybook + uploads + compliance + mobile + a11y + search + status | C1-18, C1-20, C1-24..26, C1-28, C1-30..35, C1-37 |

### Sprint 5: onboarding del 2do supervisor

Día 1-3: shadow del CTO en code reviews del Front (no merge yet)
Día 4-5: comienza a mergear PRs minor de `poppins-web`
Sprint 6+: ownership completo del Front lane

---

## 11. Sprint 6+ — C2 Scale (3 agentes)

**Goal:** Plataforma robusta para 10+ tenants concurrentes.

### Backlog C2

| ID | Story | Trigger |
|---|---|---|
| POP-C2-01 | Mensajería realtime con Supabase Realtime | Users piden chat instantáneo |
| POP-C2-02 | Async PDF generation (Inngest o QStash) | Cliente con >50 empleados |
| POP-C2-03 | Circuit breaker + retries exponenciales BUK SDK | BUK >1 incidente/mes |
| POP-C2-04 | Particionado mensual `audit_log` y `mensajes` | >1M filas |
| POP-C2-05 | Tracing distribuido OpenTelemetry → Honeycomb | SLA contractual con p95 |
| POP-C2-06 | KPIs negocio: MRR, churn, colaboradoras activas, liquidaciones/mes | Sprint 6 |
| POP-C2-07 | RBAC granular (roles custom: contador externo, asesor laboral) | 1er "rol custom" en demanda |
| POP-C2-08 | `cmdk` command palette | Después de Storybook |
| POP-C2-09 | `sonner` toasts globales | Sprint 6 |
| POP-C2-10 | Extracción `packages/ui` → repo separado `tooxs-design-system` | Cuando los 3 productos diverjan |
| POP-C2-11 | A/B testing infra (PostHog feature flags + experiments) | 50+ tenants activos |
| POP-C2-12 | PWA (service worker + offline + install prompt) | Demand mobile-first |
| POP-C2-13 | SOC 2 prep: políticas, evidencias, controles | 1er cliente enterprise pide SOC2 |
| POP-C2-14 | Pentest externo profesional | Antes de GA pública |
| POP-C2-15 | Bug bounty pasivo (HackerOne / openbugbounty) | Post-pentest |
| POP-C2-16 | API pública (rate-limited, key-based) para integraciones de clientes | 1er pedido de integración |
| POP-C2-17 | WhatsApp Business notifications | Demand explícito |
| POP-C2-18 | i18n estructura (incluso solo es-CL hoy) | Antes de expandir LATAM |
| POP-C2-19 | Multi-region Supabase | Demand de Brasil/México |
| POP-C2-20 | React Native app | Cuando WAU mobile >2000 |

---

## 12. MVP Essentials cross-cutting

Estas capabilities **no son features pero son obligatorias** para un MVP serio. Distribuidas en C0/C1/C2.

### 🚀 Onboarding & Lifecycle

| Item | Severidad | Sprint |
|---|---|---|
| Signup empleador (form + email/phone verification) | C1 | 5 |
| Onboarding wizard 6-step | C1 | 5 |
| Magic link / invite colaboradoras | C1 | 5 |
| Welcome email + dashboard tour interactivo | C1 | 5 |
| Trial expiring notifications (7, 3, 1 día) | C1 | 4 |
| Account deletion flow (LGPD) | C1 | 5 |
| Re-activation flow post-suspensión | C2 | 6 |

### 💳 Billing (Flow.cl)

| Item | Severidad | Sprint |
|---|---|---|
| Plans table + 3 tiers definidos | C1 | 4 |
| Flow.cl client + sandbox + prod | C1 | 4 |
| Subscription lifecycle (trial → active → past_due → suspended → cancelled) | C1 | 4 |
| Webhook Flow.cl (payment.success, payment.failed, subscription.cancelled) | C1 | 4 |
| Invoice generation + email PDF | C1 | 4 |
| Suspensión read-only mode | C1 | 4 |
| Billing portal UI (planes, invoices, payment method) | C1 | 5 |
| Plan upgrade/downgrade flow | C2 | 6 |
| Dunning management (retry policy) | C2 | 7 |
| Factura electrónica SII Chile (Bsale integration) | C2 | 7 |
| Coupon / discount codes | C2 | 8 |

### ⚖️ Compliance Chile (Ley 19.628)

| Item | Severidad | Sprint |
|---|---|---|
| Términos y Condiciones publicados | C1 | 4 |
| Política de Privacidad publicada | C1 | 4 |
| Cookies banner con consent management | C1 | 4 |
| Tabla `consent_log` (user_id, type, version, granted_at) | C1 | 4 |
| Acuerdo de tratamiento Poppins ↔ BUK documentado | C1 | 4 |
| Endpoint `GET /compliance/data-export` (JSON con todos los datos del user) | C1 | 5 |
| Endpoint `DELETE /compliance/data-delete` (soft + hard delete después de 30 días) | C1 | 5 |
| Data retention policy documentada | C1 | 5 |
| Data Processing Agreement (DPA) template para clientes enterprise | C2 | 6 |
| SOC 2 Type 1 → Type 2 | C2 | post-MVP |

### 📧 Email transactional (Resend)

| Item | Severidad | Sprint |
|---|---|---|
| Cuenta Resend + dominio verificado (`noreply@poppins.cl`) | C1 | 4 |
| Template engine (react-email) | C1 | 4 |
| Welcome email post-signup | C1 | 4 |
| OTP backup email (cuando SMS falla) | C1 | 4 |
| Trial expiring (7/3/1 día) | C1 | 4 |
| Invoice paid confirmation | C1 | 4 |
| Payment failed → action required | C1 | 4 |
| Magic link invitación colaboradora | C1 | 5 |
| Weekly digest (resumen de actividad) | C2 | 6 |

### 📁 File uploads (Supabase Storage)

| Item | Severidad | Sprint |
|---|---|---|
| Supabase Storage bucket `documentos` con RLS por tenant | C1 | 5 |
| Component `<FileUpload>` (drag-drop, preview, progress) | C1 | 5 |
| Tipos permitidos: PDF, JPG, PNG, DOCX (whitelist) | C1 | 5 |
| Tamaño máx: 10MB | C1 | 5 |
| Antivirus scan (Supabase Function calling ClamAV cloud) | C1 | 5 |
| Signed URLs con expiración 1h | C1 | 5 |
| Versionado de documentos | C2 | 7 |
| OCR de documentos | C2 | post-MVP |

### 🚦 Rate-limiting (Upstash Redis)

| Item | Severidad | Sprint |
|---|---|---|
| Cuenta Upstash + Redis instance | C0 | 2 |
| Middleware rate-limit por tenant_id (1000 req/min default) | C0 | 2 |
| Rate-limit por IP (60 req/min para login/signup) | C0 | 2 |
| Rate-limit OTP (3/hora/teléfono) | C1 | 3 |
| 429 responses con Retry-After header | C0 | 2 |
| Dashboard de rate-limits (admin only) | C2 | 6 |

### 🔍 Search

| Item | Severidad | Sprint |
|---|---|---|
| Postgres FTS (`tsvector` columns + GIN indexes) | C1 | 5 |
| Search en colaboradoras, tareas, documentos, mensajes | C1 | 5 |
| Component `<GlobalSearch>` con cmdk-style | C2 | 6 |
| Meilisearch (cuando >100k registros) | C2 | post-MVP |

### 📱 Mobile responsive

| Item | Severidad | Sprint |
|---|---|---|
| Mobile-first audit todas las pantallas | C1 | 5 |
| Bottom navigation mobile | C1 | 5 |
| Touch targets ≥44px | C1 | 5 |
| Swipe gestures en cards (delete/archive) | C2 | 6 |
| Mobile-specific patterns (drawer en vez de modal en mobile) | C1 | 5 |
| PWA install prompt | C2 | 6 |

### ♿ Accessibility (WCAG 2.1 AA)

| Item | Severidad | Sprint |
|---|---|---|
| `axe-core` en CI (fail si <95 score) | C1 | 5 |
| Audit contraste gradiente magenta sobre claros (sabemos que falla) | C1 | 5 |
| Keyboard navigation en todas las flows críticas | C1 | 5 |
| Skip-to-content link | C1 | 5 |
| ARIA labels en componentes interactivos | C1 | 5 |
| Focus visible custom styling | C1 | 5 |
| Screen reader testing (NVDA + VoiceOver) | C1 | 5 |
| Lighthouse a11y >95 | C1 | 5 |
| Modo alto contraste | C2 | post-MVP |

### 💾 Backup & DR

| Item | Severidad | Sprint |
|---|---|---|
| Supabase Point-in-Time Recovery configurado (7 días) | C1 | 5 |
| Backup verification mensual (restore a staging) | C1 | 5 |
| BUK token rotation procedure documentado | C1 | 5 |
| RPO 1h, RTO 4h targets documentados en runbook | C1 | 5 |
| Disaster recovery drill cuatrimestral | C2 | 6 |
| Multi-region Supabase failover | C2 | post-GA |

### 🚨 Status page & incident response

| Item | Severidad | Sprint |
|---|---|---|
| `status.poppins.cl` (Better Uptime free tier) | C1 | 5 |
| Monitoring endpoints: `app.`, `api.`, `buk.`, `BUK API`, `Supabase` | C1 | 5 |
| Runbooks por servicio en `docs/runbooks/` | C1 | 5 |
| Incident post-mortem template | C1 | 5 |
| Customer communications templates | C1 | 5 |
| On-call rotation (cuando hay 3+ humanos en el equipo) | C2 | 8 |
| PagerDuty / Opsgenie integration | C2 | 8 |

### 📊 Analytics producto

| Item | Severidad | Sprint |
|---|---|---|
| PostHog account + SDK instalado en web | C1 | 5 |
| Funnel: signup → onboarding → first colaboradora → first liquidación | C1 | 5 |
| Cohort retention semanal/mensual | C1 | 5 |
| Feature usage tracking (path: per-route page views) | C1 | 5 |
| Custom events: tarea_creada, liquidacion_vista, evaluacion_enviada | C1 | 5 |
| Heatmaps en pantallas críticas | C2 | 6 |
| A/B testing con feature flags | C2 | 7 |

### ⏱️ Performance budgets

| Item | Target | Sprint |
|---|---|---|
| p95 API latency (excl. BUK) | <500ms | C1 (medido S5) |
| p95 page load | <2.5s | C1 |
| LCP (Largest Contentful Paint) | <2.5s | C1 |
| FID (First Input Delay) | <100ms | C1 |
| CLS (Cumulative Layout Shift) | <0.1 | C1 |
| JS bundle gzipped por route | <250kb | C1 |
| Lighthouse CI por PR (perf >85, a11y >95) | gate | C1 |
| Bundle analyzer en CI | report | C1 |

### 🛡️ Security ops

| Item | Severidad | Sprint |
|---|---|---|
| Dependabot en los 4 repos | C1 | 4 |
| Snyk free tier | C1 | 4 |
| Gitleaks pre-commit + CI | C1 | 4 |
| CodeQL en GitHub Actions | C1 | 4 |
| HTTPS everywhere + HSTS preload | C0 | 2 |
| CSP estricto (no inline scripts) | C0 | 2 |
| Secrets rotation procedure (BUK, Supabase, Sentry, Resend) | C1 | 5 |
| Pentest externo profesional | C2 | pre-GA |
| Bug bounty | C2 | post-GA |

### 🚩 Feature flags

| Item | Severidad | Sprint |
|---|---|---|
| GrowthBook self-hosted (gratis) o Supabase config table | C1 | 5 |
| Kill switches para features riesgosas | C1 | 5 |
| Gradual rollout por tenant | C2 | 6 |
| A/B test infrastructure | C2 | 7 |

### 📖 API documentation

| Item | Severidad | Sprint |
|---|---|---|
| OpenAPI generado desde Zod (zod-to-openapi) en `@poppins/contracts` | C0 | 2 |
| Hosted Stoplight Elements en `api-docs.poppins.cl` | C1 | 5 |
| Postman collection auto-generada | C1 | 5 |
| Code examples por endpoint | C2 | 6 |

### 🇨🇱 i18n / Chile localization

| Item | Severidad | Sprint |
|---|---|---|
| Zona horaria America/Santiago default | C0 | 2 |
| Formato CLP sin decimales (`$1.500.000`) | C1 | 4 |
| Fechas es-CL (`26 may 2026`) | C1 | 4 |
| RUT validator + formatter centralizado (npm package) | C1 | 4 |
| next-intl scaffolding (incluso si solo es-CL) | C2 | 6 |
| pt-BR, es-AR, es-MX | C2 | post-MVP |

---

## 13. Gates de calidad C0 → C1 → C2 → GA

> **Filosofía:** Cada transición de tier requiere **tests E2E concretos verdes**. Sin esto, los tiers son aspiracionales, no validables.

### 🚪 Gate C0 → C1 (fin Sprint 2)

**Pre-condiciones:**
- ✅ Todas las stories C0 cerradas en `main`
- ✅ CI verde en los 4 repos
- ✅ Sentry recibiendo eventos de los 3 servicios

**E2E tests obligatorios (todos verdes):**

```typescript
// tests/gates/c0-to-c1.e2e.ts

test.describe('C0 → C1 Gate', () => {

  // === SECURITY ===

  test('Anonymous request to /api/v1/colaboradoras returns 401', async () => {
    const res = await fetch('https://api.poppins.cl/v1/colaboradoras');
    expect(res.status).toBe(401);
  });

  test('Colaboradora cannot read another user payroll', async () => {
    const tokenA = await loginAs('colaboradora-A');
    const res = await fetch('https://buk.poppins.cl/v1/liquidaciones?colaboradora_id=<id-B>', {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    expect(res.status).toBe(403);
  });

  test('Empleador A cannot read empleador B hogar', async () => {
    const tokenA = await loginAs('empleador-A');
    const res = await fetch(`https://api.poppins.cl/v1/hogares/${HOGAR_B_ID}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    expect(res.status).toBe(403);
  });

  // === MULTI-TENANT ===

  test('Tenant A cannot read tenant B data even with valid JWT', async () => {
    const tokenTenantA = await loginAs('admin@tenant-a.com');
    const res = await fetch(`https://api.poppins.cl/v1/colaboradoras?tenant_id=${TENANT_B_ID}`, {
      headers: { Authorization: `Bearer ${tokenTenantA}` }
    });
    // RLS bloquea, devuelve [] o 403
    expect((await res.json()).data).toEqual([]);
  });

  test('BUK SDK uses correct token per tenant', async () => {
    const tokenT1 = await loginAs('admin@tenant-1.com');
    const tokenT2 = await loginAs('admin@tenant-2.com');

    const t1Employees = await getEmployees(tokenT1);
    const t2Employees = await getEmployees(tokenT2);

    expect(t1Employees).not.toEqual(t2Employees);
    // Cada uno fue a su BUK organization
  });

  // === WEBHOOK SECURITY ===

  test('Webhook BUK without signature returns 401', async () => {
    const res = await fetch('https://buk.poppins.cl/webhooks/buk', {
      method: 'POST',
      body: JSON.stringify({ data: { event_type: 'employee_update' } }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(res.status).toBe(401);
  });

  test('Webhook BUK with valid HMAC returns 200', async () => {
    const payload = JSON.stringify({ data: { event_type: 'employee_update', employee_id: 123 } });
    const signature = hmacSha256(payload, BUK_WEBHOOK_SECRET);
    const res = await fetch('https://buk.poppins.cl/webhooks/buk', {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'X-Buk-Signature': signature
      }
    });
    expect(res.status).toBe(200);
  });

  test('Webhook BUK idempotency: same event twice processed once', async () => {
    const payload = { data: { event_type: 'employee_update', employee_id: 999, _id: 'evt_unique_123' } };
    await postWebhook(payload);
    await postWebhook(payload); // second time
    const count = await countAuditLog({ resource_id: 'evt_unique_123' });
    expect(count).toBe(1);
  });

  // === BUILD INTEGRITY ===

  test('Build passes with typescript.ignoreBuildErrors: false', async () => {
    const result = await shell('cd poppins-api-id && npm run build');
    expect(result.exitCode).toBe(0);
  });

  test('No secrets in git history', async () => {
    const result = await shell('gitleaks detect --source poppins-api-id');
    expect(result.exitCode).toBe(0);
  });

  // === OBSERVABILITY ===

  test('Sentry receives exception when API throws', async () => {
    await triggerTestException();
    await sleep(2000); // wait for ingest
    const events = await sentryAPI.fetchRecent({ tag: 'test-c0-gate' });
    expect(events.length).toBeGreaterThan(0);
  });

  test('Correlation-id propagates web → api-id → api-buk', async () => {
    const correlationId = 'test-' + Date.now();
    const res = await fetch('https://app.poppins.cl/dashboard/colaboradoras', {
      headers: { 'x-request-id': correlationId }
    });
    // Verificar que el id apareció en logs de api-id y api-buk
    const apiIdLogs = await sentryAPI.search({ tag: `correlation_id:${correlationId}` });
    const apiBukLogs = await sentryAPI.search({ tag: `correlation_id:${correlationId}` });
    expect(apiIdLogs.length).toBeGreaterThan(0);
    expect(apiBukLogs.length).toBeGreaterThan(0);
  });

  // === RATE LIMITING ===

  test('Rate-limit Upstash works (not in-memory)', async () => {
    // Hacer 1001 requests rápidos
    const requests = Array(1001).fill(null).map(() =>
      fetch('https://api.poppins.cl/v1/me', { headers: authHeader })
    );
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
    // El header Retry-After existe
    expect(rateLimited[0].headers.get('Retry-After')).toBeDefined();
  });

  // === AUTHZ COVERAGE ===

  test('100% of /api/v1/* routes have requireScope', async () => {
    const routes = await scanRoutes('poppins-api-id/src/app/api');
    const protectedRoutes = routes.filter(r => r.usesRequireScope);
    expect(protectedRoutes.length).toBe(routes.length);
  });

});
```

**Métricas que también deben validar:**

| Métrica | Target |
|---|---|
| % rutas API con authz a nivel route | 100% |
| Sentry errors/24h | <50 |
| CI green rate última semana | >95% |
| Builds sin `ignoreBuildErrors` | 100% |

**Si UNO de estos tests falla:** Sprint 3 (C1) NO arranca. Se vuelve al sprint anterior a cerrarlo.

---

### 🚪 Gate C1 → C2 (fin Sprint 5)

**Pre-condiciones:**
- ✅ Todas las stories C1 cerradas
- ✅ 2do supervisor onboarded
- ✅ Staging environment estable

**E2E tests obligatorios:**

```typescript
// tests/gates/c1-to-c2.e2e.ts

test.describe('C1 → C2 Gate', () => {

  // === HAPPY PATHS POR ROL ===

  test('Admin happy path: login → CRUD colaboradora → ver liquidación', async () => {
    await loginAs('admin@tenant.com');
    await createColaboradora({ rut: '12.345.678-9', nombre: 'María Test' });
    const colab = await waitForColaboradora('12.345.678-9');
    const liq = await viewLiquidacion(colab.id, '2026-04');
    expect(liq.estado).toBe('Pagado');
  });

  test('Empleador happy path: login → ver SU hogar → asignar tarea → ver SU liquidación', async () => {
    await loginAs('empleador-a@tenant.com');
    const hogar = await viewMyHogar();
    expect(hogar.id).toBe(HOGAR_A_ID);
    await assignTask(COLAB_ID, { titulo: 'Limpiar cocina', prioridad: 'alta' });
    const liq = await viewLiquidacion(COLAB_ID, '2026-04');
    expect(liq).toBeDefined();
  });

  test('Colaboradora happy path: login → ver tareas → marcar completada → ver MI liquidación', async () => {
    await loginAs('colaboradora-test@tenant.com');
    const tareas = await viewMyTareas();
    expect(tareas.length).toBeGreaterThan(0);
    await markTareaCompleted(tareas[0].id);
    const liq = await viewMyLiquidacion('2026-04');
    expect(liq.empleadoId).toBe(MY_BUK_EMPLOYEE_ID);
  });

  // === ONBOARDING ===

  test('Signup → onboarding wizard 6-step → first dashboard load <60s', async () => {
    const startTime = Date.now();
    await signup({ email: 'new@test.com', phone: '+56912345678' });
    await verifyOTP('123456');
    await completeOnboarding({
      tenant_name: 'Familia Test',
      buk_api_token: 'test-token',
      buk_company_id: 1,
      hogar_name: 'Casa Principal',
      plan: 'starter'
    });
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(60000);
    expect(window.location.pathname).toBe('/dashboard');
  });

  test('Tenant signup creates tenants row + first user_profile', async () => {
    await signup({ email: 'unique@test.com' });
    await completeOnboarding({ tenant_name: 'Unique Tenant' });
    const tenant = await db.tenants.findBy({ slug: 'unique-tenant' });
    expect(tenant).toBeDefined();
    const profile = await db.user_profiles.findBy({ tenant_id: tenant.id });
    expect(profile.rol).toBe('admin');
  });

  // === BILLING ===

  test('Flow.cl webhook payment.success activates subscription', async () => {
    const sub = await createTrialSubscription(TENANT_ID);
    await postFlowWebhook({
      type: 'payment.success',
      subscription_id: sub.flow_subscription_id,
      invoice_id: 'inv_001'
    });
    const updated = await db.subscriptions.findById(sub.id);
    expect(updated.status).toBe('active');
    const invoice = await db.invoices.findBy({ flow_payment_id: 'inv_001' });
    expect(invoice.status).toBe('paid');
  });

  test('Suspended tenant gets read-only mode', async () => {
    await suspendTenant(TENANT_ID);
    const tokenT = await loginAs('admin@tenant.com');
    // GET sigue funcionando
    const getRes = await fetch('https://api.poppins.cl/v1/colaboradoras', {
      headers: { Authorization: `Bearer ${tokenT}` }
    });
    expect(getRes.status).toBe(200);
    // POST bloqueado
    const postRes = await fetch('https://api.poppins.cl/v1/colaboradoras', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenT}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: 'X' })
    });
    expect(postRes.status).toBe(402); // Payment Required
  });

  test('Trial expiring triggers email 7/3/1 days before', async () => {
    const tenant = await createTenant({ trial_ends_at: addDays(now(), 7) });
    await runCron('trial-notifications');
    const emails = await resendAPI.fetchSent({ to: tenant.contact_email });
    expect(emails.some(e => e.subject.includes('expira en 7 días'))).toBe(true);
  });

  // === COMPLIANCE ===

  test('Data export returns JSON with all user data', async () => {
    const token = await loginAs('user@test.com');
    const res = await fetch('https://api.poppins.cl/compliance/data-export', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user_profile).toBeDefined();
    expect(data.tareas).toBeDefined();
    expect(data.mensajes).toBeDefined();
  });

  test('Data delete soft-deletes immediately + hard-deletes after 30 days', async () => {
    const token = await loginAs('delete-me@test.com');
    await fetch('https://api.poppins.cl/compliance/data-delete', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    // Inmediato: marked for deletion
    const profile = await db.user_profiles.findBy({ email: 'delete-me@test.com' });
    expect(profile.deletion_scheduled_at).toBeDefined();
    // Simular 31 días después
    await runCron('hard-delete', { now: addDays(now(), 31) });
    const after = await db.user_profiles.findBy({ email: 'delete-me@test.com' });
    expect(after).toBeNull();
  });

  test('Cookie banner blocks analytics until consent given', async () => {
    await visitAsNewUser('https://app.poppins.cl');
    expect(await getPostHogCookies()).toEqual([]);
    await acceptCookies();
    expect(await getPostHogCookies().length).toBeGreaterThan(0);
  });

  // === EMAIL ===

  test('Welcome email sent after signup', async () => {
    const email = `test-${Date.now()}@test.com`;
    await signup({ email });
    await sleep(2000);
    const emails = await resendAPI.fetchSent({ to: email });
    expect(emails.some(e => e.subject.includes('Bienvenido'))).toBe(true);
  });

  // === FILE UPLOADS ===

  test('Upload PDF to documentos with tenant isolation', async () => {
    const tokenA = await loginAs('admin@tenant-a.com');
    const file = createPDF('Contrato.pdf');
    const upload = await uploadFile(tokenA, file);
    expect(upload.url).toContain(`tenant-a/`);

    // Tenant B no puede descargar
    const tokenB = await loginAs('admin@tenant-b.com');
    const downloadRes = await fetch(upload.url, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    expect(downloadRes.status).toBe(403);
  });

  // === PERFORMANCE ===

  test('p95 API latency <500ms (last 24h staging)', async () => {
    const stats = await sentryAPI.getPerformance({ env: 'staging', hours: 24 });
    expect(stats.p95).toBeLessThan(500);
  });

  test('Lighthouse a11y >95 on critical pages', async () => {
    const pages = ['/', '/login', '/dashboard', '/colaboradoras'];
    for (const path of pages) {
      const result = await lighthouse(`https://app.poppins.cl${path}`, { onlyCategories: ['accessibility'] });
      expect(result.lhr.categories.accessibility.score * 100).toBeGreaterThan(95);
    }
  });

  test('Bundle size <250kb gzipped per route', async () => {
    const sizes = await bundleAnalyzer('poppins-web');
    Object.entries(sizes).forEach(([route, size]) => {
      expect(size.gzipped).toBeLessThan(250 * 1024);
    });
  });

  // === STATUS PAGE ===

  test('status.poppins.cl is reachable and shows operational', async () => {
    const res = await fetch('https://status.poppins.cl');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Operational');
  });

  // === SEARCH ===

  test('Search colaboradoras by name returns results in <300ms', async () => {
    const start = Date.now();
    const res = await fetch('https://api.poppins.cl/v1/search?q=María&type=colaboradora', {
      headers: { Authorization: authHeader }
    });
    const elapsed = Date.now() - start;
    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(300);
  });

});
```

**Métricas:**

| Métrica | Target |
|---|---|
| Tests automatizados | >80 |
| Cobertura `lib/api` y `lib/buk-sdk` | >70% |
| Deployment frequency | >2/día |
| Lead time PR → prod | <2h |
| MTTR | <2h |
| Lighthouse perf | >85 |
| Lighthouse a11y | >95 |
| Sentry errors/semana | <20 |

---

### 🚪 Gate C2 → GA (fin Sprint 7+)

**Pre-condiciones:**
- ✅ 10+ tenants concurrentes en producción sin issues
- ✅ Pentest externo aprobado
- ✅ Disaster recovery drill exitoso
- ✅ SLA público publicado

**E2E tests obligatorios:**

```typescript
test.describe('C2 → GA Gate', () => {

  // === LOAD ===

  test('Sustained 100 RPS for 10 minutes, p95 <800ms', async () => {
    const result = await k6Run({
      vus: 100,
      duration: '10m',
      url: 'https://api.poppins.cl/v1/colaboradoras'
    });
    expect(result.metrics.http_req_duration.p95).toBeLessThan(800);
    expect(result.metrics.http_req_failed.rate).toBeLessThan(0.001); // <0.1%
  });

  // === CHAOS ===

  test('api-buk down → api-id degrades gracefully', async () => {
    await chaosKill('api-buk');
    const res = await fetch('https://api.poppins.cl/v1/me', {
      headers: { Authorization: authHeader }
    });
    expect(res.status).toBe(200); // /me sigue funcionando
    expect((await res.json()).buk_employee).toBeNull(); // pero sin data BUK
  });

  test('Circuit breaker opens after 5 consecutive BUK failures', async () => {
    await chaosBUKFail(5);
    const res = await fetch('https://buk.poppins.cl/v1/liquidaciones', {
      headers: { Authorization: authHeader }
    });
    expect(res.status).toBe(503);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });

  // === DISASTER RECOVERY ===

  test('Restore from Supabase PITR backup in <2h', async () => {
    const drillStart = Date.now();
    await restoreSupabaseToStaging({ pointInTime: subHours(now(), 1) });
    const restoreTime = Date.now() - drillStart;
    expect(restoreTime).toBeLessThan(2 * 60 * 60 * 1000); // 2h
    // Verificar integridad
    const tenants = await stagingDb.tenants.count();
    expect(tenants).toBeGreaterThan(0);
  });

  // === MULTI-TENANT SCALE ===

  test('10 tenants concurrent CRUD no cross-contamination', async () => {
    const tenants = await createTenants(10);
    const results = await Promise.all(tenants.map(t => crudCycle(t)));
    results.forEach((r, i) => {
      expect(r.created.tenant_id).toBe(tenants[i].id);
      expect(r.listed.every(item => item.tenant_id === tenants[i].id)).toBe(true);
    });
  });

  // === SECURITY ===

  test('Pentest report shows 0 high/critical findings', async () => {
    const report = await loadPentestReport();
    expect(report.findings.high.length).toBe(0);
    expect(report.findings.critical.length).toBe(0);
  });

});
```

**Métricas:**

| Métrica | Target |
|---|---|
| Uptime (status.poppins.cl) | >99.5% últimos 30 días |
| MTTR | <30min |
| Change failure rate | <10% |
| Deployment frequency | >5/día |
| Tenants concurrentes sin issues | 10+ |
| Pentest findings high/critical | 0 |

---

## 14. Las 10 reglas inviolables (R1-R10)

| # | Regla | Razón |
|---|---|---|
| **R1** | Ningún archivo en `poppins-web` importa de `poppins-api-*`. Ni runtime ni types. | Si lo hace, son el mismo programa. |
| **R2** | Ningún archivo en `poppins-api-*` importa de `poppins-web`. | Mismo principio. |
| **R3** | `poppins-web` consume **solo** `@poppins/api-client`. Nunca fetch crudo a `/api`. | Garantiza tipado y MSW-ability. |
| **R4** | Todo handler valida I/O contra schemas de `@poppins/contracts`. Sin schema, no hay handler. | Contrato verificable. |
| **R5** | Cuando hay Back-A y Back-B separados, no editan archivos del otro lane sin PR con label `cross-lane`. | Evita conflicts. |
| **R6** | Cambio breaking en `contracts` requiere 3 PRs sincronizados + ambos supervisores aprueban. | Evita prod desincronizado. |
| **R7** | Front no espera al back. Si el contrato existe, Front trabaja contra MSW. | Paralelismo real. |
| **R8** | Auth cookies en `.poppins.cl`. Local dev usa `/etc/hosts` con `*.poppins.local`. | Sesión compartida. |
| **R9** | Cron jobs y webhooks viven solo en `poppins-api-buk` (excepto Flow.cl webhook que vive en `poppins-api-id`). | Cada cosa en su lugar. |
| **R10** | Logs estructurados con `correlation-id` propagado: web → api-id → api-buk → BUK. | Debug cross-service. |

**Regla extra introducida en v1.1:**

| **R11** | **Toda operación que mute datos pasa por verificación de tenant_id antes de la query/insert. Sin `tenant_id` derivado de JWT, la operación falla.** | **Tenant isolation: prevenir cross-tenant data leak.** |

---

## 15. Cómo arrancar cada agente Claude Code

### Sprint 0 — 1 agente

```bash
cd ~/code/Poppins-back
claude
# Lee docs/PLAN_MAESTRO.md + CLAUDE.md raíz
# Ejecuta playbook Sprint 0 día por día
```

### Sprint 1-5 — 2 agentes

**Terminal 1 — Back**
```bash
cd ~/code/poppins-api-id   # repo backend principal
claude
# CLAUDE.md local. Scope: api-id + acceso a api-buk para coordinación.
```

**Terminal 2 — Front**
```bash
cd ~/code/poppins-web
claude
# CLAUDE.md local. Scope: solo poppins-web.
```

### Sprint 6+ — 3 agentes

```bash
# Terminal 1 — Back-A
cd ~/code/poppins-api-id && claude

# Terminal 2 — Back-B
cd ~/code/poppins-api-buk && claude

# Terminal 3 — Front
cd ~/code/poppins-web && claude
```

---

## 16. KPIs, DORA y métricas

### Targets por fase

| Métrica | Baseline | S2 (post C0) | S5 (post C1) | S8+ (C2) | GA |
|---|---|---|---|---|---|
| Rutas API con authz | 26% | 100% | 100% | 100% | 100% |
| Tests automatizados | 0 | 30 | 80+ | 200+ | 300+ |
| Cobertura crítica | 0% | 50% | >70% | >80% | >85% |
| Deploy frequency | ad-hoc | >1/día | >2/día | >5/día | >10/día |
| Lead time PR → prod | s/m | <4h | <2h | <1h | <30min |
| MTTR | ∞ | <4h | <2h | <30min | <15min |
| Change failure rate | ? | <20% | <15% | <10% | <5% |
| Sentry errors/sem | ? | <50 | <20 | <10 | <5 |
| **Tenants activos** | 1 | 1-2 | 5-10 | 10-25 | 50+ |
| **MRR** | $0 | $0 | $200k CLP | $1M CLP | $5M+ CLP |

---

## 17. Risk register

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| POP-C0-01 destapa endpoints UI sin scope → UI rota | Alta | Alto | Feature-flag `STRICT_SCOPE` por ruta · canary release |
| Quitar `ignoreBuildErrors` revela 50+ errors TS | Media | Medio | Buffer 2 días · `@ts-expect-error` con TODO |
| Migración Supabase 0004 (multi-tenant) rompe RLS | Media | Alto | Backup pre · staging dry-run · ventana sábado |
| Cookies `.poppins.cl` no funcionan local | Media | Medio | `/etc/hosts` con `*.poppins.local` |
| Agente Front genera tipos a mano vs api-client | Alta | Alto | CLAUDE.md scope explícito + lint rule custom |
| Cambio de contrato sin ambos supervisores | Media | Alto | CODEOWNERS de contracts requiere 2 approvals para major |
| BUK rate-limit dispara 429 en agente | Media | Medio | MSW activo en dev |
| Drift Node/pnpm version entre agentes | Baja | Medio | `.nvmrc` + `engines` + Volta |
| 2 agentes editan mismo archivo `_shared/` | Alta (en 3-agent mode) | Medio | Lock-file approach: issue + espera turno |
| Logo PNG no escala favicon 32px | Alta | Bajo | Vectorizar en Sprint 1 |
| Sentry quota burns | Baja | Bajo | Sampling + ignore rules |
| BUK cambia auth sin aviso | Baja | Alto | Cache local + circuit breaker C2 |
| Sprint 0 cutover cae a mitad | Media | Alto | Commits atómicos diarios |
| **Flow.cl sandbox != prod behavior** | **Media** | **Medio** | **Smoke test contra prod con $1 antes de cutover** |
| **Multi-tenant cross-leak bug** | **Media** | **Crítico** | **Tests E2E exhaustivos en cada PR · R11 enforcement · RLS audit semanal** |
| **2do supervisor onboarding entre tarde** | **Media** | **Medio** | **Buffer 1 sprint · agent-front bajo review CTO mientras tanto** |
| **Compliance Ley 19.628 hallazgo legal** | **Baja** | **Alto** | **Asesoría legal pre-GA · DPA con BUK firmado** |
| **Gradiente brand falla a11y** | **Confirmado** | **Medio** | **Solo sobre dark backgrounds o decoración · audit axe-core** |

---

## 18. Lean Canvas + Competitive Positioning vs Domestikco

> *Esta sección responde a la pregunta que el plan v1.1 no respondía: **para quién y por qué construimos esto, y cómo ganamos contra el competidor existente.***

### 18.1 Lean Canvas Poppins v1.0

| # | Bloque | Contenido |
|---|---|---|
| **1** | **Problema** | (a) Las madres/empleadoras chilenas pierden 6-8h/mes en trámites laborales para nanas/asesoras (liquidaciones, vacaciones, finiquitos, AFP). (b) Tienen miedo a multas DT por errores formales. (c) BUK es el motor laboral líder pero está diseñado para empresas, no familias. (d) Domestikco existe pero requiere asesor humano, no es self-service, UX limitada. |
| **2** | **Segmento de cliente (ICP)** | Mujer 30-55 años, profesional o ejecutiva, vive en Santiago metropolitano (Las Condes, Vitacura, Lo Barnechea, Providencia, La Reina, Ñuñoa), tiene 1-3 trabajadoras de casa particular, ingreso familiar >$3M CLP/mes, valora su tiempo por encima de $20k/mes para evitar dolor administrativo. |
| **3** | **Propuesta única de valor** | **"ERP doméstico profesional. La potencia de BUK, la simpleza de tu hogar. Magia en tu casa."** |
| **4** | **Solución** | (a) Liquidaciones automáticas (motor BUK). (b) Onboarding self-service 6-step en <10min. (c) Mobile-first PWA responsive. (d) Chat IA Gemini 24/7 con escalamiento humano. (e) Multi-hogar en Plan Pro. (f) Vacaciones, ausencias, horas extra, beneficios, documentos en un lugar. (g) Notificaciones proactivas (vence contrato, vacaciones acumuladas, próxima liquidación). |
| **5** | **Canales** | (1) Google Ads "liquidación nana Chile", "calculadora finiquito empleada doméstica", "ley 20.786". (2) Instagram/Facebook lookalike sector ABC1 Santiago. (3) Programa referidos (1 mes gratis por invitado). (4) Partnerships agencias servicio doméstico premium (Hogar Plus, Domesticum, agencias barrio alto). (5) Content marketing SEO blog "guía empleadora 2026", "calculadora liquidación", "qué dice la ley 20.786". (6) Influencer marketing micro (mamis lifestyle Instagram). |
| **6** | **Flujo de ingresos** | Suscripción mensual recurrente vía Flow.cl. **Starter $9,990/mes** (1 hogar, 2 colaboradoras). **Pro $19,990/mes** (3 hogares, 5 colaboradoras). **Empresarial** custom (agencias, RRHH corporativo). Trial 14 días sin tarjeta. Descuento anual 20% (a definir post-PMF). |
| **7** | **Estructura de costos** | Infra ~US$130/mes fijo (Vercel + Supabase + Sentry + Resend + Upstash + PostHog + Better Uptime). Costo BUK por tenant (a negociar — pre-MVP usamos token Tooxs como tenant inicial). Twilio SMS ~$50 CLP/OTP. Gemini API ~$5 USD/1k mensajes. Equipo: CTO + Product Lead + 3 agentes Claude Code (~US$300-600/mes en tokens). Marketing CPL target: $3,000-5,000 CLP/lead calificado. |
| **8** | **Métricas clave** | MRR · Tenants activos · CAC blended · Trial → paid conversion (target >25%) · Churn mensual (target <5%) · NPS (target >40) · Activation rate (1ra liquidación generada en <14 días post-signup) · Time-to-first-value (<10min post-signup) |
| **9** | **Ventaja injusta** | (a) **Integración BUK** con motor laboral profesional certificado Chile (Domestikco hace todo casero, riesgo de bugs legales). (b) **Stack moderno full-React 19 + Tailwind 4 + shadcn** (Domestikco stack desconocido pero parece menos sofisticado). (c) **Design system propio v1.0** con manual de marca formal (Domestikco UX descrita como "simple" sin claridad). (d) **Agente IA Gemini 24/7** (Domestikco depende de humanos en WhatsApp, no escala). (e) **Self-service real desde día 1** (Domestikco requiere asesor para regularizar). (f) **Multi-tenant arch desde día 1** preparado para LATAM expansion. |

### 18.2 Kill criteria

> *Si NO logramos **20 clientes pagantes en los 3 meses post-launch del MVP** (esperado fin Sprint 6 = ~semana 13), pausamos inversión adicional y revaluamos: pivot, doble down con feedback específico, o sunset.*

Métrica complementaria de kill: si **trial → paid conversion <10%** o **churn >15%/mes** sostenido por 3 meses, también activa kill criterion (señal de no-PMF).

### 18.3 Competitive Positioning vs Domestikco

#### Comparativa feature-by-feature

| Feature | Domestikco | Poppins | Ventaja |
|---|---|---|---|
| **Trial real sin tarjeta** | ❌ Solo "consulta gratis" | ✅ 14 días free, sin TC | 🟢 Poppins |
| **Web responsive completo** | ❌ Mobile-app first, web limitado | ✅ Web + PWA mobile-first | 🟢 Poppins |
| **Self-service onboarding** | ❌ Requiere asesor humano | ✅ Wizard 6-step <10min | 🟢 Poppins |
| **Multi-hogar** | ❌ Por plan: 1 o 3 max | ✅ Ilimitado en Pro/Enterprise | 🟢 Poppins |
| **Motor laboral** | Propio (caja negra) | **BUK** (líder Chile, certificado DT) | 🟢 Poppins |
| **Support 24/7** | ❌ WhatsApp humano, horario laboral | ✅ Agente IA Gemini + escalamiento | 🟢 Poppins |
| **Pricing entrada** | $12,990/mes (1 trabajador) | **$9,990/mes (2 colaboradoras)** | 🟢 Poppins -23% precio y 2x capacidad |
| **Stack tecnológico** | Sin claridad pública | Next 16 + React 19 + Tailwind 4 + shadcn base-nova | 🟢 Poppins |
| **Multi-tenant arquitectura** | ? (mono-cliente probable) | ✅ Desde día 1 | 🟢 Poppins (escala) |
| **API pública** | ❌ No mencionada | ✅ OpenAPI desde contracts (post-MVP) | 🟢 Poppins |
| **Analytics tenant** | ❌ No mencionado | ✅ PostHog en dashboard (C1) | 🟢 Poppins |
| **Compliance Ley 19.628 explícito** | Parcial (ACHS sí) | ✅ Data export + delete + consent log | 🟢 Poppins |
| **Manual de marca formal** | ❌ Inexistente público | ✅ v1.0 con gradiente + tipografía | 🟢 Poppins |
| **Academia trabajadoras** | ✅ Tienen | ❌ Post-MVP | 🔴 Domestikco |
| **Job matching** | ✅ "Match Laboral" | ❌ Post-MVP | 🔴 Domestikco |
| **Seguro ACHS integrado** | ✅ Partnership | ❌ Documentar partnership post-MVP | 🔴 Domestikco |
| **Asesoría legal humana** | ✅ Asesores profesionales | ❌ Solo IA + email en MVP | 🔴 Domestikco (mitigable C2) |
| **2,400+ usuarios actuales** | ✅ Social proof | ❌ Empezamos en 0 | 🔴 Domestikco (mitigable: referrals + content) |
| **Marca Chile / BID Lab** | ✅ Endorsements | ❌ Sin endorsements aún | 🔴 Domestikco (mitigable C2) |

**Score:** 🟢 Poppins 13 / 🔴 Domestikco 6

#### Estrategia de posicionamiento

**Lo que NO peleamos:** breadth (academia, matching, seguros). Eso es ecosistema y Domestikco ya lo construyó. Pelearles ahí es competir en su cancha.

**Lo que SÍ peleamos — profundidad y experiencia:**
- **"Domestikco es para regularizar. Poppins es para gestionar."** Domestikco vende compliance ("evita la multa"). Poppins vende productividad ("recupera tu tiempo").
- **"El motor BUK en tu hogar."** Posicionamiento técnico que justifica el premium de marca y diferencia.
- **"Sin asesores. Sin esperas. Sin papeleo. Tu hogar, automatizado."** Self-service como bandera.

#### Vector de ataque competitiva (orden cronológico)

| Fase | Vector | Cómo |
|---|---|---|
| **Pre-MVP (Sprint 0-5)** | Construir el producto 10x | Foco ejecución |
| **MVP launch (Sprint 6)** | Trial 14 días sin TC viral | Landing page con calculadora de finiquito SEO + Google Ads "liquidación nana" |
| **Mes 1-3 post-MVP** | Capturar 20 clientes ICP puros | Referidos premium (1 mes gratis), partnerships agencias barrio alto |
| **Mes 4-6 post-MVP** | Diferenciador agente IA Gemini | Marketing: "soporte 24/7 sin esperar a oficina" |
| **Mes 6-12** | Cerrar gaps (academia opcional, seguros partnerships) | Sumar features ecosistémicas sin perder foco de profundidad |
| **Año 2** | Expansión LATAM (Perú primero) | Multi-tenant arch ya lo permite, sumar adapter local de motor laboral |

---

## 19. Engineering Excellence (Bucket E)

> *Esta sección define las prácticas de ingeniería que diferencian un MVP de "código que funciona" de un MVP de "plataforma sólida". Son las prácticas que un CTO con 20 años aplicaría desde día 1.*

### 19.1 Architecture Decision Records (ADRs) — OBLIGATORIOS

#### Política

Cualquier decisión que **afecta más de una capa** o que un futuro dev podría cuestionar ("¿por qué hicimos esto así?") **requiere ADR antes de implementar**. Sin ADR, no hay merge.

#### Template estandarizado

Archivo: `poppins-contracts/docs/adr/_template.md`

```markdown
# ADR-NNN: [Título corto, presente, decisión-no-pregunta]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Date:** YYYY-MM-DD
**Decision-makers:** [CTO, Product Lead, agente que propuso]
**Categoría:** Técnica | Producto | Seguridad | Data | Operaciones

## Contexto

[¿Qué fuerza nos llevó a tomar esta decisión? ¿Qué problema resolvemos?]

## Decisión

[La decisión específica, en presente. "Adoptamos X" no "Vamos a adoptar X".]

## Consecuencias

### Positivas
- [Lista de beneficios]

### Negativas / Trade-offs
- [Lista honesta de costos]

### Neutras
- [Cambios que no son ni buenos ni malos pero hay que conocer]

## Alternativas consideradas

### Alternativa A: [Nombre]
- Pros / Contras
- Por qué no la elegimos

### Alternativa B: [Nombre]
- Pros / Contras
- Por qué no la elegimos

## Referencias

- [Links a discusiones, RFCs, docs externos]
```

#### ADRs iniciales requeridos (Sprint 0)

| # | Título | Owner | Sprint |
|---|---|---|---|
| ADR-001 | 4 repos vs monorepo: elegimos 4 repos físicos | CTO | 0 |
| ADR-002 | BUK como source-of-truth del dominio laboral-legal | CTO | 0 |
| ADR-003 | Multi-tenancy desde día 1 con tenant_id + RLS doble capa | CTO | 0 |
| ADR-004 | Flow.cl como gateway de billing (vs Stripe / Transbank directo) | CTO | 4 |
| ADR-005 | Phone OTP vía Supabase como auth primario | CTO | 0 |
| ADR-006 | shadcn/ui style `base-nova` como component foundation | Product Lead | 0 |
| ADR-007 | 2 supervisores humanos con tier-based merger approval | CTO | 0 |
| ADR-008 | Service-to-service auth: JWT propagation (no inter-service trust) | CTO | 0 |
| ADR-009 | Subdomain-based tenancy (`<slug>.poppins.cl`) vs path-based | CTO | 2 |
| ADR-010 | Email transactional: Resend (vs SendGrid, Mailgun) | CTO | 4 |
| ADR-011 | Gemini API como agente de soporte IA (vs Claude API, GPT-4) | Product Lead | post-MVP |
| ADR-012 | Cache strategy: Edge (Vercel) + Materialized views (Supabase) + Redis (Upstash) | CTO | 2 |

#### Review cadencia

- ADRs nuevos: review en sync semanal de supervisores
- ADRs `Accepted` pero >6 meses sin re-validación: re-review trimestral
- ADR `Superseded`: NO se borra, se marca y referencia el nuevo

### 19.2 Architecture Fitness Functions

> *Tests automatizados que validan que la arquitectura se respeta. Si fallan, CI rojo, no se mergea. Son los guardarraíles del plan.*

Suite `npm run fitness` corre en CI en cada PR, los 4 repos.

#### Fitness Functions implementadas

```typescript
// fitness/01-no-cross-repo-imports.test.ts
test('poppins-web no importa de poppins-api-*', () => {
  const files = glob.sync('apps/web/src/**/*.{ts,tsx}');
  const violations = files.filter(f => {
    const content = fs.readFileSync(f, 'utf8');
    return /from\s+['"]@?poppins-api/.test(content);
  });
  expect(violations).toEqual([]);
});

// fitness/02-api-routes-have-scope.test.ts
test('100% rutas /api/v1/* mutativas usan requireScope', () => {
  const routes = glob.sync('apps/api/src/app/api/v1/**/route.ts');
  const unguarded = routes
    .filter(r => /POST|PUT|PATCH|DELETE/.test(fs.readFileSync(r, 'utf8')))
    .filter(r => !fs.readFileSync(r, 'utf8').includes('requireScope'));
  expect(unguarded).toEqual([]);
});

// fitness/03-web-uses-api-client.test.ts
test('poppins-web no hace fetch crudo a /api', () => {
  const files = glob.sync('apps/web/src/**/*.{ts,tsx}');
  const violations = files.filter(f => {
    const content = fs.readFileSync(f, 'utf8');
    return /fetch\(['"](\/?api\/|https?:\/\/(api|buk)\.poppins)/.test(content);
  });
  expect(violations).toEqual([]);
});

// fitness/04-mutations-validate-tenant.test.ts
test('Todas las queries mutativas filtran por tenant_id', () => {
  const handlers = glob.sync('apps/api/src/app/api/v1/**/route.ts');
  const violations = handlers.filter(f => {
    const content = fs.readFileSync(f, 'utf8');
    const hasMutation = /\.(insert|update|delete|upsert)\(/.test(content);
    const hasTenantCheck = /tenant_id|current_tenant_id/.test(content);
    return hasMutation && !hasTenantCheck;
  });
  expect(violations).toEqual([]);
});

// fitness/05-contracts-version-locked.test.ts
test('Los 3 repos usan misma version de @poppins/contracts', () => {
  const apiId = JSON.parse(fs.readFileSync('../poppins-api-id/package.json', 'utf8'));
  const apiBuk = JSON.parse(fs.readFileSync('../poppins-api-buk/package.json', 'utf8'));
  const web = JSON.parse(fs.readFileSync('../poppins-web/package.json', 'utf8'));
  const v1 = apiId.dependencies['@poppins/contracts'];
  const v2 = apiBuk.dependencies['@poppins/contracts'];
  const v3 = web.dependencies['@poppins/contracts'];
  expect([v1, v2, v3]).toEqual([v1, v1, v1]);
});

// fitness/06-no-secrets-in-code.test.ts
test('Gitleaks reports zero leaks', () => {
  const result = execSync('gitleaks detect --no-banner --redact').toString();
  expect(result).not.toMatch(/leaks found/i);
});

// fitness/07-bundle-size-budget.test.ts
test('Cada route web pesa <250kb gzipped', () => {
  const sizes = readBundleAnalysis();
  Object.entries(sizes).forEach(([route, size]) => {
    expect(size.gzipped).toBeLessThan(250 * 1024);
  });
});

// fitness/08-no-typescript-suppressions.test.ts
test('No hay @ts-expect-error o @ts-ignore sin TODO con ticket', () => {
  const files = glob.sync('src/**/*.{ts,tsx}');
  const violations = files.flatMap(f => {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    return lines
      .map((line, i) => ({ line, i, file: f }))
      .filter(({line}) =>
        /(ts-expect-error|ts-ignore)/.test(line) &&
        !/TODO\s+POP-\w+/.test(line)
      );
  });
  expect(violations).toEqual([]);
});

// fitness/09-handlers-use-zod-validation.test.ts
test('Todos los handlers POST/PUT/PATCH validan body con Zod', () => {
  const handlers = glob.sync('apps/api/src/app/api/v1/**/route.ts');
  const violations = handlers.filter(f => {
    const content = fs.readFileSync(f, 'utf8');
    const hasBody = /export\s+(const|async function)\s+(POST|PUT|PATCH)/.test(content);
    const usesParseBody = /parseBody\s*\(/.test(content);
    return hasBody && !usesParseBody;
  });
  expect(violations).toEqual([]);
});

// fitness/10-buk-sdk-only-in-api-buk.test.ts
test('@/lib/buk-sdk solo se usa en poppins-api-buk', () => {
  const apiIdImports = glob.sync('apps/api-id/src/**/*.ts')
    .filter(f => /from\s+['"]@\/lib\/buk-sdk/.test(fs.readFileSync(f, 'utf8')));
  expect(apiIdImports).toEqual([]);
});
```

#### Política de fitness

- ❌ **PR no se mergea si UN solo fitness function falla.** Sin excepciones.
- Si necesitás temporalmente saltar uno: el agente abre PR en `poppins-contracts` agregando excepción documentada (con razón + fecha de expiración).
- Fitness suite se ejecuta también en push a `main` post-merge (defensa en profundidad).

### 19.3 Tech Debt Budget

- **15% del effort de cada sprint** dedicado obligatoriamente a deuda técnica.
- Trackeado en columna `tech-debt` del backlog (GitHub Projects).
- Cada story de deuda lleva label `debt:<area>` (`debt:perf`, `debt:test`, `debt:refactor`, `debt:upgrade`).
- Métrica: `tech_debt_score` = count(items_backlog) × promedio(severity 1-5). Calculado fin de sprint.
- **Si `tech_debt_score` sube 2 sprints consecutivos → feature freeze, sprint completo de debt-only.**
- Trimestral: revisión por CTO de qué deuda matar definitivamente vs aceptar permanente (decisiones ADR).

### 19.4 Definition of Ready (DoR)

Antes de que una story entre a un sprint, debe cumplir TODOS los siguientes:

- [ ] **Acceptance criteria explícitas** en formato Given-When-Then (mínimo 3 escenarios)
- [ ] **Tamaño estimado** (XS=½d / S=1d / M=2-3d / L=5d). Si XL → split obligatorio
- [ ] **Riesgos identificados** (mínimo 1 riesgo con mitigación documentada)
- [ ] **Dependencias resueltas** (no bloqueada por otra story sin terminar)
- [ ] **Mockup/diseño aprobado** por Product Lead si toca UI
- [ ] **Schema contracts merged** si toca API (PR en `poppins-contracts` antes que en el repo dev)
- [ ] **Tests E2E del gate identificados** (especialmente C0→C1 y C1→C2)
- [ ] **Observability plan** (qué loggeamos, qué métrica trackeamos, qué alerta si falla)
- [ ] **Rollback plan** documentado para stories L+

**Sin DoR check, la story NO se asigna al sprint.** Se devuelve al backlog para refinement.

### 19.5 Definition of Done (DoD)

Una story se considera DONE solo si:

- [ ] Código en `main` post-merge (no en feature branch)
- [ ] CI verde (lint + typecheck + test unit + test integration + fitness functions)
- [ ] Code review: al menos 1 approval del supervisor del lane
- [ ] Tests escritos: unit (coverage >70% del código nuevo) + integration si toca cross-service
- [ ] Documentación: README/CHANGELOG/ADR actualizado si aplica
- [ ] Feature flag activado si afecta usuarios reales
- [ ] Observabilidad mínima: log estructurado + métrica si es crítico
- [ ] Smoke test manual en staging
- [ ] PR description con: contexto, screenshots si UI, riesgos conocidos, rollback steps

### 19.6 WIP Limits

| Configuración | WIP máximo |
|---|---|
| 1 agente Claude Code | 2 stories `in_progress` simultáneas |
| 1 PR abierto por agente para review | 1 (excepto cross-lane que permite 2) |
| 1 supervisor humano review queue | máx 4 PRs sin reviewar en cola (si llega 5to, prioridad de review > nuevas stories) |
| Stories de `tech-debt` en sprint | mínimo 15% del total |
| Stories L o XL en sprint | máx 1 (split agresivo) |

### 19.7 Story Slicing — INVEST

Toda story debe cumplir **INVEST** (Bill Wake):

- **I**ndependent: si una story depende de otra para entregar valor, NO es independent → slice diferente
- **N**egotiable: tiene espacio para refinement, no es spec rígida (mejor un párrafo + acceptance criteria que 5 páginas de spec)
- **V**aluable: entrega valor end-to-end al usuario (vertical slice). NO horizontal ("solo backend de feature X")
- **E**stimable: el equipo puede dimensionarla con confianza razonable
- **S**mall: cabe en 1 sprint, idealmente <3 días
- **T**estable: hay forma de validar success automáticamente

**Patrón anti-INVEST a evitar:**
- "Implementar backend de billing" (no vertical, no testable end-to-end)
- "Hacer todos los tests de C0" (no small, no estimable)
- "Refactor general del sistema" (no negotiable, no small, no estimable)

**Patrón INVEST correcto:**
- "Usuario admin puede ver lista de invoices de su tenant en `/billing/invoices` ordenadas por fecha desc" (small, valuable, testable)

### 19.8 Tech Radar trimestral

Documento vivo en `poppins-contracts/docs/tech-radar.md`, actualizado cada trimestre por el CTO con input de los agentes.

#### Categorías (de ThoughtWorks)

- **ADOPT:** tecnología probada, úsala sin pensar
- **TRIAL:** vale la pena probarla en proyectos no críticos
- **ASSESS:** evaluar para casos de uso específicos
- **HOLD:** evitar para nuevos proyectos, planificar deprecation

#### Tech Radar Poppins Q2 2026

| Tecnología | Estado | Notas |
|---|---|---|
| Next.js 16 | ADOPT | Framework principal web + api |
| React 19 | ADOPT | UI library, Server Components habilitados |
| TypeScript 5 (strict) | ADOPT | Sin `ignoreBuildErrors` post Sprint 2 |
| Tailwind 4 | ADOPT | CSS framework, `@theme inline` para tokens |
| shadcn/ui `base-nova` | ADOPT | Component foundation |
| Supabase | ADOPT | DB + Auth + Storage + Realtime |
| BUK API | ADOPT | Source of truth laboral |
| Flow.cl | ADOPT | Billing Chile |
| TanStack Query | ADOPT | Data fetching client-side |
| TanStack Table | ADOPT | Tablas data-heavy |
| Zod 4 | ADOPT | Validation runtime + tipos |
| Sentry | ADOPT | Error tracking 3 servicios |
| Upstash Redis | ADOPT | Rate limit + session cache |
| Resend | ADOPT | Email transactional |
| Vercel | ADOPT | Hosting serverless |
| PostHog | TRIAL | Analytics — evaluar costos a 1M events |
| GrowthBook | TRIAL | Feature flags self-hosted |
| Better Uptime | TRIAL | Status page free tier |
| Gemini API | TRIAL | Agente de soporte IA (decidir Sprint 7) |
| Playwright | ADOPT | E2E testing |
| Vitest | ADOPT | Unit testing |
| Storybook 10 | ADOPT | Component dev + visual testing |
| Chromatic | TRIAL | Visual regression (free tier 5k snapshots) |
| Cloudflare Workers | ASSESS | Alternativa Vercel si costos explotan |
| Inngest/QStash | ASSESS | Async jobs para PDF generation (C2) |
| OpenTelemetry | ASSESS | Distributed tracing (C2 si SLA contractual) |
| Meilisearch | ASSESS | Search avanzado cuando >100k registros |
| Bsale | ASSESS | Factura electrónica SII Chile (C2) |
| ClamAV cloud | ASSESS | Antivirus uploads |
| Mobile Native (React Native) | HOLD | PWA primero, native solo si WAU mobile >2000 |
| `/agents/` directorio decorativo | HOLD | Eliminar Sprint 4 si no se convierte a real |
| `useBuk.ts` legacy hooks | DEPRECATE | Eliminado Sprint 0 |
| `--no-package-lock` flag Vercel | DEPRECATE | Eliminado Sprint 2 |
| `typescript.ignoreBuildErrors` | DEPRECATE | Eliminado Sprint 2 |
| Command-bus paralelo (`/lib/command-control/`) | HOLD | Decisión Sprint 3 (ADR) |
| jQuery / Bootstrap | NUNCA | Stack moderno only |

### 19.9 Bug triage process

#### Severidades + SLAs

| Severity | Definición | Response time | Fix time |
|---|---|---|---|
| **P0 — Crítico** | Prod caído · Security breach · Data loss · >50% users afectados | <1h | <4h |
| **P1 — Alto** | Feature crítica rota · 10-50% users afectados · No hay workaround | <4h | <24h |
| **P2 — Medio** | Feature secundaria rota · <10% users · Workaround disponible | <24h business hours | <1 sprint |
| **P3 — Bajo** | Cosmetic · Edge case · Mejora UX | <1 semana | Backlog ordinario |

#### Proceso

1. **Bug reportado** (interno Sentry / cliente vía email / detectado por agente)
2. **Triage diario** por CTO al iniciar el día (15min)
3. **Asignación**:
   - P0/P1 → saltan sprint planning, asignación inmediata, sub-sprint hotfix
   - P2 → entra a sprint actual si capacidad, sino próximo
   - P3 → backlog ordinario
4. **Comunicación**:
   - P0 → status page actualizado + email proactivo a clientes afectados
   - P1 → status page si >100 usuarios afectados, sino email directo
   - P2/P3 → notificar en próximo changelog
5. **Post-mortem**:
   - P0 obligatorio (blameless, en 48h)
   - P1 si tiene impacto cliente facturable
   - P2/P3 no requerido

### 19.10 Release notes / Changelog público

- Cada deploy a prod genera entry en `app.poppins.cl/changelog` (público para clientes)
- Auto-generado desde Conventional Commits + curado por Product Lead antes de publicar
- Format estandarizado:
  ```
  ## YYYY-MM-DD — vX.Y.Z

  ### ✨ Nuevas features
  - Descripción usuario-friendly de feature
  
  ### 🛠 Mejoras
  - Performance / UX / fixes menores
  
  ### 🐛 Fixes
  - Bugs corregidos
  
  ### ⚠️ Breaking changes
  - Solo si aplica, con migration guide
  ```
- Comunicación a clientes: email mensual de "novedades del mes" con resumen del changelog (Product Lead owner)

### 19.11 API versioning strategy

#### Versión actual y compromiso

- **`/api/v1/*`** es la versión actual.
- **Compromiso público:** no breaking changes en `/api/v1` durante todo 2026.
- Cambios aditivos (campo opcional nuevo, endpoint nuevo) OK sin bump.

#### Cuándo bumpear a v2

- Acumulamos 5+ cambios breaking en branch `next/v2`
- Ó tenemos justificación de negocio (cliente enterprise pide cambio mayor)

#### Política deprecation

1. Anuncio público v2 + nuevo endpoint disponible en paralelo
2. **6 meses de overlap** v1 + v2 funcionando
3. v1 marcado deprecated en headers (`Sunset: <date>`, `Deprecation: true`)
4. Email mensual a clientes con uso de v1 mostrando migration path
5. **12 meses post-anuncio:** v1 retirado

#### Versionado del cliente externo (post-MVP)

- Header `Api-Version: 1` opcional permite explicit pinning
- Default: latest stable
- API key con scope `v1` o `v2` o `v1,v2`

### 19.12 Cache strategy explícita

3 capas independientes con políticas claras:

#### Capa 1: Edge CDN (Vercel)

| Tipo de contenido | Cache | TTL |
|---|---|---|
| Assets estáticos (`_next/static/*`) | Permanente | 1 año (immutable) |
| Imágenes optimizadas Next | Edge cache | 30 días |
| Páginas SSG (`/`, `/precios`, `/changelog`) | Edge cache | 1 hora con revalidate |
| Páginas dinámicas (`/dashboard/*`) | NO cache | dynamic = 'force-dynamic' |
| Responses API (`/api/*`) | NO cache | private |

#### Capa 2: Supabase materialized views

Para queries pesadas de reporting:

```sql
create materialized view mv_tenant_kpis as
select
  tenant_id,
  count(distinct buk_employee_id) as colaboradoras_activas,
  count(*) filter (where estado = 'pagado' and periodo >= now() - interval '30 days') as liquidaciones_30d,
  avg(monto_total) filter (where periodo >= now() - interval '90 days') as ticket_promedio_90d
from liquidaciones_view
group by tenant_id
with data;

create unique index on mv_tenant_kpis (tenant_id);

-- Refresh diario via cron
refresh materialized view concurrently mv_tenant_kpis;
```

#### Capa 3: Upstash Redis (app layer)

| Caso de uso | TTL | Key pattern |
|---|---|---|
| Rate-limit por tenant | 1 min sliding | `rl:tenant:<id>` |
| Rate-limit por IP | 1 min sliding | `rl:ip:<ip>` |
| BUK SDK responses (lectura) | 5 min | `buk:<tenant>:<endpoint>:<hash>` |
| Session cache | 15 min | `sess:<user_id>` |
| OTP rate-limit | 1 hora | `otp:<phone>` |
| Feature flag values | 30 seg | `ff:<tenant>:<flag>` |

#### Invalidación

- **Mutaciones SIEMPRE invalidan caches asociados al tenant_id afectado** (regla R12, ver §16)
- Helper `invalidateCacheForTenant(tenantId, scope?)` standarizado
- Sin invalidación automática global (puede causar storm)

### 19.13 Webhook retry policy

#### Webhooks salientes (Poppins → clientes externos, post-MVP)

Tabla `outbound_webhooks` con state machine:

```
[pending] → [processing] → [delivered]
              ↓ (fail)
           [retry_scheduled]
              ↓ (success)        ↓ (max retries)
           [delivered]          [dead_letter]
```

Reintentos: **1min, 5min, 15min, 1h, 6h, 24h** (exponencial backoff).

Tras **6 fallos**, marca `dead_letter` y notifica:
- Admin tenant vía email
- Sentry alert con tag `webhook-dlq`
- Endpoint `/admin/webhooks/dead-letter-queue` para retry manual

#### Webhooks entrantes (BUK, Flow.cl → Poppins)

- Tabla `webhook_events` con UNIQUE constraint en `(source, event_id)` para idempotency
- Endpoint responde **200 inmediatamente** post-validación firma + insert idempotente
- Processing async en Vercel Cron cada minuto (cola FIFO)
- Si processing falla:
  - Audit log entry (no 500 al origen — BUK/Flow.cl retry causa duplicates)
  - Retry interno con misma policy de salientes
  - Sentry alert con tag `webhook-processing-fail`

### 19.14 Database migration testing

#### Workflow obligatorio

1. **Branch:** crear PR con migration en `poppins-api-id/supabase/migrations/NNNN_*.sql`
2. **Local:** correr `supabase db reset` y verificar que aplica clean
3. **Staging:** CI aplica migration a staging DB clonado de prod
4. **Validation:** correr `npm run test:db-integrity` (verifica RLS, indexes, constraints)
5. **Performance:** comparar slow query log antes/después (`pg_stat_statements`)
6. **Review:** CTO aprueba si no hay regresiones >10% en queries top-100
7. **Apply prod:** durante ventana de mantenimiento (sábado 03:00 CLT)
8. **Monitor:** Sentry + slow query log 24h post-deploy

#### Backward compatibility obligatoria

Toda migration debe ser backward-compatible. Patrón estándar:

```
Release N:
  - Step 1: ALTER TABLE ADD COLUMN nuevo_campo TEXT (nullable, sin default destructivo)
  - App code: lee old + new column, escribe en ambos

Release N+1:
  - Step 2: Backfill data nueva columna desde datos viejos
  - App code: lee new column, escribe en new (legacy ignored)

Release N+2:
  - Step 3: ALTER TABLE ALTER COLUMN nuevo_campo SET NOT NULL
  - App code: solo new column

Release N+3:
  - Step 4: ALTER TABLE DROP COLUMN columna_vieja (opcional, puede quedar para siempre)
```

**Sin DROP COLUMN en mismo release que el ADD COLUMN reemplazante.** Mínimo 2 releases de antelación con app code transicional.

### 19.15 Pair programming policy

| Situación | Política |
|---|---|
| Sprint 0 cutover (decisiones secuenciales) | CTO + 1 agente pair en cada paso |
| Stories L o XL | Pair entre 2 agentes lanes diferentes (back+front en integration day) |
| Security-critical (auth, encryption, RLS) | Pair entre CTO y agente |
| Migration de DB | Pair obligatorio antes de apply prod |
| First-time stack/lib usage | Pair de aprendizaje (1 review extra) |
| Refactor cross-cutting | Pair entre 2 supervisores |

### 19.16 1:1 cadence

| Quiénes | Cadencia | Duración | Foco |
|---|---|---|---|
| CTO ↔ Product Lead | 1x/semana | 30min | Decisiones cross-cutting, prioridades sprint |
| Supervisor ↔ agente Claude Code | Daily async escrito | 5min | Standup, bloqueos |
| CTO ↔ asesor legal externo | 1x/mes | 60min | Compliance, T&C updates, riesgo |
| CTO ↔ asesor financiero | 1x/mes | 30min | Burn rate, billing data, unit economics (post Sprint 6) |
| CTO + PL ↔ clientes pagantes (top 5) | 1x/trimestre | 30min | Customer dev, churn prevention |

### 19.17 Single-Point-of-Failure mitigation (CTO)

- **Documentation discipline:** ADRs + runbooks + arquitectura escrita asegura que conocimiento NO vive solo en cabeza del CTO
- **Code review distribution:** Product Lead aprende a leer back con shadow reviews Sprint 5-6 (no se vuelve experto, pero entiende lo crítico)
- **Emergency credentials:** Vercel, Supabase, GitHub admin tokens en password manager compartido (1Password Family) con Product Lead
- **Bus factor 2:** post-Sprint 6 al menos 1 agente Claude Code adicional con acceso a contracts merge (rotación)
- **Sucesión documentada:** ADR-007 incluye qué pasa si CTO ausente >7 días (tie-breaker default a Product Lead + asesor técnico externo de confianza, a identificar)

### 19.18 Reglas extra cementadas (extensión de R1-R11)

| # | Regla | Razón |
|---|---|---|
| **R12** | Toda mutación a tabla con `tenant_id` invalida cache associated del tenant antes de responder 2xx | Evita stale reads post-write |
| **R13** | Sin `@ts-expect-error` o `@ts-ignore` sin TODO con ticket `POP-XXX` asociado | Suprimir tipos sin tracking = deuda invisible |
| **R14** | Sin commits a `main` directos. Toda change vía PR. Sin excepciones (ni hotfixes — usar branch + fast-track review en <30min) | Audit trail + review distribuido |
| **R15** | Todo cron job o webhook handler es idempotent y maneja exactly-once semantics vía tabla de events | Retry from infrastructure no causa duplicates |
| **R16** | Toda secret rotation tiene fecha programada en runbook (BUK token, Supabase service key, Flow.cl, Resend, Sentry DSN) — mínimo anual | Secret stale es vector de ataque |

### 19.19 Quality scorecard trimestral

Cada trimestre el CTO calcula este scorecard. Si baja del 80%, sprint dedicado a remediation.

| Categoría | Métrica | Peso | Target |
|---|---|---|---|
| Code quality | Cobertura tests crítico | 15% | >70% |
| Code quality | Fitness functions verde | 10% | 100% |
| Operations | MTTR último trimestre | 10% | <2h |
| Operations | Uptime | 10% | >99.5% |
| Operations | Deployment frequency | 10% | >1/día |
| Process | DoR/DoD compliance | 10% | 100% |
| Process | ADRs escritos vs decisiones tomadas | 5% | >90% |
| Security | Pentest findings high/critical | 10% | 0 |
| Security | Dependabot critical pendientes | 5% | 0 >30 días |
| Product | NPS clientes activos | 10% | >40 |
| Product | Trial → paid conversion | 5% | >25% |

---

## 20. Próximos pasos

### Esta semana (antes de arrancar Sprint 0)

- [ ] Confirmar cuenta GitHub org o personal donde van los 4 repos
- [ ] Verificar acceso Vercel para crear 3 proyectos
- [ ] Verificar DNS `poppins.cl` apuntable a Vercel
- [ ] Verificar acceso Supabase para configurar cookies cross-subdomain
- [ ] Crear cuentas: Flow.cl (sandbox), Resend, Upstash, PostHog, Sentry, Better Uptime
- [ ] **Identificar al 2do supervisor (Product Lead) — onboarding Sprint 5**
- [ ] (Opcional) Vectorizar logo en Figma → exportar 4 SVG
- [ ] Lectura conjunta de este `PLAN_MAESTRO.md` para validar y firmar

### Lunes próximo

- [ ] Arrancar Sprint 0 con 1 agente (`agent-cutover`)
- [ ] CTO disponible para review EOD cada día
- [ ] Validar Sprint 0 DoD el viernes 18:00

### Lunes +1 (Sprint 1)

- [ ] Arrancar 2 agentes en paralelo (Back + Front)
- [ ] Aplicar las 11 reglas R1-R11 desde el primer commit
- [ ] Daily async standup escrito

### Semana 10 (Sprint 5)

- [ ] **Onboarding 2do supervisor** (Product Lead)
  - Día 1-3: shadow del CTO en code reviews
  - Día 4-5: comienza a mergear PRs minor de `poppins-web`
- [ ] Validar Gate C1 → C2 con E2E tests

### Semana 12 (Sprint 6)

- [ ] **Escalar a 3 agentes** si los 3 criterios objetivos se cumplen
- [ ] Producción multi-tenant validada
- [ ] **MVP serio listo para 2do cliente pagante**

---

## Apéndice A — Hallazgos del análisis 360° (referencia)

Ver commits anteriores con análisis detallado por capa de Platform Architecture (L0-L8).

## Apéndice B — Asunciones documentadas

| Asunción | Valor | Cambiable |
|---|---|---|
| Dominio producción | `poppins.cl` | No |
| Subdominios | `app./api./buk./status./*.poppins.cl` | Sí |
| Stack | Next 16 + React 19 + TS 5 + Tailwind 4 + shadcn `base-nova` | No durante 2026 |
| Auth | Supabase phone OTP | Sí (puede sumar email/social en C2) |
| BUK | Source-of-truth datos laboral-legal | No |
| Tipografía | Poppins (Google Fonts) | No (Manual v1.0) |
| Hosting | Vercel | Sí (revaluar en C2) |
| DB | Supabase Postgres | Sí (revaluar en C2 si escala lo exige) |
| **Billing** | **Flow.cl** | **No (decisión cementada)** |
| **Multi-tenancy** | **Desde Sprint 2 (C0)** | **No (no postponible)** |
| **2do supervisor** | **Sprint 5** | **Sí (puede adelantarse si hay carga)** |
| **Idioma MVP** | **es-CL only** | **Sí (C2 podría sumar pt-BR/es-MX)** |
| **ICP** | **Madres/familias empleadoras 30-55 años, Santiago metropolitano (Las Condes, Vitacura, Lo Barnechea, Providencia, La Reina, Ñuñoa). B2C individual** | **No durante 2026** |
| **Kill criteria** | **<20 clientes pagantes en 3 meses post-launch MVP (Sprint 6 fin = ~semana 13) → pausa + revaluar pivot/sunset** | **No (no negociable)** |
| **Pricing** | **Starter $9,990/mes (1 hogar, 2 colaboradoras) · Pro $19,990/mes (3 hogares, 5 colaboradoras) · Empresarial custom** | **Sí (revaluar post PMF con datos reales)** |
| **Soporte cliente** | **MVP: email hola@poppins.cl + agente IA Gemini API 24/7 (Sprint 7+) · C2: escalamiento humano via WhatsApp Tooxs** | **Sí (depende de volumen)** |
| **Onboarding** | **Self-service desde día 1 con wizard 6-step <10min. NO concierge ni asesor humano en MVP** | **No (diferenciador vs Domestikco)** |
| **Landing poppins.cl raíz** | **Construida en última fase C2 (post-Sprint 7) por agent-front. Mientras tanto `app.poppins.cl` es la landing efectiva** | **Sí (si hay tráfico orgánico antes)** |
| **Vendor laboral (BUK)** | **MVP usa BUK API como source-of-truth (token Tooxs como tenant inicial). Post-MVP exitoso (Sprint 8+) decidimos: (a) alianza/precio especial con BUK, (b) motor propio. Depende de fondos disponibles** | **Sí (a evaluar post-MVP)** |
| **Soporte IA stack** | **Gemini API (Google) para agente conversacional. Decisión Sprint 7+** | **Sí (puede swap a Claude/GPT-4 si métricas calidad bajas)** |
| **Competidor principal** | **Domestikco (domestikco.com). Poppins compite por profundidad/UX, NO por breadth (academia/matching)** | **No durante 2026** |
| **Unit economics** | **A calcular con datos reales post-Sprint 6. CAC/LTV/payback/gross margin son placeholder hasta tener 10 clientes pagantes facturados 3 meses** | **No es decisión, es timing** |

## Apéndice C — Referencias

- `CLAUDE.md` raíz: instrucciones del proyecto + Platform Architecture Agent
- `README.md`: descripción comercial actual
- `docs/buk-api/`: spec OpenAPI BUK + endpoints documentados
- `Poppins_Manual_de_Marca.pdf`: Manual de Marca v1.0
- `Logo-Poppins.png`: asset oficial del logo
- `supabase/migrations/0001_initial_poppins.sql`: schema base
- `supabase/migrations/0002_rls_policies.sql`: RLS policies
- Flow.cl API docs: https://www.flow.cl/docs/api.html
- Ley 19.628 Chile: https://www.bcn.cl/leychile/navegar?idNorma=141599

## Apéndice D — Cuentas externas a aprovisionar

| Servicio | Plan | Costo aprox | Para qué |
|---|---|---|---|
| Vercel | Pro | US$20/mes | 3 proyectos producción |
| Supabase | Pro | US$25/mes | Postgres + Auth + Storage + Realtime |
| Flow.cl | sin costo base | comisión por trx | Billing |
| Sentry | Team | US$26/mes | Error tracking 3 servicios |
| Resend | Pro | US$20/mes | Email transaccional (>3k/mes) |
| Upstash | Pay-as-you-go | <US$5/mes | Redis para rate-limit |
| PostHog | Free | $0 | Analytics (hasta 1M events) |
| Better Uptime | Free | $0 | Status page + monitoring |
| GitHub | Team | US$4/user/mes | Private repos + Actions minutes |
| Twilio (Chile) | pay-as-you-go | ~$50 CLP/SMS | OTP phone login |
| Cloudflare | Free | $0 | DNS + CDN frente a Vercel |
| **Total mensual estimado** | — | **~US$130/mes + variables** | Para 2 supervisores + 3 agentes |

---

**Fin del Plan Maestro v1.1** · *Próxima revisión: post Sprint 0 retro.*

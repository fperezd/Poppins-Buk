# CLAUDE.md — `poppins-api-id` (Back / Back-A)

> **Tu identidad como agente:**
>
> Sos **agent-back** (Sprint 1-5) o **agent-back-a** (Sprint 6+), Claude Code asignado al repo `poppins-api-id`. Trabajás en una sola lane y respondés a un solo supervisor humano.
>
> **Lee este archivo completo antes de tu primer commit en este repo.**

---

## 0. Tu lane en una frase

> **Sos dueño de la identidad, autenticación, dominio Poppins-nativo y billing. NO tocás BUK SDK ni UI.**

---

## 1. Quién manda

- **Supervisor primario:** CTO (Fernando Pérez)
- **Supervisor secundario:** Product Lead (review minor/patch de contracts)
- **Cuando estás bloqueado:** abrís PR draft + mencionás `@cto` en review request, NO improvisás

---

## 2. Repo scope — qué SÍ y qué NO

### Estás autorizado a tocar

```
poppins-api-id/
├── src/
│   ├── app/api/
│   │   ├── auth/                       ← TODO esto es tuyo
│   │   ├── v1/
│   │   │   ├── me/
│   │   │   ├── tenants/                ← multi-tenancy
│   │   │   ├── billing/                ← Flow.cl
│   │   │   ├── onboarding/             ← wizard
│   │   │   ├── colaboradoras/          ← orquesta con api-buk
│   │   │   ├── empleadores/            ← orquesta con api-buk
│   │   │   ├── hogares/
│   │   │   ├── tareas/                 ← dominio Poppins puro
│   │   │   ├── listas-compras/
│   │   │   ├── conversaciones/
│   │   │   ├── mensajes/
│   │   │   ├── solicitudes-salud/
│   │   │   ├── evaluaciones/
│   │   │   └── asignaciones/
│   │   ├── compliance/
│   │   ├── audit/
│   │   └── health/
│   ├── lib/
│   │   ├── auth/                       ← requireScope, getUserScope
│   │   ├── tenant/                     ← resolver tenant from JWT/subdomain
│   │   ├── billing/                    ← Flow.cl client
│   │   ├── email/                      ← Resend templates
│   │   ├── supabase/
│   │   ├── buk-bridge/                 ← HTTP client tipado hacia api-buk
│   │   ├── rate-limit/                 ← Upstash Redis
│   │   ├── cache/                      ← Helper invalidate
│   │   └── api/                        ← handle, ok, fail
│   └── middleware.ts
├── supabase/migrations/                ← Vos sos dueño del schema Supabase
├── tests/
├── package.json
└── vercel.json
```

### Estás prohibido de tocar

- `poppins-api-buk/` — repo separado, no clonado en tu workspace
- `poppins-web/` — repo separado
- `poppins-contracts/` directamente — proponés cambios via PR en ese repo

### `_shared/` — zona compartida (cuidado)

Si necesitás tocar `src/lib/api/{handle,ok,fail,parseBody}.ts` (utilidades compartidas), abrís PR con label `cross-lane-touch` y notificás al supervisor secundario (Product Lead) además del CTO. Es excepcional.

---

## 3. Las 16 reglas inviolables (R1-R16)

| # | Regla |
|---|---|
| **R1** | NO importás de `poppins-web` (ni runtime ni types) |
| **R2** | NO importás de `poppins-api-buk` (HTTP client a `buk.poppins.cl` es la única forma) |
| **R3** | NO aplica directo (es regla del web) |
| **R4** | TODO handler valida I/O contra schemas de `@poppins/contracts`. Sin schema, no hay handler |
| **R5** | NO editás archivos de `poppins-api-buk` directamente — usá `lib/buk-bridge/` |
| **R6** | Cambio breaking en `contracts` requiere 3 PRs sincronizados + ambos supervisores aprueban |
| **R7** | Front no espera al back — implementás contra MSW mientras tu PR madura, todo OK |
| **R8** | Auth cookies en `.poppins.cl`. Local dev usa `*.poppins.local` en `/etc/hosts` |
| **R9** | Cron jobs y webhooks BUK NO viven acá — viven en `poppins-api-buk`. Excepción: webhook Flow.cl que SÍ vive acá |
| **R10** | Correlation-ID propagado: el header `x-request-id` viaja desde web → api-id → api-buk → BUK |
| **R11** | TODA mutación a tabla con `tenant_id` filtra `tenant_id = current_tenant_id()`. Sin tenant check, no hay mutación |
| **R12** | TODA mutación invalida cache asociado al tenant ANTES de responder 2xx (usá `invalidateCacheForTenant`) |
| **R13** | NO `@ts-expect-error` ni `@ts-ignore` sin TODO con ticket `POP-XXX` |
| **R14** | NO commits a `main` directos. SIEMPRE via PR |
| **R15** | TODO webhook handler es idempotent vía tabla `webhook_events` con UNIQUE constraint |
| **R16** | Secrets tienen rotación programada (BUK token tenant, Supabase service key, Flow.cl, Resend, Sentry DSN) — mínimo anual, documentado en runbook |

---

## 4. Convenciones de commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): agregar requireScope a /v1/empleadores
fix(billing): manejar HTTP 429 de Flow.cl con retry
refactor(tenant): extraer tenant resolver a middleware separado
docs(adr): agregar ADR-013 sobre rate-limit OTP
test(auth): cubrir caso scope=colaboradora viendo otro empleado
chore(deps): bump @poppins/contracts a 1.4.0
```

Scopes válidos: `auth`, `tenant`, `billing`, `onboarding`, `compliance`, `audit`, `email`, `rate-limit`, `cache`, `buk-bridge`, `domain`, `db`, `infra`, `deps`.

### Tamaño de PRs

- **Ideal:** <300 líneas de diff
- **Máximo:** 800 líneas
- **Si XL:** split en 2-3 PRs incrementales con feature flag

---

## 5. Branches

Pattern: `<tipo>/<ticket>-<slug-corto>`

```
feat/POP-C0-01-requirescope-payroll
fix/POP-C1-08-saga-rollback-empleadores
refactor/POP-C1-05-remove-command-bus
docs/adr-013-rate-limit-strategy
test/auth-scope-coverage
chore/bump-contracts-1.5.0
```

Vida máxima de feature branch: **3 días**. Si pasás de eso, abrís WIP PR para feedback.

---

## 6. Pull Request

### Template obligatorio

(Ver `docs/sprint-0-prep/PULL_REQUEST_TEMPLATE.md`)

Mínimo:
- Contexto (1-2 oraciones)
- Cambios principales (bullets)
- Tests añadidos
- Riesgos conocidos
- Rollback plan (si L+)
- Screenshots (si afecta API responses con cambio shape, mostrar request/response)

### Para mergear

- ✅ CI verde (lint + typecheck + test + build + fitness functions)
- ✅ 1 approval del supervisor primario (CTO)
- ✅ Si toca contracts: 2 approvals (CTO + Product Lead) o auto-merge según tier
- ✅ Branch up-to-date con main (rebase, no merge commit)

---

## 7. Cómo proponer un contract change

**TODO cambio en API shape empieza acá, NO en tu repo.**

1. Clonás `poppins-contracts` localmente (en tu home, no en tu working dir)
2. Branch: `contract/POP-XXX-descripcion`
3. Modificás schema en `src/schemas/<dominio>.ts`
4. Corrés `npx changeset` y describís el cambio
5. PR a `poppins-contracts` con label apropiado:
   - `patch` → docs/typos
   - `minor` → aditivo (campo opcional, endpoint nuevo)
   - `major` → breaking (eliminar, cambiar tipo, renombrar)
6. Esperás review (SLA 4h business hours del CTO para minor/patch, ambos supervisores para major)
7. Cuando mergea, `@poppins/contracts` se publica auto (CI release.yml)
8. **Solo entonces** volves a tu repo y bumpeás dependencia: `npm install @poppins/contracts@latest`

**NO escribís tipos a mano que ya existen en contracts.** Importás siempre:

```typescript
import { ListColaboradorasQuery, CreateEmpleadorBody } from '@poppins/contracts';
```

---

## 8. Cómo llamar a `api-buk` (server-to-server)

Usás `lib/buk-bridge/client.ts`:

```typescript
import { callApiBuk } from '@/lib/buk-bridge/client';

// Dentro de un route handler
export const POST = handle(async (req: NextRequest) => {
  const auth = await requireScope(['admin']);
  if (!auth.ok) return auth.error;

  // Llamada server-to-server, propaga JWT del user actual
  const response = await callApiBuk(
    '/v1/empleadores',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    },
    req
  );

  const data = await response.json();
  return ok(data);
});
```

**NO hagas `fetch` directo a `https://buk.poppins.cl`.** Usá el helper que propaga `Authorization`, `x-request-id` y `x-internal-call`.

---

## 9. Stack específico

```json
{
  "framework": "next@^16.2",
  "react": "^19.2",
  "typescript": "^5.5",
  "validation": "zod@^4.4",
  "database": "@supabase/ssr@^0.9",
  "rate-limit": "@upstash/ratelimit",
  "email": "resend + @react-email/components",
  "billing": "flow-cl-sdk (a publicar, o cliente custom)",
  "testing": "vitest + @playwright/test",
  "contracts": "@poppins/contracts"
}
```

Comandos típicos:

```bash
npm run dev              # Next dev :3001
npm run build
npm run typecheck
npm run lint
npm run test             # vitest unit
npm run test:e2e         # playwright
npm run fitness          # fitness functions
npm run db:migrate       # supabase db push (staging)
npm run db:migrate:prod  # solo con confirmación CTO
```

---

## 10. Fitness functions que TUS PRs deben pasar

(Ver `docs/sprint-0-prep/fitness-functions/`)

1. **fitness-01-no-cross-repo-imports** — no importás de web/api-buk
2. **fitness-02-api-routes-have-scope** — toda ruta mutativa usa `requireScope`
3. **fitness-04-mutations-validate-tenant** — toda mutación filtra por tenant_id
4. **fitness-05-contracts-version-locked** — bumpe `@poppins/contracts` cuando contracts release
5. **fitness-06-no-secrets-in-code** — gitleaks clean
6. **fitness-08-no-typescript-suppressions** — no `@ts-ignore` sin ticket
7. **fitness-09-handlers-use-zod-validation** — POST/PUT/PATCH valida con Zod
8. **fitness-10-buk-sdk-only-in-api-buk** — NO importás `@/lib/buk-sdk` (es de api-buk)

Si UN fitness function falla → CI rojo → no merge.

---

## 11. Definition of Ready (DoR) — antes de tomar una story

- [ ] Acceptance criteria explícitas (Given-When-Then, mínimo 3 escenarios)
- [ ] Tamaño estimado (XS=½d / S=1d / M=2-3d / L=5d). Si XL → split
- [ ] Riesgos identificados con mitigación
- [ ] Sin dependencias bloqueantes
- [ ] Schema contracts merged (si toca API)
- [ ] Tests E2E gate identificados (C0→C1 o C1→C2)
- [ ] Observability plan (logs, métrica, alerta)
- [ ] Rollback plan documentado (si L+)

**Sin DoR check, NO empezás.**

---

## 12. Definition of Done (DoD) — cierre de story

- [ ] Código en `main` post-merge
- [ ] CI verde (lint + typecheck + test + build + fitness)
- [ ] 1 approval supervisor primario
- [ ] Tests escritos: unit coverage >70% del código nuevo
- [ ] Documentación actualizada (README/CHANGELOG/ADR si aplica)
- [ ] Feature flag activado si afecta usuarios reales
- [ ] Observabilidad: log estructurado + métrica si crítico
- [ ] Smoke test manual en staging
- [ ] PR description completa

---

## 13. WIP limits

- **Máx 2 stories `in_progress` simultáneas.**
- Máx 1 PR abierto esperando review (excepto cross-lane → 2 permitido).
- **NO nuevo work hasta cerrar lo en review.**

---

## 14. Cuándo escalar al supervisor

Escalá inmediato si:

- 🔴 Encontrás un security issue grave (data leak potencial, RCE, etc) → DM al CTO
- 🔴 Decidir entre 2 caminos arquitectónicos no triviales → abrís ADR draft
- 🔴 Necesitás romper alguna regla R1-R16 → escalation explicit
- 🟠 Story toma >2x del estimado → revisar slicing
- 🟠 Falla CI en cosa que no entendés → no force-merge, escalá
- 🟠 Bug P0/P1 detectado en producción → triage inmediato

NO escales:

- Decisiones de estilo de código (seguí convenciones existentes)
- Bugs P2/P3 → backlog
- Refactor pequeño "mientras estoy acá" → otro PR

---

## 15. Specifics del repo

### Multi-tenancy

- TODA query a Supabase usa RLS con `current_tenant_id()` autocompletado.
- TODA query a BUK usa `getBukSDKForTenant(tenantId)` desde el bridge.
- JWT en `req.headers.authorization` siempre tiene `app_metadata.tenant_id`.

### Service-to-service auth

- Hacia `api-buk`: propagás JWT del user via `callApiBuk()`.
- Endpoints `_internal/*` requieren además `x-internal-token` header.

### Billing Flow.cl

- Webhook URL público: `https://api.poppins.cl/v1/billing/webhook`
- HMAC verification obligatoria.
- Idempotency via tabla `webhook_events`.

### Email Resend

- From: `Poppins <noreply@poppins.cl>`
- Templates en `lib/email/templates/*.tsx` con `@react-email/components`
- Helper `sendEmail({ to, type, props })` centraliza retry + logging.

---

## 16. Cuando hagas tu primer commit

Antes:

1. ✅ Leíste este archivo completo
2. ✅ Leíste `docs/PLAN_MAESTRO.md` (al menos las secciones que aplican a tu lane)
3. ✅ Verificaste el sprint backlog (tu primera story asignada)
4. ✅ Tu story pasó DoR
5. ✅ Tenés branch local con nombre conforme convención
6. ✅ Corriste `npm run typecheck && npm run test && npm run fitness` antes del commit

Después:

1. Commit con Conventional Commits
2. Push a tu branch
3. PR con template completo
4. Mención al supervisor primario para review
5. Esperás review, no auto-mergeás

---

**Bienvenido a la lane Identity. Construí cosas seguras y limpias. Pregunta cuando dudes.**

— CTO

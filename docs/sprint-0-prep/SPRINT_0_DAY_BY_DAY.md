# 📅 Sprint 0 — Day-by-day execution guide

> Playbook detallado hora-por-hora para que el CTO + agente ejecuten Sprint 0 (cutover de monolito a 4 repos) en 5 días.
>
> **Fecha objetivo:** Semana del lunes 2026-06-01
>
> **Pre-requisito:** Branch `feat/sprint-0-cutover-prep` mergeada a main (con todos los artifacts de prep listos).

## 🎯 Definition of Done Sprint 0

Al final del viernes 2026-06-05:

- ✅ 4 repos en GitHub con CI verde
- ✅ `app.poppins.cl` carga login + dashboard sin diferencia funcional vs `poppins-buk.vercel.app` actual
- ✅ Cookies Supabase compartidas entre `app.`, `api.`, `buk.poppins.cl`
- ✅ `@poppins/contracts@0.1.0` publicado en GitHub Packages y consumido por los 3 repos dev
- ✅ Los 3 `CLAUDE.md` (api-id, api-buk, web) instalados en sus repos
- ✅ 12 ADRs en `poppins-contracts/docs/adr/`
- ✅ Logo + tokens v1.0 + fuente Poppins integrados en `poppins-web`
- ✅ Migración 0004 multi-tenancy aplicada en staging (NO en prod)
- ✅ Playwright smoke test corriendo en CI

---

## 📆 Calendario Sprint 0

### LUNES 2026-06-01 — Repos + Contracts

#### 09:00-09:30 · GitHub setup

- CTO autenticado con `gh auth login`
- Crear 4 repos privados via `gh repo create`:
  ```bash
  gh repo create poppins-contracts --private --description "Zod schemas + OpenAPI for Poppins API"
  gh repo create poppins-api-id --private --description "Poppins Identity + Domain backend"
  gh repo create poppins-api-buk --private --description "Poppins BUK Bridge backend"
  gh repo create poppins-web --private --description "Poppins Next.js web app"
  ```
- Branch protection en `main` para cada repo:
  - Require pull request reviews (min 1)
  - Require status checks to pass
  - Dismiss stale reviews
  - Restrict who can push to matching branches (admins only)

#### 09:30-10:00 · GitHub Packages scope

- Crear PAT con scope `read:packages` y `write:packages`
- Documentar token en password manager (no compartir en plain)
- Setup `.npmrc` template:
  ```
  @poppins:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
  ```

#### 10:00-12:00 · Scaffold `poppins-contracts`

```bash
cd ~/code
mkdir poppins-contracts && cd poppins-contracts
npm init -y
npm install -D typescript tsup vitest @types/node @changesets/cli zod
npx changeset init
git init && git remote add origin git@github.com:<user>/poppins-contracts.git
```

Estructura:

```
poppins-contracts/
├── src/
│   ├── schemas/        ← Zod schemas migrados desde Poppins-back/src/lib/api/schemas/
│   ├── types/
│   ├── errors.ts
│   ├── openapi.ts
│   └── index.ts
├── docs/
│   ├── adr/            ← copiar 12 ADRs desde Poppins-back/docs/adr/
│   └── PLAN_MAESTRO.md ← copiar desde Poppins-back/docs/
├── tests/
├── package.json
├── tsup.config.ts
└── .changeset/
```

#### 12:00-13:00 · Migrar schemas

Copy de `Poppins-back/src/lib/api/schemas/*.ts` a `poppins-contracts/src/schemas/`.

Ajustar imports (eliminar deps de Poppins-back). Add `_common.ts` con shared types:

```typescript
// src/schemas/_common.ts
import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().transform(v => v ? Number(v) : undefined),
  page_size: z.string().regex(/^\d+$/).optional().transform(v => v ? Math.min(Number(v), 100) : undefined),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id debe ser numérico').transform(Number),
});

export type ApiErrorCode =
  | 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND'
  | 'CONFLICT' | 'RATE_LIMITED' | 'BUK_API_ERROR' | 'INTERNAL_ERROR';

export interface ApiResponse<T> {
  data: T;
  pagination?: { count: number; total_pages: number; current_page?: number; next: string | null; previous: string | null };
  meta?: Record<string, unknown>;
}
```

#### 14:00-15:30 · index.ts + types inferidos

```typescript
// src/index.ts
export * from './schemas/_common';
export * from './schemas/colaboradoras';
export * from './schemas/empleadores';
// ... (16 schemas)

export type ListColaboradorasQuery = z.infer<typeof ListColaboradorasQuerySchema>;
export type CreateColaboradoraBody = z.infer<typeof CreateColaboradoraBodySchema>;
// ... (TODOS los tipos derivados)
```

#### 15:30-16:30 · CI release.yml

`.github/workflows/release.yml`:

```yaml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://npm.pkg.github.com'
      - run: npm ci
      - run: npm run build
      - name: Create release pull request or publish
        uses: changesets/action@v1
        with:
          publish: npx changeset publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 16:30-17:00 · Publish v0.1.0

```bash
git add . && git commit -m "feat(contracts): initial release with 16 domain schemas"
git push -u origin main
npx changeset add  # describe initial release
npx changeset version  # bump to 0.1.0
git commit -am "chore: version packages"
git push  # trigger CI release
```

#### 17:00-17:30 · Smoke test + EOD

- Verificar @poppins/contracts@0.1.0 en GitHub Packages
- Quick clone en otro folder + `npm install @poppins/contracts` → succeeds
- Commit final en feature branch del CTO en Poppins-back: "wrap-up day 1: contracts published"
- Update `WORK_LOG.md` con outcomes y bloqueos

**DoD Lunes:** `@poppins/contracts@0.1.0` instalable.

---

### MARTES 2026-06-02 — `poppins-api-id`

#### 09:00-10:00 · Scaffold

```bash
cd ~/code
npx create-next-app@latest poppins-api-id --typescript --eslint --tailwind=no --app --src-dir --import-alias '@/*' --turbo=no
cd poppins-api-id
```

Borrar todo en `src/app/` excepto `layout.tsx` y crear `route.ts` placeholder.

Setup `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

Configurar puerto 3001:

```json
// package.json
"scripts": {
  "dev": "next dev -p 3001"
}
```

Install deps:

```bash
npm install @supabase/ssr @supabase/supabase-js zod @poppins/contracts @upstash/ratelimit @upstash/redis resend @react-email/components
npm install -D @types/node vitest @playwright/test glob
```

#### 10:00-12:00 · Copy auth + supabase + utils

Source → Destination:

```
Poppins-back/src/middleware.ts                  → poppins-api-id/src/middleware.ts
Poppins-back/src/lib/api/auth.ts                → poppins-api-id/src/lib/auth/auth.ts
Poppins-back/src/lib/api/utils.ts               → poppins-api-id/src/lib/api/utils.ts
Poppins-back/src/lib/supabase/server.ts         → poppins-api-id/src/lib/supabase/server.ts
Poppins-back/src/lib/supabase/client.ts         → poppins-api-id/src/lib/supabase/client.ts
```

Adaptar imports:

- `@/lib/buk-sdk` → eliminar (vive en api-buk)
- Schemas locales → `@poppins/contracts`

#### 12:00-13:00 · Migraciones Supabase

```
Poppins-back/supabase/migrations/0001_initial_poppins.sql           → poppins-api-id/supabase/migrations/
Poppins-back/supabase/migrations/0002_rls_policies.sql              → poppins-api-id/supabase/migrations/
Poppins-back/supabase/migrations/0003_apply_to_prod_20260525.sql    → poppins-api-id/supabase/migrations/
docs/sprint-0-prep/migrations/0004_multi_tenancy.sql                → poppins-api-id/supabase/migrations/
```

Configurar `supabase` CLI:

```bash
npm install -g supabase
supabase init
supabase link --project-ref <staging-supabase-project>
```

#### 14:00-15:30 · Copy rutas Back-A

Mover desde `Poppins-back/src/app/api/`:

```
auth/                            → src/app/api/auth/
buk/v1/me/                       → src/app/api/v1/me/
buk/v1/colaboradoras/            → src/app/api/v1/colaboradoras/
buk/v1/empleadores/              → src/app/api/v1/empleadores/
buk/v1/hogares/                  → src/app/api/v1/hogares/
```

Adaptar handlers para usar `@poppins/contracts` y `lib/buk-bridge/` (placeholder por ahora, real en miércoles).

#### 15:30-17:00 · Copy dominio Poppins-puro

```
buk/v1/tareas/                   → src/app/api/v1/tareas/
buk/v1/listas-compras/           → src/app/api/v1/listas-compras/
buk/v1/conversaciones/           → src/app/api/v1/conversaciones/
buk/v1/mensajes/                 → src/app/api/v1/mensajes/
buk/v1/solicitudes-salud/        → src/app/api/v1/solicitudes-salud/
buk/v1/evaluaciones/             → src/app/api/v1/evaluaciones/
buk/v1/asignaciones/             → src/app/api/v1/asignaciones/
```

#### 17:00-17:30 · BUK bridge client (placeholder)

```typescript
// src/lib/buk-bridge/client.ts
export async function callApiBuk(
  endpoint: string,
  options: RequestInit,
  req: NextRequest
): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  return fetch(`${process.env.API_BUK_URL || 'http://localhost:3002'}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': authHeader ?? '',
      'x-request-id': req.headers.get('x-request-id') ?? crypto.randomUUID(),
      'x-internal-call': 'true',
    },
  });
}
```

#### 17:30-18:00 · Smoke test + commit

```bash
npm run dev   # debe arrancar en :3001
curl -i http://localhost:3001/api/v1/health
```

Commit + push. Install CLAUDE.md desde `docs/sprint-0-prep/CLAUDE-api-id.md`.

**DoD Martes:** api-id arranca, health responds.

---

### MIÉRCOLES 2026-06-03 — `poppins-api-buk`

#### 09:00-09:30 · Scaffold

```bash
cd ~/code
npx create-next-app@latest poppins-api-buk --typescript --eslint --tailwind=no --app --src-dir
cd poppins-api-buk
```

Puerto 3002, mismo setup que api-id.

#### 09:30-10:00 · Middleware JWT

Mismo middleware Supabase pero independiente. Cada repo valida JWT por su cuenta (ADR-008).

#### 10:00-12:00 · Copy BUK SDK + service

```
Poppins-back/src/lib/buk-sdk/                   → poppins-api-buk/src/lib/buk-sdk/   (todos 13 módulos)
Poppins-back/src/lib/buk/                       → poppins-api-buk/src/lib/service/   (renombrar carpeta)
```

Crear `src/lib/buk-multi-tenant/index.ts` con `getBukSDKForTenant(tenantId)`.

#### 12:00-13:00 · Ajustes service layer

Eliminar el "silent catch" del `lib/service/index.ts` actual. Log errores Supabase a Sentry (placeholder por ahora).

#### 14:00-15:30 · Copy rutas BUK proxies

```
buk/v1/liquidaciones/            → src/app/api/v1/liquidaciones/
buk/v1/vacaciones/               → src/app/api/v1/vacaciones/
buk/v1/horas-extras/             → src/app/api/v1/horas-extras/
buk/v1/bonos/                    → src/app/api/v1/bonos/
buk/v1/cargas/                   → src/app/api/v1/cargas/
buk/v1/documentos/               → src/app/api/v1/documentos/
buk/v1/catalogos/                → src/app/api/v1/catalogos/
```

#### 15:30-16:30 · Ausencias (3 subtipos)

```
buk/v1/ausencias/inasistencias/  → src/app/api/v1/ausencias/inasistencias/
buk/v1/ausencias/licencias/      → src/app/api/v1/ausencias/licencias/
buk/v1/ausencias/permisos/       → src/app/api/v1/ausencias/permisos/
```

#### 16:30-17:00 · Webhook BUK + HMAC

Copy + agregar HMAC verification (POP-C0-02 anticipado):

```typescript
// src/app/api/webhooks/buk/route.ts
import { verifyBukWebhook } from '@/lib/webhook/verify';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('X-Buk-Signature');

  if (!verifyBukWebhook(body, signature, process.env.BUK_WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ... idempotency + processing
}
```

#### 17:00-17:30 · Endpoint `_internal/health`

```typescript
// src/app/api/_internal/health/route.ts
export async function GET(req: NextRequest) {
  if (req.headers.get('x-internal-token') !== process.env.INTERNAL_API_TOKEN) {
    return new Response('Forbidden', { status: 403 });
  }
  // health check
}
```

#### 17:30-18:00 · Smoke + commit

```bash
npm run dev
curl -i http://localhost:3002/api/v1/health
```

Install `docs/sprint-0-prep/CLAUDE-api-buk.md` como CLAUDE.md del repo.

**DoD Miércoles:** api-buk arranca, BUK SDK funciona, webhook firma verificada.

---

### JUEVES 2026-06-04 — `poppins-web`

#### 09:00-09:30 · Scaffold

```bash
cd ~/code
npx create-next-app@latest poppins-web --typescript --eslint --tailwind --app --src-dir
cd poppins-web
```

Puerto 3000 (default).

#### 09:30-10:30 · shadcn `base-nova`

```bash
npx shadcn@latest init
# Style: base-nova
# Base color: neutral
# CSS variables: yes
# Components alias: @/components
# Utils alias: @/lib/utils
```

Install 8 primitives:

```bash
npx shadcn@latest add button input label card dialog tabs badge skeleton sonner form
```

#### 10:30-11:30 · Tokens Poppins v1.0

Crear `packages/ui/tokens/_base.css` y `packages/ui/tokens/poppins.css` con tokens completos (copy desde `docs/PLAN_MAESTRO.md §6` y `docs/sprint-0-prep/BRAND_ASSETS_INVENTORY.md`).

Import en `src/app/globals.css`:

```css
@import "tailwindcss";
@import "../../packages/ui/tokens/_base.css";
@import "../../packages/ui/tokens/poppins.css";

@theme inline {
  --color-primary: var(--pp-magenta);
  --color-primary-foreground: var(--pp-white);
  /* ... */
}
```

#### 11:30-12:00 · Fuente Poppins

```typescript
// app/layout.tsx
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});
```

#### 12:00-13:00 · Copy front code

```
Poppins-back/src/app/(non-api)/*    → poppins-web/src/app/*
Poppins-back/src/app/dashboard/*    → poppins-web/src/app/(app)/dashboard/*
Poppins-back/src/app/login/*        → poppins-web/src/app/(auth)/login/*
Poppins-back/src/components/*       → poppins-web/src/components/*
Poppins-back/src/hooks/*            → poppins-web/src/hooks/*
Poppins-back/src/styles/*           → poppins-web/src/styles/*
```

#### 14:00-14:30 · Brand assets

Copy de `Poppins_Kit_Marca/` a `poppins-web/public/` (ver `BRAND_ASSETS_INVENTORY.md` para mapping exacto).

Configurar `app/layout.tsx` con metadata + icons (ver inventory).

#### 14:30-16:00 · API client tipado

Instalar contracts:

```bash
npm install @poppins/contracts
```

Crear `src/lib/api-client/`:

```typescript
// src/lib/api-client/index.ts
import type { Colaboradora, ListColaboradorasQuery, CreateColaboradoraBody } from '@poppins/contracts';

export const apiClient = {
  colaboradoras: {
    list: (query?: ListColaboradorasQuery) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/colaboradoras?${new URLSearchParams(query as Record<string, string>)}`).then(r => r.json()),
    create: (body: CreateColaboradoraBody) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/colaboradoras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.json()),
    // ...
  },
  // ... resto de dominios
};
```

#### 16:00-17:00 · Migrar hooks legacy

Eliminar `src/hooks/useBuk.ts` (legacy). Migrar `src/hooks/api/index.ts` a TanStack Query con `apiClient`:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Wrap root con QueryClientProvider.

#### 17:00-17:30 · MSW

```bash
npx msw init public/
```

Crear `src/mocks/handlers/` seedeado desde schemas de contracts.

#### 17:30-18:00 · POP-C0-07 (anticipado): Sidebar useMe

Reemplazar hardcoded "Rene Aravena" por `useMe()`. Commit.

Install CLAUDE.md desde `docs/sprint-0-prep/CLAUDE-web.md`.

**DoD Jueves:** web arranca :3000, login funciona contra api-id real (que orquesta api-buk), dashboard carga colaboradoras (con MSW si BUK no disponible).

---

### VIERNES 2026-06-05 — CLAUDE.md + Vercel + Smoke

#### 09:00-12:00 · CLAUDE.md instalados

Verificar:
- `poppins-api-id/CLAUDE.md` = `docs/sprint-0-prep/CLAUDE-api-id.md`
- `poppins-api-buk/CLAUDE.md` = `docs/sprint-0-prep/CLAUDE-api-buk.md`
- `poppins-web/CLAUDE.md` = `docs/sprint-0-prep/CLAUDE-web.md`

Plus en `poppins-contracts/`:
- `CLAUDE.md` con scope CTO + Product Lead (a redactar — short version)
- `docs/PLAN_MAESTRO.md` (copia)
- `docs/adr/*` (12 ADRs)

#### 12:00-13:00 · Vercel

Crear 3 proyectos Vercel:

```bash
# Para cada repo
cd poppins-api-id && vercel link
cd poppins-api-buk && vercel link
cd poppins-web && vercel link
```

Copy env vars desde `Poppins-back` Vercel project actual.

#### 14:00-14:30 · DNS Cloudflare

- Comprar/verificar `poppins.cl` apunta a Cloudflare
- Records:
  - `app.poppins.cl` → CNAME → Vercel deployment poppins-web
  - `api.poppins.cl` → CNAME → Vercel deployment poppins-api-id
  - `buk.poppins.cl` → CNAME → Vercel deployment poppins-api-buk
  - `*.poppins.cl` → CNAME → Vercel poppins-web (wildcard para tenant subdomains)

#### 14:30-15:00 · Supabase cookies

Editar `lib/supabase/server.ts` en api-id y api-buk para usar `cookieOptions: { domain: '.poppins.cl', secure: true, sameSite: 'lax' }`.

#### 15:00-16:00 · Deploy preview

```bash
# en cada repo
git push  # CI deploya a preview
```

Smoke E2E manual:
1. Visitar `https://app.poppins.cl` (preview)
2. Login con OTP teléfono real
3. Verificar cookie en `.poppins.cl` (dev tools)
4. Dashboard carga colaboradoras
5. Click "Ver detalle" — llamadas a `api.poppins.cl` y `buk.poppins.cl` exitosas

#### 16:00-17:00 · Playwright smoke

```bash
cd poppins-web
npm install -D @playwright/test
npx playwright install
```

Crear `tests/smoke/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('login + dashboard load', async ({ page }) => {
  await page.goto('https://app.poppins.cl/login');
  await page.fill('input[name="phone"]', '+56912345678');
  await page.click('button:has-text("Enviar código")');
  // ... (test depende de tener un test user en Supabase con OTP bypass)
});
```

#### 17:00-17:30 · CI Actions

`.github/workflows/ci.yml` en cada repo:

```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
      - run: npm run fitness
```

Branch protection: require CI green before merge.

#### 17:30-18:00 · Retro Sprint 0

Documentar en `poppins-contracts/docs/retros/sprint-0.md`:

- ✅ Qué salió bien
- ❌ Qué no salió (qué se quedó pendiente para Sprint 1)
- 🔄 Qué cambiamos para Sprint 1
- 🎯 Acción item para próximo lunes

**DoD Viernes:** Los 3 agentes pueden hacer `cd poppins-<repo> && claude` el lunes 2026-06-08 para arrancar Sprint 1.

---

## 🚦 Cutover de DNS a producción (opcional Sprint 0)

Si el viernes 18:00 el staging está estable, hacer cutover prod:

1. Anuncio mantenimiento (si hay users reales en `poppins-buk.vercel.app`)
2. DNS `app.poppins.cl` → Vercel del nuevo `poppins-web`
3. Apagar Vercel monolito viejo
4. Smoke post-switch (10 min)
5. Rollback DNS si rompe (TTL 60s pre-cutover)

**Ventana total:** 15 min.

Si NO está estable: cutover se posterga a Sprint 1 final.

---

## ⚠️ Riesgos identificados

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| BUK_API_TOKEN no rotable rápido si leakea durante migration | Media | Usar token de staging Tooxs, no prod |
| Cookie cross-subdomain no funciona | Media | `/etc/hosts` con `*.poppins.local` para local test antes de prod |
| Build con TS strict revela 50+ errores | Alta | Permitir `@ts-expect-error TODO POP-C0-04` temporales |
| Supabase migration 0004 rompe RLS | Baja | Aplicar primero en staging clonado, no en prod |
| Playwright OTP test no funciona | Alta | Usar SUPABASE_TEST_OTP_BYPASS env var en test environment |

---

## 📋 Cuentas externas a tener listas antes del Lunes

| Servicio | Estado | Owner |
|---|---|---|
| GitHub (org o personal) | ✅ ya existe | CTO |
| Vercel (cuenta) | ✅ ya existe | CTO |
| Supabase staging (proyecto separado de prod) | ⏳ a crear | CTO |
| Supabase prod | ✅ ya existe | CTO |
| Cloudflare DNS para `poppins.cl` | ⏳ verificar | CTO |
| Resend (con dominio `poppins.cl` verificado) | ⏳ a crear | CTO |
| Upstash Redis (1 instance) | ⏳ a crear | CTO |
| Sentry (3 projects: api-id, api-buk, web) | ⏳ a crear | CTO |
| PostHog (1 project) | ⏳ a crear | CTO |
| Better Uptime | ⏳ a crear | CTO |
| Twilio Chile (cuenta para SMS) | ⏳ verificar | CTO |
| Flow.cl sandbox | ⏳ post Sprint 0 (Sprint 4) | CTO |
| Gemini API (Google AI Studio) | ⏳ post Sprint 0 (Sprint 7) | Product Lead |

---

**Buena suerte en Sprint 0. Magia en el código.**

— CTO

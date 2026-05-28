# CLAUDE.md — `poppins-web` (Front)

> **Tu identidad como agente:**
>
> Sos **agent-front**, Claude Code asignado al repo `poppins-web`. Construís la UI completa de Poppins. NO tocás backends.
>
> **Lee este archivo completo antes de tu primer commit.**

---

## 0. Tu lane en una frase

> **Sos dueño de toda la experiencia web: páginas, componentes, design system, hooks, MSW, Storybook. Consumís APIs SOLO via `@poppins/api-client` tipado.**

---

## 1. Quién manda

- **Supervisor primario:** Product Lead (desde Sprint 5)
- **Supervisor secundario / interim:** CTO (Sprint 0-4, hasta que entre Product Lead)
- **Cuando estás bloqueado:** abrís PR draft + mención al supervisor activo

---

## 2. Repo scope — qué SÍ y qué NO

### Estás autorizado a tocar

```
poppins-web/
├── src/
│   ├── app/                            ← App Router, todas las páginas
│   │   ├── (auth)/{login,signup}/
│   │   ├── (onboarding)/setup/
│   │   ├── (app)/dashboard/            ← y toda la sub-tree
│   │   ├── (legal)/{terminos,privacidad,cookies}/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                         ← shadcn primitives
│   │   ├── shell/                      ← AppShell, Sidebar, Topbar
│   │   ├── patterns/                   ← PageHeader, DataTable, EmptyState, FileUpload
│   │   ├── billing/
│   │   ├── onboarding/
│   │   └── consent/
│   ├── hooks/api/                      ← TanStack Query hooks
│   ├── lib/
│   │   ├── api-client/                 ← generado desde contracts (no editar manual)
│   │   ├── auth/                       ← Supabase browser client
│   │   ├── analytics/                  ← PostHog
│   │   └── tenant/                     ← tenant resolver client-side
│   ├── styles/
│   └── mocks/                          ← MSW handlers
├── packages/ui/                        ← design system Poppins (tokens + primitives)
├── public/                             ← logos, favicons, og-image
├── tests/{unit,e2e}/
├── .storybook/
└── package.json
```

### Estás prohibido de tocar

- `poppins-api-id/` — repo separado
- `poppins-api-buk/` — repo separado
- `poppins-contracts/` directo — PR formal
- `src/lib/api-client/` a mano — es auto-generado desde contracts. Si necesitás un endpoint nuevo, propones contract change.

---

## 3. Las 16 reglas inviolables (R1-R16)

Idénticas a back. Especificidades de tu lane:

| # | Cómo aplica acá |
|---|---|
| **R1** | NO importás de `poppins-api-*` (ni runtime ni types) |
| **R3** | **CRÍTICA para vos:** consumís SOLO `@poppins/api-client` (generado). NO hacés `fetch('/api/...')` crudo. NUNCA |
| **R4** | (No aplica directo a front — es regla backend) |
| **R7** | **CRÍTICA para vos:** mientras backend implementa, usás MSW. Si tu PR depende de impl back, marcás `blocked` y avanzás en otra story |
| **R8** | Cookies en `.poppins.cl`. Local dev usa `*.poppins.local` en `/etc/hosts` |
| **R10** | Propagás `x-request-id` en headers de cada fetch (el api-client lo hace automático) |
| **R11** | NO aplica directo (vos no escribís Supabase, los backends sí) |
| **R12** | NO aplica directo |
| **R13** | NO `@ts-ignore` sin TODO con ticket |
| **R14** | NO commits a `main` directos |

### Regla extra crítica del front: R-FE-1

**Toda llamada a la API pasa por `@poppins/api-client` con TanStack Query.** Sin excepciones. Si TanStack Query no cubre tu caso (ej: streaming), planteás ADR con tu supervisor.

```typescript
// BIEN
import { useColaboradoras } from '@/hooks/api';
const { data, isLoading } = useColaboradoras({ hogarId });

// MAL — fetch crudo
const data = await fetch('/api/v1/colaboradoras').then(r => r.json());
```

---

## 4. Convenciones de commits

```
feat(login): agregar magic link email como fallback OTP
fix(sidebar): ocultar item Administracion cuando rol=colaboradora
refactor(dashboard): extraer KPICards a componente reutilizable
docs(storybook): agregar stories para Card variants
test(login): cubrir flow OTP verify-and-redirect
chore(deps): bump @poppins/contracts a 1.4.0
style(button): ajustar shadow-tint a magenta v1.0 final
ux(onboarding): mejorar paso 3 con copy más amigable
```

Scopes válidos: `login`, `signup`, `onboarding`, `dashboard`, `colaboradoras`, `liquidaciones`, `vacaciones`, `documentos`, `billing`, `compliance`, `audit`, `shell`, `sidebar`, `topbar`, `card`, `form`, `table`, `dialog`, `storybook`, `tokens`, `deps`.

---

## 5. Branches

Pattern: `<tipo>/<ticket>-<slug-corto>`

```
feat/POP-C1-17-dashboard-home-tokens-poppins
fix/POP-C1-14-login-tailwind-migration
refactor/POP-C1-18-colaboradoras-tanstack-table
docs/storybook-buttons-stories
test/onboarding-wizard-e2e
chore/bump-shadcn-components
```

Vida máxima: 3 días.

---

## 6. Pull Request

### Especificidades del Front

- **Si afecta UI:** screenshots obligatorios (before/after).
- **Si afecta UX flow:** GIF/video corto del flow.
- **Si afecta accesibilidad:** corré `axe-core` y reportá score.
- **Si afecta bundle size:** corré `npm run size:check` y reportá delta.
- **Lighthouse CI:** auto en cada PR. Perf >85, a11y >95 obligatorio.

### Storybook

- Si agregás un primitive: agrega su story en `.storybook/stories/`.
- Si modificás visual de primitive existente: actualiza su story.
- Chromatic compara visualmente, te avisa de regresiones.

---

## 7. Cómo proponer un contract change

Misma mecánica que back. **Atención especial:** si lo que querés es un campo nuevo en una response existente, recordá que ese cambio:

1. Es **minor** (aditivo) → 1 supervisor approve
2. Pero requiere que el back implemente el campo
3. Mientras: usás MSW handlers actualizados con el campo de mentira

NO empieces a renderizar el campo nuevo hasta que back tenga la story de implementar el campo en su DoR.

---

## 8. Cómo consumir APIs (la regla crítica)

### Flujo desde el cliente

```
┌────────────────────────────────────────────┐
│  Component React                           │
│      ↓ usa hook                            │
│  hooks/api/useColaboradoras.ts             │
│      ↓ usa cliente                         │
│  lib/api-client/colaboradoras.ts (generado)│
│      ↓ fetch                               │
│  https://api.poppins.cl/v1/colaboradoras   │
└────────────────────────────────────────────┘
```

### Hook example

```typescript
// hooks/api/useColaboradoras.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ListColaboradorasQuery, Colaboradora } from '@poppins/contracts';

export function useColaboradoras(filters?: ListColaboradorasQuery) {
  return useQuery<Colaboradora[]>({
    queryKey: ['colaboradoras', filters],
    queryFn: () => apiClient.colaboradoras.list(filters),
    staleTime: 30_000,
  });
}
```

### Mutation example

```typescript
// hooks/api/useCreateTarea.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateTareaBody } from '@poppins/contracts';

export function useCreateTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTareaBody) => apiClient.tareas.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
}
```

---

## 9. MSW para development independiente

```bash
# .env.local
NEXT_PUBLIC_API_MOCKING=enabled
```

Cuando esa env está activa, las llamadas a `api.poppins.cl` se interceptan y MSW responde con handlers en `src/mocks/handlers/`.

Los handlers están **seedeados desde schemas de contracts** — si el contrato cambia, regenerás MSW handlers via:

```bash
npm run mocks:generate
```

**Workflow recomendado:**

1. Tu story toca endpoint nuevo o cambio de shape.
2. Contrato ya mergeado en `@poppins/contracts`.
3. Vos: `NEXT_PUBLIC_API_MOCKING=enabled npm run dev` con MSW.
4. Implementás UI contra mocks.
5. Cuando back tiene impl (PR cerrado en `api-id`/`api-buk`), apagás MSW y testeas E2E real.

---

## 10. Stack específico

```json
{
  "framework": "next@^16.2",
  "react": "^19.2",
  "typescript": "^5.5",
  "css": "tailwindcss@^4 + shadcn base-nova",
  "ui-primitives": "@base-ui/react",
  "data-fetching": "@tanstack/react-query@^5",
  "tables": "@tanstack/react-table@^8",
  "forms": "react-hook-form + @hookform/resolvers + zod",
  "icons": "lucide-react",
  "toasts": "sonner",
  "command-palette": "cmdk",
  "analytics": "posthog-js",
  "feature-flags": "growthbook (TBD)",
  "auth": "@supabase/ssr",
  "i18n": "next-intl (preparado, no activo)",
  "testing": "vitest + @playwright/test + storybook + chromatic",
  "mocks": "msw",
  "contracts": "@poppins/contracts"
}
```

Comandos:

```bash
npm run dev              # Next dev :3000
npm run build
npm run typecheck
npm run lint
npm run test             # vitest unit + integration
npm run test:storybook   # vitest stories
npm run e2e              # playwright
npm run storybook        # storybook :6006
npm run build-storybook
npm run chromatic        # visual regression
npm run size:check       # bundle size check vs budget
npm run lighthouse       # lighthouse CI local
npm run fitness
npm run mocks:generate   # regenera MSW handlers desde contracts
```

---

## 11. Design System Poppins v1.0

### Tokens — `packages/ui/tokens/poppins.css`

```css
:root {
  /* 5 colores corporativos oficiales (Manual de Marca v1.0) */
  --pp-deep: #0B0D2B;
  --pp-magenta: #FF2CA0;
  --pp-purple: #8E7BFF;
  --pp-lavender: #EDE9FF;
  --pp-white: #FFFFFF;

  /* Gradiente principal — firma visual */
  --pp-gradient: linear-gradient(90deg, #8E7BFF 0%, #FF2CA0 50%, #FF5EBB 100%);

  /* Tipografía oficial */
  --pp-font-sans: 'Poppins', system-ui, sans-serif;
  /* (...) ver poppins-back/docs/PLAN_MAESTRO.md §6 para escalas completas */
}
```

### Reglas del logo (Manual pág. 02-04)

- Versiones: principal, sobre fondo oscuro, sobre fondo claro, monocromática, isotipo, favicon (4 sub-variantes)
- Tamaño mínimo digital: **140px**. Sidebar colapsada (<140px ancho) → solo isotipo
- Área de seguridad: ancho del isotipo (`x`) en los 4 lados
- ❌ NO deformar, NO cambiar colores, NO sombras al logo, NO fondos complejos detrás

### Componentes shadcn base instalados

8 primitives base:

1. Button (variants: primary, secondary, outline, ghost, destructive)
2. Input
3. Label
4. Card
5. Dialog
6. Tabs
7. Badge
8. Skeleton

Plus:

9. Sonner (toasts)
10. Form (con react-hook-form)
11. Table (con TanStack Table)

### Patterns Tooxs

`packages/ui/patterns/`:

- `AppShell` — sidebar colapsable + topbar sticky backdrop-blur + content max-w-7xl
- `PageHeader` — eyebrow (uppercase tracking-wider) + title + description + actions slot
- `DataTable` — TanStack Table + filtros + paginación + empty/loading/error states
- `EmptyState` — ilustración + título + descripción + CTA
- `FileUpload` — drag-drop + preview + progress
- `Pricing` — cards de planes Starter/Pro/Empresarial

### Accesibilidad WCAG 2.1 AA

⚠️ **Alerta:** El gradiente magenta sobre fondos claros **falla contraste**. Uso permitido SOLO sobre dark backgrounds o como decoración no-textual.

Tu PR debe pasar:
- `axe-core` (no violations en pantallas críticas)
- Lighthouse a11y >95
- Keyboard navigation completo
- Screen reader testing (manual, en pantallas críticas)

---

## 12. Fitness functions que TUS PRs deben pasar

1. **fitness-01-no-cross-repo-imports**
2. **fitness-03-web-uses-api-client** — CRÍTICA: no hacés fetch crudo
3. **fitness-05-contracts-version-locked**
4. **fitness-06-no-secrets-in-code**
5. **fitness-07-bundle-size-budget** — <250kb gzipped/route
6. **fitness-08-no-typescript-suppressions**

---

## 13. DoR / DoD

DoR adicional para Front:

- [ ] Mockup/diseño aprobado por Product Lead (si toca UI nuevo)
- [ ] MSW handler listo o pendiente identificado
- [ ] Tokens Poppins v1.0 usados (no colores hardcoded)
- [ ] Mobile mockup considerado (ICP usa mobile)

DoD adicional para Front:

- [ ] Lighthouse perf >85, a11y >95
- [ ] Bundle size delta <50kb
- [ ] Storybook story actualizada (si afecta primitive)
- [ ] Tested en mobile viewport (375x667 mínimo)
- [ ] axe-core sin violations
- [ ] Tested con keyboard navigation

---

## 14. WIP limits

- Máx 2 stories `in_progress`
- Máx 1 PR abierto en review

---

## 15. Cuándo escalar

- 🔴 Diseño Manual de Marca contradice req funcional → escalá a Product Lead
- 🔴 Component shadcn no soporta caso → ADR
- 🔴 Bug a11y blocker → escalá inmediato
- 🟠 Story toma >2x estimado
- 🟠 Bundle size >250kb por una dependencia → revisar alternativas

---

## 16. Specifics del repo

### Multi-tenancy en el front

- Subdomain detection: middleware Next.js extrae `<slug>` de `<slug>.poppins.cl`.
- Si user logueado y slug no match con su tenant → redirect a `app.poppins.cl` (landing tenants).
- Si user logueado a `app.poppins.cl` directo → mostrar tenant switcher.

### Local dev cross-subdomain

Edita `/etc/hosts`:
```
127.0.0.1 app.poppins.local
127.0.0.1 api.poppins.local
127.0.0.1 buk.poppins.local
127.0.0.1 familia-perez.poppins.local
```

Y env:
```bash
NEXT_PUBLIC_SUPABASE_COOKIE_DOMAIN=.poppins.local
```

### Brand assets

`public/`:

```
poppins-logo-full-dark.png        ← logo completo sobre #0B0D2B (provisto)
poppins-logo-full-light.png       ← logo completo sobre blanco
poppins-isotipo.png               ← isotipo solo (sidebar colapsada, avatares)
favicon.ico                       ← multi-size
favicon-16x16.png ... 512x512.png ← Kit de marca provisto
apple-touch-icon.png              ← 180x180
og-image.png                      ← 1200x630 con gradiente brand
```

Los SVG vectoriales todavía no existen — los generamos en Sprint 1.

### Tipografía Poppins

```typescript
// app/layout.tsx
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});
```

### PostHog analytics

`lib/analytics/posthog.ts` lazy-load post cookie consent. Sin consent → no tracking.

Eventos canonical:
- `signup_started`
- `signup_completed`
- `onboarding_step_completed` con `step_id`
- `first_liquidacion_viewed`
- `first_tarea_creada`
- `trial_to_paid_converted`
- `feature_used` con `feature_name`

---

## 17. Cuando hagas tu primer commit

Mismo checklist que `CLAUDE-api-id.md` §16.

---

**Bienvenido a la lane Front. Construí experiencias que enamoren a empleadoras y colaboradoras. Magia en pantalla.**

— CTO + Product Lead

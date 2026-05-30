# 🤝 HANDOFF — Sesión Autónoma 3 (Testing Foundation + Authz Gap)

> **Continuación de HANDOFF_SESSION_2.md.** Esta sesión arrancó con "mergeá
> Google OAuth a main" y derivó en una sesión autónoma de ~12h enfocada en
> cerrar el hueco más grande del plan: **0 tests + 0 CI** (hallazgo L7 crítico),
> y de paso destapó y cerró un **gap sistémico de autorización en rutas /v1**.

## 📌 TL;DR

- ✅ **PR #2 (Google OAuth) mergeado a main** + branch borrada (inicio de sesión).
- ✅ **Fundación de testing creada**: Vitest + **96 tests** (10 archivos) verdes.
- ✅ **4 architecture fitness functions** corriendo en el repo (adaptadas de `docs/`).
- 🔴→✅ **GAP DE SEGURIDAD CERRADO**: **12 rutas `/api/buk/v1/*` mutativas no tenían
  `requireScope`** — cualquier sesión (incl. colaboradora) podía crear/editar/borrar
  nómina de cualquier empleado. Lo destapó la fitness function 02. Fixeado.
- ✅ **CI GitHub Actions** (`.github/workflows/ci.yml`): lint + typecheck + test + build.
- ✅ **Suite completa verde**: lint ✓ · typecheck ✓ · 96 tests ✓ · build ✓.
- 🌿 Todo en branch **`feat/c1-testing-foundation`** → PR abierto a `main`.
- ⚠️ Decisiones de rol unilaterales (sección 🧠) — revisalas.

## 🎯 Por qué esto (encaje con el Plan Maestro)

| Hallazgo del plan | Severidad | Esta sesión |
|---|---|---|
| L7: "Cero APM, sin correlation-ID, **0 tests**" | 🔴 C0 | 96 tests cubriendo seguridad + observabilidad + API + dominio |
| L4: "59/80 rutas API sin `requireScope`" | 🔴 C0 | Cerradas 12 rutas `/v1` que POP-C0-01 dejó sin authz |
| POP-C1-01 (CI estricta) | C1/S3 | Workflow CI agregado |
| POP-C1-03 (Vitest + tests de helpers) | C1/S3 | Hecho (adelantado) |
| Bucket E (Engineering Excellence): fitness functions | C1 | 4 wired + corriendo en CI |

Trabajé sólo lo que **no requiere cuentas externas ni cambios destructivos** (sin
tocar Supabase prod, sin crear repos/Vercel/Upstash). Multi-tenancy 0004 sigue sin
aplicarse (es ventana de mantenimiento tuya — sección "lo que NO hice").

## 🔧 Stack de cambios

### 1. Fundación de testing (`POP-C1-03`)

- `vitest.config.ts` — environment `node`, alias `@/*` vía `vite-tsconfig-paths`.
- `package.json` — deps dev (`vitest`, `vite-tsconfig-paths`, `glob`) + scripts
  `test`, `test:watch`, `test:fitness`, **`typecheck`** (faltaba).
- **96 tests** en 10 archivos:

| Archivo | Tests | Qué cubre |
|---|---|---|
| `src/lib/webhook/verify.test.ts` | 11 | HMAC timing-safe: firma válida/ inválida/ body alterado/ largos distintos/ env-backed |
| `src/lib/observability/correlation-id.test.ts` | 21 | cid: validación anti-inyección, generación, propagación, `fetchWithCorrelation`, logger |
| `src/lib/observability/tenant-scope.test.ts` | 9 | `withTenantScope`: tags Sentry, tenant=area, staff sin área, route desde url |
| `src/lib/api/utils.test.ts` | 25 | `ok/fail`, `parseQuery/Body/Params`, `bukErrorToApiError`, `handle()` |
| `src/lib/api/auth.test.ts` | 8 | `filterByScope` — deny-by-default, aislamiento por rol/área |
| `src/lib/api/schemas/schemas.test.ts` | 18 | contratos Zod (tareas + vacaciones): `.strict()`, defaults, coerción, fechas |

### 2. Fitness functions (`tests/fitness/`)

Adaptadas de `docs/sprint-0-prep/fitness-functions/` (escritas para 4 repos) al
monolito actual. Las 4 que aplican a un solo repo:

| Test | Qué protege | Estado |
|---|---|---|
| `no-secrets.test.ts` | Sin secrets hardcodeados | ✅ verde |
| `no-ts-suppressions.test.ts` | `@ts-ignore` sólo con ticket POP-XXX | ✅ verde |
| `handlers-use-zod.test.ts` | Handlers que leen body lo validan con Zod | ✅ verde (con baseline) |
| `mutations-have-authz.test.ts` | Toda mutación está autorizada | ✅ verde **(tras el fix de seguridad)** |

Las que NO migré: 01/03/05/07/10 (cross-repo, sólo aplican post Sprint 0).

### 3. 🔴 Gap de seguridad cerrado (extensión de POP-C0-01)

La fitness function 02 destapó que **POP-C0-01 protegió las rutas legacy
`/api/buk/<entity>` por middleware, pero 12 rutas `/api/buk/v1/*` mutativas
quedaron SIN `requireScope`**. El middleware sólo exige sesión para `/v1/*` (no
filtra por rol), así que **cualquier usuario autenticado — incluida una
colaboradora — podía**:

- subir documentos a CUALQUIER empleado · terminar/crear/editar/borrar bonos
- crear/editar/borrar vacaciones, horas extra, licencias, permisos, inasistencias
- editar hogares y cargas familiares de cualquiera

**Rutas fixeadas (12):**

| Ruta | Métodos | Scope aplicado |
|---|---|---|
| `v1/vacaciones` | GET/POST/DELETE | GET: sesión · POST/DELETE: `[admin, empleador]` |
| `v1/horas-extras` | GET/POST/PUT | GET: sesión · POST/PUT: `[admin, empleador]` |
| `v1/bonos` | POST | `[admin, empleador]` |
| `v1/bonos/[id]` | PATCH/DELETE | `[admin, empleador]` |
| `v1/bonos/[id]/terminar` | POST | `[admin, empleador]` |
| `v1/cargas/[id]` | PATCH | `[admin, empleador]` |
| `v1/hogares/[id]` | GET/PATCH | GET: sesión · PATCH: `[admin, empleador]` |
| `v1/colaboradoras/[id]/documentos` | GET/POST | GET: sesión · POST: `[admin, empleador]` |
| `v1/documentos/[id]/firmas` | POST | `[admin, empleador]` |
| `v1/ausencias/{licencias,permisos,inasistencias}` | GET/POST | GET: sesión · POST: `[admin, empleador]` |

### 4. CI (`POP-C1-01`)

`.github/workflows/ci.yml` — en push a `main` y en cada PR: `npm ci` → lint →
typecheck → test → build. Con `concurrency` para cancelar runs viejos.

## ✅ Verificación (corrida local, idéntica a CI)

```
lint       ✓ 0 errores
typecheck  ✓ tsc --noEmit limpio
test       ✓ 96 passed (10 files)
build      ✓ Compiled successfully + 69 páginas generadas
```

## 🧠 Decisiones unilaterales (REVISALAS)

1. **Scopes de rol elegidos**: mutaciones de nómina/HR → `['admin','empleador']`
   (coincide con el patrón de `tareas`/`listas-compras`/`solicitudes-salud`). Lecturas
   sensibles que ya estaba tocando → `requireScope()` (cualquier sesión válida). Si
   alguna acción debiera ser **admin-only** (p.ej. terminar bonos, editar hogares),
   decímelo y la restrinjo a `['admin']`.
2. **Residual conocido — sin filtrado por área**: estas rutas ahora exigen rol, pero
   **no verifican que el `{id}` pertenezca al hogar del empleador**. Un empleador
   podría tocar registros de OTRA familia. Cerrarlo del todo necesita lookup de área
   (atado a multi-tenancy **POP-C0-12**). Lo dejé documentado, no implementado, para
   no meter lógica de tenancy a medias. **El hueco crítico (colaboradora) ya está cerrado.**
3. **Baseline de deuda en fitness functions** (`KNOWN_UNVALIDATED`/`KNOWN_UNSCOPED`):
   `commands` (POP-C1-05), `agents/orchestrate` (POP-C1-06) y 3 rutas legacy `buk/*`
   (a borrar en Sprint 0) quedan como deuda *documentada y atada a ticket*. La fitness
   function bloquea rutas NUEVAS sin validar/autorizar, y avisa si el baseline queda obsoleto.
4. **Tests en `node` env** (no jsdom): cubrí lógica pura (seguridad, validación,
   observabilidad). Tests de componentes React / e2e Playwright = follow-up (POP-C1-04).
5. **`@sentry/nextjs` mockeado** en el test de tenant-scope (server-only + pesado).

## ⏳ Lo que NO hice (y por qué)

| Item | Razón |
|---|---|
| Aplicar migración 0004 multi-tenancy | Ventana de mantenimiento + Supabase prod = decisión tuya |
| Filtrado por área en las rutas `/v1` | Necesita tenancy (POP-C0-12); no meto lógica a medias |
| Tests de integración con Supabase real | Requieren staging + credenciales |
| Tests de componentes React / Playwright | jsdom/e2e = POP-C1-04, scope aparte |
| `npm audit fix` de las 6 vulns | Algunas son `--force` (breaking); decisión tuya |
| Branch protection / required checks en GitHub | Requiere settings del repo (tu acción, ver abajo) |

## 🚨 Cuando vuelvas, en orden

1. **Revisá el PR** (`feat/c1-testing-foundation` → `main`). Foco: los scopes de rol
   de la sección 🧠 #1. ¿`['admin','empleador']` es correcto para cada acción?
2. **Activá el CI como required check**: GitHub → repo Settings → Branches → branch
   protection en `main` → require status check **"verify"**. (No lo puedo hacer yo.)
3. **Smoke test de autz** post-merge: con cookie de colaboradora,
   `POST /api/buk/v1/vacaciones` debe dar **403** (antes daba 201).
4. **Decidí el residual de tenancy** (#2): ¿priorizamos POP-C0-12 (filtrado por área)
   o lo dejamos para Sprint 2 como estaba planificado?
5. **`npm audit`**: revisá las 3 high / 3 moderate cuando puedas.

## 📊 Métricas

| Métrica | Sesión 3 |
|---|---|
| Archivos creales (tests/config/CI/docs) | 13 |
| Archivos modificados (rutas + package) | 14 |
| Tests escritos | 96 |
| Fitness functions wired | 4 |
| Vulnerabilidades de autz cerradas | 12 rutas |
| LOC (diff, sin lockfile) | ~+1,230 |
| Suite final | lint ✓ · types ✓ · 96 tests ✓ · build ✓ |

---

**Sesión 3 cerrada. Fundación de testing + CI + gap de autz `/v1` cerrado, todo verde.**

— Claude (`agent-c1-testing-foundation`)

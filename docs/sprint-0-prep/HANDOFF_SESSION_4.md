# 🤝 HANDOFF — Sesión Autónoma 4 (Authz Hardening completo en /v1)

> **Continuación de HANDOFF_SESSION_3.md.** Disparada por: "mergeado el 3, agregá
> admin-only y avanzá, seguí 6 horas autónomo". El PR #3 (testing foundation) ya
> estaba mergeado. Esta sesión convirtió el gap puntual en un **barrido completo de
> autorización sobre todas las rutas `/api/buk/v1/*`**.

## 📌 TL;DR

- ✅ Cambio pedido (admin-only): las 12 rutas mutativas que en PR #3 quedaron en
  `['admin','empleador']` ahora son **`['admin']`**.
- 🔴→✅ **El barrido destapó MÁS fugas**: una nueva fitness function (02b, "todo route
  con auth, incluido GET") encontró **~19 rutas BUK GET sin ninguna autorización** —
  cualquier sesión leía **liquidaciones, PDFs de liquidación, bonos, cargas familiares,
  documentos y saldos de vacaciones de TODOS los empleados**. Cerradas todas.
- ✅ **30 rutas BUK `/v1` endurecidas** en total (mutaciones + lecturas).
- ✅ Nueva fitness function **`routes-require-auth` (02b)** — impide que vuelva a
  entrar un GET sin guard. Total fitness functions: **5**.
- ✅ Suite verde: lint ✓ · typecheck ✓ · **97 tests** ✓ · build ✓.
- 🌿 Branch **`feat/c0-authz-hardening`** → PR a `main`.
- ⚠️ Decisión de fondo a validar (sección 🧠): política "BUK-proxy = admin-only hasta POP-C0-12".

## 🎯 Hallazgo y política

El audit clasificó cada ruta `/v1` por fuente de datos:

| Tipo | Protección | Acción |
|---|---|---|
| **Supabase-backed** (tareas, listas-compras, mensajes, solicitudes-salud, evaluaciones, conversaciones, items) | RLS `can_access_area()` a nivel DB | **Sin cambios** — el empleador/colaboradora siguen con acceso (la DB filtra por área) |
| **BUK-proxy** (vacaciones, horas-extras, bonos, ausencias, cargas, hogares, documentos, liquidaciones, colaboradoras/[id]/*) | **Ninguna** — pegan al BUK SDK sin RLS ni filtro por área | **Admin-only** hasta POP-C0-12 |
| **Catálogos/referencia** (catalogos/*, *tipos, politicas-vacaciones, dias-habiles) | Ninguna | **`requireScope()`** (sesión válida) |
| **Ya bien scopeadas** (hogares list, colaboradoras list+[id], empleadores/[id]) | Filtro por área/ownership en código | **Sin cambios** (ya seguras) |

**Por qué admin-only y no `['admin','empleador']`:** las rutas BUK no tienen filtrado
por área. Con `empleador` permitido, un empleador podría leer/editar la nómina de
**otra familia** pasando un id ajeno. Admin-only cierra el hueco por completo. El
acceso self-service de empleador/colaboradora a datos BUK vuelve con **POP-C0-12**
(tenant/area filtering), que es el lugar correcto para esa lógica. Hoy la app es
operada por admin, así que no rompe funcionalidad actual.

## 🔧 Rutas endurecidas (30)

**Mutaciones → `['admin']`** (eran `['admin','empleador']`):
vacaciones (POST/DELETE), horas-extras (POST/PUT), bonos (POST), bonos/[id]
(PATCH/DELETE), bonos/[id]/terminar (POST), cargas/[id] (PATCH), hogares/[id]
(PATCH), colaboradoras/[id]/documentos (POST), documentos/[id]/firmas (POST),
ausencias/{licencias,permisos,inasistencias} (POST).

**Lecturas PII sin auth → `requireScope(['admin'])`**:
liquidaciones, colaboradoras/[id]/liquidaciones, colaboradoras/[id]/liquidaciones/.../pdf,
colaboradoras/[id]/{bonos,cargas,documentos/[file_id],vacaciones/saldo,vacaciones/devengadas},
documentos/[id] *(spec → requireScope())*, horas-extras/[id], vacaciones/[id], ausencias.

**Lecturas list que filtraban por sesión pero devolvían todo → `['admin']`**:
vacaciones (GET), horas-extras (GET), ausencias/{licencias,permisos,inasistencias} (GET),
colaboradoras/[id]/documentos (GET).

**Catálogos sin auth → `requireScope()`**:
catalogos/{cargos,cargos/[id],centros-costo,empresa,familias-cargos,locaciones},
{ausencias/*/tipos}, horas-extras/tipos, politicas-vacaciones, vacaciones/dias-habiles.

**Caso especial — `hogares/[id]/empleados`**: agregado `requireScope()` + check de área
(admin ve cualquiera; no-admin sólo su propio hogar). Preserva self-service de forma segura.

## 🧪 Fitness function nueva (02b)

`tests/fitness/routes-require-auth.test.ts` — exige que **todo** route handler (incl.
GET) esté autorizado: `requireScope` inline, guard de middleware legacy (POP-C0-01),
exención documentada (auth/webhooks/health/_internal/cron) o baseline con ticket.
Encontró de paso 3 rutas `/agents/*` más sin guard (registry in-memory, sin PII) →
baselined a POP-C1-06 junto con `orchestrate`.

## ✅ Verificación (local = CI)

```
lint       ✓   typecheck ✓   test ✓ (97, 11 files)   build ✓
```

## 🧠 Decisiones unilaterales (REVISALAS)

1. **Política "BUK-proxy = admin-only hasta POP-C0-12"** (lo central). Si querés que el
   empleador acceda YA a datos BUK de su hogar, la vía correcta es priorizar POP-C0-12
   (filtrado por área) en vez de aflojar el rol — porque sin filtro, aflojar = fuga
   cross-familia. Decisión tuya el timing.
2. **Catálogos → `requireScope()`** (no admin): son referencia (cargos, centros de costo,
   tipos de ausencia), no PII. Cualquier sesión válida los lee.
3. **`documentos/[id]` (getDocSpec) → `requireScope()`** no admin: es un spec/plantilla,
   no el documento de una persona. Si resultara sensible, subilo a `['admin']`.
4. **`/agents/*` (4 rutas) baseline POP-C1-06**: registry in-memory, sin BUK/Supabase/PII,
   protegido por sesión vía middleware. Se eliminan/rehacen en POP-C1-06.
5. **No agregué filtrado por área** a las rutas BUK (sería implementar tenancy a medias).
   Eso es POP-C0-12.

## ⏳ Lo que NO hice

| Item | Razón |
|---|---|
| Filtrado por área en rutas BUK (POP-C0-12) | Es trabajo de multi-tenancy; no a medias |
| Tocar rutas legacy `/api/buk/<entity>` | Ya admin-only por middleware (POP-C0-01); se borran en Sprint 0 |
| Tests de integración de cada ruta con Supabase | Requiere staging; las fitness functions cubren la presencia del guard |

## 🚨 Cuando vuelvas

1. **Revisá la política** (🧠 #1). ¿OK admin-only para datos BUK hasta POP-C0-12?
2. **Smoke test**: con cookie de colaboradora, `GET /api/buk/v1/liquidaciones` debe dar
   **403/401** (antes daba 200 con toda la nómina). `GET /api/buk/v1/catalogos/cargos`
   debe seguir **200** para cualquier sesión.
3. **OJO si el dashboard actual consume estas rutas como non-admin**: hoy es admin, pero
   si alguna página usa un rol distinto, romperá hasta POP-C0-12. Verificá en preview.
4. ¿Priorizamos **POP-C0-12** (tenant/area filtering) para devolver self-service?

## 📊 Métricas

| Métrica | Sesión 4 |
|---|---|
| Rutas BUK endurecidas | 30 |
| Fugas de lectura PII cerradas | ~19 |
| Fitness functions (nuevas / total) | 1 / 5 |
| Tests totales | 97 |
| Suite | lint ✓ · types ✓ · 97 tests ✓ · build ✓ |

---

**Sesión 4 cerrada. Autorización completa en `/v1`: ninguna ruta BUK queda sin guard.**

— Claude (`agent-c0-authz-hardening`)

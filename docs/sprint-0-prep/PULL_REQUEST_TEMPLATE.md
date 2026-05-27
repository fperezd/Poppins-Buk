# Pull Request

## 📝 Contexto

<!-- 1-2 oraciones: ¿qué problema resolvés? Link a la story (POP-CX-XX) -->

Closes #ISSUE

## 🔧 Cambios principales

<!-- Bullets concretos, en pasado. "Agregué X", "Refactoricé Y", "Eliminé Z" -->

-
-
-

## 🧪 Tests

- [ ] Tests unitarios añadidos/actualizados
- [ ] Tests integration (si toca cross-service)
- [ ] Tests E2E (si toca flow crítico)
- [ ] Fitness functions pasan (`npm run fitness`)
- [ ] Coverage del código nuevo >70%

<!-- Detalles de qué cubrís y qué quedó out-of-scope -->

## 🔐 Seguridad

- [ ] No hay secrets en el código (gitleaks clean)
- [ ] Validación Zod en todos los handlers nuevos
- [ ] `requireScope` en rutas mutativas
- [ ] `tenant_id` validado en mutaciones
- [ ] Cache invalidation post-mutation

## 📊 Observabilidad

- [ ] Logs estructurados en operaciones críticas
- [ ] Métricas Sentry/PostHog si aplica
- [ ] Correlation-ID propagado en llamadas cross-service

## 🎨 UI / UX (si aplica)

- [ ] Screenshots before/after
- [ ] Tested en mobile viewport (375x667 mínimo)
- [ ] Lighthouse perf >85, a11y >95
- [ ] Bundle size delta <50kb
- [ ] Storybook story actualizada (si toca primitive)
- [ ] Keyboard navigation funciona
- [ ] axe-core sin violations
- [ ] Tokens Poppins v1.0 usados (no colores hardcoded)

**Screenshots:**

<!-- Screenshots o GIF del cambio. Mobile + desktop si aplica. -->

## 🚀 Riesgos conocidos

<!-- ¿Qué podría romper? ¿En qué pensaste y descartaste? -->

-

## ↩️ Rollback plan

<!-- ¿Cómo revertimos si rompe en prod? Obligatorio para PRs L+. -->

-

## 📦 Cambios en `@poppins/contracts`

- [ ] N/A — este PR no requiere cambio de contrato
- [ ] Sí — PR de contracts mergeado primero: <link a PR contracts>
  - Tipo: `patch` / `minor` / `major`
  - Versión nueva: `X.Y.Z`
  - Bumpeada en este repo

## 🗂 Migración DB (si aplica)

- [ ] N/A
- [ ] Migración backward-compatible
- [ ] Aplicada en staging primero
- [ ] Slow query log diff: sin regresiones >10%
- [ ] Rollback script disponible

## 🎯 Definition of Done

- [ ] CI verde (lint + typecheck + test + build + fitness)
- [ ] Code review: al menos 1 approval del supervisor del lane
- [ ] Documentación actualizada (README/CHANGELOG/ADR si aplica)
- [ ] Feature flag activado si afecta usuarios reales
- [ ] Smoke test manual en staging

## 📋 Notas para el reviewer

<!-- Cualquier cosa que el reviewer deba prestar atención especial.
     "Mirar primero archivo X.ts", "Comportamiento contraintuitivo en Y", etc. -->

---

**Sprint:** SX
**Story ID:** POP-CX-XX
**Estimación original:** [XS/S/M/L]
**Tiempo real:** [horas]

# ADR-001: Adoptamos 4 repos físicos en GitHub (vs monorepo)

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Técnica · Operaciones

## Contexto

Poppins evoluciona desde un monolito Next.js (`Poppins-back`) que mezcla API y web hacia una arquitectura productizada multi-tenant. Necesitamos definir la topología del código para soportar 3 agentes Claude Code paralelos (2 Back + 1 Front) con aislamiento de lane real, sumado a 2 supervisores humanos con especialización.

Fuerzas en juego:

- **Aislamiento de agentes:** 3 agentes corriendo en el mismo repo se pisan cambios constantemente sin disciplina ferrea.
- **Velocidad de cambio:** Sprint 0 debe completarse en 1 semana, no podemos pagar overhead operacional alto.
- **Distribución de ownership:** CODEOWNERS distintos por área (Back-A, Back-B, Front) son cleaner con repos separados.
- **Deploys independientes:** Vercel deploya un repo a un proyecto. Web + 2 APIs = 3 deploys, naturales con 3 repos.
- **Cambios cross-cutting:** un cambio en el contrato API requiere coordinar 3 repos vs 1 PR atómico en monorepo.

## Decisión

**Adoptamos 4 repos físicos en GitHub:**

1. `poppins-contracts` — Zod schemas + OpenAPI + tipos generados. Publicado como `@poppins/contracts` (GitHub Packages).
2. `poppins-api-id` — Backend Identity (auth, scopes, dominio Poppins puro, billing, Supabase migrations).
3. `poppins-api-buk` — Backend BUK Bridge (SDK BUK, proxies, webhooks, cron sync).
4. `poppins-web` — Frontend Next.js (UI + design system + hooks + MSW + Storybook).

### Detalles de implementación

- Cada repo es Next.js 16 standalone (excepto `poppins-contracts` que es paquete npm publicable).
- Comunicación inter-servicios: solo HTTP. Sin imports cruzados.
- `@poppins/contracts` es la **única dependencia compartida**. Versionada con semver estricto via changesets.
- Cada repo tiene su propio CI (GitHub Actions: lint + typecheck + test + build + fitness).
- CODEOWNERS por repo según supervisor.

## Consecuencias

### Positivas

- **Aislamiento físico de agentes:** Back-A no puede tocar `poppins-web` accidentalmente.
- **CI independiente:** rebuilds rápidos, falla de un repo no bloquea otros.
- **Deploys independientes:** un fix en `web` no requiere redeploy de backends.
- **Permisos granulares:** CODEOWNERS naturales por repo (1 repo = 1 owner).
- **Onboarding por lane:** un dev nuevo en Front clona solo `poppins-web`.
- **Vercel projects naturales:** 3 proyectos, 3 dominios.

### Negativas / Trade-offs

- **Cambio cross-cutting cuesta 3 PRs sincronizados** (1 en contracts + 1 en back consumer + 1 en web consumer).
- **Drift de versiones** posible si los repos no sincronizan `@poppins/contracts` (mitigación: Dependabot + fitness function 05).
- **Onboarding inicial más complejo** (4 clones, 4 `npm install`, 4 `npm run dev` en local).
- **Local dev requiere `/etc/hosts`** para `*.poppins.local` cross-subdomain cookies.
- **Refactor cross-cutting es doloroso** (típicamente requiere PR coordinado en 3 repos).

### Neutras

- Costo Vercel ligeramente superior (3 proyectos vs 1).
- Cada repo tiene su README, su CONTRIBUTING, su CHANGELOG. Más mantenimiento.

## Alternativas consideradas

### Alternativa A: Monorepo pnpm + Turborepo

**Pros:**
- 1 `git pull` actualiza todo.
- Cambios cross-cutting en 1 PR atómico.
- Shared deps deduped.
- Tooling moderno (Turborepo cache).

**Contras:**
- 3 agentes Claude Code chocan en el mismo working dir → conflicts diarios.
- CODEOWNERS más complejos con paths regex.
- Mental model "todo es 1 cosa" puede llevar a couplings inadvertidos.

**Por qué no la elegimos:** El factor decisivo es el aislamiento de agentes. La disciplina necesaria para que monorepo funcione con 3 agentes paralelos > la disciplina necesaria para 4 repos con contracts versionados. Cuando el equipo sea >6 humanos y los agentes ya no sean el bottleneck, podemos revaluar.

### Alternativa B: 2 repos (back + front, contracts dentro de back)

**Pros:**
- Solo 1 paquete a versionar (contracts).
- 2 deploys, no 3.
- Menos overhead operacional inicial.

**Contras:**
- Back-A y Back-B comparten repo → mismo conflicto que monorepo cuando saltemos a 3 agentes.
- Contracts mezclado con back impl hace harder publicarlo como dependency externa post-MVP.

**Por qué no la elegimos:** No resuelve el aislamiento de los 2 backend agents. Sería una solución parcial que tendríamos que romper en Sprint 6.

### Alternativa C: 3 repos (sin contracts separado)

**Pros:**
- 1 menos repo que mantener.
- Contracts puede vivir en `poppins-api-id`.

**Contras:**
- Front y api-buk dependen de api-id solo para tipos → coupling raro.
- Versionado de contracts queda implícito (no semver claro).

**Por qué no la elegimos:** `contracts` separado es la pieza más importante de la arquitectura — la "piedra" que sincroniza los 3 lanes. Esconderla en un repo dev la degrada conceptualmente.

## Referencias

- `docs/PLAN_MAESTRO.md` §5 Arquitectura de repos
- Conway's Law: la arquitectura del software refleja la estructura de comunicación del equipo
- Hashicorp's polyrepo migration writeups (2019)

## Revisión

Re-evaluar esta decisión cuando:
- Lleguemos a >6 humanos en el equipo dev
- Cambios cross-cutting representen >30% del effort del sprint sostenido 2 trimestres
- Cuando saltemos a Sprint 8+ con multi-vendor (BUK alternativo)

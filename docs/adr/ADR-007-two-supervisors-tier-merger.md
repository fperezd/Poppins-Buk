# ADR-007: 2 supervisores humanos con tier-based merger approval

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Operaciones · Producto

## Contexto

Con 3 agentes Claude Code paralelos (2 Back + 1 Front desde Sprint 6) y velocidad esperada de 15-25 PRs/semana, un único supervisor humano (CTO) es bottleneck de review (~8 PRs/día máx con revisión profunda).

Nuevo elemento: el CTO decidió que **habrá 2 supervisores humanos** desde Sprint 5. Necesitamos definir:
- Reparto de responsabilidades
- Workflow de approval para contracts (la pieza más crítica)
- Tie-breaker en desacuerdos
- Plan de continuidad si un supervisor está ausente

## Decisión

**2 supervisores con roles especializados + approval tier-based en `@poppins/contracts`.**

### Supervisor 1 — CTO (Fernando Pérez) · Desde Sprint 0

- **Owns:** `poppins-contracts` (único merger MAJOR bumps), `poppins-api-id`, `poppins-api-buk`.
- **Reviews:** PRs de Back-A/B (primario), arquitectura, security, performance, data, migrations.
- **Único merger:** contracts MAJOR (breaking changes).

### Supervisor 2 — Product Lead · Desde Sprint 5

- **Owns:** `poppins-web`.
- **Reviews:** PRs de Front (primario), UX, copy, customer flows.
- **Merger:** `poppins-web` autonomous + contracts MINOR/PATCH.

### Workflow tier-based en contracts

| Tipo de change | Approval requerido | Quién puede mergear |
|---|---|---|
| **Patch** (doc, comentario, fix typo) | 1 supervisor | Cualquiera |
| **Minor** (campo opcional, endpoint nuevo, schema aditivo) | 1 supervisor + 1 notificación al otro 24h | Cualquiera con notificación previa |
| **Major** (breaking: eliminar, cambiar tipo, renombrar) | Ambos supervisores | CTO finaliza con label `breaking` |

### Tie-breaker

| Conflicto | Resuelve |
|---|---|
| Decisión técnica (arquitectura, performance, security) | CTO |
| Decisión de producto (UX, copy, pricing, feature priority) | Product Lead |
| Cross-cutting | Ambos consensúan, ADR. Si no, CTO en backends, PL en web. |
| Contract change | Ver tabla anterior. |

### Continuidad operacional

- **Si CTO ausente >7 días:** Product Lead toma rol técnico con consulta a asesor técnico externo de confianza (a identificar).
- **Si Product Lead ausente >7 días:** CTO toma producto con consulta a primeros 3 clientes (customer dev).
- **Si ambos ausentes:** plan de hibernation 1 semana (los agentes Claude Code paran de mergear, PRs quedan pending review).

## Consecuencias

### Positivas

- **Especialización clara.** Producto no consume tiempo técnico de CTO.
- **Review capacity duplicada** vs 1 supervisor (8 → ~16 PRs/día).
- **Velocidad superior** para mergear minor/patch sin requerir consensus.
- **Veto solo en major** (cambios raros e importantes).
- **Bus factor mitigado** desde Sprint 5.
- **Especialización post-MVP:** PL aprende customer-first, CTO sigue scaling tech.

### Negativas / Trade-offs

- **Costo salarial 2do humano** desde Sprint 5 (~$X/mes según seniority).
- **Coordination overhead** entre los 2 supervisores (2x/semana 30min).
- **Risk de divergencia** en visión producto vs técnica (mitigación: ADRs forzados en cross-cutting).
- **Onboarding 1-2 semanas** del PL antes de poder mergear con autonomía.

### Neutras

- ADRs cross-cutting se vuelven más frecuentes (positivo para documentación).
- Standups async ganan importancia (3 streams para sincronizar).

## Alternativas consideradas

### Alternativa A: 1 supervisor (status quo del plan v1.0)

**Pros:**
- Sin coordination overhead.
- Visión unificada de producto + técnica.

**Contras:**
- Bottleneck de review identificado en plan v1.1.
- Bus factor 1 (CTO único punto de falla).
- 3 agentes requieren ~16 PRs/día revisables, fuera de capacity humana sola.

**Por qué no la elegimos:** El CTO confirmó que habrá 2 supervisores. Esta alternativa es el status quo a superar.

### Alternativa B: 3 supervisores (1 por agente)

**Pros:**
- Cada lane tiene supervisor dedicado.
- Menos cross-lane coordination.

**Contras:**
- 3x costo salarial sin justificación de velocidad (la velocidad la marcan los agentes, no los supervisores).
- 3 visiones de producto se vuelven 3 conflictos.

**Por qué no la elegimos:** Overkill. Producto necesita 1 voz, no 3. Velocity issue se resuelve con 2.

### Alternativa C: 2 supervisores ambos full-stack (sin especialización)

**Pros:**
- Cualquiera revisa cualquier PR.
- Backup mutuo total.

**Contras:**
- Ambos terminan haciendo lo mismo, diluyendo expertise.
- Tie-breakers ambiguos (¿quién decide en arquitectura si ambos opinan?).

**Por qué no la elegimos:** Especialización > redundancia para equipo de 2.

## Referencias

- `docs/PLAN_MAESTRO.md` §4 Modelo de supervisión humana
- Bus factor concept: <https://en.wikipedia.org/wiki/Bus_factor>
- DACI framework para decision-making

## Revisión

Re-evaluar:
- Cuando entre 3er supervisor (Sprint 12+ o cuando volumen lo exija).
- Si Product Lead requiere ramp-up >3 sprints (señal de mal fit).
- Trimestralmente: medir % PRs revisadas en <4h vs target.

# ADR-012: Cache strategy 3-layer (Edge / Materialized views / Redis)

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO
**Categoría:** Técnica

## Contexto

Poppins tiene 3 fuentes de latencia significativa:
1. **BUK API** — cada llamada cuesta 200-500ms (red CL→remoto)
2. **Supabase Postgres** — queries con JOIN agregado pueden ser slow
3. **Vercel cold starts** — primera invocación ~500ms-1s

Sin cache, el dashboard típico llamaría a BUK 3-5 veces secuencialmente = 1-3s de wait. Inaceptable para UX MVP.

## Decisión

**3-layer cache strategy con políticas explícitas por capa.**

### Detalles de implementación

#### Capa 1: Vercel Edge CDN

Para assets estáticos y páginas SSG.

| Tipo de contenido | Cache | TTL |
|---|---|---|
| Assets estáticos `_next/static/*` | Permanente | 1 año (immutable) |
| Imágenes optimizadas Next | Edge cache | 30 días |
| Páginas SSG (`/`, `/precios`, `/changelog`) | Edge cache | 1h con on-demand revalidate |
| Páginas dinámicas (`/dashboard/*`) | NO cache | `dynamic = 'force-dynamic'` |
| Responses API (`/api/*`) | NO cache | `private` |

Implementation: `next.config.ts` headers + page-level `revalidate` directives.

#### Capa 2: Supabase Materialized views

Para queries pesadas de reporting/aggregations.

```sql
-- Ejemplo: KPIs por tenant para dashboard admin
create materialized view mv_tenant_kpis as
select
  t.id as tenant_id,
  t.name,
  count(distinct e.buk_employee_id) as colaboradoras_activas,
  count(distinct ta.id) filter (where ta.estado = 'completada' and ta.completada_at >= now() - interval '30 days') as tareas_30d,
  count(distinct l.id) filter (where l.periodo >= now() - interval '90 days') as liquidaciones_90d
from tenants t
left join user_profiles e on e.tenant_id = t.id and e.rol = 'colaboradora'
left join tareas ta on ta.tenant_id = t.id
left join liquidaciones_view l on l.tenant_id = t.id
group by t.id, t.name;

create unique index on mv_tenant_kpis (tenant_id);

-- Refresh diario via pg_cron o Vercel Cron
refresh materialized view concurrently mv_tenant_kpis;
```

Refresh frequency:
- Critical KPIs: cada 1h (`mv_tenant_kpis`)
- Reporting históricos: diario (3am CLT)
- Heavy analytics: semanal (lunes 4am CLT)

#### Capa 3: Upstash Redis (app layer)

Para hot data y rate-limiting.

| Caso de uso | TTL | Key pattern | Invalidación |
|---|---|---|---|
| Rate-limit por tenant | 1 min sliding | `rl:tenant:<id>` | Automático |
| Rate-limit por IP | 1 min sliding | `rl:ip:<ip>` | Automático |
| BUK SDK responses (lectura) | 5 min | `buk:<tenant>:<endpoint>:<hash>` | Manual on mutation |
| Session cache | 15 min | `sess:<user_id>` | On logout |
| OTP rate-limit | 1 hora | `otp:<phone>` | Automático |
| Feature flag values | 30 seg | `ff:<tenant>:<flag>` | On flag change |
| Tenant config (active, plan) | 5 min | `tenant:<id>:config` | On subscription change |

### Invalidación cross-layer

**Regla R12** (definida en PLAN_MAESTRO §19.18): toda mutación a tabla con `tenant_id` invalida caches asociados al tenant antes de responder 2xx.

Helper centralizado:

```typescript
// poppins-api-id/src/lib/cache/invalidate.ts
export async function invalidateCacheForTenant(
  tenantId: string,
  scope: 'all' | 'buk' | 'config' | 'feature-flags' = 'all'
) {
  const redis = getRedis();
  const patterns = scope === 'all'
    ? [`buk:${tenantId}:*`, `tenant:${tenantId}:*`, `ff:${tenantId}:*`]
    : scope === 'buk' ? [`buk:${tenantId}:*`]
    : scope === 'config' ? [`tenant:${tenantId}:*`]
    : [`ff:${tenantId}:*`];

  await Promise.all(patterns.map(p => redis.del(...await redis.keys(p))));
}
```

## Consecuencias

### Positivas

- **Dashboard typical load <500ms** (vs 1-3s sin cache).
- **BUK rate-limit absorption:** cache de 5min reduce calls 10-30x.
- **Performance budget realizable:** p95 <500ms posible.
- **Rate-limit real** (Upstash vs in-memory que no funciona en serverless).
- **Cost de Supabase reducido** (materialized views vs queries vivas).

### Negativas / Trade-offs

- **Complejidad de invalidación.** Bug invisible: stale data si invalidate falla. Mitigación: fitness function que valida invalidations en código.
- **3 dependencias adicionales** (Vercel cache, Supabase MV, Upstash Redis). Más cosas que pueden fallar.
- **Materialized views requieren refresh discipline.** Si refresh falla, dashboards muestran data vieja sin alerta. Mitigación: monitoring del refresh job.
- **Costo Upstash variable** (pay-as-you-go). Estimado <$5/mes hasta 100 tenants.
- **Tenant cache key prefix obligatorio** (regla R12) — error humano puede causar cross-tenant leak por miskeyed cache. Mitigación: helper centralizado, no construir keys manualmente.

### Neutras

- Cache layer abstrae provider (si cambiamos Upstash → Cloudflare KV, swap interno).
- TTLs son ajustables sin code deploy (Redis CONFIG SET).

## Alternativas consideradas

### Alternativa A: Sin cache (queries vivas)

**Pros:**
- Simple.
- Data siempre fresh.

**Contras:**
- Latency inaceptable.
- BUK rate-limit problem rapidísimo.
- Supabase queries lentos al escalar.

**Por qué no la elegimos:** Obvio. Cache es necesidad, no lujo.

### Alternativa B: Solo Redis (sin materialized views ni Edge cache)

**Pros:**
- 1 tecnología.

**Contras:**
- Edge cache es gratis y rápido (Vercel CDN). Perderlo es regalar performance.
- Materialized views mueven compute al DB (postgres es bueno en eso).

**Por qué no la elegimos:** Cada capa tiene sweet spot. Combinar las 3 maximiza valor.

### Alternativa C: Cloudflare Workers KV en vez de Upstash

**Pros:**
- Ya usamos Cloudflare para DNS.
- Latency edge-distributed.

**Contras:**
- KV eventual consistency (5-10s propagation). No sirve para rate-limit.
- Pricing similar a Upstash.

**Por qué no la elegimos:** Eventual consistency mata el rate-limit. Upstash Redis es Redis real con read-after-write.

### Alternativa D: Vercel KV (managed Redis Vercel)

**Pros:**
- Integración nativa Vercel.
- Setup más rápido.

**Contras:**
- Pricing menos competitivo a escala.
- Vendor lock-in mayor.

**Por qué no la elegimos:** Upstash es Redis-as-a-Service estándar, swap fácil si necesitamos.

## Referencias

- `docs/PLAN_MAESTRO.md` §19.12 Cache strategy explícita
- ADR-003 Multi-tenancy (justifica tenant-key prefix obligatorio)
- Vercel CDN: <https://vercel.com/docs/edge-network/overview>
- Supabase materialized views: <https://supabase.com/docs/guides/database/materialized-views>
- Upstash Redis: <https://upstash.com/docs/redis>

## Revisión

Re-evaluar:
- Si BUK SDK responses TTL 5min causa stale-data complaints (bajar a 2min).
- Cuando Postgres queries dejen de ser bottleneck (drop materialized views si no aportan).
- Si Upstash bills suben más rápido que tenants (revisar consumption).

# ADR-003: Multi-tenancy desde día 1 con `tenant_id` + RLS doble capa

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Técnica · Producto · Seguridad · Data

## Contexto

Poppins es B2B SaaS targeting madres/familias empleadoras chilenas. El plan v1.1 proponía multi-tenancy en C2 (post-MVP). Revisión v1.2 lo movió a C0 por costo de retrofit.

Datos del análisis:
- Retrofitear multi-tenancy a sistema mono-tenant en producción = 4 semanas con downtime + risk de cross-tenant leak.
- Implementarlo desde día 1 = 5 días en Sprint 2.
- El plan asume llegar a 20 tenants en 3 meses post-MVP (kill criteria).
- Cada tenant tiene su propio `BUK_API_TOKEN` (su organización BUK).

## Decisión

**Multi-tenancy en C0 (Sprint 2). Cada tenant es un cliente Tooxs con su propia organización BUK.**

### Detalles de implementación

#### Schema (migración 0004)

```sql
-- Tabla raíz
create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                    -- 'familia-perez', usado en subdomain
  name text not null,                            -- display
  buk_api_token_encrypted text not null,         -- pgcrypto sym_encrypt
  buk_base_url text default 'https://app.buk.cl/api/v1/chile',
  buk_company_id integer,
  contact_email text not null,
  contact_phone text,
  rut text,
  legal_name text,
  address text,
  active boolean default true,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tenant_id en TODAS las tablas de dominio
alter table user_profiles add column tenant_id uuid not null references tenants(id);
alter table asignaciones add column tenant_id uuid not null references tenants(id);
alter table tareas add column tenant_id uuid not null references tenants(id);
-- ... (14 tablas con tenant_id)

-- Helper de scope automático
create or replace function current_tenant_id()
returns uuid language sql security definer stable as $$
  select (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
$$;
```

#### RLS doble capa

Cada tabla de dominio tiene RLS reforzada:

```sql
-- Capa 1: Tenant isolation (universal)
create policy tenant_isolation_<tabla> on <tabla>
  for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- Capa 2: Rol-based access dentro del tenant (heredado de v1.1)
create policy tareas_admin_all on tareas
  for all using (is_admin()) with check (is_admin());
-- (resto de políticas por rol existentes)
```

#### Resolución de tenant en runtime

3 fuentes, en orden de prioridad:

1. **JWT `app_metadata.tenant_id`** (autoritativo). Escrito por Supabase Admin al asignar user a tenant.
2. **Subdomain** `<slug>.poppins.cl` (UI hint para customer-friendly URLs).
3. **Header `X-Tenant-Slug`** (development only).

Middleware en ambos backends:

```typescript
// Pseudo-code
export async function middleware(req: NextRequest) {
  const jwt = await getJWT(req);
  if (!jwt) return unauthorized();

  const tenantId = jwt.app_metadata?.tenant_id;
  if (!tenantId) return forbidden('No tenant');

  const tenant = await getTenant(tenantId);
  if (!tenant?.active) return forbidden('Tenant inactive');

  const subscription = await getSubscription(tenantId);
  if (subscription.status === 'suspended') {
    return readOnlyMode(req); // GET ok, mutations blocked
  }

  req.headers.set('x-tenant-id', tenantId);
  return NextResponse.next();
}
```

#### BUK SDK por tenant

`getBukSDKForTenant(tenantId)` mantiene cache LRU de SDK instances. Cada SDK usa el token específico del tenant.

## Consecuencias

### Positivas

- **Onboarding 2do cliente en 48h** (vs 4 semanas de retrofit).
- **Cross-tenant leak prevention** desde día 1 (RLS doble capa + fitness function 04).
- **Multi-BUK organization soportado** sin diseño extra.
- **Subdomain `<slug>.poppins.cl`** da customer-friendly URLs sin trabajo adicional.
- **Suspensión por impago a nivel tenant** simple de implementar.
- **Data isolation auditable** (queries siempre filtran por tenant_id).

### Negativas / Trade-offs

- **5 días extra en Sprint 2** vs no hacerlo (pero ahorra 4 semanas post-MVP).
- **Complejidad agregada en cada migration:** toda tabla de dominio futura debe agregar `tenant_id`.
- **JWT más pesado** (carry app_metadata con tenant_id).
- **Cache layer key requiere prefix tenant** (BUK SDK cache, Redis cache, materialized views).
- **Tests requieren setup multi-tenant** (más complejos).

### Neutras

- Costo Supabase no aumenta significativamente (RLS no es más caro que filtrado WHERE).
- Onboarding wizard tiene que crear tenant + primer user + first hogar.

## Alternativas consideradas

### Alternativa A: Multi-tenancy en C2 (post-MVP)

**Pros:**
- Sprint 2 es más liviano.
- Validamos PMF con 1 cliente antes de invertir en multi-tenant.

**Contras:**
- Retrofit cuesta 4 semanas con downtime.
- Riesgo de cross-tenant leak en período de migración.
- 2do cliente queda esperando si llega antes del retrofit.

**Por qué no la elegimos:** El delta de hacerlo ahora (5 días) vs después (4 semanas + risk) es 8x. ROI obvio.

### Alternativa B: Database-per-tenant

**Pros:**
- Aislamiento físico absoluto.
- Tenant puede escalar independientemente.
- Backup/restore por tenant.

**Contras:**
- Operativa pesada (N databases para manejar, N conexiones, N migraciones simultáneas).
- Supabase no tiene workflow nativo para esto.
- Costo lineal con tenants.

**Por qué no la elegimos:** Overengineering para nuestra escala (target 50 tenants año 1). Schema-level isolation con RLS es suficiente y operativamente simple. Re-evaluar si llegamos a >500 tenants.

### Alternativa C: Schema-per-tenant (Postgres schemas)

**Pros:**
- Aislamiento lógico fuerte.
- Migrations más controlables (per-tenant).

**Contras:**
- Complejidad agregada en queries cross-schema.
- Supabase RLS no soporta nativamente.
- Migraciones requieren script que itere sobre N schemas.

**Por qué no la elegimos:** Misma razón que database-per-tenant. RLS con `tenant_id` columna es estándar industria y suficientemente seguro.

## Referencias

- `docs/PLAN_MAESTRO.md` §7 Multi-tenancy desde día 1
- `docs/sprint-0-prep/migrations/0004_multi_tenancy.sql`
- ADR-009 Subdomain-based tenancy
- Supabase RLS: <https://supabase.com/docs/guides/database/postgres/row-level-security>

## Revisión

Re-evaluar:
- Cuando lleguemos a >500 tenants (re-evaluar database-per-tenant)
- Si un cliente enterprise exige aislamiento físico (compliance fuerte)
- Cuando RLS performance se vuelva bottleneck mensurable (slow query log)

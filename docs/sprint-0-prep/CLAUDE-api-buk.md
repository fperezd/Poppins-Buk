# CLAUDE.md — `poppins-api-buk` (Back / Back-B)

> **Tu identidad como agente:**
>
> Sos **agent-back** (Sprint 1-5, compartís con api-id) o **agent-back-b** (Sprint 6+, lane separada), Claude Code asignado al repo `poppins-api-buk`. Sos el "BUK Bridge" — todo lo que toca BUK API pasa por vos.
>
> **Lee este archivo completo antes de tu primer commit.**

---

## 0. Tu lane en una frase

> **Sos dueño del SDK BUK, proxies hacia BUK, webhooks BUK y cron sync. NO tocás auth, billing, ni UI.**

---

## 1. Quién manda

- **Supervisor primario:** CTO (Fernando Pérez)
- **Supervisor secundario:** Product Lead (review minor/patch de contracts)
- **Cuando estás bloqueado:** abrís PR draft + mencionás `@cto`

---

## 2. Repo scope — qué SÍ y qué NO

### Estás autorizado a tocar

```
poppins-api-buk/
├── src/
│   ├── app/api/
│   │   ├── v1/
│   │   │   ├── liquidaciones/          ← TODO esto es tuyo (todas las rutas BUK proxy)
│   │   │   ├── vacaciones/
│   │   │   ├── horas-extras/
│   │   │   ├── ausencias/{inasistencias,licencias,permisos}/
│   │   │   ├── bonos/
│   │   │   ├── cargas/
│   │   │   ├── documentos/
│   │   │   └── catalogos/
│   │   ├── webhooks/buk/               ← receptor BUK con HMAC
│   │   ├── cron/sync/                  ← Vercel Cron BUK→cache
│   │   └── _internal/                  ← endpoints solo callables desde api-id
│   ├── lib/
│   │   ├── buk-sdk/                    ← TODOS los 13 módulos
│   │   ├── buk-multi-tenant/           ← SDK factory per-tenant
│   │   ├── service/                    ← service layer + mappers + mock data
│   │   ├── webhook/                    ← signing + idempotency
│   │   └── api/                        ← handle, ok, fail (mismas convenciones que api-id)
│   └── middleware.ts                   ← Supabase JWT validation independiente
├── tests/
├── package.json
└── vercel.json
```

### Estás prohibido de tocar

- `poppins-api-id/` — repo separado
- `poppins-web/` — repo separado
- `poppins-contracts/` directamente — PR formal
- **Migraciones Supabase de tablas non-cache.** Vos solo tocás `cache_*` tablas. El schema de dominio Poppins lo maneja `api-id`.

### Multi-tenancy

- TODA llamada al SDK BUK pasa por `getBukSDKForTenant(tenantId)`.
- TODA escritura a Supabase incluye `tenant_id` (RLS lo enforce).
- TUS tablas autorizadas a escribir: `cache_areas`, `cache_roles`, `cache_absence_types`, `webhook_events` (idempotency), `audit_log` (insert-only).

---

## 3. Las 16 reglas inviolables (R1-R16)

Idénticas a `CLAUDE-api-id.md` §3. Especificidades de tu lane:

| # | Cómo aplica acá |
|---|---|
| R1 | NO importás de `poppins-web` |
| R2 | NO importás de `poppins-api-id` (si necesitás algo de allá, pedís PR contracts) |
| R4 | Tu BUK SDK ya está tipado — los datos que devuelvas a `api-id` deben matchear `@poppins/contracts` |
| R5 | NO editás archivos de `poppins-api-id` directamente |
| R8 | Validás JWT independientemente. NO confiás en que `api-id` ya lo hizo |
| R9 | Webhooks BUK y crons sync **viven acá**. Vos sos el dueño |
| R10 | El `x-request-id` que recibís lo propagás al hacer llamadas BUK |
| R11 | TODA query BUK pasa por SDK por-tenant. NO hay BUK SDK "global" |
| R15 | Webhook handler valida HMAC + insert idempotent en `webhook_events` |
| R16 | BUK token por tenant tiene rotación documentada (anual mínimo) |

---

## 4. Convenciones de commits

```
feat(buk-sdk): agregar módulo holidays para soporte feriados regionales
fix(webhook): manejar event_type job_termination con employee_id null
refactor(service): consolidar mapping de lines_settlement en helper
docs(adr): proponer ADR-013 sobre circuit breaker BUK
test(holidays): cubrir feriado regional Chile zona extrema
chore(deps): bump @poppins/contracts a 1.4.0
```

Scopes válidos: `buk-sdk`, `service`, `webhook`, `cron`, `multi-tenant`, `cache`, `internal`, `deps`.

---

## 5. Branches

Pattern: `<tipo>/<ticket>-<slug-corto>`

```
feat/POP-C0-02-webhook-hmac-firma
fix/POP-C1-10-cron-sync-handle-rate-limit
refactor/buk-sdk-pagination-improve
docs/adr-014-bukDLQ-strategy
test/webhook-idempotency-coverage
```

Vida máxima feature branch: 3 días.

---

## 6. Pull Request

Mismo template que `api-id`. Especificidades:

- **Si tocás BUK SDK:** mostrá ejemplos de request/response BUK reales (con datos sanitizados).
- **Si tocás webhook handler:** documentá qué `event_types` cubrís y cuáles no.
- **Si tocás cron:** documentá schedule + idempotency.

---

## 7. Cómo proponer un contract change

Mismo proceso que `api-id`. Diferencia clave para vos:

Cuando agregás un endpoint BUK proxy nuevo, **el schema completo (request/response) debe estar en `@poppins/contracts` antes de implementar la ruta acá.** Si BUK devuelve más campos que el schema, los descartás (no los expongas).

---

## 8. Cómo otros servicios te llaman

`api-id` te llama via HTTP con JWT propagado:

```
GET https://buk.poppins.cl/v1/liquidaciones?colaboradora_id=123
Headers:
  Authorization: Bearer <user-jwt>
  x-request-id: <uuid>
  x-internal-call: true
```

Tu middleware:

1. Extrae JWT
2. Valida via `supabase.auth.getUser()`
3. Extrae `tenant_id` de `app_metadata`
4. Carga BUK SDK del tenant: `getBukSDKForTenant(tenantId)`
5. Ejecuta la ruta

**Endpoints `_internal/*`:** además del JWT, validás header `x-internal-token` contra `process.env.INTERNAL_API_TOKEN`.

---

## 9. BUK SDK por tenant

```typescript
// poppins-api-buk/src/lib/buk-multi-tenant/index.ts
const sdkCache = new Map<string, { sdk: BukSDK; expiresAt: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15min

export async function getBukSDKForTenant(tenantId: string): Promise<BukSDK> {
  const cached = sdkCache.get(tenantId);
  if (cached && cached.expiresAt > Date.now()) return cached.sdk;

  const supabase = await createServiceRoleClient();
  const { data: tenant } = await supabase
    .from('tenants')
    .select('buk_api_token_encrypted, buk_base_url, active')
    .eq('id', tenantId)
    .single();

  if (!tenant?.active) throw new Error(`Tenant ${tenantId} inactive`);

  const apiToken = await decrypt(tenant.buk_api_token_encrypted);
  const sdk = new BukSDK({ apiToken, baseUrl: tenant.buk_base_url });

  sdkCache.set(tenantId, { sdk, expiresAt: Date.now() + CACHE_TTL });
  return sdk;
}

export function invalidateTenantSDK(tenantId: string) {
  sdkCache.delete(tenantId);
}
```

**Cuando rotás un BUK token, llamá `invalidateTenantSDK(tenantId)` para forzar reload.**

---

## 10. Webhook BUK — HMAC + idempotencia

### Verificación de firma

```typescript
// poppins-api-buk/src/lib/webhook/verify.ts
import crypto from 'crypto';

export function verifyBukWebhook(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Idempotencia

```typescript
// poppins-api-buk/src/app/api/webhooks/buk/route.ts
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('X-Buk-Signature');

  if (!verifyBukWebhook(body, signature, process.env.BUK_WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const event = JSON.parse(body);
  const eventId = event.data._id || `${event.data.event_type}-${event.data.date}-${event.data.employee_id}`;

  // Idempotency check
  const { error } = await supabaseAdmin
    .from('webhook_events')
    .insert({
      source: 'buk',
      event_id: eventId,
      payload: event,
      received_at: new Date().toISOString(),
      processed: false,
    });

  if (error?.code === '23505') {
    // Unique violation = already processed
    return NextResponse.json({ received: true, idempotent: true });
  }

  // Process async (Vercel Cron picks it up)
  return NextResponse.json({ received: true, queued: true });
}
```

### Cron processor

```typescript
// poppins-api-buk/src/app/api/cron/process-webhooks/route.ts
export async function GET(req: NextRequest) {
  // Auth: Vercel Cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: pending } = await supabaseAdmin
    .from('webhook_events')
    .select('*')
    .eq('processed', false)
    .order('received_at', { ascending: true })
    .limit(50);

  for (const event of pending) {
    try {
      await processBukEvent(event);
      await supabaseAdmin
        .from('webhook_events')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('id', event.id);
    } catch (err) {
      // Log + retry policy
      await supabaseAdmin
        .from('webhook_events')
        .update({
          last_error: err instanceof Error ? err.message : 'Unknown',
          retry_count: event.retry_count + 1,
        })
        .eq('id', event.id);
    }
  }

  return NextResponse.json({ processed: pending.length });
}
```

---

## 11. Stack específico

```json
{
  "framework": "next@^16.2",
  "react": "^19.2",
  "typescript": "^5.5",
  "validation": "zod@^4.4",
  "database": "@supabase/ssr@^0.9",
  "testing": "vitest + @playwright/test",
  "contracts": "@poppins/contracts"
}
```

Comandos:

```bash
npm run dev              # Next dev :3002
npm run build
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run fitness
npm run sync:buk         # local trigger del cron sync (testing)
npm run webhook:replay   # replay de eventos del DLQ (testing)
```

---

## 12. Fitness functions que TUS PRs deben pasar

1. **fitness-01-no-cross-repo-imports**
2. **fitness-04-mutations-validate-tenant** — escrituras a `cache_*` filtran tenant_id
3. **fitness-05-contracts-version-locked**
4. **fitness-06-no-secrets-in-code**
5. **fitness-08-no-typescript-suppressions**
6. **fitness-09-handlers-use-zod-validation**
7. **fitness-10-buk-sdk-only-in-api-buk** — SÍ aplica acá (verificás que vos sos único consumer del SDK)

---

## 13. DoR / DoD

Idénticos a `CLAUDE-api-id.md` §11, §12. Especificidad: si tu story toca BUK API, **verificá primero contra Postman BUK** que el endpoint existe y devuelve el shape esperado.

---

## 14. WIP limits

- Máx 2 stories `in_progress`
- Máx 1 PR abierto en review (excepto cross-lane)

---

## 15. Cuándo escalar

- 🔴 BUK API devuelve algo inesperado/breaking → DM al CTO (puede ser cambio upstream)
- 🔴 Rate-limit BUK consistente → escalá para revisar pricing/contrato BUK
- 🔴 Webhook BUK no llega (sospecha de error en Tooxs config) → escalá
- 🟠 Endpoint BUK lento (>2s p95) → considerar cache layer 2
- 🟠 Story toma >2x estimado

---

## 16. Specifics del repo

### BUK SDK organization

Los 13 módulos en `lib/buk-sdk/modules/`:

```
absences/         ← vacaciones, licencias, permisos, inasistencias
assigns/          ← asignaciones BUK
attendance/       ← asistencia, working_days
credits/          ← créditos
documents/        ← documentos firmados
employees/        ← CRUD empleados
holidays/         ← feriados Chile
jobs/             ← contratos, finiquitos
organization/     ← areas, roles, companies, locations, cost_centers
overtime/         ← horas extra
payroll/          ← liquidaciones
processes/        ← procesos (nómina mensual, etc)
substitutions/    ← reemplazos
```

### Service layer responsabilidad

`lib/service/index.ts` decide entre:
1. Mock data si `USE_MOCK_DATA=true`
2. Supabase cache si data fresca (<6h)
3. BUK SDK live

Vos podés modificar este layer libremente. La regla: NO hacer "silent catch" (regla anti-pattern v1.1). Si Supabase falla, log a Sentry, no escondas el error.

### Crons (Vercel Cron schedule)

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/sync", "schedule": "0 */6 * * *" },           // BUK→cache cada 6h
    { "path": "/api/cron/process-webhooks", "schedule": "* * * * *" }, // webhooks DLQ cada 1min
    { "path": "/api/cron/refresh-mv", "schedule": "0 3 * * *" }        // materialized views diario 3am CLT
  ]
}
```

### Endpoints `_internal/*`

Estos endpoints **NO son públicos**. Solo callable desde `api-id`. Validación doble:

```typescript
export const GET = handle(async (req: NextRequest) => {
  // 1. JWT auth (heredado del middleware)
  // 2. Internal token check
  if (req.headers.get('x-internal-token') !== process.env.INTERNAL_API_TOKEN) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... lógica
});
```

---

## 17. Cuando hagas tu primer commit

Mismo checklist que `CLAUDE-api-id.md` §16.

---

**Bienvenido a la lane BUK Bridge. Vos sos la cara de Poppins ante BUK. Que las latencias sean bajas y los webhooks idempotents.**

— CTO

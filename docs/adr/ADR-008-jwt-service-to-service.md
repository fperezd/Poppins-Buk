# ADR-008: Auth service-to-service vía JWT Supabase propagación (sin gateway)

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Técnica · Seguridad

## Contexto

Arquitectura tiene 2 backends:
- `poppins-api-id` (auth + dominio Poppins + billing)
- `poppins-api-buk` (BUK SDK + proxies + webhooks)

`api-id` necesita llamar a `api-buk` para algunas operaciones server-side (ej: en endpoint `/empleadores` POST que crea Area BUK + Empleado BUK).

Opciones:
1. Gateway centralizado (API Gateway pattern) — api-id proxy de todo, api-buk privado.
2. Service-to-service trust (mTLS o shared secret) entre backends.
3. JWT del usuario original propagado (Token Passthrough).
4. OAuth Client Credentials (service tiene su propio token).

## Decisión

**JWT Supabase del usuario original propagado en header `Authorization: Bearer <jwt>` entre api-id y api-buk.**

Cada backend valida JWT independientemente vía `supabase.auth.getUser()`. **No hay trust inter-service.**

### Detalles de implementación

```typescript
// poppins-api-id/src/lib/buk-bridge/client.ts
export async function callApiBuk(
  endpoint: string,
  options: RequestInit,
  req: NextRequest
): Promise<Response> {
  // Extraer JWT del request original
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new Error('No auth header to propagate');

  return fetch(`${process.env.API_BUK_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': authHeader,
      'x-request-id': req.headers.get('x-request-id') || crypto.randomUUID(),
      'x-internal-call': 'true', // marca que viene de api-id
    },
  });
}

// poppins-api-buk/src/middleware.ts
export async function middleware(req: NextRequest) {
  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!jwt) return unauthorized();

  const supabase = createClient({ jwt }); // Supabase con token explícito
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return unauthorized();

  const tenantId = user.app_metadata?.tenant_id;
  if (!tenantId) return forbidden('No tenant');
  // ... validar tenant active, subscription, etc
}
```

### Endpoint interno marker

api-buk expone algunos endpoints `_internal/*` solo callable desde api-id. Validados con header `x-internal-call: true` PLUS shared secret `INTERNAL_API_TOKEN` (defense in depth).

```typescript
// poppins-api-buk/src/app/api/_internal/health/route.ts
export async function GET(req: NextRequest) {
  const internalToken = req.headers.get('x-internal-token');
  if (internalToken !== process.env.INTERNAL_API_TOKEN) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... lógica
}
```

## Consecuencias

### Positivas

- **Sin servicio gateway adicional** que mantener.
- **Cada backend valida auth independientemente** → defense in depth.
- **JWT tiene tenant_id en `app_metadata`** → tenant resolution natural en ambos backends.
- **Tokens son short-lived** (Supabase default 1h) → revocación implícita.
- **No hay long-lived service credentials** que rotar.
- **Auditable:** cada request lleva el user real, no un service account anónimo.

### Negativas / Trade-offs

- **Doble validación de JWT** (en api-id + api-buk). ~30-50ms latencia agregada por llamada inter-service.
- **Cron jobs y webhooks** (que no tienen JWT user) requieren auth diferente:
  - Webhooks BUK: HMAC signature
  - Cron: ejecuta como service con `SUPABASE_SERVICE_ROLE_KEY`
- **Network exposure:** ambos backends son públicos (api.poppins.cl, buk.poppins.cl). No hay backend "privado". Mitigación: rate-limit + validation estricta.
- **Si api-id falla, api-buk sigue accesible directamente** desde web. Esto requiere que web NO llame a api-buk a menos que explícitamente, y que las rutas críticas de mutación vivan en api-id.

### Neutras

- Refresh tokens los maneja Supabase client. Backends no se preocupan.
- En local dev cada backend valida contra mismo Supabase instance.

## Alternativas consideradas

### Alternativa A: API Gateway (api-id como gateway de api-buk)

**Pros:**
- 1 punto de entrada público (`api.poppins.cl`).
- api-buk completamente privado.
- Reglas de routing centralizadas.

**Contras:**
- api-id se vuelve bottleneck (todos los requests a BUK pasan por ahí).
- Latencia adicional (1 hop más).
- Coupling fuerte: si api-id cae, api-buk inalcanzable.

**Por qué no la elegimos:** Bottleneck arquitectónico. Y a la escala de Poppins (decenas a cientos de tenants), no compensa la complejidad.

### Alternativa B: mTLS entre backends

**Pros:**
- Auth muy segura sin compartir JWT.
- Estándar enterprise.

**Contras:**
- Operación pesada: gestión de certificates por entorno.
- Vercel serverless no expone facilities buenas para mTLS.
- Overkill para nuestra escala.

**Por qué no la elegimos:** Complejidad operacional injustificada.

### Alternativa C: Service Account JWT (OAuth Client Credentials)

**Pros:**
- api-id tiene su propio token estable.
- Lifecycle independiente del usuario.

**Contras:**
- Pierde auditability del user original.
- Service account es target de attack (largo-lived secret).
- Tenant context se pierde (no hay `app_metadata.tenant_id` natural).

**Por qué no la elegimos:** Perdemos el "user real" en logs y auditoría. RLS en Supabase pierde context. Mucho peor para debugging.

### Alternativa D: Shared secret simple (api-id manda `X-Internal-Secret: xxx`)

**Pros:**
- Simple de implementar.
- Rápido.

**Contras:**
- Si el secret leakea, full access a api-buk desde cualquier lugar.
- Sin user context.
- Sin tenant context.

**Por qué no la elegimos:** Inseguro. Y como complemento defensivo lo usamos (header `x-internal-token` en endpoints `_internal/*`), pero NO como mecanismo primario.

## Referencias

- `docs/PLAN_MAESTRO.md` §5 Comunicación entre servicios
- Supabase Auth getUser: <https://supabase.com/docs/reference/javascript/auth-getuser>
- Token Passthrough pattern (OAuth WG)

## Revisión

Re-evaluar:
- Cuando latencia inter-service sea bottleneck observable (>200ms p95).
- Cuando un cliente enterprise requiera red privada (entonces sí gateway + mTLS).
- Si Supabase Auth latency degrade significativamente.

# Poppins API Layer — Arquitectura

**Fecha:** 2026-05-15
**Status:** Fase A — diseño y dominio de referencia
**Versión de API:** `v1`

---

## 1. Propósito

La **API capa** (`/api/buk/v1/*`) es la única superficie HTTP que el frontend Poppins consume. Encapsula:

- La integración con Buk vía el `BukSDK` interno
- La lógica de negocio del modelo D (staffing legal + UX marketplace)
- Validación de inputs (Zod)
- Manejo uniforme de errores
- Auth y autorización (RLS-aware en Fase B)

El frontend nunca llama directo al SDK ni a la API de Buk. **Todo pasa por `/api/buk/v1/*`.**

---

## 2. Principios

1. **Thin wrapper sobre Buk.** No duplicamos almacenamiento; cuando Buk es source-of-truth, la API capa solo orquesta. Persistencia propia solo para datos de interacción (Supabase).
2. **Shape passthrough (snake_case).** Las respuestas devuelven el JSON crudo de Buk en `snake_case`. El frontend hace el mapeo a `camelCase`/labels en español. *(Decisión del 2026-05-15.)*
3. **Validación estricta del input.** Todo body/params/query se valida con un schema Zod antes de tocar el SDK. Inputs inválidos → `400` con detalle por campo.
4. **Errores uniformes.** Toda respuesta de error sigue el shape `{ error: { code, message, details? } }`. Códigos definidos en sección 5.
5. **Idempotencia donde aplica.** POSTs que crean recursos aceptan `Idempotency-Key` en header (Fase B+).
6. **Modelo D nativo.** Las rutas hablan en lenguaje Poppins: `/colaboradoras`, `/empleadores`, `/hogares`. Internamente mapean a entidades Buk (`/employees`, `/areas`).

---

## 3. Convenciones de routing (Next.js 16 App Router)

```
src/app/api/buk/v1/<dominio>/route.ts             ← GET (list) + POST (create)
src/app/api/buk/v1/<dominio>/[id]/route.ts        ← GET + PUT + DELETE
src/app/api/buk/v1/<dominio>/[id]/<sub>/route.ts  ← sub-recursos (ej: vacaciones)
```

Cada `route.ts` exporta funciones nombradas `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Next-canonical.

---

## 4. Estructura por archivo

```ts
// src/app/api/buk/v1/<dominio>/route.ts
import { NextRequest } from 'next/server';
import { getBukSDK } from '@/lib/buk-sdk';
import { parseQuery, parseBody, ok, fail } from '@/lib/api/utils';
import { ListSchema, CreateSchema } from '@/lib/api/schemas/<dominio>';

export async function GET(req: NextRequest) {
  const query = parseQuery(req, ListSchema);
  if (!query.ok) return fail('VALIDATION_ERROR', query.error);
  const sdk = getBukSDK();
  const result = await sdk.<modulo>.list(query.data);
  return ok(result);
}

export async function POST(req: NextRequest) {
  const body = await parseBody(req, CreateSchema);
  if (!body.ok) return fail('VALIDATION_ERROR', body.error);
  const sdk = getBukSDK();
  const created = await sdk.<modulo>.create(body.data);
  return ok(created, 201);
}
```

**Beneficios del patrón:**
- Cada handler es ~10 líneas
- Validación, error handling y SDK están separados → testeable
- Schemas se reusan entre dominios (vía import) y se exponen como tipos TS

---

## 5. Errores estándar

| Code | HTTP | Cuándo |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Body/query/params inválido (con `details: Record<field, string[]>`) |
| `UNAUTHORIZED` | 401 | Auth inválida (token Buk expirado/mal configurado) |
| `FORBIDDEN` | 403 | Sin permisos para la operación |
| `NOT_FOUND` | 404 | Recurso no existe en Buk o en Supabase |
| `CONFLICT` | 409 | Constraint violado (ej: RUT duplicado) |
| `RATE_LIMITED` | 429 | Buk respondió 429 — reintentar con backoff |
| `BUK_API_ERROR` | 502 | Buk respondió 5xx o timeout |
| `INTERNAL_ERROR` | 500 | Cualquier otro fallo no clasificado |

Shape de respuesta de error:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": { "rut": ["formato inválido"] }
  }
}
```

Shape de respuesta exitosa:
```json
{
  "data": { ... },          // objeto o array según endpoint
  "pagination": { ... }     // solo en listados paginados
}
```

---

## 6. Auth

**Fase A (ahora):** El header `auth_token` de Buk lo lee el SDK desde `process.env.BUK_API_TOKEN`. La API capa **no** valida quién llama todavía — asume llamadas internas confiables desde el frontend Next.

**Fase B (cuando agreguemos login Supabase):**
- Cada request lleva la sesión Supabase (`@supabase/ssr` lee la cookie)
- Middleware en `src/middleware.ts` valida la sesión
- Cada handler decide qué área(s) puede ver el usuario:
  - Admin Poppins → todas
  - Empleador → solo su Area + empleados de su Area
  - Colaboradora → solo a sí misma + tareas/mensajes de su Area

---

## 7. Convenciones de input

- Fechas: `YYYY-MM-DD` (ISO).
- RUT: con puntos y guión: `12.345.678-9`. Validador acepta también sin formato y normaliza.
- IDs: siempre `number` (entero positivo). Buk usa integers.
- Booleans en query string: aceptamos `"true"|"false"|"1"|"0"`.
- Paginación: `?page=1&page_size=50`. Máximo `page_size=100` (límite de Buk).

---

## 8. Observabilidad

Cada handler hace `console.error('[API <dominio>]', error)` en catch top-level. En producción esto va a logs de Vercel. Para tracing avanzado (Sentry, OpenTelemetry) — Fase B+.

---

## 9. Testing

Patrón sugerido (no implementado en Fase A):

```
src/app/api/buk/v1/<dominio>/__tests__/route.test.ts
```

Mockear el SDK con `vi.mock('@/lib/buk-sdk')`. Testear:
- Validación de input (mal RUT → 400)
- Caso happy path (SDK ok → 200 con shape correcto)
- Errores del SDK (Buk 401 → 401 nuestro)

---

## 10. Próximos pasos

1. ✅ Fase A: README + route map + utils + dominio Colaboradoras como referencia
2. ⏳ Fase B: Implementar 5 dominios críticos (colaboradoras + empleadores + hogares + asignaciones + catálogos)
3. ⏳ Fase C: Resto (vacaciones, ausencias, liquidaciones, documentos, etc.)
4. ⏳ Fase D: Auth Supabase + RLS
5. ⏳ Fase E: Webhooks Buk de entrada

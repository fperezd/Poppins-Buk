# Sentry — pasos manuales para activar (POP-C0-05)

> El wiring de @sentry/nextjs ya está commiteado (commit `ac593b6`).
> Sin SENTRY_DSN, el SDK queda no-op. Estos pasos lo activan en prod.

## 1. Crear cuenta + proyecto (5 min)

1. Ir a https://sentry.io/signup/ (free tier 5k events/mo).
2. Crear org `tooxs`.
3. Create Project → platform `Next.js` → name `poppins-back`.
4. Copiar el DSN que aparece tras crear (formato `https://<key>@<org>.ingest.sentry.io/<project_id>`).

## 2. Auth token para sourcemaps (3 min)

1. Settings → Auth Tokens → Create Token.
2. Scopes mínimos: `project:read`, `project:releases`, `org:read`.
3. Guardar el token (no se vuelve a mostrar).

## 3. Setear env vars en Vercel (5 min)

```bash
# Server runtime
vercel env add SENTRY_DSN production
# pegar DSN del paso 1

# Browser
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# mismo DSN

# Build-time (sourcemap upload)
vercel env add SENTRY_ORG production
# tooxs

vercel env add SENTRY_PROJECT production
# poppins-back

vercel env add SENTRY_AUTH_TOKEN production
# token del paso 2

# Repetir para `preview` env si querés tracking en branch previews
```

## 4. Smoke test (3 min)

1. Redeploy producción.
2. Disparar un error a propósito en una ruta:
   - Temp: agregá `throw new Error('sentry smoke test')` en alguna ruta `/api/v1/*`.
   - Curl la ruta logueado.
3. Verificar que el evento aparece en Sentry dashboard con:
   - `tags.correlation_id` presente
   - `user.id` presente (en rutas que usaron `withTenantScope`)
   - `tags.tenant_id` presente
4. Revertir el throw.

## 5. Habilitar leaked password protection (1 min)

Mientras estás en config, también:

1. Supabase Dashboard → Authentication → Providers → Email
2. Habilitar "Leaked Password Protection" (checkea HaveIBeenPwned).

Cierra el último warning del Supabase advisor.

## Operación día-a-día

- **Cuota free tier**: 5k events/mes. Sampling actual = 10% en prod, 100% en dev. Si saltás cuota, primero subir a Team plan ($26/mo) o bajar tracesSampleRate.
- **Multi-tenant**: el dashboard filtra eventos por `tags.tenant_id` para ver problemas por familia. Útil cuando una familia reporta un bug.
- **Session Replay**: está desactivado por default (privacidad B2C). Si activás para incidentes puntuales, configurar masking de inputs con datos sensibles.
- **Source maps**: se suben en build de prod automáticamente si SENTRY_AUTH_TOKEN existe. Se borran del bundle final (config `deleteSourcemapsAfterUpload`).

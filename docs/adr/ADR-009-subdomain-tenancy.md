# ADR-009: Subdomain-based tenancy (`<slug>.poppins.cl`)

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO
**Categoría:** Técnica · Producto

## Contexto

Multi-tenancy (ADR-003) requiere mecanismo para que el usuario "entre" a su tenant. Opciones:

1. Subdomain por tenant (`familia-perez.poppins.cl`)
2. Path-based (`app.poppins.cl/t/familia-perez/dashboard`)
3. Header HTTP custom (admin tools only)
4. JWT-only (cliente nunca ve tenant en URL)

## Decisión

**Subdomain-based primary (`<slug>.poppins.cl`) + JWT autoritativo + path-based fallback.**

### Detalles de implementación

#### URLs canónicas

| URL | Resuelve a |
|---|---|
| `app.poppins.cl` | Landing post-login: lista de tenants donde el user tiene acceso, redirige al default |
| `app.poppins.cl/login` | Login global (sin tenant) |
| `app.poppins.cl/signup` | Signup → onboarding wizard crea tenant |
| `<slug>.poppins.cl/dashboard` | Dashboard del tenant `<slug>` |
| `api.poppins.cl/v1/*` | Backend api-id (tenant desde JWT) |
| `buk.poppins.cl/v1/*` | Backend api-buk (tenant desde JWT) |

#### Resolución de tenant_id (3 fuentes, prioridad descendente)

1. **JWT `app_metadata.tenant_id`** — autoritativo, siempre wins
2. **Subdomain slug** — UI hint, valida contra JWT
3. **Header `X-Tenant-Slug`** — dev/admin tools only

#### DNS / Vercel

- Wildcard DNS: `*.poppins.cl` → mismo Vercel project (`poppins-web`)
- Next.js middleware extrae slug del subdomain y lo valida contra session
- Si subdomain ≠ user's tenant → redirect a landing

#### Cookies

- Cookies Supabase escritas en `domain: .poppins.cl` (todo el árbol)
- Permite que `app.`, `<slug>.`, `api.`, `buk.` compartan sesión

## Consecuencias

### Positivas

- **Customer-friendly URLs** ("ingresa a tu Poppins en `familia-perez.poppins.cl`").
- **Branding tenant** posible en futuro (logo del tenant en header).
- **Bookmarking** del tenant correcto.
- **Multi-tenant en mismo browser:** abrir 2 tabs con 2 tenants distintos funciona si user tiene acceso a ambos.
- **DNS wildcard simple** (1 record en Cloudflare, no por tenant).
- **SEO ready:** cada tenant puede tener landing pública opcional con su slug.

### Negativas / Trade-offs

- **DNS wildcard cuesta** (Vercel Pro lo soporta, Hobby no).
- **Subdomain collision possible** (reservar `app`, `api`, `buk`, `status`, `admin`, `www`, etc).
- **Cert SSL wildcard** (Vercel lo maneja automático con Let's Encrypt).
- **Subdomain spoofing:** atacante levanta `evil-tenant.poppins.cl` y phishing. Mitigación: JWT autoritativo (subdomain solo UI hint).
- **Local dev requiere `/etc/hosts`** para `*.poppins.local`.
- **Slug es público** → tenant name no puede ser sensitive info.

### Neutras

- Migración a path-based posible en futuro sin gran impacto (URLs cambian, JWT autoritativo no).

## Alternativas consideradas

### Alternativa A: Path-based (`app.poppins.cl/t/<slug>/dashboard`)

**Pros:**
- Sin DNS wildcard.
- Sin SSL wildcard.
- Local dev sin /etc/hosts.

**Contras:**
- URLs más feas.
- Bookmarking más torpe.
- Tenant slug expuesto en URL pero menos prominente.

**Por qué no la elegimos:** Subdomain feels more "professional" para B2B SaaS. Es estándar (Slack, Linear, Notion, Vercel).

### Alternativa B: Sin slug en URL (JWT autoritativo only)

**Pros:**
- URLs constantes (`app.poppins.cl/dashboard` siempre).
- Sin DNS complejo.

**Contras:**
- Imposible bookmarking de tenant específico cuando user tiene multi-tenant access.
- Imposible 2 tabs con 2 tenants.
- "¿En qué tenant estoy?" requiere UI extra.

**Por qué no la elegimos:** Multi-tenant access es real (un contador externo puede ver 5 hogares de 5 clientes diferentes en futuro).

### Alternativa C: Custom domains per tenant (`familia-perez.com`)

**Pros:**
- Máximo branding.

**Contras:**
- Operación pesada (CNAME setup, cert per tenant).
- Overkill para nuestro segmento (familias, no enterprises grandes).

**Por qué no la elegimos:** Reservar para C2+ tier Enterprise si demanda existe.

## Referencias

- `docs/PLAN_MAESTRO.md` §7.4 Subdomain strategy
- Vercel wildcard subdomains: <https://vercel.com/docs/concepts/projects/domains/wildcard-domains>
- ADR-003 Multi-tenancy day 1
- Slack subdomain pattern: <https://api.slack.com/methods/auth.test>

## Revisión

Re-evaluar cuando:
- Algún tenant Enterprise demande custom domain.
- DNS wildcard Vercel se vuelva pricing concern.
- Aparezca seguridad issue por subdomain enumeration.

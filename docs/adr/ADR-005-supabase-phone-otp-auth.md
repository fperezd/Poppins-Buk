# ADR-005: Phone OTP vía Supabase como auth primario

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Técnica · Seguridad · Producto

## Contexto

Poppins target son madres/familias empleadoras chilenas (30-55, ABC1). Necesitamos auth seguro y de baja fricción. Adicionalmente, colaboradoras (nanas) acceden a la app — segmento que típicamente:
- Tiene WhatsApp activo (>95% en Chile)
- Cambia de email frecuentemente o no tiene email principal
- Recuerda mejor su número de celular que un password
- Es móvil-first

Opciones evaluadas:
1. Email + password (clásico)
2. Phone OTP (SMS o WhatsApp)
3. Magic link email
4. OAuth social (Google, Facebook)
5. Combinación email/social + phone OTP

## Decisión

**Phone OTP vía Supabase Auth como método primario. Email como backup en perfil.**

### Detalles de implementación

- Provider: Supabase Auth con Twilio Chile como SMS gateway.
- Flujo:
  1. Usuario ingresa teléfono `+56 9 XXXX XXXX`
  2. `supabase.auth.signInWithOtp({ phone, options: { channel: 'sms' } })`
  3. Twilio envía OTP 6 dígitos.
  4. Usuario ingresa código, `verifyOtp` retorna sesión.
- Email guardado en `user_profiles.email` como **secundario** (para emails transaccionales).
- WhatsApp como channel alternativo del OTP cuando Twilio soporte mejor en C2.

### Rate-limit (POP-C0-13 → POP-C1-12)

- Max 3 OTPs / hora / número (vía Upstash Redis).
- Después de 5 intentos fallidos consecutivos: bloqueo 15 min.
- Anti-fraud: monitor en Sentry de números abusando del envío.

### Magic link email como backup

Si SMS no llega (Twilio caído o número inválido), Resend envía magic link al email del perfil.

## Consecuencias

### Positivas

- **Friction mínima** para usuarios chilenos.
- **Sin passwords que olvidar / robar / rotar.**
- **Colaboradoras pueden usar la app** sin email corporativo.
- **Recuperación trivial:** cambia de número, admin actualiza desde dashboard.
- **WhatsApp ready** cuando Twilio Chile lo permita (canal preferido en LATAM).
- **2FA implícito** (poseer el teléfono = ya es algo que tienes).

### Negativas / Trade-offs

- **Costo SMS** ~$50 CLP por OTP enviado (variable según Twilio Chile rate). A escala importa.
- **Vulnerabilidad SIM swap** (atacante porta el número). Mitigación: alertas de cambio de device, plus magic link email como recovery.
- **Phone churn** (usuarios cambian número). Mitigación: UI para admin actualizar.
- **Dependencia Twilio.** Si Twilio cae, no se puede login. Mitigación: magic link email + status page.
- **Internacional fricción.** Usuario en roaming o sin signal no recibe SMS.

### Neutras

- Supabase Auth maneja internals (no implementamos OTP nosotros).
- Backend valida JWT igual independiente de método.

## Alternativas consideradas

### Alternativa A: Email + password clásico

**Pros:**
- Familiar para todos.
- Sin costo variable (SMS).
- Funciona sin telefonía.

**Contras:**
- Passwords se olvidan, rotar es UX horrible.
- Colaboradoras frecuentemente no tienen email "personal" activo.
- Security: password reuse, brute force, leaks.

**Por qué no la elegimos:** Friction mucho mayor para ICP target (mamis ocupadas + nanas sin email).

### Alternativa B: Magic link email primario

**Pros:**
- Sin password.
- Sin costo variable.
- Funciona en cualquier device.

**Contras:**
- Email checking habit no universal en colaboradoras.
- Spam folder problem.
- Friction inicial: usuario revisa email, vuelve a Poppins, clic, etc.

**Por qué no la elegimos:** Phone OTP es UX más rápido (todo en pantalla del teléfono). Email magic link queda como **backup**.

### Alternativa C: OAuth Google/Facebook

**Pros:**
- Sin costo.
- Familiar para usuarios tech-savvy.
- Sin OTP delays.

**Contras:**
- Colaboradoras menos likely de tener cuenta Google/FB con email asociado.
- Privacy concerns (algunas usuarios desconfían de share data con tech giants).
- Onboarding require permissions screen extra.

**Por qué no la elegimos:** Posible añadir como **opcional** en C2 (sumar Google login para empleadoras tech-savvy). No es la opción primaria.

### Alternativa D: Auth0 / Clerk en vez de Supabase Auth

**Pros:**
- Más features avanzados (MFA management, organizations).
- Mejor admin UI.

**Contras:**
- Costo: ambos tienen tier pago ~$25/mes mínimo + per-MAU.
- Otro vendor más en el stack.
- Stack ya tiene Supabase, doble auth tooling es complejidad innecesaria.

**Por qué no la elegimos:** Supabase Auth es "good enough" para Phone OTP, viene incluido, integra naturalmente con RLS Postgres. No agregamos vendor sin razón.

## Referencias

- Supabase Auth Phone: <https://supabase.com/docs/guides/auth/phone-login>
- Twilio Chile pricing: <https://www.twilio.com/pricing/messaging/cl>
- `Poppins-back/src/app/login/page.tsx` (implementación actual)
- ADR-009 Subdomain tenancy (relacionado para cookies cross-subdomain)

## Revisión

Re-evaluar:
- Si SMS costs >$50/mes/tenant sostenido (considerar WhatsApp Business cuando disponible).
- Cuando Twilio agregue WhatsApp como channel oficial Chile.
- Si SIM swap attacks emergen como vector real (agregar MFA secundario).
- Cuando lleguemos a expansion LATAM (per-país validation).

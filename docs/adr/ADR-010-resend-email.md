# ADR-010: Resend como proveedor de email transaccional

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO
**Categoría:** Técnica

## Contexto

Poppins necesita email transaccional desde C1:
- Welcome post-signup
- OTP backup (cuando SMS falla)
- Trial expiring (7/3/1 día)
- Invoice paid / payment failed
- Magic link invitación colaboradora
- Reset password (cuando se sume email auth)
- Weekly digest (C2)

Volumen estimado MVP: 500-3000 emails/mes.

## Decisión

**Resend (resend.com) como proveedor de email transaccional, con `react-email` para templates.**

### Detalles de implementación

- Cuenta Resend Pro ($20/mes incluye 100k emails/mes).
- Dominio verificado `poppins.cl` (SPF + DKIM + DMARC).
- From address: `Poppins <noreply@poppins.cl>`. Reply-to: `hola@poppins.cl`.
- Templates en `poppins-api-id/src/lib/email/templates/` usando `@react-email/components`.
- Cliente: `lib/email/client.ts` con función `sendEmail({ to, subject, react: <Template props /> })`.
- Idempotency: `email_log` table con `(recipient, type, idempotency_key)` unique para evitar duplicados.

### Templates iniciales (C1)

| Trigger | Template | Sprint |
|---|---|---|
| Post-signup completion | `Welcome` | 4 |
| Trial expiring 7d | `TrialExpiring7d` | 4 |
| Trial expiring 1d | `TrialExpiring1d` | 4 |
| Trial expired | `TrialExpired` | 4 |
| Invoice paid | `InvoicePaid` (con PDF attach future) | 4 |
| Invoice payment failed | `PaymentFailed` | 4 |
| Magic link invite colaboradora | `ColaboradoraInvite` | 5 |
| OTP backup | `OTPBackup` | 5 |

## Consecuencias

### Positivas

- **DX moderno** (TypeScript SDK + react-email templates).
- **Free tier 3k emails/mes** suficiente para development y MVP early.
- **Deliverability alta** (Resend está optimizado para transaccional).
- **API simple:** un endpoint, payload claro.
- **Preview de templates** en localhost via react-email dev server.
- **Webhooks** para eventos: delivered, opened, clicked, bounced, complained.

### Negativas / Trade-offs

- **Vendor relativamente nuevo** (Resend lanzó 2023). Madurez vs SendGrid/Mailgun.
- **Pricing pro escala más rápido** que competidores en volumen alto (>1M emails/mes).
- **Sin marketing emails buenos.** Resend es transaccional. Para newsletter/marketing usar Mailchimp/Buttondown en C2.
- **Region:** Resend tiene infra US. Para LATAM latency aceptable pero no ideal.

### Neutras

- Templates en JSX (familiar a React devs).
- Integración Sentry no nativa, agregar manualmente.

## Alternativas consideradas

### Alternativa A: SendGrid (Twilio)

**Pros:**
- Maduro, líder mercado.
- Free tier 100/día.
- Templates HTML builder.

**Contras:**
- DX más torpe (REST API verbose).
- Templates en su builder (no React).
- Deliverability decreciendo (reportado en comunidad).

**Por qué no la elegimos:** DX moderno de Resend gana. Y ya usamos Twilio (SMS) — separar SendGrid evita dependencia única.

### Alternativa B: Mailgun

**Pros:**
- Maduro.
- Pay-as-you-go atractivo.

**Contras:**
- DX similar a SendGrid (REST clásico).
- Sin React templates nativos.

**Por qué no la elegimos:** Mismo razonamiento que SendGrid.

### Alternativa C: Postmark

**Pros:**
- Deliverability excelente.
- Especializado transaccional.

**Contras:**
- Más caro a escala.
- DX similar a Resend pero más antiguo.

**Por qué no la elegimos:** Resend tiene mejor DX moderno y precio inicial. Si deliverability se vuelve problema, swap a Postmark es trivial (1 file change).

### Alternativa D: AWS SES

**Pros:**
- El más barato a escala.
- Maduro.

**Contras:**
- DX horrible (necesita SDK AWS pesado, dominios review process manual).
- Sandbox por defecto (1ra request bloqueada hasta verification AWS).
- Templates pesado de manejar.

**Por qué no la elegimos:** DX overhead anti-startup. Quizás en escala >1M/mes evaluamos.

### Alternativa E: SMTP gratis (Gmail / Sendinblue free)

**Pros:**
- Cero costo MVP.

**Contras:**
- Rate-limited.
- Sin tracking de delivery/bounces.
- Limits estrictos.

**Por qué no la elegimos:** Cero infra de email = imposible debug entregabilidad. Bad practice para producto pagante.

## Referencias

- Resend docs: <https://resend.com/docs>
- react-email: <https://react.email/>
- `docs/PLAN_MAESTRO.md` §12.4 Email transactional

## Revisión

Re-evaluar:
- Cuando volumen >100k/mes (verify pricing favorable).
- Si deliverability metrics bajan <95%.
- Cuando expandamos LATAM (Resend region routing).

# ADR-004: Flow.cl como gateway de billing

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Técnica · Producto

## Contexto

Poppins necesita facturación automática mensual recurrente en CLP para clientes chilenos. Plan v1.1 sugería postponer billing a C2 (manual invoicing en MVP). Plan v1.2 decidió incorporar billing automatizado en C1 (Sprint 4-5).

Necesitamos gateway que soporte:
- Cobros recurrentes (subscriptions)
- Webpay / tarjetas Chile (no solo internacional)
- Webhooks para confirmar pagos
- Trial periods + suspensiones
- Sandbox para desarrollo

## Decisión

**Flow.cl como gateway de billing.**

### Detalles de implementación

- Cuenta Flow.cl sandbox creada antes de Sprint 4.
- Cliente `lib/billing/flow-client.ts` en `poppins-api-id`.
- Schema billing (migración 0005):
  - `plans` table (starter / pro / empresarial)
  - `subscriptions` table (tenant_id, plan_id, status, trial_ends_at, current_period_end, flow_subscription_id)
  - `invoices` table (subscription_id, amount_clp, status, flow_payment_id)
- Webhook `/api/billing/webhook` recibe eventos Flow.cl con HMAC verification.
- Flow webhook events handled:
  - `payment.success` → mark invoice paid, ensure subscription active
  - `payment.failed` → trigger dunning retry
  - `subscription.cancelled` → suspend tenant (read-only mode)

### Plan tiers

```typescript
const PLANS = {
  starter: { monthly_clp: 9990, max_hogares: 1, max_colaboradoras: 2 },
  pro:     { monthly_clp: 19990, max_hogares: 3, max_colaboradoras: 5 },
  empresarial: { monthly_clp: null, max_hogares: null, max_colaboradoras: null }, // contact sales
};
```

## Consecuencias

### Positivas

- **Procesador chileno nativo.** Cuentas en pesos, IVA Chile, sin friction cambiaria.
- **Webpay integrado** (tarjeta crédito/débito Chile).
- **Sin costo base** (solo comisión por transacción ~3-4%).
- **Sandbox robusto** para testing.
- **API REST documentada** en español.
- **Soporte recurring** nativo.

### Negativas / Trade-offs

- **Vendor lock-in** a procesador local. Migrar a Stripe Chile (cuando exista) o Transbank directo requiere reescribir billing module.
- **Limitación geográfica.** Si expandimos a Perú/Colombia/México, Flow.cl no cubre.
- **API REST less mature** vs Stripe (menos features avanzadas tipo customer portal hosted, dunning automation builtin).
- **Webhook reliability** desconocida hasta operar en producción (asumimos OK, mitigamos con idempotency).

### Neutras

- Factura electrónica SII Chile NO la emite Flow.cl. Integración separada con Bsale en C2.
- Comisión variable según volumen, negociable post-PMF.

## Alternativas consideradas

### Alternativa A: Stripe (US) con tarjetas internacionales

**Pros:**
- API world-class.
- Customer portal hosted.
- Dunning automation builtin.
- Documentación excelente.

**Contras:**
- Cobra en USD, fricción cambiaria para clientes chilenos.
- No soporta Webpay (mayoría de débito Chile).
- Stripe Chile aún limitado (sin todas las features).

**Por qué no la elegimos:** El cliente target es mamá chilena con tarjeta CL. Pagar en USD es UX inaceptable. Cuando Stripe Chile madure (TBD), reconsiderar.

### Alternativa B: Transbank Webpay directo

**Pros:**
- Procesador oficial Chile.
- Soporte completo Webpay.
- Sin intermediario.

**Contras:**
- API antigua (XML/SOAP en mucha documentación).
- Costo inicial de integración alto.
- No soporta subscriptions nativas (requiere construir layer encima).
- Setup operacional pesado (cuenta empresa con Transbank, certificación PCI light).

**Por qué no la elegimos:** Flow.cl es Transbank-as-a-service con API moderna + features que necesitamos. Roi obvio.

### Alternativa C: Mercado Pago

**Pros:**
- Latam amplio (incluye Chile).
- Marca conocida.

**Contras:**
- API más enfocada a marketplaces.
- Subscriptions menos maduras que Flow.cl.

**Por qué no la elegimos:** Flow.cl es más Chile-céntrico y específico para SaaS subscriptions.

### Alternativa D: Sin billing automatizado, invoicing manual (plan v1.1 original)

**Pros:**
- 0 ingeniería en MVP.
- Validamos pricing con conversaciones reales.

**Contras:**
- No escala. A los 10 clientes ya es trabajo manual significativo.
- Suspensión por impago manual = errores y customers enojados.

**Por qué no la elegimos:** El CTO confirmó billing automatizado en C1. Plan v1.2 lo refleja.

## Referencias

- Flow.cl API docs: <https://www.flow.cl/docs/api.html>
- Flow.cl pricing: <https://www.flow.cl/precios>
- `docs/PLAN_MAESTRO.md` §10 Sprint 3-5 Billing
- `docs/PLAN_MAESTRO.md` §12.2 Billing Flow.cl

## Revisión

Re-evaluar:
- Cuando Stripe Chile alcance feature parity con Flow.cl (~2027).
- Cuando expandamos a otro país LATAM (Flow.cl no aplica).
- Si volumen de pagos justifica negociación tasa preferencial Transbank directo (~>$100M CLP/año en transacciones).

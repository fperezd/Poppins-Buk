# ADR-011: Gemini API como agente conversacional de soporte (C2)

**Status:** Proposed (decisión final Sprint 7+)
**Date:** 2026-05-27
**Decision-makers:** Product Lead + CTO
**Categoría:** Producto · Técnica

## Contexto

Domestikco (competidor) ofrece soporte via WhatsApp humano. Poppins decide diferenciarse con **agente IA conversacional 24/7** que responde preguntas comunes y escala a humano cuando necesario.

CTO definió: "agente conectado con API de Gemini, al final". El "al final" = Sprint 7+ (post-MVP launch).

Volumen esperado: 50-200 conversaciones/mes con 20 tenants. Crece con MAU.

## Decisión

**Gemini API (Google) como motor LLM del agente conversacional de soporte, con escalamiento manual via email a `hola@poppins.cl` cuando IA no resuelve.**

Decisión final ratificada en Sprint 7 después de validar costos reales y calidad de respuestas con prompts curados.

### Detalles de implementación (preliminar)

#### Arquitectura del agente

```
User chat (web widget) → poppins-api-id /agents/support/chat
                          ↓
                       Gemini API call con system prompt:
                          - Contexto Poppins (qué es, cómo funciona)
                          - Datos del tenant (plan, hogares, colaboradoras count)
                          - Últimas 10 turns de la conversación
                          - Tools disponibles (lookup_invoice, get_liquidacion, etc)
                          ↓
                       Response al user + posible tool calls
                          ↓
                       Si confidence_low → "Te conecto con el equipo, revisaré tu caso pronto en hola@poppins.cl"
                          + email a Tooxs con transcript + tenant context
```

#### Tools del agente

Funciones que Gemini puede invocar para responder mejor:

- `get_my_liquidacion(month, year)` → busca liquidación específica del user
- `get_my_vacaciones_saldo()` → saldo vacaciones
- `get_my_billing_status()` → status suscripción, próxima factura
- `get_active_tareas()` → tareas pendientes del user
- `escalate_to_human(reason, context)` → emite email a Tooxs

#### System prompt base (preliminar, refinar en Sprint 7)

```
Eres "Mary", asistente IA de Poppins (ERP doméstico para familias chilenas).

Tu rol:
- Responder preguntas sobre uso de Poppins
- Ayudar con interpretación de liquidaciones, vacaciones, horas extra
- Explicar conceptos legales-laborales chilenos básicos (con disclaimer que no eres abogada)
- Escalar a humano cuando no estás segura

Tono:
- Cercano, cálido (somos Poppins, "Magia en tu casa")
- Profesional cuando es necesario
- Usa "tú" no "usted"
- Lenguaje claro, evita jerga legal innecesaria

Restricciones:
- NUNCA inventes números o fechas. Si no tienes el dato, usa tools o escala.
- NO des asesoría legal definitiva. Sugiere consultar DT o asesor humano.
- NO compartas data de otros tenants.
- NO opines sobre temas políticos/religiosos.

Contexto del tenant actual:
{tenant_context}

Conversación previa:
{conversation_history}
```

## Consecuencias

### Positivas

- **Soporte 24/7 sin equipo humano** (especialmente nights/weekends).
- **Diferenciador vs Domestikco** (que depende de humanos en WhatsApp).
- **Costo bajo:** ~$5 USD por 1k mensajes con Gemini (free tier hasta 60 req/min).
- **Escalable:** sin contratar people para soporte hasta volumen alto.
- **Aprende del contexto del tenant** (data personalizada).
- **Tools nativos:** Gemini soporta function calling.
- **Mantiene marca:** "Mary" (Mary Poppins guiño) refuerza identidad.

### Negativas / Trade-offs

- **Vendor lock-in Google.** Si Gemini cambia precios o API, refactorizar.
- **Hallucinations risk:** LLM puede inventar info crítica (liquidaciones, leyes). Mitigación: tools obligatorios + disclaimer + escalation rápida.
- **Latency:** Gemini Pro ~2-5s response time. UX requiere streaming UI.
- **Compliance:** data de tenants enviada a Google API. Mitigación: GDPR/LGPD-compatible (Google Cloud DPA estándar), data no usada para training (config explícita).
- **Costo variable:** difícil de proyectar exactamente. Setear caps con Vercel env $$$.

### Neutras

- Comparable a Claude API (Anthropic) o GPT-4 (OpenAI) en capacidad técnica.
- Free tier generoso pero rate-limit puede hit en producción.

## Alternativas consideradas

### Alternativa A: Claude API (Anthropic)

**Pros:**
- Calidad de respuestas excelente.
- Tool use bien diseñado.
- Trust signals fuertes (Anthropic safety focus).

**Contras:**
- Más caro: ~$3/1M input + $15/1M output (Sonnet) vs Gemini Flash ~$0.10/1M input.
- Latency comparable.

**Por qué no la elegimos (preliminar):** Costo. Gemini Flash es 10-30x más barato a calidad comparable para nuestro use case (soporte conversacional). Si calidad de Gemini decepciona, **swap a Claude es trivial** (cambia provider class). Plan B siempre listo.

### Alternativa B: GPT-4 (OpenAI)

**Pros:**
- Brand recognition.
- Plugin ecosystem.

**Contras:**
- Más caro que Gemini.
- Rate-limit más estricto en tier inicial.

**Por qué no la elegimos:** Gemini ganaría en pricing.

### Alternativa C: LLM open-source self-hosted (Llama 3, Mistral)

**Pros:**
- Costo marginal cero post-infra.
- Privacy total.
- Sin vendor lock-in.

**Contras:**
- Infra ML (GPU servers) cuesta sustancialmente.
- Calidad inferior a Gemini/Claude/GPT en tool use.
- Operación pesada (model versioning, scaling).

**Por qué no la elegimos:** Overkill operacional para nuestro volumen MVP. Re-evaluar en C2 escala.

### Alternativa D: Sin agente IA, solo soporte humano

**Pros:**
- Sin costo LLM variable.
- Trust humano.

**Contras:**
- No escala sin contratar.
- 24/7 imposible con equipo chico.
- Pierde diferenciador vs Domestikco.

**Por qué no la elegimos:** Decisión del CTO ya tomada — Poppins compite con IA en soporte.

## Referencias

- Gemini API docs: <https://ai.google.dev/docs>
- Gemini pricing: <https://ai.google.dev/pricing>
- Anthropic Claude API: <https://docs.anthropic.com/>
- `docs/PLAN_MAESTRO.md` §12 MVP Essentials Customer ops
- ICP context: madres/familias que valoran self-service + IA help

## Revisión

Re-evaluar:
- Sprint 7: validar quality con 100 conversaciones reales. Si <70% resuelven sin escalation, considerar Claude.
- Trimestral: revisar pricing Gemini vs competidores.
- Si Google cambia ToS sobre data usage.
- Cuando volumen >10k conversations/mes (precios bulk discounts).

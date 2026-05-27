# ADR-002: BUK es source-of-truth del dominio laboral-legal chileno

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO (Fernando Pérez)
**Categoría:** Técnica · Producto · Seguridad

## Contexto

Poppins necesita gestionar dominio laboral chileno: liquidaciones, vacaciones, ausencias (con sus 3 subtipos), horas extra, bonos, cargas familiares, finiquitos, AFP, Isapre, Previred. Este dominio tiene **complejidad regulatoria alta**, **cambios legales frecuentes** (Ley 40 horas, Ley 21.220, normativa DT), y **responsabilidad civil/penal** si se calculan mal liquidaciones.

Opciones de fondo:
1. Construir motor laboral propio (3-6 meses de ingeniería + maestría legal especializada).
2. Integrar con BUK (motor líder del mercado chileno, certificación DT, usado por miles de empresas).
3. Integrar con competidores BUK (Talana, Nominapro).

## Decisión

**BUK API es el source-of-truth de todo dato laboral-legal de Poppins.**

### Detalles de implementación

- **Modelo D** (definido en `Poppins-back/CLAUDE.md`):
  - 1 Tenant Poppins = 1 organización BUK con su propio `BUK_API_TOKEN` encriptado en `tenants.buk_api_token_encrypted`.
  - 1 Hogar = 1 BUK Area.
  - 1 Empleador = 1 BUK Empleado con cargo "Jefe de Área" + sueldo simbólico $1.
  - 1 Colaboradora = 1 BUK Empleado con cargo Poppins (Poppins Hogar / Poppins Jardín / Poppins Piscina).
- **Cálculos críticos** (liquidaciones, vacaciones acumuladas, finiquitos) los hace BUK. Poppins solo presenta y orquesta.
- **Datos de dominio Poppins-puro** (tareas, listas compras, mensajes, evaluaciones, solicitudes salud, asignaciones) viven en Supabase Postgres con RLS multi-tenant.
- **Cache local en Supabase** (`cache_areas`, `cache_roles`, `cache_absence_types`) refrescado por cron cada 6h. Sirve para reducir latencia BUK + funcionar en degraded mode si BUK cae.

## Consecuencias

### Positivas

- **No reinventamos compliance.** BUK ya certificado por DT, integrado con Previred, calcula impuestos correctos.
- **Responsabilidad legal compartida.** Si BUK calcula mal, BUK responde. Poppins es interface.
- **Time-to-market 3-6 meses más rápido** vs construir motor propio.
- **Confiabilidad alta:** BUK procesa nóminas de empresas grandes, robustez probada.
- **Foco de Poppins:** UX/UI + multi-hogar + dominio Poppins-puro. NO compliance laboral.

### Negativas / Trade-offs

- **Dependencia crítica de proveedor externo.** BUK puede subir precios, cambiar términos, bajar API access.
- **Latencia agregada** en cada request que consulta BUK (mitigamos con cache local).
- **Costo BUK por tenant.** Negociar precio especial o tarifa preferencial cuando lleguemos a >10 tenants (parte de vendor strategy post-MVP).
- **Limitados a features que BUK expone.** Si necesitamos algo que BUK no soporta, no lo podemos construir hasta que BUK lo agregue.
- **Cambios en BUK API rompen Poppins.** Mitigación: contract tests + monitoreo de changelog BUK.

### Neutras

- BUK no expone WebSocket / Realtime. Para features realtime usamos Supabase Realtime sobre dominio Poppins-puro.
- BUK no expone embeds. Toda UI la construye Poppins desde cero.

## Alternativas consideradas

### Alternativa A: Motor laboral propio

**Pros:**
- Control total de features y pricing.
- Sin vendor lock-in.
- Mejor margen unit economics (no costo BUK por tenant).

**Contras:**
- 3-6 meses ingeniería + asesoría legal especializada.
- Responsabilidad legal completa si calculamos mal.
- Necesitamos mantener actualización con cambios legales mensualmente.
- Certificación DT cuesta tiempo y dinero.

**Por qué no la elegimos:** No es el "core differentiator" de Poppins. Nuestro valor está en UX/UI + multi-hogar + experiencia para empleadoras, no en compliance laboral. Reservamos esta opción como **plan post-MVP exitoso** (ver vendor strategy en PLAN_MAESTRO §17).

### Alternativa B: Integrar con Talana/Nominapro

**Pros:**
- Posibles APIs similares a BUK.
- Diversificación de vendor.

**Contras:**
- BUK es líder de mercado, mayor cobertura de features.
- Talana/Nominapro API maturity desconocida.
- Cambiar provider en futuro es trivial si arquitectura es modular (api-buk módulo).

**Por qué no la elegimos:** BUK es el provider más maduro al momento de la decisión. Si en futuro evaluamos alternativa, el módulo `poppins-api-buk` se reescribe contra otra API sin tocar el resto.

### Alternativa C: Hybrid (BUK para cálculos críticos, propio para UX)

**Pros:**
- Algunos cálculos simples (horas extra de mes corriente) los hace Poppins, BUK confirma.

**Contras:**
- Complejidad de mantener consistencia entre 2 fuentes de verdad.
- Bugs sutiles si los cálculos divergen.

**Por qué no la elegimos:** Mantener 2 fuentes de verdad es la peor anti-práctica de ingeniería. Single source of truth.

## Referencias

- BUK API docs: <https://documenter.getpostman.com/view/1587820/SzYW3LFa>
- `Poppins-back/CLAUDE.md` Modelo D
- `Poppins-back/src/lib/buk-sdk/` — SDK ya construido (13 módulos)
- `BUK INTEGRATIONS/` — documentación BUK del equipo

## Revisión

Re-evaluar:
- Cuando BUK cambie políticas comerciales (precio >2x, restricciones API).
- Cuando lleguemos a 20+ tenants y unit economics demanden motor propio.
- Cuando emerja un competidor BUK significativamente superior (improbable a 12 meses).
- Cuando expandamos LATAM (Perú/Colombia/México — BUK no opera ahí).

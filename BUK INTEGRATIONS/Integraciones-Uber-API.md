# Integraciones Uber API - Skills y Capacidades

**Fuente:** https://developer.uber.com/docs
**Seccion:** Uber Developer Platform - APIs y SDKs
**Fecha de adquisicion:** 2026-03-25

---

## Resumen Ejecutivo

Uber expone un ecosistema completo de APIs RESTful que cubren movilidad de personas, entregas de ultima milla, gestion empresarial, salud, flotas, marketplace de restaurantes y transporte publico. Todas las APIs usan JSON, autenticacion OAuth 2.0 y ofrecen ambientes sandbox para pruebas.

**Base URL produccion:** `https://api.uber.com`
**Base URL sandbox:** `https://sandbox-api.uber.com`
**Autenticacion:** OAuth 2.0 (Authorization Code + Client Credentials)
**Token URL:** `https://auth.uber.com/oauth/v2/token`
**Authorization URL:** `https://auth.uber.com/oauth/v2/authorize`
**Vigencia del token:** 30 dias (2,592,000 segundos)
**Rate limit (client credentials):** 100 requests/hora

---

## SKILL 1: Uber Rides API — Solicitud de Viajes

**Producto:** Uber Ride Requests
**Documentacion:** https://developer.uber.com/products/ride-requests
**SDKs:** iOS, Android, Java, Python

### Capacidades

| Skill | Endpoint | Metodo | Descripcion |
|-------|----------|--------|-------------|
| Listar productos disponibles | `/v1.2/products` | GET | Obtiene productos Uber disponibles en una ubicacion (UberX, Comfort, Black, etc.) |
| Estimar tarifa | `/v1.2/requests/estimate` | POST | Genera un `fare_id` con tarifa upfront y tiempo estimado de llegada |
| Solicitar viaje | `/v1.2/requests` | POST | Crea una solicitud de viaje para un rider autenticado |
| Estado del viaje | `/v1.2/requests/{request_id}` | GET | Consulta el estado actual de un viaje en curso |
| Cancelar viaje | `/v1.2/requests/{request_id}` | DELETE | Cancela un viaje solicitado |
| Historial de viajes | `/v1.2/history` | GET | Obtiene historial de viajes del rider |
| Recibo del viaje | `/v1.2/requests/{request_id}/receipt` | GET | Obtiene el recibo detallado de un viaje completado |
| Mapa del viaje | `/v1.2/requests/{request_id}/map` | GET | Obtiene la URL del mapa del viaje |

### Flujo de Solicitud de Viaje

```
1. GET /v1.2/products (server token) → lista productos disponibles
2. POST /v1.2/requests/estimate (rider token) → obtiene fare_id
3. POST /v1.2/requests (rider token + fare_id) → solicita el viaje
4. GET /v1.2/requests/{id} → monitorea estado
```

### Autenticacion Requerida

- **Server Token:** Para endpoints sin contexto de rider (`GET /products`)
- **Rider Access Token:** Para solicitar viajes o ver historial (requiere autorizacion del usuario via OAuth)

### Ride Request Button

Integracion rapida con pocas lineas de codigo. Muestra estimaciones de tarifa en tiempo real y ETA de recogida. Al tocar, abre la app Uber via deep links con pickup, destino y producto pre-configurados.

---

## SKILL 2: Uber Direct API — Entregas de Ultima Milla

**Producto:** Uber Direct (Delivery as a Service)
**Documentacion:** https://developer.uber.com/docs/deliveries/overview
**API Reference:** https://developer.uber.com/docs/deliveries/api-reference/daas

### Capacidades

| Skill | Endpoint | Metodo | Descripcion |
|-------|----------|--------|-------------|
| Crear cotizacion | `/v1/customers/{customer_id}/delivery_quotes` | POST | Cotiza una entrega con origen y destino |
| Crear entrega | `/v1/customers/{customer_id}/deliveries` | POST | Despacha un courier Uber para pickup y entrega |
| Obtener entrega | `/v1/customers/{customer_id}/deliveries/{delivery_id}` | GET | Consulta estado de una entrega |
| Actualizar entrega | `/v1/customers/{customer_id}/deliveries/{delivery_id}` | PATCH | Actualiza detalles (ej: incrementar propina) |
| Cancelar entrega | `/v1/customers/{customer_id}/deliveries/{delivery_id}` | DELETE | Cancela una entrega activa |
| Listar entregas | `/v1/customers/{customer_id}/deliveries` | GET | Lista entregas del customer |

### Webhooks

| Evento | Descripcion |
|--------|-------------|
| `event.delivery_status` | Cambios de estado de la entrega (pickup, dropoff, cancelada, etc.) |
| `event.courier_update` | Actualizaciones de ubicacion y estado del courier |

### Flujo de Entrega

```
1. POST /delivery_quotes → obtiene cotizacion con precio y ETA
2. POST /deliveries → crea la entrega (usar mismo formato de direccion que la cotizacion)
3. Recibir webhooks → monitorear progreso via tracking_url
4. PATCH /deliveries/{id} → actualizar propina si es necesario
```

### Consideraciones Tecnicas

- **Direcciones:** Usar formato estructurado para mayor precision. Si lat/long difiere >1km de la direccion, Uber sobrescribe con su geocoding.
- **Propinas:** Solo pueden incrementarse via Update Delivery. Para corregir, cancelar y recrear.
- **Rate Limits (sandbox):** 200 requests/10 min por `application_id`
- **Rate Limits (produccion):** Varian por endpoint; exceder devuelve `429 customer_limited`
- **Sandbox:** Solo para pruebas funcionales, NO para pruebas de carga/rendimiento

### Proceso de Go-Live

1. Desarrollo con credenciales sandbox (sin entregas reales)
2. Proporcionar tiendas reales para piloto
3. Monitoreo conjunto con equipo Uber
4. Deploy a todas las tiendas tras piloto exitoso

---

## SKILL 3: Uber for Business API — Gestion Empresarial

**Producto:** Uber for Business
**Documentacion:** https://developer.uber.com/docs/guest-rides/about/u4b-api-introduction

### Sub-Skills

#### 3.1 Employee Management API

| Skill | Descripcion |
|-------|-------------|
| Provisionar empleados | Alta automatizada de empleados en la organizacion |
| Desprovisionar empleados | Baja automatizada de empleados |
| Gestionar roster | Acceso al directorio de empleados de la empresa |

#### 3.2 Guest Trips API

| Skill | Descripcion |
|-------|-------------|
| Solicitar viaje para invitado | Crear viaje sin que el invitado tenga cuenta Uber |
| Gestionar viajes a escala | Alternativa programatica al dashboard Uber Central |
| Monitorear viajes | Seguimiento de todos los viajes de la organizacion |

**Autenticacion:** OAuth 2.0 Client Credentials con scope `guest.rides`

#### 3.3 Receipts API

| Skill | Descripcion |
|-------|-------------|
| Obtener recibos en tiempo real | Updates detallados de cada viaje corporativo |
| Acceso organizacional | Sin necesidad de tokens por usuario individual |
| Filtrar viajes corporativos | Solo viajes designados como oficiales por el rider |

#### 3.4 Statements API

| Skill | Descripcion |
|-------|-------------|
| Gestionar estados de cuenta | APIs para administracion de statements de la organizacion |

---

## SKILL 4: Uber Vouchers API — Programas de Vouchers

**Producto:** Uber Vouchers
**Documentacion:** https://developer.uber.com/docs/vouchers/introduction
**Build Guide:** https://developer.uber.com/docs/vouchers/voucher-api-build-guide/overview

### Capacidades

| Skill | Endpoint | Descripcion |
|-------|----------|-------------|
| Crear programa de vouchers | `POST /v1/organizations/{org_id}/voucher-programs` | Crea un programa con parametros personalizados |
| Gestionar codigos | Multiples endpoints | Crear, listar y administrar codigos de voucher |
| Consultar programas | GET endpoints | Listar y consultar programas activos |

### Scopes de Autenticacion

| Scope | Grant Type | Uso |
|-------|-----------|-----|
| `organizations.voucher_programs` | Client Credentials | Integracion directa |
| `organizations.voucher_programs.delegated` | Authorization Code | Acceso delegado |
| `organizations.voucher_programs.aggregator` | Client Credentials | Terceros/agregadores |

### Como Funcionan los Vouchers

1. Creador define parametros (monto, vigencia, productos elegibles)
2. Receptor redime en la app Uber (se aplica automaticamente como metodo de pago)
3. Si el costo excede el voucher, el usuario paga la diferencia
4. El creador solo paga la porcion utilizada antes de la expiracion

---

## SKILL 5: Uber Health API — Transporte Medico (HIPAA)

**Producto:** Uber Health
**Documentacion:** https://developer.uber.com/docs/health/introduction
**Compliance:** HIPAA

### Capacidades

| Skill | Endpoint | Metodo | Descripcion |
|-------|----------|--------|-------------|
| Estimar viaje medico | `/v1/health/trips/estimates` | POST | Obtiene fare_id y estimacion. Si `fares_unavailable=true`, aun se puede crear viaje sin fare_id |
| Crear viaje medico | `/v1/health/trips` | POST | Programa transporte para pacientes/invitados |
| Obtener recibo | `/v1/health/trips/{trip_id}/receipt` | GET | Recibo detallado del viaje completado |

### Autenticacion

- **Scope:** `health`
- **Grant Type:** OAuth 2.0 Bearer Token

### Caracteristicas

- Pacientes **no requieren** cuenta Uber
- Alternativa programatica al dashboard Uber Health
- Acceso a todos los viajes de la organizacion sin tokens individuales
- Solo retorna viajes designados como oficiales (no viajes personales)

### Sandbox

- Usa "runs" para crear viajes de prueba con riders/drivers temporales
- Datos temporales desaparecen tras 8 horas
- Pickup y dropoff deben estar en ciudades donde Uber opera

---

## SKILL 6: Uber Eats Marketplace API — Restaurantes y Pedidos

**Producto:** Uber Eats Marketplace
**Documentacion:** https://developer.uber.com/docs/eats/introduction
**Change Log:** https://developer.uber.com/docs/eats/api-change-log

### Capacidades de Menu

| Skill | Endpoint | Descripcion |
|-------|----------|-------------|
| Crear/actualizar menu | Menu API endpoints | Gestionar menu completo del restaurante |
| Actualizar items | `POST /menus/items` | Marcar items como agotados/disponibles, actualizar precios |
| Recomendaciones de reemplazo | Endpoint ML | Hasta 7 recomendaciones de alta confianza para items agotados |

### Estructura del Menu

```
Menu
├── Category (ej: "Entradas", "Platos Principales")
│   ├── Item (ej: "Pizza Margherita")
│   │   ├── Modifier Group (ej: "Toppings de Pizza")
│   │   │   ├── Item (ej: "Champiñones")
│   │   │   └── Item (ej: "Pimientos")
```

### Capacidades de Store

| Skill | Endpoint | Descripcion |
|-------|----------|-------------|
| Estado de tienda | `POST /status` | Poner tienda online/offline (paused) |
| Horarios especiales | `POST /holiday_hours` | Configurar horarios de feriados |
| Consultar horarios | `GET /holiday_hours` | Obtener horarios especiales |
| Detalles de tienda | `GET /eats/stores/{store_id}` | Informacion completa de la tienda |
| Datos de integracion | `GET /eats/stores/{store_id}/pos_data` | Detalles de integracion POS |

### Capacidades de Ordenes

| Skill | Endpoint | Metodo | Descripcion |
|-------|----------|--------|-------------|
| Aceptar orden | `/eats/orders/{order_id}/accept_pos_order` | POST | Aceptar orden entrante |
| Rechazar orden | `/eats/orders/{order_id}/deny_pos_order` | POST | Rechazar orden entrante |

### Webhooks Uber Eats

- Ordenes entrantes
- Notificaciones de tienda
- Cancelaciones de ordenes
- Firma: `X-Uber-Signature` (HMAC SHA256 con client secret)

### Flujo de Ordenes

```
1. Cliente pide en Uber Eats
2. Uber envia webhook a tu sistema
3. Tu sistema ACK el webhook
4. POST /accept_pos_order o /deny_pos_order (dentro de 11.5 min o auto-cancela)
5. Preparar pedido → fulfillment
```

### Tipos de Integracion

| Tipo | Tiempo | Alcance |
|------|--------|---------|
| Full POS Integration | 4-8 semanas | Sync en tiempo real, ordenes, promociones, BYOC delivery |
| Enterprise Reporting | 2-4 semanas | Analytics, reportes de transacciones, metricas |

---

## SKILL 7: Uber Driver API — Datos de Conductores

**Producto:** Driver API
**Documentacion:** https://developer.uber.com/docs/drivers/introduction
**API Reference:** https://developer.uber.com/docs/drivers/references/api
**Version:** v1.2
**Acceso:** Restringido (requiere aplicacion)

### Capacidades

| Skill | Endpoint | Metodo | Descripcion |
|-------|----------|--------|-------------|
| Perfil del conductor | `/v1.2/partners/me` | GET | Info de contacto, foto, rating, cantidad de viajes, estado |
| Ganancias | `/v1.2/partners/payments` | GET | Desglose de ingresos, peajes, impuestos |
| Viajes | Trip endpoints | GET | Actividad: ciudad, tarifa, distancia, duracion por viaje |

### Parametros de Consulta

- `from_time` y `to_time`: filtros opcionales para pagos y viajes

---

## SKILL 8: Uber Vehicles/Fleet API — Gestion de Flotas

**Producto:** Fleet Management
**Documentacion:** https://developer.uber.com/docs/vehicles/references/api/v2/supplier-performance-data/get-vehicles-information

### Capacidades

| Skill | Endpoint | Metodo | Descripcion |
|-------|----------|--------|-------------|
| Info de vehiculos (Flotas) | `/v2/vehicle-suppliers/vehicles` | GET | Modelo, registro, estado, placa, color, marca, ano |
| Info de conductores (Flotas) | `/v1/vehicle-suppliers/drivers` | GET | Perfiles, contacto, UUID encriptado y raw |
| Buscar vehiculos (Rentals) | `/v1/vehicle-suppliers/vehicles/search` | POST | Busqueda por VIN o placa (frescura <2 min) |
| Vehiculos por propietario | `/v1/vehicle-suppliers/vehicles` | GET | Todos los vehiculos de un owner con compliance |
| Pagos de conductores | `/v1/vehicle-suppliers/driver-payments` | GET | Pagos ultimas 24h: earnings, net fare, desglose |

### Flujo de Consulta de Flota

```
1. GET Organizations API (con Fleet Supplier ID) → obtiene org IDs encriptados
2. GET /v2/vehicle-suppliers/vehicles (con org ID) → detalles de vehiculos
```

### Rate Limits

- 100,000 requests/hora por Developer Application
- Paginacion via `page_token` y `page_size`

---

## SKILL 9: Uber Transit API — Transporte Publico

**Producto:** Uber Transit
**Documentacion:** https://www.uber.com/us/en/transitapi/

### Capacidades

| Skill | Descripcion |
|-------|-------------|
| Planificacion de rutas multimodal | Combina Uber + transporte publico para rutas optimas |
| First-mile/Last-mile | Conecta estaciones de transporte con origenes/destinos |
| Microtransito on-demand | Servicios de transporte subsidiados bajo demanda |
| Ticketing integrado | Compra de boletos de transporte publico en la app Uber |
| Informacion en tiempo real | Horarios, conexiones, precios y tiempos de llegada |

### Casos de Uso

- Agencias de transito disenan programas subsidiados de transporte on-demand
- Call centers coordinan viajes Uber para pasajeros
- Apps custom integran features de la plataforma Uber
- Conectividad first-mile/last-mile (ej: Brightline, DART)

---

## SKILL 10: Autenticacion y Seguridad Transversal

### OAuth 2.0 Flows

| Flow | Uso | Descripcion |
|------|-----|-------------|
| Authorization Code | Rider/Driver context | Usuario autoriza app, se intercambia code por access token |
| Client Credentials | Server-to-server | Para APIs sin contexto de usuario (Business, Direct, Health) |

### Endpoints de Auth

```
Authorization: https://auth.uber.com/oauth/v2/authorize
Token:         https://auth.uber.com/oauth/v2/token
```

### Scopes Principales

| Scope | API |
|-------|-----|
| `guest.rides` | Guest Trips API |
| `health` | Health API |
| `organizations.voucher_programs` | Vouchers API |
| `organizations.voucher_programs.delegated` | Vouchers (delegado) |
| `organizations.voucher_programs.aggregator` | Vouchers (terceros) |

### Seguridad de Webhooks

- Header: `X-Uber-Signature`
- Algoritmo: HMAC SHA256
- Clave: Client Secret
- Formato: Hexadecimal en minusculas

---

## Mapeo de Skills Uber hacia Plataforma Buk

### Integraciones Potenciales Uber + Buk

| Skill Uber | Aplicacion en RRHH/Buk | Capa de Plataforma |
|------------|----------------------|---------------------|
| **Rides API** | Transporte corporativo de empleados, viajes a oficina | Layer 6 - Domain Enablement |
| **Uber for Business** | Gestion centralizada de movilidad corporativa | Layer 3 - IDP / Layer 6 |
| **Vouchers API** | Beneficio de movilidad para colaboradores (integracion con modulo Beneficios Buk) | Layer 6 - Domain Enablement |
| **Health API** | Traslado de empleados a citas medicas (integracion con Licencias Medicas) | Layer 6 - Domain Enablement |
| **Direct API** | Envio de documentos, equipos o materiales a colaboradores remotos | Layer 6 - Domain Enablement |
| **Receipts API** | Conciliacion automatica de gastos de transporte con liquidaciones Buk | Layer 5 - Data Platform |
| **Driver API** | Gestion de conductores corporativos en flotas de la empresa | Layer 8 - Platform Experience |
| **Fleet API** | Control de vehiculos corporativos asignados a empleados | Layer 1 - Infrastructure |
| **Eats Marketplace** | Beneficio de alimentacion para colaboradores via Uber Eats | Layer 6 - Domain Enablement |
| **Transit API** | Subsidio de transporte publico como beneficio laboral | Layer 6 - Domain Enablement |

### Flujos de Integracion Prioritarios

#### 1. Movilidad Corporativa (Rides + Business + Buk)
```
Buk Employee API → Uber Employee Provisioning → Viajes corporativos
                                                      ↓
Buk Liquidaciones ← Receipts API ← Conciliacion automatica
```

#### 2. Beneficios de Transporte (Vouchers + Buk)
```
Buk Beneficios → Crear Programa Vouchers → Distribuir a colaboradores
                                                ↓
                                    Redencion en app Uber
                                                ↓
Buk Reportes ← Consumo y facturacion ← Uber Billing
```

#### 3. Entregas a Colaboradores Remotos (Direct + Buk)
```
Buk Employee Address → Uber Direct Quote → Create Delivery
                                                ↓
                                    Tracking en tiempo real
                                                ↓
                              Confirmacion de entrega via webhook
```

#### 4. Salud Ocupacional (Health + Buk)
```
Buk Licencias Medicas → Uber Health Trip → Traslado HIPAA-compliant
                                                ↓
Buk Ausencias ← Registro automatico ← Trip completion webhook
```

---

## Referencias Tecnicas

- **Uber Developer Portal:** https://developer.uber.com
- **Documentacion General:** https://developer.uber.com/docs
- **Rides API:** https://developer.uber.com/products/ride-requests
- **Direct API:** https://developer.uber.com/docs/deliveries/overview
- **Eats API:** https://developer.uber.com/docs/eats/introduction
- **Business API:** https://developer.uber.com/docs/guest-rides/about/u4b-api-introduction
- **Vouchers API:** https://developer.uber.com/docs/vouchers/introduction
- **Health API:** https://developer.uber.com/docs/health/introduction
- **Driver API:** https://developer.uber.com/docs/drivers/introduction
- **Fleet API:** https://developer.uber.com/docs/vehicles/references/api/v2/supplier-performance-data/get-vehicles-information
- **Transit:** https://www.uber.com/us/en/transitapi/

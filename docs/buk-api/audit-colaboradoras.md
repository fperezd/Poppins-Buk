# Audit Módulo Colaboradoras — Cobertura Buk vs Supabase

**Fecha:** 2026-05-09
**Modelo arquitectónico:** D — Staffing legal con UX marketplace
**Scope:** Solo módulo Colaboradoras (`src/app/dashboard/colaboradoras/*`)
**Tenant Buk auditado:** `renearavena.buk.cl` (1 empresa, 5 empleados)

---

## TL;DR

- **Buk cubre el 100% de los datos laborales-legales** que el frontend ya muestra. No hay un campo de "datos duros" que el sistema necesite y Buk no exponga.
- **El frontend está a un 30% de aprovechar Buk:** consume 8 endpoints contra los ~25 viables. Faltan vacaciones reales, licencias, horas extra, documentos, balance, edición y baja.
- **La capa de "interacción Poppins" no existe todavía** — toda la lógica entre hogar y colaboradora (tareas, lista compras, mensajes, evaluaciones) es lo que va a Supabase.
- **Hay code smells graves** que bloquean avanzar: doble cliente Buk (legacy + moderno), base URL hardcodeada que ignora el `.env.local`, endpoints fantasma (`/absence_requests` que no existe en Buk oficial), `createAbsence` stubbeado.

---

## 1. Matriz de cobertura: UI ↔ Buk ↔ Supabase

Leyenda: ✅ Implementado · 🟡 Endpoint Buk existe pero NO consumido · ❌ No existe en Buk → Supabase · ⚠️ Bug / código legacy

### 1.1 Datos personales y contacto

| Campo UI | Endpoint Buk | Schema field | Estado |
|---|---|---|---|
| Nombre, Apellido, Nombre completo | `GET /employees`, `GET /employees/{id}` | `first_name`, `surname`, `second_surname`, `full_name` | ✅ |
| RUT (con validador chileno) | idem | `rut`, `document_number`, `document_type` | ✅ |
| Email laboral / personal | idem | `email`, `personal_email` | ✅ |
| Teléfono | idem | `phone_number` | 🟡 (existe en Buk, no se muestra) |
| Dirección | idem | `address`, `street`, `city`, `country` | 🟡 |
| Foto / avatar | idem | `picture_url` | 🟡 (UI genera iniciales en lugar de usar el campo real) |
| Iniciales y color | — | — | ❌ (derivado, no persistir) |

### 1.2 Datos contractuales y organizacionales

| Campo UI | Endpoint Buk | Schema field | Estado |
|---|---|---|---|
| Cargo | `GET /roles` + `jobs` del empleado | `position.name`, `roles.name` | ✅ |
| Departamento / Área (= empleador en modelo D) | `GET /areas`, `POST /areas` | `area_id` | 🟡 (existe, no se filtra UI por empleador) |
| Tipo de contrato | `jobs` del empleado | `contract_terms` (enum) | ✅ |
| Fecha de ingreso / término | idem | `start_date`, `end_date` | ✅ |
| Estado (activo, licencia, vacaciones, despido) | `GET /employees?status=` | `status`, `active`, `employment_status` | ✅ (lectura) / 🟡 (cambio de estado no implementado) |
| Horario semanal | `jobs` | (custom attribute) | 🟡 |
| Centro de costo | `GET /centro_costo_definitions` | `cost_center_id` | 🟡 |
| Sucursal / lugar de trabajo | `GET /locations`, `GET /piecework/places` | `location_id` | 🟡 |

### 1.3 Remuneración

| Campo UI | Endpoint Buk | Schema field | Estado |
|---|---|---|---|
| Sueldo base | `jobs` o `payroll_detail` | `base_salary` | ✅ |
| Horas extra (monto en perfil) | `GET /attendances/overtime` | `amount` | 🟡 SDK existe (`buk.attendances.overtime`), UI no lo usa |
| Bonos / Gratificación | `POST /assigns`, `GET /employees/{id}/assigns` | `assigns[].amount`, `item_id` | 🟡 |
| Colación / Movilización | idem (assigns) | idem | 🟡 |
| Días de vacaciones base | `GET /vacation_definitions` + `GET /vacations/balance` por empleado | balance | 🟡 endpoint existe, UI no lo consulta |

### 1.4 Previsión social

| Campo UI | Endpoint Buk | Schema field | Estado |
|---|---|---|---|
| AFP + descuento mensual | `GET /afps` (catálogo) + `payroll_detail` | `pension_savings`, `desc_afp` | ✅ (en liquidación) |
| Plan de salud (UF) | `GET /health_plans` (catálogo) + `payroll_detail` | `health_plan`, `desc_salud` | ✅ |
| Mutual | `payroll_detail` | mutual fields | 🟡 |
| Cesantía | `payroll_detail` | `desc_cesantia` | ✅ |
| Impuesto único | `payroll_detail` | `impuesto_unico` | ✅ |

### 1.5 Datos bancarios

| Campo UI | Endpoint Buk | Schema field | Estado |
|---|---|---|---|
| Banco, tipo cuenta, número | `POST /employees/{employee_id}/payment_data/{period_id}` | bank account info | 🟡 endpoint existe, UI no lo usa |

### 1.6 Familia (cargas)

| Campo UI | Endpoint Buk | Schema field | Estado |
|---|---|---|---|
| Cargas familiares | `PATCH /cargas/{id}` (+ via `/people/{id}` para listado) | `family_responsibilities[]` con `relation` | 🟡 endpoint existe, UI no lo usa |

### 1.7 Liquidaciones

| Campo UI | Endpoint Buk | Estado |
|---|---|---|
| Listado de liquidaciones del empleado | `GET /employees/{employee_id}/payroll_detail` | ✅ |
| Modal de detalle (haberes/descuentos/líquido) | idem | ✅ |
| PDF de liquidación | `GET /employees/{id}/statements/{year}-{month}.pdf` | 🟡 endpoint existe, UI no lo descarga |

### 1.8 Vacaciones, ausencias, permisos

| Operación | Endpoint Buk | Estado |
|---|---|---|
| Listar vacaciones por empleado | `GET /vacations?employee_id=` | ✅ (vía `/api/buk/absences` que mezcla todo) |
| Crear solicitud vacaciones | `POST /vacations` | 🟡 botón existe, mutation no dispara |
| Días hábiles entre fechas | `GET /vacations/business_days` | 🟡 |
| Saldo de vacaciones | `GET /vacations/balance` (proxy desde mappers) | 🟡 |
| Tipos de ausencia / permiso / licencia | `GET /absences/{absence,permission,licence}/types` | 🟡 (UI no carga catálogos dinámicos) |
| Crear ausencia | `POST /absences/absence` | ⚠️ función `createAbsence()` está stubbeada con mock success |
| Crear licencia médica | `POST /absences/licence` | 🟡 |
| Crear permiso | `POST /absences/permission` | 🟡 |
| Listado unificado de inasistencias | `GET /absences` | ✅ |

### 1.9 Beneficios y créditos

| Operación | Endpoint Buk | Estado |
|---|---|---|
| Listar beneficios disponibles | `GET /benefits/benefit_requests` (es solicitudes, no catálogo) | ⚠️ código legacy llama a `/benefits` que no existe en Swagger oficial |
| Crear solicitud beneficio | (no expuesto en API pública) | ❌ probable gap real, validar en plataforma Buk |
| Créditos del empleado | `GET /credits`, `POST /credits/create` | 🟡 |

### 1.10 Documentos

| Operación | Endpoint Buk | Estado |
|---|---|---|
| Listar docs del empleado | `GET /employees/{id}/docs` | 🟡 SDK existe (módulo `documents.ts`), UI no lo usa |
| Subir doc | `POST /employees/{id}/docs` | 🟡 |
| Firma digital | `POST /docs/{id}/signatures/process` | 🟡 |

### 1.11 Finiquitos / baja

| Operación | Endpoint Buk | Estado |
|---|---|---|
| Crear finiquito (con causal) | `POST /jobs/{id}/termination` | 🟡 UI no tiene botón "dar de baja" |
| Terminar / rehacer trabajo | `PATCH /jobs/{id}/terminate`, `POST /jobs/{id}/undo` | 🟡 |

---

## 2. Lo que NO cubre Buk → debe vivir en Supabase

Esto es lo que Manu pidió "identificar y guardar". Cualquier cosa que el negocio Poppins necesite y NO esté en la matriz anterior va acá.

### 2.1 Capa de interacción hogar↔colaboradora

| Concepto | Tabla Supabase propuesta | Nota |
|---|---|---|
| **Empleador funcional** (datos del hogar que Buk no guarda) | `empleadores` | RUT del titular, dirección de la casa, teléfonos del hogar, fecha de inicio del servicio, plan contratado, FK `buk_area_id` |
| **Asignación colaboradora ↔ empleador** (con histórico) | `asignaciones` | quién trabaja en qué casa y desde cuándo. FK a `buk_employee_id` y a `empleadores.id` |
| **Tareas del día/semana** | `tareas`, `tareas_recurrentes` | el hogar asigna, la colaboradora marca completado |
| **Lista de compras compartida** | `listas_compras`, `items_lista` | colaborativa, con estado y monto pagado |
| **Mensajería privada hogar↔colaboradora** | `conversaciones`, `mensajes` | con read receipts |
| **Notificaciones in-app** | `notificaciones` | uso interno de la app |
| **Solicitudes médicas privadas** (NO licencia formal) | `solicitudes_salud` | aviso "no me siento bien hoy", distinto de licencia médica formal Buk |
| **Evaluaciones de servicio** | `evaluaciones` | hogar evalúa colaboradora y viceversa, con notas privadas |
| **Check-in / check-out con foto y geo** | `jornadas` | solo si Poppins quiere validar presencia más allá del control horario Buk |
| **Documentos privados Poppins** (NO oficiales) | `archivos_poppins` | fotos del hogar, instrucciones, llaves, códigos. Distinto del repositorio Buk |
| **Notas privadas del hogar sobre la colaboradora** | `notas_empleador` | preferencias, alergias, recordatorios |
| **Preferencias de contacto / disponibilidad extendida** | `preferencias_colaboradora` | horarios preferidos, canales (WhatsApp, push, email) |
| **Auditoria de la app** | `audit_log` | qué usuario hizo qué acción cuándo |

### 2.2 Catálogos cacheados desde Buk (lectura periódica)

Para evitar latencia y sobre-consumo de la API Buk, cachear en Supabase con sync periódico:

| Tabla cache | Origen Buk | Frecuencia sync |
|---|---|---|
| `cache_areas` | `GET /areas` | Diario o on-demand |
| `cache_afps` | `GET /afps` | Mensual |
| `cache_health_plans` | `GET /health_plans` | Mensual |
| `cache_absence_types` | `GET /absences/{absence,permission,licence}/types` | Mensual |
| `cache_roles` | `GET /roles` | Diario |
| `cache_locations` | `GET /locations` | Mensual |

---

## 3. Schema Supabase preliminar

```sql
-- ================================
-- DOMINIO 1: Empleadores (hogares)
-- ================================
create table empleadores (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null unique,        -- FK a Buk Area
  nombre_titular text not null,
  rut_titular text not null,
  email_titular text,
  telefono_titular text,
  direccion text,
  comuna text,
  ciudad text,
  fecha_inicio_servicio date not null,
  fecha_fin_servicio date,
  plan_contratado text,                        -- 'medio_dia', 'jornada_completa', 'puertas_adentro'
  estado text not null default 'activo',       -- 'activo', 'pausado', 'cancelado'
  notas_internas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================
-- DOMINIO 2: Asignaciones (histórico)
-- =====================================
create table asignaciones (
  id uuid primary key default gen_random_uuid(),
  buk_employee_id integer not null,            -- FK a Buk Empleado
  empleador_id uuid not null references empleadores(id),
  fecha_inicio date not null,
  fecha_fin date,
  modalidad text not null,                     -- 'titular', 'reemplazo', 'extra'
  estado text not null default 'activa',
  created_at timestamptz default now()
);
create index idx_asignaciones_empleado on asignaciones(buk_employee_id);
create index idx_asignaciones_empleador on asignaciones(empleador_id);

-- ================================
-- DOMINIO 3: Tareas
-- ================================
create table tareas (
  id uuid primary key default gen_random_uuid(),
  empleador_id uuid not null references empleadores(id),
  buk_employee_id integer not null,
  titulo text not null,
  descripcion text,
  prioridad text default 'media',
  fecha_para date,
  hora_para time,
  estado text default 'pendiente',             -- 'pendiente', 'en_curso', 'completada', 'cancelada'
  completada_at timestamptz,
  created_by uuid not null,                    -- auth.uid del que creó
  created_at timestamptz default now()
);

create table tareas_recurrentes (
  id uuid primary key default gen_random_uuid(),
  empleador_id uuid not null references empleadores(id),
  buk_employee_id integer not null,
  titulo text not null,
  descripcion text,
  recurrencia text not null,                   -- 'diaria', 'semanal', 'mensual'
  dias_semana int[],                           -- [1,3,5] = lun/mié/vie
  hora time,
  activa boolean default true,
  created_at timestamptz default now()
);

-- ================================
-- DOMINIO 4: Lista de compras
-- ================================
create table listas_compras (
  id uuid primary key default gen_random_uuid(),
  empleador_id uuid not null references empleadores(id),
  nombre text not null default 'Lista de compras',
  estado text default 'abierta',
  fecha_compra date,
  monto_total numeric(10,2),
  created_at timestamptz default now()
);

create table items_lista (
  id uuid primary key default gen_random_uuid(),
  lista_id uuid not null references listas_compras(id) on delete cascade,
  producto text not null,
  cantidad text,
  agregado_por uuid not null,                  -- auth.uid
  comprado boolean default false,
  precio_pagado numeric(10,2),
  comentario text,
  created_at timestamptz default now()
);

-- ================================
-- DOMINIO 5: Mensajería
-- ================================
create table conversaciones (
  id uuid primary key default gen_random_uuid(),
  empleador_id uuid not null references empleadores(id),
  buk_employee_id integer not null,
  ultimo_mensaje_at timestamptz,
  created_at timestamptz default now(),
  unique(empleador_id, buk_employee_id)
);

create table mensajes (
  id uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references conversaciones(id) on delete cascade,
  emisor_uid uuid not null,                    -- auth.uid
  emisor_tipo text not null,                   -- 'empleador' | 'colaboradora'
  contenido text not null,
  adjunto_url text,
  leido_at timestamptz,
  created_at timestamptz default now()
);

-- ================================
-- DOMINIO 6: Solicitudes de salud (no formales)
-- ================================
create table solicitudes_salud (
  id uuid primary key default gen_random_uuid(),
  buk_employee_id integer not null,
  empleador_id uuid not null references empleadores(id),
  tipo text not null,                          -- 'malestar', 'retraso', 'salida_temprana'
  descripcion text,
  fecha date not null,
  derivada_a_licencia_buk boolean default false,
  buk_licence_id integer,                      -- si terminó siendo licencia formal
  created_at timestamptz default now()
);

-- ================================
-- DOMINIO 7: Evaluaciones
-- ================================
create table evaluaciones (
  id uuid primary key default gen_random_uuid(),
  empleador_id uuid not null references empleadores(id),
  buk_employee_id integer not null,
  evaluador_tipo text not null,                -- 'empleador' | 'colaboradora'
  puntaje int check (puntaje between 1 and 5),
  comentario text,
  created_at timestamptz default now()
);

-- ================================
-- DOMINIO 8: Caché desde Buk
-- ================================
create table cache_areas (
  buk_area_id integer primary key,
  nombre text not null,
  raw_json jsonb not null,
  synced_at timestamptz default now()
);

-- (idem cache_afps, cache_health_plans, cache_absence_types, cache_roles, cache_locations)

-- ================================
-- RLS (Row Level Security) — todos los empleadores ven solo lo suyo
-- ================================
alter table empleadores enable row level security;
alter table asignaciones enable row level security;
alter table tareas enable row level security;
alter table listas_compras enable row level security;
alter table items_lista enable row level security;
alter table conversaciones enable row level security;
alter table mensajes enable row level security;
alter table solicitudes_salud enable row level security;
alter table evaluaciones enable row level security;
-- (políticas a definir según el modelo de auth: auth.uid() = empleador titular o colaboradora asignada)
```

---

## 4. Bugs y deuda técnica detectada (bloquean avanzar)

| # | Severidad | Issue | Acción |
|---|---|---|---|
| 1 | 🔴 Alta | Doble cliente Buk: `src/lib/buk-sdk/` (moderno) y `src/lib/buk/` (legacy) coexisten. El segundo tiene endpoints que no existen en el Swagger oficial (`/absence_requests`, `/benefits`). | Eliminar `src/lib/buk/client.ts` legacy. Migrar mappers y mock-data al SDK moderno. |
| 2 | 🔴 Alta | Base URL hardcodeada en `buk-sdk/client.ts` apunta a `https://app.buk.cl` ignorando el env `BUK_API_BASE_URL`. Eso significa que con la nueva configuración (`renearavena.buk.cl`) el SDK NO está apuntando al tenant correcto. | Leer `process.env.BUK_API_BASE_URL` en el cliente con fallback a `app.buk.cl`. |
| 3 | 🔴 Alta | `createAbsence()` en `src/lib/buk/index.ts` está stubbeado con mock success. La UI ya tiene botón "+ Nueva Solicitud" en vacaciones que aparenta funcionar pero no escribe nada. | Implementar contra `POST /vacations` o `POST /absences/{type}` real según el caso. |
| 4 | 🟡 Media | UI no permite editar colaboradora (PUT) ni darla de baja (POST `/jobs/{id}/termination`). | Añadir flujos. |
| 5 | 🟡 Media | UI no carga catálogos dinámicos desde Buk (tipos de ausencia, AFPs, salud, áreas). Forms con valores fijos. | Implementar caché Supabase + cargas iniciales. |
| 6 | 🟡 Media | Avatar genera "iniciales + color" en código en lugar de usar `picture_url` de Buk. | Priorizar `picture_url`, dejar iniciales como fallback. |
| 7 | 🟢 Baja | Mocks `mock-data.ts` mantienen campos no estándar (`puertasAdentro`, `iniciales`, `color`, `empleador` como string). | Refactor o eliminar tras migrar a Buk real. |

---

## 5. Plan de implementación priorizado

### Fase 0 — Desbloquear (1-2 días)

1. **Arreglar base URL del SDK** (issue #2). Sin esto, nada apunta al tenant correcto.
2. **Eliminar capa legacy `src/lib/buk/`** (issue #1) o consolidar en SDK moderno.
3. **Implementar `createAbsence` real** (issue #3) — cierra una mentira de la UI.

### Fase 1 — Migrar al SDK real (3-5 días)

4. Reemplazar todo `mock-data.ts` por llamadas reales a Buk en endpoints `/api/buk/*`.
5. Conectar formulario de "Nueva Colaboradora" a `POST /employees` real (validando RUT contra `findByRut` antes).
6. Implementar listado de **Áreas Buk** y filtro "Empleador" en la tabla de colaboradoras.
7. Implementar `useVacationBalance` real (`GET /vacations/balance`) y mostrar en perfil.
8. Implementar descarga de PDF de liquidación.

### Fase 2 — Schema Supabase (2-3 días)

9. Crear migración inicial Supabase con las tablas de la sección 3 (empleadores, asignaciones, cache_areas como mínimo).
10. RLS policies básicas + endpoint de sync `cache_areas` desde Buk.
11. Crear página `/dashboard/empleadores` para gestionar hogares (CRUD sobre tabla `empleadores` + crear Area Buk al mismo tiempo).

### Fase 3 — Capa de interacción (5-10 días)

12. Tareas (lista + form + completar + recurrentes).
13. Lista de compras compartida.
14. Mensajería con Supabase Realtime.
15. Solicitudes de salud (con flag de "convertir en licencia Buk").
16. Evaluaciones.

### Fase 4 — Cierre laboral (3-5 días)

17. Editar colaboradora (PUT `/employees/{id}`).
18. Dar de baja con flujo `POST /jobs/{id}/termination` + causal.
19. Asignar/cambiar empleador (mover entre Areas Buk + actualizar `asignaciones` Supabase con histórico).
20. Beneficios y créditos (validar primero qué hay realmente vía API Buk).

---

## 6. Decisiones pendientes que deben tomarse antes de Fase 2

- **Auth Supabase:** ¿quién accede a la app? ¿Solo Manu/admin (entonces RLS es trivial), o cada empleador y cada colaboradora tienen su propio login (entonces RLS es crítico)?
- **Estructura de "plan_contratado":** ¿es enum cerrado (`medio_dia`, `jornada_completa`, `puertas_adentro`) o tabla aparte con tarifas?
- **Multi-empleador por colaboradora:** ¿una colaboradora puede trabajar en N hogares en paralelo, o es 1:1 en cada momento? (afecta uniqueness de `asignaciones`)
- **Beneficios:** ¿se gestionan vía Buk (validar qué endpoints reales hay) o se construyen 100% en Supabase?
- **Mensajería:** ¿Supabase Realtime o WhatsApp Business API? El target del usuario hogar puede preferir WhatsApp.

---

## 7. Anexo — Endpoints Buk relevantes consolidados

Lista plana de endpoints útiles para el módulo (referencia rápida). Path completo con base `https://renearavena.buk.cl/api/v1/chile`:

```
# Colaboradoras
GET    /employees
GET    /employees/active
GET    /employees/{id}
POST   /employees
PUT    /employees/{id}
POST   /employees/{id}/clone

# Empleadores (Areas)
GET    /areas
GET    /areas/{id}
GET    /organization/areas/
POST   /organization/areas/
PATCH  /organization/areas/{id}

# Cargas familiares
PATCH  /cargas/{id}

# Documentos
GET    /employees/{id}/docs
POST   /employees/{id}/docs
GET    /employees/{id}/docs/{file_id}
POST   /docs/{id}/signatures/process

# Asignaciones (bonos/items)
POST   /assigns
PATCH  /assigns/{id}
DELETE /assigns/{id}
POST   /assigns/{id}/terminate
GET    /employees/{id}/assigns

# Datos de pago
POST   /employees/{employee_id}/payment_data/{period_id}

# Vacaciones
GET    /vacations
POST   /vacations
DELETE /vacations
GET    /vacations/{id}
GET    /vacations/business_days
GET    /vacation_definitions

# Ausencias / licencias / permisos
GET    /absences
GET    /absences/absence/types
GET    /absences/absence
POST   /absences/absence
GET    /absences/licence/types
GET    /absences/licence
POST   /absences/licence
GET    /absences/permission/types
GET    /absences/permission
POST   /absences/permission

# Horas extras / no trabajadas
GET    /attendances/overtime
POST   /attendances/overtime
GET    /attendances/overtime/types
GET    /attendances/non-worked-hours
POST   /attendances/non-worked-hours

# Liquidaciones
GET    /payroll_detail/month
GET    /employees/{employee_id}/payroll_detail
GET    /employees/{id}/statements/{year}-{month}.pdf

# Beneficios y créditos
GET    /benefits/benefit_requests
GET    /benefits/benefit_requests/{id}
GET    /credits
POST   /credits
GET    /credits/{id}

# Catálogos
GET    /roles
GET    /role_families
GET    /locations
GET    /companies
GET    /process_periods

# Finiquitos / cambios de trabajo
GET    /jobs/{id}/termination
POST   /jobs/{id}/termination
PATCH  /jobs/{id}/terminate
POST   /jobs/{id}/undo
```

---

**Próximo paso sugerido:** atacar Fase 0 (desbloquear). Con los 3 bugs críticos resueltos, el módulo Colaboradoras ya estaría llamando a Buk real y podemos iterar el resto sobre datos vivos.

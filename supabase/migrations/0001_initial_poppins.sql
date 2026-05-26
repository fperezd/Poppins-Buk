-- ================================================================
-- Poppins-Buk — Migración inicial (2026-05-09)
--
-- Crea el schema Supabase para la capa de interacción Poppins.
-- Buk es source-of-truth para todo dato laboral-legal.
-- Esta migración cubre:
--   - user_profiles: vínculo auth.users ↔ buk_employee_id + rol
--   - asignaciones: histórico colaboradora ↔ hogar
--   - tareas / tareas_recurrentes: hogar asigna a colaboradora
--   - listas_compras / items_lista: lista colaborativa
--   - conversaciones / mensajes: chat hogar↔colaboradora
--   - solicitudes_salud: avisos no formales (distinto de licencia Buk)
--   - evaluaciones: rating bidireccional
--   - cache_areas / cache_roles / cache_absence_types: caché Buk
--   - audit_log: trazabilidad
--
-- Modelo D:
--   - Empleador = Buk Empleado con cargo "Jefe de Área", sueldo $1
--   - Cada hogar = Buk Area
--   - Colaboradora = Buk Empleado real asignada a un Area
-- ================================================================

-- ============================================================
-- Extensiones
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================
create type rol_poppins as enum ('admin', 'empleador', 'colaboradora');
create type modalidad_asignacion as enum ('titular', 'reemplazo', 'extra');
create type estado_tarea as enum ('pendiente', 'en_curso', 'completada', 'cancelada');
create type prioridad_tarea as enum ('baja', 'media', 'alta', 'urgente');
create type recurrencia_tipo as enum ('diaria', 'semanal', 'mensual');
create type estado_lista as enum ('abierta', 'cerrada', 'cancelada');
create type tipo_solicitud_salud as enum ('malestar', 'retraso', 'salida_temprana', 'consulta_medica');

-- ============================================================
-- DOMINIO 0: Perfiles de usuario (vínculo Supabase Auth ↔ Buk)
-- ============================================================
create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rol rol_poppins not null,
  -- Para empleador y colaboradora: ID del empleado en Buk
  buk_employee_id integer,
  -- Para empleador: ID de su Area Buk (su hogar)
  -- Para colaboradora: ID del Area Buk donde trabaja actualmente
  buk_area_id integer,
  nombre text,
  email text,
  telefono text,
  activo boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_user_profiles_rol on user_profiles(rol);
create index idx_user_profiles_buk_employee on user_profiles(buk_employee_id);
create index idx_user_profiles_buk_area on user_profiles(buk_area_id);

-- Función helper: scope del usuario actual
create or replace function get_user_scope()
returns table (
  user_id uuid,
  rol rol_poppins,
  buk_employee_id integer,
  buk_area_id integer
) language sql security definer as $$
  select user_id, rol, buk_employee_id, buk_area_id
  from user_profiles
  where user_id = auth.uid();
$$;

-- Función helper: bool si el user es admin
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists(
    select 1 from user_profiles where user_id = auth.uid() and rol = 'admin'
  );
$$;

-- Función helper: bool si el user puede ver un area dada
create or replace function can_access_area(area_id integer)
returns boolean language sql security definer as $$
  select exists(
    select 1 from user_profiles
    where user_id = auth.uid()
      and (rol = 'admin' or buk_area_id = area_id)
  );
$$;

-- ============================================================
-- DOMINIO 1: Asignaciones (histórico)
-- ============================================================
create table asignaciones (
  id uuid primary key default gen_random_uuid(),
  buk_employee_id integer not null,
  buk_area_id integer not null,
  fecha_inicio date not null,
  fecha_fin date,
  modalidad modalidad_asignacion not null default 'titular',
  observaciones text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index idx_asignaciones_empleado on asignaciones(buk_employee_id);
create index idx_asignaciones_area on asignaciones(buk_area_id);
create index idx_asignaciones_activas on asignaciones(buk_employee_id) where fecha_fin is null;

-- ============================================================
-- DOMINIO 2: Tareas
-- ============================================================
create table tareas (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null,
  buk_employee_id integer not null,         -- a quién está asignada
  titulo text not null,
  descripcion text,
  prioridad prioridad_tarea default 'media',
  fecha_para date,
  hora_para time,
  estado estado_tarea default 'pendiente',
  completada_at timestamptz,
  completada_por uuid references auth.users(id),
  created_by uuid references auth.users(id) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_tareas_area on tareas(buk_area_id);
create index idx_tareas_empleado on tareas(buk_employee_id);
create index idx_tareas_estado on tareas(estado);

create table tareas_recurrentes (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null,
  buk_employee_id integer not null,
  titulo text not null,
  descripcion text,
  recurrencia recurrencia_tipo not null,
  dias_semana int[],                         -- 1=lun, 7=dom; null si recurrencia != semanal
  dia_mes int,                               -- 1-31; null si recurrencia != mensual
  hora time,
  activa boolean default true,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz not null default now()
);
create index idx_tareas_recurrentes_area on tareas_recurrentes(buk_area_id);

-- ============================================================
-- DOMINIO 3: Lista de compras
-- ============================================================
create table listas_compras (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null,
  nombre text not null default 'Lista de compras',
  estado estado_lista default 'abierta',
  fecha_compra date,
  monto_total numeric(10,2),
  created_by uuid references auth.users(id) not null,
  created_at timestamptz not null default now()
);
create index idx_listas_area on listas_compras(buk_area_id);

create table items_lista (
  id uuid primary key default gen_random_uuid(),
  lista_id uuid not null references listas_compras(id) on delete cascade,
  producto text not null,
  cantidad text,
  comprado boolean default false,
  precio_pagado numeric(10,2),
  comentario text,
  agregado_por uuid references auth.users(id),
  comprado_por uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index idx_items_lista on items_lista(lista_id);

-- ============================================================
-- DOMINIO 4: Mensajería
-- ============================================================
create table conversaciones (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null,
  buk_employee_id integer not null,
  ultimo_mensaje_at timestamptz,
  created_at timestamptz not null default now(),
  unique(buk_area_id, buk_employee_id)
);
create index idx_conversaciones_area on conversaciones(buk_area_id);
create index idx_conversaciones_empleado on conversaciones(buk_employee_id);

create table mensajes (
  id uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references conversaciones(id) on delete cascade,
  emisor_uid uuid not null references auth.users(id),
  emisor_rol rol_poppins not null,
  contenido text not null,
  adjunto_url text,
  leido_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_mensajes_conversacion on mensajes(conversacion_id);

-- ============================================================
-- DOMINIO 5: Solicitudes de salud (no formales — distinto de licencia Buk)
-- ============================================================
create table solicitudes_salud (
  id uuid primary key default gen_random_uuid(),
  buk_employee_id integer not null,
  buk_area_id integer not null,
  tipo tipo_solicitud_salud not null,
  descripcion text,
  fecha date not null,
  derivada_a_licencia_buk boolean default false,
  buk_licence_id integer,                    -- si terminó en licencia Buk formal
  created_at timestamptz not null default now()
);
create index idx_solicitudes_salud_empleado on solicitudes_salud(buk_employee_id);
create index idx_solicitudes_salud_area on solicitudes_salud(buk_area_id);

-- ============================================================
-- DOMINIO 6: Evaluaciones
-- ============================================================
create table evaluaciones (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null,
  buk_employee_id integer not null,
  evaluador_uid uuid references auth.users(id),
  evaluador_rol rol_poppins not null,
  puntaje int not null check (puntaje between 1 and 5),
  comentario text,
  created_at timestamptz not null default now()
);
create index idx_evaluaciones_empleado on evaluaciones(buk_employee_id);
create index idx_evaluaciones_area on evaluaciones(buk_area_id);

-- ============================================================
-- DOMINIO 7: Caché desde Buk (refresco periódico)
-- ============================================================
create table cache_areas (
  buk_area_id integer primary key,
  nombre text not null,
  raw_json jsonb not null,
  synced_at timestamptz not null default now()
);

create table cache_roles (
  buk_role_id integer primary key,
  nombre text not null,
  es_jefe_area boolean default false,
  raw_json jsonb not null,
  synced_at timestamptz not null default now()
);

create table cache_absence_types (
  buk_type_id integer primary key,
  kind text not null,                        -- ausencia/licencia/permiso
  nombre text not null,
  raw_json jsonb not null,
  synced_at timestamptz not null default now()
);

-- ============================================================
-- DOMINIO 8: Audit log
-- ============================================================
create table audit_log (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  action text not null,                      -- ej: 'create_colaboradora', 'asignar_hogar'
  resource_type text,                        -- ej: 'colaboradora', 'tarea'
  resource_id text,                          -- ID del recurso afectado (string para flexibilidad)
  meta jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_user on audit_log(user_id);
create index idx_audit_action on audit_log(action);
create index idx_audit_created on audit_log(created_at desc);

-- ============================================================
-- updated_at trigger genérico
-- ============================================================
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_profiles_updated_at
  before update on user_profiles
  for each row execute function set_updated_at();

create trigger trg_tareas_updated_at
  before update on tareas
  for each row execute function set_updated_at();

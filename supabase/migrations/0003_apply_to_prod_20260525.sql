-- ================================================================
-- Poppins-Buk — Apply to prod (2026-05-25)
--
-- Script combinado, idempotente, listo para Supabase SQL Editor.
--
-- Hace 3 cosas en orden:
--   1. Renombra a `legacy_<nombre>_20260525` cualquier tabla/tipo enum
--      del schema public que colisione con las nuevas definiciones.
--      Esto preserva data anterior por si la necesitas.
--   2. Aplica 0001_initial_poppins.sql (schema base).
--   3. Aplica 0002_rls_policies.sql (RLS).
--
-- Seguro de re-ejecutar: si las tablas nuevas ya existen, primero las
-- renombrará a legacy_*_20260525_<segundo timestamp> y volverá a crearlas.
-- Si ya existen tablas legacy_*_20260525, no las toca.
-- ================================================================

-- ============================================================
-- PASO 1 — Rename de tablas colisionantes
-- ============================================================
do $$
declare
  ts text := '20260525';
  tbl text;
  new_name text;
  tbls text[] := array[
    'user_profiles',
    'asignaciones',
    'tareas',
    'tareas_recurrentes',
    'listas_compras',
    'items_lista',
    'conversaciones',
    'mensajes',
    'solicitudes_salud',
    'evaluaciones',
    'cache_areas',
    'cache_roles',
    'cache_absence_types',
    'audit_log'
  ];
begin
  foreach tbl in array tbls loop
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = tbl
    ) then
      new_name := 'legacy_' || tbl || '_' || ts;
      -- Si ya existe ese legacy, agregar sufijo con hora
      if exists (
        select 1 from information_schema.tables
        where table_schema = 'public' and table_name = new_name
      ) then
        new_name := new_name || '_' || to_char(now(), 'HH24MISS');
      end if;
      execute format('alter table public.%I rename to %I', tbl, new_name);
      raise notice 'Renamed table public.% -> public.%', tbl, new_name;
    end if;
  end loop;
end $$;

-- ============================================================
-- PASO 2 — Rename de tipos enum colisionantes
-- ============================================================
do $$
declare
  ts text := '20260525';
  ty text;
  new_name text;
  tys text[] := array[
    'rol_poppins',
    'modalidad_asignacion',
    'estado_tarea',
    'prioridad_tarea',
    'recurrencia_tipo',
    'estado_lista',
    'tipo_solicitud_salud'
  ];
begin
  foreach ty in array tys loop
    if exists (
      select 1 from pg_type t
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typname = ty
    ) then
      new_name := 'legacy_' || ty || '_' || ts;
      if exists (
        select 1 from pg_type t
        join pg_namespace n on n.oid = t.typnamespace
        where n.nspname = 'public' and t.typname = new_name
      ) then
        new_name := new_name || '_' || to_char(now(), 'HH24MISS');
      end if;
      execute format('alter type public.%I rename to %I', ty, new_name);
      raise notice 'Renamed type public.% -> public.%', ty, new_name;
    end if;
  end loop;
end $$;

-- ============================================================
-- PASO 3 — Aplicar 0001_initial_poppins.sql
-- ============================================================

-- Extensiones
create extension if not exists "pgcrypto";

-- Enums
create type rol_poppins as enum ('admin', 'empleador', 'colaboradora');
create type modalidad_asignacion as enum ('titular', 'reemplazo', 'extra');
create type estado_tarea as enum ('pendiente', 'en_curso', 'completada', 'cancelada');
create type prioridad_tarea as enum ('baja', 'media', 'alta', 'urgente');
create type recurrencia_tipo as enum ('diaria', 'semanal', 'mensual');
create type estado_lista as enum ('abierta', 'cerrada', 'cancelada');
create type tipo_solicitud_salud as enum ('malestar', 'retraso', 'salida_temprana', 'consulta_medica');

-- DOMINIO 0: Perfiles de usuario
create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rol rol_poppins not null,
  buk_employee_id integer,
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

create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists(
    select 1 from user_profiles where user_id = auth.uid() and rol = 'admin'
  );
$$;

create or replace function can_access_area(area_id integer)
returns boolean language sql security definer as $$
  select exists(
    select 1 from user_profiles
    where user_id = auth.uid()
      and (rol = 'admin' or buk_area_id = area_id)
  );
$$;

-- DOMINIO 1: Asignaciones
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

-- DOMINIO 2: Tareas
create table tareas (
  id uuid primary key default gen_random_uuid(),
  buk_area_id integer not null,
  buk_employee_id integer not null,
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
  dias_semana int[],
  dia_mes int,
  hora time,
  activa boolean default true,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz not null default now()
);
create index idx_tareas_recurrentes_area on tareas_recurrentes(buk_area_id);

-- DOMINIO 3: Lista de compras
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

-- DOMINIO 4: Mensajería
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

-- DOMINIO 5: Solicitudes de salud
create table solicitudes_salud (
  id uuid primary key default gen_random_uuid(),
  buk_employee_id integer not null,
  buk_area_id integer not null,
  tipo tipo_solicitud_salud not null,
  descripcion text,
  fecha date not null,
  derivada_a_licencia_buk boolean default false,
  buk_licence_id integer,
  created_at timestamptz not null default now()
);
create index idx_solicitudes_salud_empleado on solicitudes_salud(buk_employee_id);
create index idx_solicitudes_salud_area on solicitudes_salud(buk_area_id);

-- DOMINIO 6: Evaluaciones
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

-- DOMINIO 7: Caché desde Buk
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
  kind text not null,
  nombre text not null,
  raw_json jsonb not null,
  synced_at timestamptz not null default now()
);

-- DOMINIO 8: Audit log
create table audit_log (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  action text not null,
  resource_type text,
  resource_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_user on audit_log(user_id);
create index idx_audit_action on audit_log(action);
create index idx_audit_created on audit_log(created_at desc);

-- updated_at trigger genérico
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

-- ============================================================
-- PASO 4 — Aplicar 0002_rls_policies.sql
-- ============================================================

-- USER_PROFILES
alter table user_profiles enable row level security;

create policy user_profiles_self_read on user_profiles
  for select using (user_id = auth.uid());

create policy user_profiles_admin_read on user_profiles
  for select using (is_admin());

create policy user_profiles_admin_write on user_profiles
  for all using (is_admin()) with check (is_admin());

-- ASIGNACIONES
alter table asignaciones enable row level security;

create policy asignaciones_admin_all on asignaciones
  for all using (is_admin()) with check (is_admin());

create policy asignaciones_empleador_read on asignaciones
  for select using (can_access_area(buk_area_id));

create policy asignaciones_colaboradora_self on asignaciones
  for select using (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

-- TAREAS
alter table tareas enable row level security;

create policy tareas_admin_all on tareas
  for all using (is_admin()) with check (is_admin());

create policy tareas_area_read on tareas
  for select using (can_access_area(buk_area_id));

create policy tareas_empleador_write on tareas
  for all using (
    exists(select 1 from user_profiles
      where user_id = auth.uid() and rol = 'empleador' and buk_area_id = tareas.buk_area_id)
  ) with check (
    exists(select 1 from user_profiles
      where user_id = auth.uid() and rol = 'empleador' and buk_area_id = tareas.buk_area_id)
  );

create policy tareas_colaboradora_update on tareas
  for update using (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

-- TAREAS_RECURRENTES
alter table tareas_recurrentes enable row level security;

create policy tareas_rec_admin_all on tareas_recurrentes
  for all using (is_admin()) with check (is_admin());

create policy tareas_rec_area_read on tareas_recurrentes
  for select using (can_access_area(buk_area_id));

create policy tareas_rec_empleador_write on tareas_recurrentes
  for all using (
    exists(select 1 from user_profiles
      where user_id = auth.uid() and rol = 'empleador' and buk_area_id = tareas_recurrentes.buk_area_id)
  ) with check (
    exists(select 1 from user_profiles
      where user_id = auth.uid() and rol = 'empleador' and buk_area_id = tareas_recurrentes.buk_area_id)
  );

-- LISTAS_COMPRAS + ITEMS_LISTA
alter table listas_compras enable row level security;

create policy listas_admin_all on listas_compras
  for all using (is_admin()) with check (is_admin());

create policy listas_area_all on listas_compras
  for all using (can_access_area(buk_area_id))
  with check (can_access_area(buk_area_id));

alter table items_lista enable row level security;

create policy items_via_lista on items_lista
  for all using (
    exists(select 1 from listas_compras l where l.id = items_lista.lista_id
      and (is_admin() or can_access_area(l.buk_area_id)))
  ) with check (
    exists(select 1 from listas_compras l where l.id = items_lista.lista_id
      and (is_admin() or can_access_area(l.buk_area_id)))
  );

-- CONVERSACIONES + MENSAJES
alter table conversaciones enable row level security;

create policy conv_admin_all on conversaciones
  for all using (is_admin()) with check (is_admin());

create policy conv_participantes on conversaciones
  for select using (
    can_access_area(buk_area_id) or
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

create policy conv_participantes_write on conversaciones
  for insert with check (
    can_access_area(buk_area_id) or
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

alter table mensajes enable row level security;

create policy mensajes_via_conversacion on mensajes
  for select using (
    exists(select 1 from conversaciones c where c.id = mensajes.conversacion_id
      and (is_admin() or can_access_area(c.buk_area_id) or
           c.buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())))
  );

create policy mensajes_emisor_insert on mensajes
  for insert with check (emisor_uid = auth.uid());

-- SOLICITUDES_SALUD
alter table solicitudes_salud enable row level security;

create policy salud_admin_all on solicitudes_salud
  for all using (is_admin()) with check (is_admin());

create policy salud_empleador_read on solicitudes_salud
  for select using (can_access_area(buk_area_id));

create policy salud_colaboradora on solicitudes_salud
  for all using (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  ) with check (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

-- EVALUACIONES
alter table evaluaciones enable row level security;

create policy eval_admin_all on evaluaciones
  for all using (is_admin()) with check (is_admin());

create policy eval_partes_read on evaluaciones
  for select using (
    can_access_area(buk_area_id) or
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

create policy eval_emisor_insert on evaluaciones
  for insert with check (evaluador_uid = auth.uid());

-- CACHÉS
alter table cache_areas enable row level security;
alter table cache_roles enable row level security;
alter table cache_absence_types enable row level security;

create policy cache_areas_read on cache_areas for select using (auth.uid() is not null);
create policy cache_areas_admin_write on cache_areas for all using (is_admin()) with check (is_admin());

create policy cache_roles_read on cache_roles for select using (auth.uid() is not null);
create policy cache_roles_admin_write on cache_roles for all using (is_admin()) with check (is_admin());

create policy cache_absence_types_read on cache_absence_types for select using (auth.uid() is not null);
create policy cache_absence_types_admin_write on cache_absence_types for all using (is_admin()) with check (is_admin());

-- AUDIT_LOG
alter table audit_log enable row level security;

create policy audit_admin_read on audit_log for select using (is_admin());
create policy audit_self_insert on audit_log for insert with check (user_id = auth.uid());

-- ============================================================
-- FIN — Verificación opcional
-- ============================================================
-- Para verificar después de correr:
--   select table_name from information_schema.tables
--   where table_schema = 'public' order by table_name;
--
-- Deberías ver las 14 tablas nuevas + cualquier `legacy_*_20260525`
-- que quedó de la base anterior.

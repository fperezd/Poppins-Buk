-- ================================================================
-- Poppins-Buk — RLS Policies (2026-05-09)
--
-- Modelo de autorización:
--   - admin: ve y edita todo
--   - empleador: solo su buk_area_id (su hogar)
--               + colaboradoras asignadas a su area (vía buk_employee_id ∈ area)
--   - colaboradora: solo a sí misma + tareas/mensajes de su area
--
-- Las funciones is_admin() y can_access_area() se definieron en 0001.
-- ================================================================

-- ============================================================
-- USER_PROFILES
-- ============================================================
alter table user_profiles enable row level security;

-- Cualquier user autenticado puede leer su propio perfil
create policy user_profiles_self_read on user_profiles
  for select using (user_id = auth.uid());

-- Admin lee todos
create policy user_profiles_admin_read on user_profiles
  for select using (is_admin());

-- Solo admin puede crear/editar/borrar perfiles
create policy user_profiles_admin_write on user_profiles
  for all using (is_admin()) with check (is_admin());

-- ============================================================
-- ASIGNACIONES
-- ============================================================
alter table asignaciones enable row level security;

create policy asignaciones_admin_all on asignaciones
  for all using (is_admin()) with check (is_admin());

-- Empleador ve asignaciones de su area
create policy asignaciones_empleador_read on asignaciones
  for select using (can_access_area(buk_area_id));

-- Colaboradora ve sus propias asignaciones
create policy asignaciones_colaboradora_self on asignaciones
  for select using (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- TAREAS
-- ============================================================
alter table tareas enable row level security;

create policy tareas_admin_all on tareas
  for all using (is_admin()) with check (is_admin());

create policy tareas_area_read on tareas
  for select using (can_access_area(buk_area_id));

-- Empleador crea/edita tareas de su area
create policy tareas_empleador_write on tareas
  for all using (
    exists(select 1 from user_profiles
      where user_id = auth.uid() and rol = 'empleador' and buk_area_id = tareas.buk_area_id)
  ) with check (
    exists(select 1 from user_profiles
      where user_id = auth.uid() and rol = 'empleador' and buk_area_id = tareas.buk_area_id)
  );

-- Colaboradora puede actualizar (marcar como completada) tareas que le toquen
create policy tareas_colaboradora_update on tareas
  for update using (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- TAREAS_RECURRENTES
-- ============================================================
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

-- ============================================================
-- LISTAS_COMPRAS + ITEMS_LISTA
-- ============================================================
alter table listas_compras enable row level security;

create policy listas_admin_all on listas_compras
  for all using (is_admin()) with check (is_admin());

create policy listas_area_all on listas_compras
  for all using (can_access_area(buk_area_id))
  with check (can_access_area(buk_area_id));

alter table items_lista enable row level security;

-- Items: heredan acceso a través de la lista
create policy items_via_lista on items_lista
  for all using (
    exists(select 1 from listas_compras l where l.id = items_lista.lista_id
      and (is_admin() or can_access_area(l.buk_area_id)))
  ) with check (
    exists(select 1 from listas_compras l where l.id = items_lista.lista_id
      and (is_admin() or can_access_area(l.buk_area_id)))
  );

-- ============================================================
-- CONVERSACIONES + MENSAJES
-- ============================================================
alter table conversaciones enable row level security;

create policy conv_admin_all on conversaciones
  for all using (is_admin()) with check (is_admin());

-- Empleador ve conversaciones de su area
-- Colaboradora ve su propia conversación
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

-- Solo el emisor puede insertar su mensaje
create policy mensajes_emisor_insert on mensajes
  for insert with check (emisor_uid = auth.uid());

-- ============================================================
-- SOLICITUDES_SALUD
-- ============================================================
alter table solicitudes_salud enable row level security;

create policy salud_admin_all on solicitudes_salud
  for all using (is_admin()) with check (is_admin());

-- Empleador ve solicitudes de colaboradoras de su area
create policy salud_empleador_read on solicitudes_salud
  for select using (can_access_area(buk_area_id));

-- Colaboradora crea y ve las propias
create policy salud_colaboradora on solicitudes_salud
  for all using (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  ) with check (
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- EVALUACIONES
-- ============================================================
alter table evaluaciones enable row level security;

create policy eval_admin_all on evaluaciones
  for all using (is_admin()) with check (is_admin());

-- Cada parte ve y crea evaluaciones que le involucran
create policy eval_partes_read on evaluaciones
  for select using (
    can_access_area(buk_area_id) or
    buk_employee_id = (select buk_employee_id from user_profiles where user_id = auth.uid())
  );

create policy eval_emisor_insert on evaluaciones
  for insert with check (evaluador_uid = auth.uid());

-- ============================================================
-- CACHÉS — solo lectura para usuarios autenticados; escritura para admin/jobs
-- ============================================================
alter table cache_areas enable row level security;
alter table cache_roles enable row level security;
alter table cache_absence_types enable row level security;

create policy cache_areas_read on cache_areas for select using (auth.uid() is not null);
create policy cache_areas_admin_write on cache_areas for all using (is_admin()) with check (is_admin());

create policy cache_roles_read on cache_roles for select using (auth.uid() is not null);
create policy cache_roles_admin_write on cache_roles for all using (is_admin()) with check (is_admin());

create policy cache_absence_types_read on cache_absence_types for select using (auth.uid() is not null);
create policy cache_absence_types_admin_write on cache_absence_types for all using (is_admin()) with check (is_admin());

-- ============================================================
-- AUDIT_LOG — solo admin lee; cualquiera autenticado inserta sus propios
-- ============================================================
alter table audit_log enable row level security;

create policy audit_admin_read on audit_log for select using (is_admin());
create policy audit_self_insert on audit_log for insert with check (user_id = auth.uid());

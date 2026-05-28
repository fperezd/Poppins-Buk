-- ================================================================
-- 0006 — Hardening de helpers SECURITY DEFINER
--
-- Cierra advisors de Supabase database-linter:
--   0011 function_search_path_mutable (search_path no seteado)
--   0028 anon_security_definer_function_executable
--   0029 authenticated_security_definer_function_executable
--
-- Las 4 funciones helper de 0001 (is_admin, can_access_area,
-- get_user_scope, set_updated_at) son SECURITY DEFINER pero estaban
-- expuestas como RPC via PostgREST a anon/authenticated y sin
-- search_path fijo. Riesgo: search_path hijacking + recon de roles.
--
-- Estas funciones son uso interno de RLS y triggers. RLS las invoca
-- como rol postgres, asi que el REVOKE no rompe nada.
-- ================================================================

-- set_updated_at: trigger interno
alter function public.set_updated_at() set search_path = public, pg_temp;
revoke execute on function public.set_updated_at() from anon, authenticated, public;

-- is_admin: invocada por RLS policies
alter function public.is_admin() set search_path = public, pg_temp;
revoke execute on function public.is_admin() from anon, authenticated, public;

-- can_access_area: invocada por RLS policies
alter function public.can_access_area(integer) set search_path = public, pg_temp;
revoke execute on function public.can_access_area(integer) from anon, authenticated, public;

-- get_user_scope: helper conveniencia
-- Si en el futuro la queremos exponer via RPC, convertir a
-- SECURITY INVOKER + grant explicito a authenticated.
alter function public.get_user_scope() set search_path = public, pg_temp;
revoke execute on function public.get_user_scope() from anon, authenticated, public;

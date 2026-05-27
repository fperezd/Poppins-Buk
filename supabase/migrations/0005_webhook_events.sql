-- ================================================================
-- POP-C0-10: Tabla webhook_events para idempotencia
--
-- Sirve para deduplicar webhooks entrantes (BUK, Flow.cl).
-- UNIQUE (source, event_id) garantiza que un mismo evento se procesa una sola vez.
-- Retry from BUK/Flow.cl con mismo event_id = no-op idempotent.
--
-- Esta migración es independiente de 0004_multi_tenancy.sql.
-- Si 0004 ya creó la tabla (porque se aplicó primero), esta migración no la duplica.
-- ================================================================

-- Solo crear si no existe (defensa contra orden de aplicación)
create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('buk', 'flow_cl')),
  event_id text not null,
  event_type text,
  payload jsonb not null,
  -- tenant_id es nullable porque el webhook puede llegar antes de identificar tenant
  -- (BUK no manda tenant_id, lo derivamos del payload o de la URL del webhook)
  tenant_id uuid,
  received_at timestamptz not null default now(),
  processed boolean not null default false,
  processed_at timestamptz,
  retry_count integer not null default 0,
  last_error text,
  -- Unique constraint para idempotencia
  constraint webhook_events_source_event_id_unique unique (source, event_id)
);

-- Indexes (idempotentes con if not exists)
create index if not exists idx_webhook_events_unprocessed
  on webhook_events(processed, received_at)
  where processed = false;

create index if not exists idx_webhook_events_source_eventid
  on webhook_events(source, event_id);

create index if not exists idx_webhook_events_tenant
  on webhook_events(tenant_id)
  where tenant_id is not null;

create index if not exists idx_webhook_events_received_at
  on webhook_events(received_at desc);

-- RLS: solo admin (super-admin) puede leer/escribir directamente.
-- El service role (usado por API routes server-side) bypasea RLS,
-- así que api/webhooks/buk/ funciona sin más config.
alter table webhook_events enable row level security;

drop policy if exists webhook_events_admin_only on webhook_events;
create policy webhook_events_admin_only on webhook_events
  for all using (is_admin()) with check (is_admin());

-- ============================================================
-- Comentario para mantener tabla limpia (retención 90 días)
-- ============================================================
-- Idealmente correr un cron que borre eventos procesados >90 días:
--   delete from webhook_events
--   where processed = true and processed_at < now() - interval '90 days';
--
-- Esto NO se hace acá. Se agendará como Vercel Cron en Sprint 4 (POP-C1-10 cleanup).
-- ============================================================

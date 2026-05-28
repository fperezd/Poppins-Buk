/**
 * POST /api/webhooks/buk
 *
 * Receptor de webhooks desde BUK.
 * Configurar en BUK: Configuración → Acceso API → URLs Webhooks
 *
 * Cambios POP-C0-02 + POP-C0-10:
 *   - HMAC verification del header X-Buk-Signature contra BUK_WEBHOOK_SECRET
 *   - Idempotency via tabla webhook_events (UNIQUE constraint en source+event_id)
 *   - 401 si firma inválida o ausente
 *   - 200 inmediato post-validación; processing en background
 *   - Sin firma configurada (BUK_WEBHOOK_SECRET undefined) → 503 con error claro
 */

import { NextResponse } from 'next/server';
import { verifyBukWebhook } from '@/lib/webhook/verify';

interface BukWebhookPayload {
  employee_id?: number;
  area_id?: number;
  vacation_id?: number;
  absence_id?: number;
  licence_id?: number;
  permission_id?: number;
  document_id?: number;
  date: string;
  event_type: string;
  tenant_url: string;
  employment_status?: string;
  metadata?: Record<string, unknown>;
}

interface BukWebhookEnvelope {
  data: BukWebhookPayload;
  // BUK puede incluir un identifier único del evento; si no, generamos uno
  // desde event_type + date + entity_id
  _id?: string;
}

/**
 * Genera un event_id determinístico desde el payload si BUK no provee uno.
 * Esto garantiza idempotency incluso si BUK reintenta el mismo evento.
 */
function deriveEventId(envelope: BukWebhookEnvelope): string {
  if (envelope._id) return envelope._id;
  const e = envelope.data;
  const entityId =
    e.employee_id ?? e.area_id ?? e.vacation_id ?? e.absence_id ??
    e.licence_id ?? e.permission_id ?? e.document_id ?? 'no-entity';
  return `${e.event_type}-${e.date}-${entityId}`;
}

export async function POST(request: Request) {
  const receivedAt = new Date().toISOString();

  // ── PASO 1: Leer body como texto crudo para HMAC ──
  const bodyText = await request.text();
  if (!bodyText) {
    return NextResponse.json({ error: 'Body vacío' }, { status: 400 });
  }

  // ── PASO 2: Verificar HMAC (POP-C0-02) ──
  const signature = request.headers.get('X-Buk-Signature');

  // Si el secret no está configurado, fallar explícitamente (NO procesar webhook unsigned)
  if (!process.env.BUK_WEBHOOK_SECRET) {
    console.error('[BUK Webhook] BUK_WEBHOOK_SECRET no configurado — rechazando webhook');
    return NextResponse.json(
      { error: 'Webhook secret not configured on server' },
      { status: 503 },
    );
  }

  const verification = verifyBukWebhook(bodyText, signature);
  if (!verification.valid) {
    console.warn(`[BUK Webhook] Firma inválida (${verification.reason}) desde ${request.headers.get('x-forwarded-for') ?? 'unknown'}`);
    return NextResponse.json(
      { error: 'Invalid webhook signature', reason: verification.reason },
      { status: 401 },
    );
  }

  // ── PASO 3: Parsear y validar shape ──
  let envelope: BukWebhookEnvelope;
  try {
    envelope = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  if (!envelope?.data?.event_type) {
    return NextResponse.json({ error: 'Payload inválido — falta data.event_type' }, { status: 400 });
  }

  const event = envelope.data;
  const eventId = deriveEventId(envelope);

  // ── PASO 4: Idempotency check + insert en webhook_events (POP-C0-10) ──
  // Usa Supabase Service Role para insert. Si conflict en unique → ya procesado.
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        source: 'buk',
        event_id: eventId,
        event_type: event.event_type,
        payload: envelope,
        received_at: receivedAt,
        processed: false,
      } as never);

    if (insertError) {
      // Postgres unique violation = idempotent retry, OK
      if (insertError.code === '23505') {
        console.log(`[BUK Webhook] Evento ya procesado (idempotent): ${eventId}`);
        return NextResponse.json({ received: true, idempotent: true, event_id: eventId });
      }
      // Otro error de DB: logueamos pero NO retornamos 500 al webhook origin
      // (BUK reintentaría, causando más errores). Mejor 200 + alerta interna.
      console.error('[BUK Webhook] DB error registrando evento:', insertError);
    }
  } catch (err) {
    // Supabase no disponible: log y continuar (mejor procesar que rechazar)
    console.error('[BUK Webhook] Supabase no disponible:', err);
  }

  // ── PASO 5: Procesar (async, sin bloquear respuesta a BUK) ──
  // Sí, await acá porque Vercel serverless no soporta dangling promises.
  // En producción con cron processor, este await desaparece (sería marca processed=true).
  try {
    await processEvent(event);
  } catch (err) {
    console.error(`[BUK Webhook] Error processing ${event.event_type}:`, err);
    // No retornar 500 — BUK reintenta y duplica. Mejor 200 + retry interno via cron.
  }

  console.log(`[BUK Webhook] ${event.event_type} (${eventId}) recibido OK a las ${receivedAt}`);
  return NextResponse.json({ received: true, event_type: event.event_type, event_id: eventId, at: receivedAt });
}

async function processEvent(event: BukWebhookPayload) {
  if (event.event_type.startsWith('employee_') || event.event_type.startsWith('job_')) {
    await handleEmployeeEvent(event);
  } else if (event.event_type.startsWith('vacation_')) {
    console.log(`[BUK Webhook] Vacación ${event.event_type} id=${event.vacation_id}`);
  } else if (
    event.event_type.startsWith('absence_') ||
    event.event_type.startsWith('licence_') ||
    event.event_type.startsWith('permission_')
  ) {
    console.log(
      `[BUK Webhook] Ausencia ${event.event_type} id=${event.absence_id ?? event.licence_id ?? event.permission_id}`,
    );
  } else if (event.event_type.startsWith('area_')) {
    console.log(`[BUK Webhook] Área ${event.event_type} id=${event.area_id}`);
  } else if (event.event_type === 'document_create') {
    console.log(`[BUK Webhook] Documento creado id=${event.document_id}`);
  }
}

async function handleEmployeeEvent(event: BukWebhookPayload) {
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log(`[BUK Webhook] Mock mode — ignorando ${event.event_type} para employee ${event.employee_id}`);
    return;
  }

  try {
    const { getBukSDK } = await import('@/lib/buk-sdk');
    const { createClient } = await import('@/lib/supabase/server');
    const sdk = getBukSDK();
    const supabase = await createClient();

    const { data: employers } = await supabase
      .from('employers')
      .select('id')
      .eq('active', true)
      .limit(1);
    const employerId = (employers as Array<{ id: string }> | null)?.[0]?.id;
    if (!employerId || !event.employee_id) return;

    if (event.event_type === 'job_termination' || event.employment_status === 'terminado') {
      await supabase
        .from('employees')
        .update({ estado: 'inactivo', buk_synced_at: new Date().toISOString() })
        .eq('buk_id', event.employee_id);
      return;
    }

    const emp = await sdk.employees.get(event.employee_id);
    const row = {
      employer_id: employerId,
      buk_id: emp.id,
      rut: emp.rut || '',
      nombre: emp.first_name || '',
      apellido: emp.last_name || '',
      email: emp.email || null,
      telefono: emp.phone || null,
      cargo: emp.current_job?.role?.name || 'Sin cargo',
      estado: emp.active ? ('activo' as const) : ('inactivo' as const),
      buk_synced_at: new Date().toISOString(),
    };

    await supabase.from('employees').upsert(row as never, { onConflict: 'buk_id' });
    console.log(`[BUK Webhook] Empleado ${event.employee_id} sincronizado`);
  } catch (err) {
    console.error(`[BUK Webhook] Error sync employee:`, err);
  }
}

/**
 * POST /api/webhooks/buk
 *
 * Receptor de webhooks desde BUK.
 * Configurar en BUK: Configuración → Acceso API → URLs Webhooks
 */

import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  const receivedAt = new Date().toISOString();

  try {
    const body = await request.json().catch(() => null);
    if (!body?.data) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const event = body.data as BukWebhookPayload;
    const { event_type } = event;

    console.log(`[BUK Webhook] ${event_type} recibido a las ${receivedAt}`, event);

    if (event_type.startsWith('employee_') || event_type.startsWith('job_')) {
      await handleEmployeeEvent(event);
    } else if (event_type.startsWith('vacation_')) {
      console.log(`[BUK Webhook] Vacación ${event_type} id=${event.vacation_id}`);
    } else if (event_type.startsWith('absence_') || event_type.startsWith('licence_') || event_type.startsWith('permission_')) {
      console.log(`[BUK Webhook] Ausencia ${event_type} id=${event.absence_id ?? event.licence_id ?? event.permission_id}`);
    } else if (event_type.startsWith('area_')) {
      console.log(`[BUK Webhook] Área ${event_type} id=${event.area_id}`);
    } else if (event_type === 'document_create') {
      console.log(`[BUK Webhook] Documento creado id=${event.document_id}`);
    }

    return NextResponse.json({ received: true, event_type, at: receivedAt });
  } catch (error) {
    console.error('[BUK Webhook] Error:', error);
    return NextResponse.json({ received: true, error: 'Error interno procesado' });
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
      .from('employers').select('id').eq('active', true).limit(1);
    const employerId = (employers as Array<{ id: string }> | null)?.[0]?.id;
    if (!employerId || !event.employee_id) return;

    if (event.event_type === 'job_termination' || event.employment_status === 'terminado') {
      await supabase.from('employees')
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
      estado: emp.active ? 'activo' as const : 'inactivo' as const,
      buk_synced_at: new Date().toISOString(),
    };

    await supabase.from('employees').upsert(row as never, { onConflict: 'buk_id' });
    console.log(`[BUK Webhook] Empleado ${event.employee_id} sincronizado`);
  } catch (err) {
    console.error(`[BUK Webhook] Error sync:`, err);
  }
}

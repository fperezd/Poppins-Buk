'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useColaboradora, useLiquidaciones, useSaldoVacaciones, useVacaciones, useHogar } from '@/hooks/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

function fmtCLP(n: number) {
  return '$' + n.toLocaleString('es-CL');
}

function initials(emp: { first_name?: string; surname?: string }): string {
  return `${(emp.first_name ?? ' ')[0]}${(emp.surname ?? ' ')[0]}`.toUpperCase();
}

export default function ColaboradoraDetailPage({ params }: PageProps) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const [tab, setTab] = useState<'info' | 'liquidaciones' | 'vacaciones'>('info');

  const { data: emp, loading, error } = useColaboradora(id);
  const { data: liquidaciones } = useLiquidaciones(id);
  const { data: saldoVacaciones } = useSaldoVacaciones(id);
  const { data: vacacionesList } = useVacaciones(id);
  const { data: hogar } = useHogar(emp?.current_job?.area_id ?? null);

  if (loading) return <div className="text-sm text-gray-400 p-6">Cargando…</div>;
  if (error) return <div className="text-red-700 text-sm p-3 bg-red-50 rounded-lg">{error.message}</div>;
  if (!emp) return <div className="text-sm text-gray-500 p-6">No encontrada</div>;

  const haberes = (liquidaciones as Array<{ income_gross?: number; year?: number; month?: number; liquid_reach?: number; closed?: boolean; liquidacion_id?: number }> | null) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <Link href="/dashboard/colaboradoras" className="text-sm text-gray-500 hover:text-gray-900">← Volver</Link>
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white"
          style={{ background: `hsl(${((emp.first_name ?? '?').charCodeAt(0) * 137) % 360}, 60%, 45%)` }}
        >
          {initials(emp)}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{emp.full_name ?? `${emp.first_name} ${emp.surname}`}</h1>
          <div className="text-sm text-gray-500 mt-1">
            {emp.current_job?.role?.name ?? '—'} · RUT {emp.rut ?? '—'}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Hogar: {hogar?.name ?? (emp.current_job?.area_id ? `Area #${emp.current_job.area_id}` : 'Sin hogar')} · Desde {emp.current_job?.start_date ?? '—'}
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${emp.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {emp.active ? 'activo' : 'inactivo'}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'info' as const, label: 'Información' },
            { id: 'liquidaciones' as const, label: 'Liquidaciones' },
            { id: 'vacaciones' as const, label: 'Vacaciones' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 text-sm font-medium ${tab === t.id ? 'text-[#F0197A] border-b-2 border-[#F0197A]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: Info */}
      {tab === 'info' && (
        <div className="grid grid-cols-2 gap-4">
          <Card title="Contacto">
            <Field label="Email" value={emp.email ?? '—'} />
            <Field label="Teléfono" value={emp.phone_number ?? '—'} />
            <Field label="Email personal" value={(emp.personal_email as string) ?? '—'} />
          </Card>
          <Card title="Laboral">
            <Field label="Cargo" value={emp.current_job?.role?.name ?? '—'} />
            <Field label="Fecha ingreso" value={emp.current_job?.start_date ?? '—'} />
            <Field label="Tipo contrato" value={(emp.contract_type as string) ?? 'Indefinido'} />
            <Field label="Sueldo base" value={emp.base_salary ? fmtCLP(Number(emp.base_salary)) : '—'} />
          </Card>
          <Card title="Previsión">
            <Field label="AFP" value={(emp.pension_fund as string) ?? '—'} />
            <Field label="Salud" value={(emp.health_company as string) ?? '—'} />
          </Card>
          <Card title="Dirección">
            <Field label="Dirección" value={(emp.address as string) ?? '—'} />
            <Field label="Comuna" value={(emp.district as string) ?? '—'} />
            <Field label="Ciudad" value={(emp.city as string) ?? '—'} />
          </Card>
        </div>
      )}

      {/* TAB: Liquidaciones */}
      {tab === 'liquidaciones' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="px-5 py-3">Periodo</th>
                <th className="px-3 py-3 text-right">Bruto</th>
                <th className="px-3 py-3 text-right">Líquido</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {haberes.map(l => (
                <tr key={l.liquidacion_id} className="border-b border-gray-50">
                  <td className="px-5 py-3">{l.year}-{String(l.month).padStart(2, '0')}</td>
                  <td className="px-3 py-3 text-right">{fmtCLP(Number(l.income_gross ?? 0))}</td>
                  <td className="px-3 py-3 text-right font-medium">{fmtCLP(Number(l.liquid_reach ?? 0))}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${l.closed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {l.closed ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <a
                      href={`/api/buk/v1/colaboradoras/${id}/liquidaciones/${l.year}/${l.month}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#F0197A] hover:underline text-xs"
                    >
                      Ver PDF
                    </a>
                  </td>
                </tr>
              ))}
              {haberes.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">Sin liquidaciones</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Vacaciones */}
      {tab === 'vacaciones' && (
        <div className="space-y-4">
          {saldoVacaciones?.vacations && (
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Saldo disponible</h3>
              <div className="grid grid-cols-3 gap-3">
                {saldoVacaciones.vacations.map((v, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">{v.name}</div>
                    <div className="text-xl font-bold text-gray-900">{v.stock}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Historial de solicitudes</h3>
              <Link href={`/dashboard/vacaciones/nueva?colaboradora_id=${id}`} className="text-xs text-[#F0197A] hover:underline">
                + Nueva solicitud
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-3 py-3">Desde</th>
                  <th className="px-3 py-3">Hasta</th>
                  <th className="px-3 py-3">Días</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {(vacacionesList as Array<{ id: number; type?: string; start_date?: string; end_date?: string; working_days?: number; status?: string }> | null ?? []).map(v => (
                  <tr key={v.id} className="border-b border-gray-50">
                    <td className="px-5 py-3">{v.type ?? 'vacaciones'}</td>
                    <td className="px-3 py-3">{v.start_date}</td>
                    <td className="px-3 py-3">{v.end_date}</td>
                    <td className="px-3 py-3">{v.working_days ?? '—'}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {v.status ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!vacacionesList || (vacacionesList as unknown[]).length === 0) && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">Sin solicitudes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useVacaciones, useColaboradoras } from '@/hooks/api';

interface VacRow {
  id: number;
  employee_id: number;
  start_date?: string;
  end_date?: string;
  working_days?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'submitted' | 'pre_approved' | string;
  type?: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  approved: { label: 'Aprobada', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-600' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-500' },
  submitted: { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
  pre_approved: { label: 'Pre-aprobada', color: 'bg-indigo-100 text-indigo-700' },
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
};

function StatusBadge({ status }: { status?: string }) {
  const s = STATUS_LABEL[status ?? ''] ?? { label: status ?? '—', color: 'bg-gray-100 text-gray-500' };
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>;
}

export default function VacacionesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { data: rawVacaciones, loading, error } = useVacaciones();
  const { data: colaboradoras } = useColaboradoras();

  const vacaciones = (rawVacaciones as VacRow[] | null) ?? [];
  const empName = (id: number) =>
    colaboradoras?.find(c => c.id === id)?.full_name ?? `Empleado #${id}`;

  const filtered = statusFilter
    ? vacaciones.filter(v => v.status === statusFilter)
    : vacaciones;

  const pendientes = filtered.filter(v => v.status === 'submitted' || v.status === 'pending' || v.status === 'pre_approved');
  const resueltas = filtered.filter(v => !pendientes.includes(v));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Vacaciones</h1>
        <Link href="/dashboard/vacaciones/nueva" className="px-4 py-2 bg-[#F0197A] text-white text-sm font-semibold rounded-lg hover:bg-[#d4166c]">
          + Nueva solicitud
        </Link>
      </div>

      <div className="flex gap-2">
        {['', 'submitted', 'approved', 'rejected'].map(s => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-full border ${statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {s === '' ? 'Todas' : (STATUS_LABEL[s]?.label ?? s)}
          </button>
        ))}
      </div>

      {error && <div className="text-red-700 text-sm p-3 bg-red-50 rounded-lg">{error.message}</div>}

      {loading ? (
        <div className="text-sm text-gray-400">Cargando…</div>
      ) : (
        <>
          <Section title="Pendientes" rows={pendientes} empName={empName} />
          <Section title="Resueltas" rows={resueltas} empName={empName} />
        </>
      )}
    </div>
  );
}

function Section({ title, rows, empName }: { title: string; rows: VacRow[]; empName: (id: number) => string }) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="text-xs text-gray-400">{rows.length}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/50 text-left text-xs font-semibold text-gray-500 uppercase">
            <th className="px-5 py-2">Colaboradora</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Desde</th>
            <th className="px-3 py-2">Hasta</th>
            <th className="px-3 py-2">Días</th>
            <th className="px-3 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(v => (
            <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-5 py-3">{empName(v.employee_id)}</td>
              <td className="px-3 py-3 text-gray-500 text-xs">{v.type ?? 'vacaciones'}</td>
              <td className="px-3 py-3">{v.start_date}</td>
              <td className="px-3 py-3">{v.end_date}</td>
              <td className="px-3 py-3">{v.working_days ?? '—'}</td>
              <td className="px-3 py-3"><StatusBadge status={v.status} /></td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-5 py-6 text-center text-gray-400 text-sm">Sin registros</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useColaboradoras, useMe } from '@/hooks/api';
import { apiPost, ApiError } from '@/lib/api/client';

function NuevaInner() {
  const router = useRouter();
  const params = useSearchParams();
  const colaboradoraIdParam = params.get('colaboradora_id');

  const { data: me } = useMe();
  const { data: colabs } = useColaboradoras();

  const [employeeId, setEmployeeId] = useState<string>(
    colaboradoraIdParam ?? (me?.rol === 'colaboradora' && me.buk_employee_id ? String(me.buk_employee_id) : '')
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [observations, setObservations] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lockEmployee = me?.rol === 'colaboradora';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!employeeId || !startDate || !endDate) {
      setError('Colaboradora, fecha inicio y fecha fin son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      await apiPost('/vacaciones', {
        employee_id: Number(employeeId),
        start_date: startDate,
        end_date: endDate,
        observations: observations || undefined,
      });
      router.push('/dashboard/vacaciones');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/dashboard/vacaciones" className="text-sm text-gray-500 hover:text-gray-900">← Volver</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Nueva solicitud de vacaciones</h1>
      </div>

      {error && (
        <div className="text-red-700 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Colaboradora *</label>
          <select
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            disabled={lockEmployee}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F0197A] bg-white disabled:bg-gray-50"
          >
            <option value="">— Seleccionar —</option>
            {(colabs ?? []).map(c => (
              <option key={c.id} value={c.id}>{c.full_name ?? `${c.first_name} ${c.surname}`}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Desde *</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F0197A]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Hasta *</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F0197A]" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Observaciones</label>
          <textarea value={observations} onChange={e => setObservations(e.target.value)} rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F0197A]" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/dashboard/vacaciones" className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </Link>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#F0197A] text-white text-sm font-semibold rounded-lg hover:bg-[#d4166c] disabled:opacity-50">
            {submitting ? 'Enviando…' : 'Crear solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NuevaVacacionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Cargando…</div>}>
      <NuevaInner />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useColaboradoras } from '@/hooks/api';

interface LiqRow {
  liquidacion_id: number;
  employee_id: number;
  rut?: string;
  month: number;
  year: number;
  income_gross?: number;
  liquid_reach?: number;
  total_legal_discounts?: number;
  total_other_discounts?: number;
  closed?: boolean;
}

function fmtCLP(n: number) {
  return '$' + (n || 0).toLocaleString('es-CL');
}

export default function LiquidacionesPage() {
  const [periodicidad, setPeriodicidad] = useState<'month' | 'semi_month' | 'week'>('month');
  const { data, loading, error } = useQuery<LiqRow[]>('/liquidaciones', { periodicidad });
  const { data: colabs } = useColaboradoras();

  const rows = (data as LiqRow[] | null) ?? [];
  const empName = (id: number) => colabs?.find(c => c.id === id)?.full_name ?? `Empleado #${id}`;

  const totalBruto = rows.reduce((acc, r) => acc + (Number(r.income_gross) || 0), 0);
  const totalLiquido = rows.reduce((acc, r) => acc + (Number(r.liquid_reach) || 0), 0);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Liquidaciones</h1>

      <div className="flex gap-2">
        {(['month', 'semi_month', 'week'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriodicidad(p)}
            className={`px-3 py-1.5 text-xs rounded-full border ${periodicidad === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {p === 'month' ? 'Mensual' : p === 'semi_month' ? 'Quincenal' : 'Semanal'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-500 uppercase">Liquidaciones</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{rows.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-500 uppercase">Total bruto</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{fmtCLP(totalBruto)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-500 uppercase">Total líquido</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{fmtCLP(totalLiquido)}</div>
        </div>
      </div>

      {error && <div className="text-red-700 text-sm p-3 bg-red-50 rounded-lg">{error.message}</div>}

      {loading ? (
        <div className="text-sm text-gray-400">Cargando…</div>
      ) : (
        <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="px-5 py-3">Colaboradora</th>
                <th className="px-3 py-3">Periodo</th>
                <th className="px-3 py-3 text-right">Bruto</th>
                <th className="px-3 py-3 text-right">Desc. legales</th>
                <th className="px-3 py-3 text-right">Líquido</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.liquidacion_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/colaboradoras/${r.employee_id}`} className="font-medium text-gray-800 hover:text-[#F0197A]">
                      {empName(r.employee_id)}
                    </Link>
                    <div className="text-xs text-gray-400">{r.rut}</div>
                  </td>
                  <td className="px-3 py-3">{r.year}-{String(r.month).padStart(2, '0')}</td>
                  <td className="px-3 py-3 text-right">{fmtCLP(Number(r.income_gross))}</td>
                  <td className="px-3 py-3 text-right text-gray-500">{fmtCLP(Number(r.total_legal_discounts))}</td>
                  <td className="px-3 py-3 text-right font-medium text-emerald-700">{fmtCLP(Number(r.liquid_reach))}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.closed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.closed ? 'Cerrada' : 'Abierta'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <a
                      href={`/api/buk/v1/colaboradoras/${r.employee_id}/liquidaciones/${r.year}/${r.month}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#F0197A] hover:underline text-xs"
                    >
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400 text-sm">Sin liquidaciones del periodo</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

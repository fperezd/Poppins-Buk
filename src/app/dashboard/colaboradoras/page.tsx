'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useColaboradoras, type Empleado } from '@/hooks/api';

function StatusBadge({ active }: { active?: boolean }) {
  const colors = active
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-gray-100 text-gray-500';
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors}`}>
      {active ? 'activo' : 'inactivo'}
    </span>
  );
}

function avatarColor(name: string): string {
  return `hsl(${(name.charCodeAt(0) * 137) % 360}, 60%, 45%)`;
}

function initials(emp: Empleado): string {
  const f = (emp.first_name ?? ' ')[0];
  const s = (emp.surname ?? ' ')[0];
  return `${f}${s}`.toUpperCase();
}

export default function ColaboradorasPage() {
  const router = useRouter();
  const { data, loading, error } = useColaboradoras();
  const [search, setSearch] = useState('');

  const colaboradoras = data ?? [];

  const filtered = colaboradoras.filter(e => {
    const haystack = `${e.full_name ?? ''} ${e.current_job?.role?.name ?? ''} ${e.rut ?? ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/colaboradoras/${id}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Colaboradoras</h1>
        <a
          href="/dashboard/colaboradoras/nuevo"
          className="px-4 py-2 bg-[#F0197A] text-white text-sm font-semibold rounded-lg hover:bg-[#d4166c] transition inline-block"
        >
          + Nueva Colaboradora
        </a>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg px-3 h-10 shadow-sm border border-gray-100 max-w-sm">
        <span className="text-gray-400">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, cargo o RUT..."
          className="border-none bg-transparent outline-none text-sm text-gray-700 w-full placeholder:text-gray-400"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
          Error: {error.message} ({error.code})
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400">Cargando colaboradoras...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Colaboradora</th>
                <th className="px-3 py-3">Cargo</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Hogar (Area)</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3 text-right">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => handleRowClick(emp.id)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: avatarColor(emp.first_name ?? '?') }}
                      >
                        {initials(emp)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{emp.full_name ?? `${emp.first_name} ${emp.surname}`}</div>
                        <div className="text-xs text-gray-400">{emp.rut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{emp.current_job?.role?.name ?? '—'}</td>
                  <td className="px-3 py-3 text-gray-600 truncate max-w-[200px]">{emp.email ?? '—'}</td>
                  <td className="px-3 py-3 text-gray-600">{emp.current_job?.area_id ? `#${emp.current_job.area_id}` : '—'}</td>
                  <td className="px-3 py-3"><StatusBadge active={emp.active} /></td>
                  <td className="px-3 py-3 text-right text-gray-500">{emp.current_job?.start_date ?? '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    {colaboradoras.length === 0 ? 'No hay colaboradoras registradas' : 'Sin resultados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

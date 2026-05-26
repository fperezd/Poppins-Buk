'use client';

import { useAttendance } from '@/hooks/useBuk';

export default function AsistenciaPage() {
  const { data: attendance, loading } = useAttendance();

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  const now = new Date();
  const dayOfWeek = now.getDay();

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Asistencia</h1>
        <div className="text-sm text-gray-500">
          Semana del {fmtDate(weekStart)} - {fmtDate(weekEnd)} {now.getFullYear()}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Cargando asistencia...</div>
      ) : attendance.length === 0 ? (
        <div className="text-sm text-gray-400">No hay datos de asistencia.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Colaborador(a)</th>
                {days.map(d => (
                  <th key={d} className="px-3 py-3 text-center">{d}</th>
                ))}
                <th className="px-3 py-3 text-center">Días</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(emp => (
                <tr key={emp.employee_id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {emp.iniciales && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: emp.color || '#6B7280' }}
                        >
                          {emp.iniciales}
                        </div>
                      )}
                      <span className="font-medium text-gray-800">{emp.nombre}</span>
                    </div>
                  </td>
                  {days.map((d, dayIdx) => {
                    const dayKey = `day_${dayIdx + 1}`;
                    const status = emp.dias?.[dayKey];
                    const dayNum = dayIdx + 1;
                    const isPast = dayNum < dayOfWeek || (dayOfWeek === 0 && dayNum <= 5);
                    const isToday = dayNum === dayOfWeek;

                    if (status === 'ausente') {
                      return (
                        <td key={d} className="px-3 py-3 text-center">
                          <span className="inline-block w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs leading-6">✗</span>
                        </td>
                      );
                    }
                    if (status === 'presente' || isPast) {
                      return (
                        <td key={d} className="px-3 py-3 text-center">
                          <span className={`inline-block w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs leading-6 ${isToday ? 'ring-2 ring-emerald-300' : ''}`}>✓</span>
                        </td>
                      );
                    }
                    if (isToday) {
                      return (
                        <td key={d} className="px-3 py-3 text-center">
                          <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs leading-6 ring-2 ring-blue-300">✓</span>
                        </td>
                      );
                    }
                    return (
                      <td key={d} className="px-3 py-3 text-center">
                        <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs leading-6">—</span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center">
                    <span className="font-semibold text-gray-700">{emp.total_trabajados}</span>
                    <span className="text-gray-400 text-xs">/5</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attendance.some(e => e.horas_no_trabajadas > 0) && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Horas no trabajadas esta semana</h3>
          <div className="space-y-1">
            {attendance.filter(e => e.horas_no_trabajadas > 0).map(e => (
              <div key={e.employee_id} className="text-sm text-amber-700 flex justify-between">
                <span>{e.nombre}</span>
                <span className="font-medium">{e.horas_no_trabajadas}h</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

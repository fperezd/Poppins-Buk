'use client';

import Link from 'next/link';
import { useMe, useColaboradoras, useHogares, useEmpleadores, useTareas, useSaldoVacaciones } from '@/hooks/api';

export default function DashboardHome() {
  const { data: me, loading: meLoading } = useMe();

  if (meLoading) {
    return <div className="p-6 text-sm text-gray-400">Cargando…</div>;
  }

  if (!me) {
    return (
      <div className="p-6 text-sm text-gray-700">
        No se pudo cargar tu perfil. Verifica que tengas un registro en <code>user_profiles</code>.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Hola, {me.buk_employee?.first_name ?? me.email?.split('@')[0] ?? 'usuario'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {me.rol === 'admin' && 'Vista de administración Poppins'}
          {me.rol === 'empleador' && (me.buk_area?.name ?? 'Tu hogar')}
          {me.rol === 'colaboradora' && 'Vista de colaboradora'}
        </p>
      </div>

      {me.rol === 'admin' && <AdminDashboard />}
      {me.rol === 'empleador' && <EmpleadorDashboard areaId={me.buk_area_id} />}
      {me.rol === 'colaboradora' && <ColaboradoraDashboard empleadoId={me.buk_employee_id} />}
    </div>
  );
}

// ── Admin ──

function AdminDashboard() {
  const { data: colabs, loading: lc } = useColaboradoras();
  const { data: hogares, loading: lh } = useHogares();
  const { data: empleadores, loading: le } = useEmpleadores();

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <Card title="Hogares" value={lh ? '…' : (hogares?.length ?? 0)} href="/dashboard/colaboradoras" />
        <Card title="Empleadores" value={le ? '…' : (empleadores?.length ?? 0)} href="/dashboard/colaboradoras" />
        <Card title="Colaboradoras" value={lc ? '…' : (colabs?.length ?? 0)} href="/dashboard/colaboradoras" highlight />
        <Card title="Activas" value={lc ? '…' : (colabs?.filter(c => c.active).length ?? 0)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <QuickAction href="/dashboard/colaboradoras/nuevo" label="Crear colaboradora" />
        <QuickAction href="/dashboard/colaboradoras" label="Ver todas las colaboradoras" />
      </div>

      <RecentColaboradoras />
    </>
  );
}

function RecentColaboradoras() {
  const { data, loading } = useColaboradoras();
  const recent = (data ?? []).slice(0, 5);
  return (
    <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Colaboradoras recientes</h3>
        <Link href="/dashboard/colaboradoras" className="text-xs text-[#F0197A] hover:underline">
          Ver todas →
        </Link>
      </div>
      {loading ? (
        <div className="p-5 text-sm text-gray-400">Cargando…</div>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {recent.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-800">{c.full_name ?? `${c.first_name} ${c.surname}`}</td>
                <td className="px-3 py-3 text-gray-500 text-xs">{c.current_job?.role?.name ?? '—'}</td>
                <td className="px-3 py-3 text-gray-500 text-xs">{c.rut ?? '—'}</td>
                <td className="px-3 py-3 text-right">
                  <Link href={`/dashboard/colaboradoras/${c.id}`} className="text-xs text-[#F0197A] hover:underline">Ver</Link>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr><td className="px-5 py-8 text-center text-gray-400 text-sm">Sin colaboradoras aún</td></tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

// ── Empleador ──

function EmpleadorDashboard({ areaId }: { areaId: number | null }) {
  const { data: colabs, loading } = useColaboradoras(areaId ? { hogar_id: areaId } : undefined);
  const { data: tareas } = useTareas({ hogar_id: areaId ?? undefined, estado: 'pendiente' });

  const colabActivas = (colabs ?? []).filter(c => c.active);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card title="Colaboradoras en mi hogar" value={loading ? '…' : colabActivas.length} highlight />
        <Card title="Tareas pendientes" value={(tareas as unknown[] | null)?.length ?? 0} />
        <Card title="Mensajes nuevos" value={0} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <QuickAction href="/dashboard/colaboradoras" label="Mis colaboradoras" />
        <QuickAction href="/dashboard/vacaciones" label="Vacaciones" />
        <QuickAction href="/dashboard/liquidaciones" label="Liquidaciones" />
      </div>

      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Mis colaboradoras</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {colabActivas.map(c => (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{c.full_name}</td>
                <td className="px-3 py-3 text-gray-500 text-xs">{c.current_job?.role?.name ?? '—'}</td>
                <td className="px-3 py-3 text-right">
                  <Link href={`/dashboard/colaboradoras/${c.id}`} className="text-xs text-[#F0197A] hover:underline">Ver perfil</Link>
                </td>
              </tr>
            ))}
            {colabActivas.length === 0 && (
              <tr><td className="px-5 py-8 text-center text-gray-400 text-sm">Sin colaboradoras asignadas</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

// ── Colaboradora ──

function ColaboradoraDashboard({ empleadoId }: { empleadoId: number | null }) {
  const { data: saldo, loading: ls } = useSaldoVacaciones(empleadoId);
  const { data: tareas } = useTareas({ colaboradora_id: empleadoId ?? undefined, estado: 'pendiente' });
  const totalDias = (saldo?.vacations ?? []).reduce((acc, v) => acc + v.stock, 0);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card title="Mis tareas pendientes" value={(tareas as unknown[] | null)?.length ?? 0} highlight />
        <Card title="Días de vacaciones disponibles" value={ls ? '…' : Math.round(totalDias)} />
        <Card title="Mensajes nuevos" value={0} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <QuickAction href={`/dashboard/colaboradoras/${empleadoId}`} label="Mi perfil" />
        <QuickAction href="/dashboard/vacaciones" label="Solicitar vacaciones" />
        <QuickAction href="/dashboard/liquidaciones" label="Mis liquidaciones" />
      </div>
    </>
  );
}

// ── UI helpers ──

function Card({ title, value, href, highlight }: { title: string; value: string | number; href?: string; highlight?: boolean }) {
  const content = (
    <div className={`p-4 rounded-xl border ${highlight ? 'border-[#F0197A]/40 bg-pink-50/50' : 'border-gray-100 bg-white'}`}>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
  return href ? <Link href={href} className="hover:opacity-80">{content}</Link> : content;
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-[#F0197A] hover:shadow-sm transition flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#F0197A]">→</div>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </Link>
  );
}

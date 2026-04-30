'use client';

import { useState, useEffect } from 'react';

interface Documento {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  tipo: string;
  nombre: string;
  fechaCreacion: string;
  estado: string;
  url?: string;
}

const TIPO_LABELS: Record<string, string> = {
  contrato: 'Contrato',
  anexo: 'Anexo',
  certificado: 'Certificado',
  finiquito: 'Finiquito',
  otro: 'Otro',
};

const ESTADO_COLORS: Record<string, string> = {
  firmado: 'bg-emerald-100 text-emerald-700',
  pendiente_firma: 'bg-yellow-100 text-yellow-700',
  emitido: 'bg-blue-100 text-blue-700',
  disponible: 'bg-gray-100 text-gray-600',
};

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/buk/documents')
      .then(r => r.json())
      .then(json => {
        setDocuments(Array.isArray(json.data) ? json.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.message || 'Error desconocido');
        setLoading(false);
      });
  }, []);

  const filtered = documents.filter(d => {
    if (filterTipo && d.tipo !== filterTipo) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.nombre.toLowerCase().includes(q) ||
        d.empleadoNombre.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tipos = [...new Set(documents.map(d => d.tipo))];

  const byType = tipos.reduce<Record<string, number>>((acc, t) => {
    acc[t] = documents.filter(d => d.tipo === t).length;
    return acc;
  }, {});

  const pendientes = documents.filter(d => d.estado === 'pendiente_firma').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Documentos</h1>
        <div className="text-sm text-gray-500">{documents.length} documentos totales</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tipos.map(tipo => (
          <button
            key={tipo}
            onClick={() => setFilterTipo(filterTipo === tipo ? '' : tipo)}
            className={`bg-white rounded-xl shadow-sm border p-4 text-left transition hover:shadow-md ${
              filterTipo === tipo ? 'border-[#F0197A] ring-1 ring-[#F0197A]' : 'border-gray-100'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{byType[tipo]}</div>
            <div className="text-xs text-gray-500 font-medium mt-1">{TIPO_LABELS[tipo] || tipo}</div>
          </button>
        ))}
        {pendientes > 0 && (
          <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
            <div className="text-2xl font-bold text-yellow-700">{pendientes}</div>
            <div className="text-xs text-yellow-600 font-medium mt-1">Pendientes de Firma</div>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">Error: {error}</div>}

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 h-10 shadow-sm border border-gray-100 flex-1 max-w-sm">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o colaboradora..."
            className="border-none bg-transparent outline-none text-sm text-gray-700 w-full placeholder:text-gray-400"
          />
        </div>
        {filterTipo && (
          <button
            onClick={() => setFilterTipo('')}
            className="text-xs text-[#F0197A] font-medium hover:underline"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Cargando documentos...</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400">No hay documentos para mostrar.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Documento</th>
                <th className="px-3 py-3">Colaboradora</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Fecha</th>
                <th className="px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{doc.nombre}</div>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{doc.empleadoNombre}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {TIPO_LABELS[doc.tipo] || doc.tipo}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500">{doc.fechaCreacion}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      ESTADO_COLORS[doc.estado] || 'bg-gray-100 text-gray-500'
                    }`}>
                      {doc.estado === 'pendiente_firma' ? 'Pendiente firma' : doc.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployees } from '@/hooks/useBuk';
import { ArrowLeft } from 'lucide-react';

export default function NuevaHoraExtraPage() {
  const router = useRouter();
  const { data: employees } = useEmployees();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    empleadoId: '',
    fecha: '',
    horas: '',
    tipo: '50%',
    motivo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.empleadoId || !formData.fecha || !formData.horas) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/buk/overtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: parseInt(formData.empleadoId),
          date: formData.fecha,
          hours: parseFloat(formData.horas),
          overtime_type: formData.tipo,
          observations: formData.motivo,
          status: 'pendiente',
        }),
      });

      if (response.ok) {
        alert('Horas extra registradas exitosamente');
        router.push('/dashboard/horas-extra');
      } else {
        alert('Error al registrar horas extra');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar horas extra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/horas-extra"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Registrar Horas Extra</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Empleada */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Colaboradora <span className="text-red-500">*</span>
            </label>
            <select
              name="empleadoId"
              value={formData.empleadoId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0197A] focus:border-transparent"
            >
              <option value="">Selecciona una colaboradora</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombreCompleto}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0197A] focus:border-transparent"
            />
          </div>

          {/* Horas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Horas <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="horas"
              value={formData.horas}
              onChange={handleChange}
              placeholder="Ej: 2.5"
              min="0.5"
              step="0.5"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0197A] focus:border-transparent"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Recargo <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0197A] focus:border-transparent"
            >
              <option value="50%">50% (Normal)</option>
              <option value="100%">100% (Festivo)</option>
            </select>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivo o Observaciones
            </label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Describe el motivo de las horas extra..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0197A] focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#F0197A] text-white font-semibold rounded-lg hover:bg-[#d4166c] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Horas Extra'}
            </button>
            <Link
              href="/dashboard/horas-extra"
              className="px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

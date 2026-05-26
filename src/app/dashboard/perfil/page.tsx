'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Users, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

export default function PerfilPage() {
  const fmt = (n: number) => '$' + n.toLocaleString('es-CL');

  const adminData = {
    nombre: 'Rene Aravena',
    email: 'rene@email.com',
    plan: 'Poppins Premium',
    direccion: 'Providencia, Santiago',
    telefono: '+56 9 8765 4321',
  };

  const hogarData = {
    empleadas: 3,
    costoMensual: 1850000,
    proximaNomina: '2026-03-31',
  };

  const facturacionData = {
    plan: 'Poppins Premium',
    precio: 29990,
    ciclo: 'Mensual',
    proximaPago: '2026-03-20',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1B1564] to-[#3730A3] flex items-center justify-center text-2xl font-bold text-white shrink-0">
            RA
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{adminData.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">Administrador Poppins</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-[#F0197A]" />
                {adminData.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#F0197A]" />
                {adminData.telefono}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#F0197A]" />
                {adminData.direccion}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</div>
            <div className="text-sm font-bold text-[#F0197A] mt-1">{adminData.plan}</div>
            <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition">
              Cambiar Plan
            </button>
          </div>
        </div>
      </div>

      {/* Mi Hogar Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Mi Hogar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium">Colaboradoras Activas</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{hogarData.empleadas}</div>
              </div>
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium">Costo Mensual</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{fmt(hogarData.costoMensual)}</div>
              </div>
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium">Próxima Nómina</div>
                <div className="text-lg font-bold text-gray-900 mt-2">{hogarData.proximaNomina}</div>
              </div>
              <div className="p-2.5 bg-[#F0197A]/10 rounded-lg">
                <Calendar className="w-5 h-5 text-[#F0197A]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facturación Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Facturación Poppins</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="text-sm font-semibold text-gray-800">Plan Actual</div>
                <div className="text-xs text-gray-500 mt-1">{facturacionData.plan}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{fmt(facturacionData.precio)}</div>
                <div className="text-xs text-gray-500 mt-1">/{facturacionData.ciclo.toLowerCase()}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="text-sm font-semibold text-gray-800">Próximo Pago</div>
                <div className="text-xs text-gray-500 mt-1">Se procesará automáticamente</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{facturacionData.proximaPago}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-800">Método de Pago</div>
                <div className="text-xs text-gray-500 mt-1">Tarjeta de crédito</div>
              </div>
              <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-gray-900">¿Necesitas ayuda?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Accede a nuestro centro de ayuda, contacta al soporte o consulta la documentación.
            </p>
            <div className="flex gap-3 mt-3">
              <button className="text-sm font-medium text-blue-600 hover:underline">Centro de Ayuda</button>
              <span className="text-gray-300">•</span>
              <button className="text-sm font-medium text-blue-600 hover:underline">Contactar Soporte</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

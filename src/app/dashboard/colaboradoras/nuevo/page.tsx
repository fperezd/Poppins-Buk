'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHogares, useCatalogoCargos } from '@/hooks/api';
import { isColaboradora } from '@/lib/api/schemas/colaboradoras';
import { apiPost, ApiError } from '@/lib/api/client';

// ── Validador RUT chileno ──

function validateRUT(rut: string): boolean {
  const cleaned = rut.replace(/[^0-9k]/gi, '');
  if (cleaned.length < 8) return false;
  const parts = cleaned.split('');
  const verifier = parts.pop()?.toLowerCase();
  const number = parts.join('');
  if (!/^\d+$/.test(number)) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  const expectedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'k' : remainder.toString();
  return expectedVerifier === verifier;
}

function formatRUT(rut: string): string {
  const cleaned = rut.replace(/[^0-9k]/gi, '');
  if (cleaned.length < 2) return cleaned;
  const verifier = cleaned.slice(-1);
  const number = cleaned.slice(0, -1);
  const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${verifier}`;
}

// ── Página ──

interface FormData {
  first_name: string;
  surname: string;
  second_surname: string;
  rut: string;
  email: string;
  phone_number: string;
  address: string;
  area_id: number | '';      // hogar
  role_id: number | '';      // cargo
  start_date: string;
  base_salary: number;
  contract_type: 'indefinido' | 'plazo_fijo' | 'por_obra';
  pension_fund: string;
  health_company: string;
}

const initialForm: FormData = {
  first_name: '',
  surname: '',
  second_surname: '',
  rut: '',
  email: '',
  phone_number: '',
  address: '',
  area_id: '',
  role_id: '',
  start_date: new Date().toISOString().slice(0, 10),
  base_salary: 500000,
  contract_type: 'indefinido',
  pension_fund: '',
  health_company: 'fonasa',
};

export default function NuevaColaboradoraPage() {
  const router = useRouter();
  const { data: hogares } = useHogares();
  const { data: cargos } = useCatalogoCargos();

  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const cargosColaboradora = (cargos ?? []).filter(c => isColaboradora(c.name));

  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setFieldErrors(fe => { const next = { ...fe }; delete next[key]; return next; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateRUT(form.rut)) {
      setFieldErrors({ rut: ['RUT inválido'] });
      return;
    }
    if (form.area_id === '' || form.role_id === '') {
      setError('Hogar y cargo son obligatorios');
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        ...form,
        rut: formatRUT(form.rut),
        area_id: Number(form.area_id),
        role_id: Number(form.role_id),
      };
      await apiPost('/colaboradoras', body);
      router.push('/dashboard/colaboradoras');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) setFieldErrors(err.details);
      } else {
        setError(String(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/dashboard/colaboradoras" className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
          ← Volver
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Nueva colaboradora</h1>
        <p className="text-sm text-gray-500 mt-1">
          Se creará como empleado Buk asignado al hogar (Area) seleccionado.
        </p>
      </div>

      {error && (
        <div className="text-red-700 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white p-5 rounded-xl border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos personales</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombres" value={form.first_name} onChange={v => handleChange('first_name', v)} required errors={fieldErrors.first_name} />
            <Input label="Apellido paterno" value={form.surname} onChange={v => handleChange('surname', v)} required errors={fieldErrors.surname} />
            <Input label="Apellido materno" value={form.second_surname} onChange={v => handleChange('second_surname', v)} errors={fieldErrors.second_surname} />
            <Input label="RUT (12.345.678-9)" value={form.rut} onChange={v => handleChange('rut', formatRUT(v))} required errors={fieldErrors.rut} />
            <Input label="Email" type="email" value={form.email} onChange={v => handleChange('email', v)} errors={fieldErrors.email} />
            <Input label="Teléfono" value={form.phone_number} onChange={v => handleChange('phone_number', v)} errors={fieldErrors.phone_number} />
            <div className="col-span-2">
              <Input label="Dirección" value={form.address} onChange={v => handleChange('address', v)} errors={fieldErrors.address} />
            </div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-xl border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Asignación y contrato</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Hogar (Area)"
              value={String(form.area_id)}
              onChange={v => handleChange('area_id', v === '' ? '' : Number(v))}
              options={[{ value: '', label: '— Seleccionar —' }, ...(hogares ?? []).map(h => ({ value: String(h.id), label: h.name }))]}
              required
              errors={fieldErrors.area_id}
            />
            <Select
              label="Cargo"
              value={String(form.role_id)}
              onChange={v => handleChange('role_id', v === '' ? '' : Number(v))}
              options={[{ value: '', label: '— Seleccionar —' }, ...cargosColaboradora.map(c => ({ value: String(c.id), label: c.name }))]}
              required
              errors={fieldErrors.role_id}
            />
            <Input label="Fecha de inicio" type="date" value={form.start_date} onChange={v => handleChange('start_date', v)} required />
            <Input label="Sueldo base (CLP)" type="number" value={String(form.base_salary)} onChange={v => handleChange('base_salary', Number(v) || 0)} required />
            <Select
              label="Tipo de contrato"
              value={form.contract_type}
              onChange={v => handleChange('contract_type', v as FormData['contract_type'])}
              options={[
                { value: 'indefinido', label: 'Indefinido' },
                { value: 'plazo_fijo', label: 'Plazo Fijo' },
                { value: 'por_obra', label: 'Por Obra' },
              ]}
            />
            <Input label="AFP" value={form.pension_fund} onChange={v => handleChange('pension_fund', v)} />
            <Input label="Plan de salud (fonasa/banmedica/colmena/...)" value={form.health_company} onChange={v => handleChange('health_company', v)} />
          </div>
        </section>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/colaboradoras" className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </Link>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#F0197A] text-white text-sm font-semibold rounded-lg hover:bg-[#d4166c] disabled:opacity-50">
            {submitting ? 'Guardando…' : 'Crear colaboradora'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Componentes UI inline (sin lucide) ──

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  errors?: string[];
}
function Input({ label, value, onChange, type = 'text', required, errors }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F0197A]"
      />
      {errors && errors.map((e, i) => <p key={i} className="text-xs text-red-600 mt-1">{e}</p>)}
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  errors?: string[];
}
function Select({ label, value, onChange, options, required, errors }: SelectProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F0197A] bg-white"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors && errors.map((e, i) => <p key={i} className="text-xs text-red-600 mt-1">{e}</p>)}
    </div>
  );
}

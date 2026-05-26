'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/api';

const ROL_LABEL: Record<string, string> = {
  admin: 'Admin',
  empleador: 'Empleador',
  colaboradora: 'Colaboradora',
};

function initials(text: string): string {
  const parts = text.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function Topbar() {
  const router = useRouter();
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // cerrar el menu si clickean afuera
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const displayName = me?.buk_employee?.full_name ?? me?.email ?? 'Usuario';
  const rolLabel = me?.rol ? ROL_LABEL[me.rol] : '';

  return (
    <div className="h-[52px] min-h-[52px] bg-white border-b border-gray-200 flex items-center px-4 gap-[10px] z-50">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 h-[34px] flex-1 max-w-[380px]">
        <span className="text-gray-400 text-sm">🔍</span>
        <input
          placeholder="Buscar..."
          className="border-none bg-transparent outline-none font-inherit text-[13px] text-gray-700 w-full placeholder:text-gray-400"
        />
      </div>

      <div className="flex-1" />

      {/* User chip + menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 px-[10px] py-1 rounded-[20px] cursor-pointer border border-gray-200 hover:bg-gray-50"
        >
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#1B1564] to-[#3730A3] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {initials(displayName)}
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-medium text-gray-700">{displayName.split(' ').slice(0, 2).join(' ')}</div>
            {rolLabel && <div className="text-[10px] text-gray-500">{rolLabel}</div>}
          </div>
        </button>

        {open && (
          <div className="absolute right-0 top-[42px] bg-white border border-gray-200 rounded-lg shadow-lg w-56 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-700 truncate">{displayName}</div>
              {me?.email && <div className="text-[10px] text-gray-500 truncate">{me.email}</div>}
              {rolLabel && <div className="text-[10px] text-gray-400 mt-0.5">Rol: {rolLabel}</div>}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

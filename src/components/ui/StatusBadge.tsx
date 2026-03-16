'use client';

import React from 'react';

type Estado = string;
type Size = 'sm' | 'md';

interface StatusBadgeProps {
  estado: Estado;
  size?: Size;
}

const getStatusColor = (estado: string): string => {
  const normalized = estado.toLowerCase().trim();

  if (['activo', 'aprobada', 'approved', 'paid', 'pagado'].includes(normalized)) {
    return 'bg-emerald-100 text-emerald-800';
  }

  if (['inactivo', 'rechazada', 'rejected'].includes(normalized)) {
    return 'bg-red-100 text-red-800';
  }

  if (['licencia', 'pendiente', 'pending'].includes(normalized)) {
    return 'bg-amber-100 text-amber-800';
  }

  if (['draft', 'calculating'].includes(normalized)) {
    return 'bg-blue-100 text-blue-800';
  }

  return 'bg-gray-100 text-gray-800';
};

const getSizeClasses = (size: Size): string => {
  switch (size) {
    case 'sm':
      return 'px-2 py-1 text-xs font-medium rounded';
    case 'md':
    default:
      return 'px-3 py-1.5 text-sm font-medium rounded-md';
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ estado, size = 'md' }) => {
  const colorClasses = getStatusColor(estado);
  const sizeClasses = getSizeClasses(size);

  return (
    <span className={`inline-block ${colorClasses} ${sizeClasses} whitespace-nowrap`}>
      {estado}
    </span>
  );
};

export default StatusBadge;

'use client';

import React from 'react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12 px-4">
      {/* Icon Container */}
      <div
        className="mb-4 inline-flex items-center justify-center rounded-full p-3"
        style={{ backgroundColor: '#F0F2F5' }}
      >
        <div className="text-gray-400" style={{ color: '#1B1564', opacity: 0.6 }}>
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className="mb-2 text-center text-lg font-semibold"
        style={{ color: '#1B1564' }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mb-6 max-w-sm text-center text-sm text-gray-600">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-block rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#F0197A' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

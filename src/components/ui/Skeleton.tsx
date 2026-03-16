'use client';

import React from 'react';

interface SkeletonLineProps {
  className?: string;
}

interface SkeletonCardProps {
  className?: string;
}

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({ className = '' }) => {
  return (
    <div
      className={`h-4 animate-pulse rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}
    />
  );
};

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-4">
        <SkeletonLine className="mb-2 h-6 w-3/4" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-5/6" />
        <SkeletonLine className="h-4 w-4/6" />
      </div>

      {/* Footer */}
      <div className="mt-6 flex gap-2">
        <SkeletonLine className="h-10 w-1/4 rounded" />
        <SkeletonLine className="h-10 flex-1 rounded" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  cols = 4,
  className = '',
}) => {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
      {/* Table Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={`header-${i}`}>
              <SkeletonLine className="h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="border-b border-gray-100 p-4 last:border-b-0"
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div key={`col-${colIndex}`}>
                  <SkeletonLine className="h-4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  SkeletonLine,
  SkeletonCard,
  SkeletonTable,
};

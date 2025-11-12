'use client';

import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Component
 * Navigation breadcrumb with home icon and clickable items
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', onClick: () => navigate('/home') },
 *     { label: 'Kibibot', isActive: true }
 *   ]}
 * />
 * ```
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="pb-4 mb-4 border-b border-[#DFE4EA] dark:border-[#374151]">
      <div className="flex items-center gap-2 text-sm" style={{ color: '#7B7B7B' }}>
        {/* Home Icon */}
        {items[0]?.onClick && (
          <>
            <button
              onClick={items[0].onClick}
              className="hover:text-primary-green transition-colors"
              aria-label="Ir a inicio"
            >
              <Home className="w-4 h-4" />
            </button>
            {items.length > 1 && <ChevronRight className="w-4 h-4" />}
          </>
        )}

        {/* Rest of breadcrumb items */}
        {items.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="hover:text-primary-green transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={item.isActive ? 'text-primary-green font-medium' : ''}>
                {item.label}
              </span>
            )}
            {index < items.length - 2 && <ChevronRight className="w-4 h-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

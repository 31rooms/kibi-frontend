'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
}

/**
 * DropdownMenu Component
 * Reusable dropdown menu with three dots trigger
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   items={[
 *     { label: 'Editar nombre', onClick: () => {} },
 *     { label: 'Marcar favorito', onClick: () => {} },
 *     { label: 'Eliminar', onClick: () => {}, variant: 'danger' }
 *   ]}
 * />
 * ```
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  className,
  buttonClassName,
  menuClassName,
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'p-2 rounded-full transition-colors',
          'text-grey-600 dark:text-grey-400',
          'hover:bg-grey-100 dark:hover:bg-grey-700',
          buttonClassName
        )}
        aria-label="Abrir menú"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 py-2 min-w-[180px]',
            'bg-white dark:bg-[#1E242D]',
            'border border-grey-300 dark:border-grey-700',
            'rounded-lg shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item);
              }}
              className={cn(
                'w-full px-4 py-2 text-left text-sm',
                'flex items-center gap-3',
                'transition-colors',
                item.variant === 'danger'
                  ? 'text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20'
                  : 'text-dark-900 dark:text-white hover:bg-grey-100 dark:hover:bg-grey-700'
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

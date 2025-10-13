'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface ListDropdownItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ListDropdownProps {
  items: ListDropdownItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const ListDropdown = React.forwardRef<HTMLDivElement, ListDropdownProps>(
  ({ items, value, onValueChange, className }, ref) => {
    const handleItemClick = (itemValue: string, disabled?: boolean) => {
      if (!disabled && onValueChange) {
        onValueChange(itemValue);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-grey-200 bg-white p-1 shadow-sm',
          className
        )}
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => handleItemClick(item.value, item.disabled)}
            disabled={item.disabled}
            className={cn(
              'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
              'hover:bg-grey-100',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
              value === item.value && 'bg-blue-500 text-white hover:bg-blue-600'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }
);

ListDropdown.displayName = 'ListDropdown';

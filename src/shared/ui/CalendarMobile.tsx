'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  setMonth,
  setYear,
  isSameMonth,
  isSameDay,
  isToday,
  getMonth,
  getYear,
} from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

export interface CalendarMobileProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  variant?: 'default' | 'compact';
  onCancel?: () => void;
  onAccept?: () => void;
  cancelLabel?: string;
  acceptLabel?: string;
}

export const CalendarMobile = React.forwardRef<HTMLDivElement, CalendarMobileProps>(
  (
    {
      selected,
      onSelect,
      className,
      variant = 'default',
      onCancel,
      onAccept,
      cancelLabel = 'Cancelar',
      acceptLabel = 'Aceptar',
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = variant === 'compact' ? ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'] : ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);

    const handleMonthChange = (month: string) => {
      const newDate = setMonth(currentMonth, parseInt(month));
      setCurrentMonth(newDate);
    };

    const handleYearChange = (year: string) => {
      const newDate = setYear(currentMonth, parseInt(year));
      setCurrentMonth(newDate);
    };

    const handleDateClick = (date: Date) => {
      if (onSelect) {
        onSelect(date);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-white rounded-lg border border-grey-200 shadow-sm p-4',
          variant === 'default' ? 'max-w-sm' : 'max-w-xs',
          className
        )}
      >
        {/* Header with Dropdowns */}
        <div className="flex gap-2 mb-4">
          <Select
            value={getMonth(currentMonth).toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className={variant === 'compact' ? 'text-xs' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getYear(currentMonth).toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className={cn('w-24', variant === 'compact' ? 'text-xs' : '')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className={cn(
                'text-center font-medium text-grey-600 py-1',
                variant === 'compact' ? 'text-[10px]' : 'text-xs'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = selected && isSameDay(day, selected);
            const isTodayDate = isToday(day);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!isCurrentMonth}
                className={cn(
                  'w-full aspect-square rounded-md transition-colors flex items-center justify-center',
                  variant === 'compact' ? 'text-xs' : 'text-sm',
                  'hover:bg-grey-100',
                  !isCurrentMonth && 'text-grey-300 cursor-not-allowed',
                  isCurrentMonth && 'text-grey-900',
                  isSelected &&
                    'bg-primary-green text-white hover:bg-[#7da855] font-semibold',
                  isTodayDate &&
                    !isSelected &&
                    'font-semibold border-2 border-primary-green text-primary-green'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        {(onCancel || onAccept) && (
          <div className="flex gap-2 mt-4">
            {onCancel && (
              <button
                onClick={onCancel}
                className={cn(
                  'flex-1 px-4 py-2 font-medium text-grey-700 bg-white border border-grey-300 hover:bg-grey-50 rounded-lg transition-colors',
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                )}
              >
                {cancelLabel}
              </button>
            )}
            {onAccept && (
              <button
                onClick={onAccept}
                className={cn(
                  'flex-1 px-4 py-2 font-medium text-white bg-primary-green hover:bg-[#7da855] rounded-lg transition-colors',
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                )}
              >
                {acceptLabel}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

CalendarMobile.displayName = 'CalendarMobile';

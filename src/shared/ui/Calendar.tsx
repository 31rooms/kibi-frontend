'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  showActions?: boolean;
  onRemove?: () => void;
  onDone?: () => void;
  removeLabel?: string;
  doneLabel?: string;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      selected,
      onSelect,
      className,
      showActions = true,
      onRemove,
      onDone,
      removeLabel = 'Remove',
      doneLabel = 'Done',
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'MMMM yyyy';
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const handlePrevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDateClick = (date: Date, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onSelect) {
        onSelect(date);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full max-w-sm bg-white rounded-lg border border-grey-200 shadow-sm p-4',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-grey-100 rounded-md transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-grey-600" />
          </button>
          <h2 className="text-base font-medium text-grey-900">
            {format(currentMonth, dateFormat)}
          </h2>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-grey-100 rounded-md transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-grey-600" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-grey-600 py-2"
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
                type="button"
                key={index}
                onClick={(e) => handleDateClick(day, e)}
                className={cn(
                  'h-9 w-full text-sm rounded-md transition-colors',
                  'hover:bg-grey-100',
                  !isCurrentMonth && 'text-grey-400',
                  isCurrentMonth && 'text-grey-900',
                  isSelected &&
                    'bg-blue-500 text-white hover:bg-blue-600 font-medium',
                  isTodayDate &&
                    !isSelected &&
                    'font-semibold text-blue-500 bg-blue-50'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onRemove}
              className="flex-1 px-4 py-2 text-sm font-medium text-grey-700 bg-dark hover:bg-grey-800 rounded-lg transition-colors"
            >
              {removeLabel}
            </button>
            <button
              type="button"
              onClick={onDone}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              {doneLabel}
            </button>
          </div>
        )}
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

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
  setMonth,
  setYear,
  getYear,
  getMonth,
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
    const [showYearSelect, setShowYearSelect] = React.useState(false);
    const [showMonthSelect, setShowMonthSelect] = React.useState(false);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = 'MMMM yyyy';
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    // Generate year options (from current year - 100 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 101 }, (_, i) => currentYear - i);

    // Month names in Spanish
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

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

    const handleYearChange = (year: number) => {
      setCurrentMonth(setYear(currentMonth, year));
      setShowYearSelect(false);
    };

    const handleMonthChange = (monthIndex: number) => {
      setCurrentMonth(setMonth(currentMonth, monthIndex));
      setShowMonthSelect(false);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          setShowYearSelect(false);
          setShowMonthSelect(false);
        }
      };

      if (showYearSelect || showMonthSelect) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showYearSelect, showMonthSelect]);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full max-w-sm bg-white dark:bg-[#171B22] rounded-lg border border-grey-200 shadow-sm p-4',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-grey-100 dark:hover:bg-grey-800 rounded-md transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-grey-600 dark:text-grey-400" />
          </button>

          <div className="flex items-center gap-2">
            {/* Month Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowMonthSelect(!showMonthSelect);
                  setShowYearSelect(false);
                }}
                className="px-3 py-1 text-base font-medium text-grey-900 dark:text-white hover:bg-grey-100 dark:hover:bg-grey-800 rounded-md transition-colors"
              >
                {months[getMonth(currentMonth)]}
              </button>

              {showMonthSelect && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1E242D] border border-grey-200 dark:border-grey-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {months.map((month, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleMonthChange(index)}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors",
                        getMonth(currentMonth) === index && "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium"
                      )}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowYearSelect(!showYearSelect);
                  setShowMonthSelect(false);
                }}
                className="px-3 py-1 text-base font-medium text-grey-900 dark:text-white hover:bg-grey-100 dark:hover:bg-grey-800 rounded-md transition-colors"
              >
                {getYear(currentMonth)}
              </button>

              {showYearSelect && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-[#1E242D] border border-grey-200 dark:border-grey-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors whitespace-nowrap",
                        getYear(currentMonth) === year && "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-grey-100 dark:hover:bg-grey-800 rounded-md transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-grey-600 dark:text-grey-400" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-grey-600 dark:text-grey-400 py-2"
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
                  'hover:bg-grey-100 dark:hover:text-grey-900',
                  !isCurrentMonth && 'text-grey-400',
                  isCurrentMonth && 'text-grey-900 dark:text-white',
                  isSelected &&
                    'bg-blue-500 text-white hover:bg-blue-600 font-medium',
                  isTodayDate &&
                    !isSelected &&
                    'font-semibold text-blue-500 dark:text-grey-900 bg-blue-50'
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
              className="flex-1 px-4 py-2 text-sm font-medium text-grey-700 dark:text-grey-300 bg-dark hover:bg-grey-800 rounded-lg transition-colors"
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

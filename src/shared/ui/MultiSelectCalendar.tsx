'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Card } from './Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  getYear,
  getMonth,
  setYear,
  setMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';

export interface MultiSelectCalendarProps {
  selectedDates?: Date[];
  onDatesChange?: (dates: Date[]) => void;
  className?: string;
  activeDates?: Date[];
  inactiveDates?: Date[];
  readOnly?: boolean; // Nueva prop para modo solo lectura
}

const MONTHS = [
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

export const MultiSelectCalendar = React.forwardRef<HTMLDivElement, MultiSelectCalendarProps>(
  (
    {
      selectedDates = [],
      onDatesChange,
      className,
      activeDates = [],
      inactiveDates = [],
      readOnly = false,
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const currentYear = getYear(currentMonth);
    const currentMonthIndex = getMonth(currentMonth);

    // Generate year options (current year ± 5 years)
    const yearOptions = React.useMemo(() => {
      const years = [];
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push(i);
      }
      return years;
    }, [currentYear]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    const handleDateClick = (date: Date) => {
      if (readOnly || !onDatesChange) return;

      const isSelected = selectedDates.some((d) => isSameDay(d, date));

      if (isSelected) {
        // Remove date
        onDatesChange(selectedDates.filter((d) => !isSameDay(d, date)));
      } else {
        // Add date
        onDatesChange([...selectedDates, date]);
      }
    };

    const handleMonthChange = (value: string) => {
      const monthIndex = parseInt(value);
      setCurrentMonth(setMonth(currentMonth, monthIndex));
    };

    const handleYearChange = (value: string) => {
      const year = parseInt(value);
      setCurrentMonth(setYear(currentMonth, year));
    };

    const isDateActive = (date: Date) => {
      return activeDates.some((d) => isSameDay(d, date));
    };

    const isDateInactive = (date: Date) => {
      return inactiveDates.some((d) => isSameDay(d, date));
    };

    const isDateSelected = (date: Date) => {
      return selectedDates.some((d) => isSameDay(d, date));
    };

    return (
      <Card ref={ref} className={cn('w-full max-w-lg', className)}>
        {/* Legend */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#47830E]" />
            <span className="text-[14px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
              Activo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-grey-500 dark:bg-grey-600" />
            <span className="text-[14px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
              Inactivo
            </span>
          </div>
        </div>

        {/* Month and Year Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[14px] font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
              Mes
            </label>
            <Select value={currentMonthIndex.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
              Año
            </label>
            <Select value={currentYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[14px] font-medium text-[#47830E] dark:text-primary-green py-2 font-[family-name:var(--font-rubik)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isDateSelected(day);
            const isActive = isDateActive(day);
            const isInactive = isDateInactive(day);

            return (
              <button
                type="button"
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!isCurrentMonth || readOnly}
                className={cn(
                  'h-10 w-full text-[14px] rounded-lg transition-all font-[family-name:var(--font-rubik)]',
                  !readOnly && 'hover:bg-grey-100 dark:hover:bg-dark-700',
                  readOnly && 'cursor-default',
                  !isCurrentMonth && 'text-grey-300 dark:text-grey-700 cursor-not-allowed',
                  isCurrentMonth && 'text-dark-900 dark:text-white',
                  isSelected && !readOnly && 'bg-[#47830E] text-white hover:bg-[#3a6b0b] font-bold',
                  isActive && !isSelected && 'bg-[#47830E] text-white font-bold',
                  isInactive && !isSelected && 'bg-grey-100 dark:bg-grey-800'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </Card>
    );
  }
);

MultiSelectCalendar.displayName = 'MultiSelectCalendar';

'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, MultiSelectCalendar, LineChart, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { ArrowLeft } from 'lucide-react';
import { useMonthlyStatus } from '../hooks/useMonthlyStatus';

interface CalendarDetailViewProps {
  activityTimePeriod: string;
  setActivityTimePeriod: (value: string) => void;
  activityData: Array<{ category: string; value: number }>;
  onBack: () => void;
  className?: string;
}

export const CalendarDetailView = React.forwardRef<HTMLElement, CalendarDetailViewProps>(
  ({ activityTimePeriod, setActivityTimePeriod, activityData, onBack, className }, ref) => {
    const { activeDates, isLoading, year, month, setYear, setMonth } = useMonthlyStatus();

    // Handle month change from calendar
    const handleMonthChange = (newYear: number, newMonth: number) => {
      setYear(newYear);
      setMonth(newMonth);
    };

    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6",
          "bg-grey-50 dark:bg-dark-900",
          className
        )}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Botón Volver */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-dark-900 dark:text-white hover:text-primary-green dark:hover:text-primary-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[16px] font-medium font-[family-name:var(--font-rubik)]">Volver</span>
          </button>

          {/* Calendario Completo - Con datos reales */}
          <div className="relative">
            <MultiSelectCalendar
              activeDates={activeDates}
              readOnly={true}
              className="max-w-full"
              defaultMonth={new Date(year, month - 1)}
              onMonthChange={handleMonthChange}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-dark-900/50 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
              </div>
            )}
          </div>

          {/* Gráfico de Tiempo de Actividad */}
          <Card className="p-3 md:p-6">
            {/* Header con título y select */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Tiempo de Actividad
              </h3>
              <div className="w-40">
                <Select value={activityTimePeriod} onValueChange={setActivityTimePeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gráfico */}
            <LineChart
              data={activityData}
              height={320}
              showArea={true}
              showPoints={true}
              color="#95C16B"
              yAxisMax="auto"
              valueFormatter={(val) => `${val} min`}
            />

            {/* Leyenda */}
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#95C16B' }} />
                <span className="text-[14px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                  {year}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }
);

CalendarDetailView.displayName = 'CalendarDetailView';

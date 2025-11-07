'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, BarChart, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from '@/shared/ui';
import { CheckCircle, Calendar } from 'lucide-react';
import { CalendarDetailView } from './CalendarDetailView';
import { AchievementsDetailView } from './AchievementsDetailView';
import { ReforzarPuntosDebiles } from './ReforzarPuntosDebiles';

interface ProgresoSectionMobileProps {
  dashboard: any;
  timePeriod: string;
  setTimePeriod: (value: string) => void;
  activityTimePeriod: string;
  setActivityTimePeriod: (value: string) => void;
  chartData: Array<{ category: string; value: number }>;
  activityData: Array<{ category: string; value: number }>;
  weekDays: Array<{ label: string; isActive: boolean; isInactive: boolean }>;
  className?: string;
}

export const ProgresoSectionMobile = React.forwardRef<HTMLElement, ProgresoSectionMobileProps>(
  ({ dashboard, timePeriod, setTimePeriod, activityTimePeriod, setActivityTimePeriod, chartData, activityData, weekDays, className }, ref) => {
    const [showCalendarDetail, setShowCalendarDetail] = useState(false);
    const [showAchievementsDetail, setShowAchievementsDetail] = useState(false);
    const [showReforzarView, setShowReforzarView] = useState(false);

    // Función para acortar labels largos en mobile
    const shortenLabel = (label: string): string => {
      return label.length > 12 ? label.substring(0, 10) + '...' : label;
    };

    // Datos del gráfico con labels acortados para mobile
    const mobileChartData = chartData.map(item => ({
      ...item,
      category: shortenLabel(item.category)
    }));

    // Si showCalendarDetail es true, mostrar la vista de detalle del calendario
    if (showCalendarDetail) {
      return (
        <CalendarDetailView
          ref={ref}
          activityTimePeriod={activityTimePeriod}
          setActivityTimePeriod={setActivityTimePeriod}
          activityData={activityData}
          onBack={() => setShowCalendarDetail(false)}
          className={className}
        />
      );
    }

    // Si showAchievementsDetail es true, mostrar la vista de detalle de logros
    if (showAchievementsDetail) {
      return (
        <AchievementsDetailView
          ref={ref}
          onBack={() => setShowAchievementsDetail(false)}
          className={className}
        />
      );
    }

    // Si showReforzarView es true, mostrar la vista de refuerzo
    if (showReforzarView) {
      return (
        <ReforzarPuntosDebiles
          ref={ref}
          onBack={() => setShowReforzarView(false)}
          className={className}
        />
      );
    }

    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6",
          "bg-grey-50 dark:bg-dark-900",
          className
        )}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Weekly Calendar Card - Clickeable */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowCalendarDetail(!showCalendarDetail)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-primary-green" />
                    Activo
                  </span>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    Inactivo
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                        day.isActive && "bg-primary-green text-white",
                        day.isInactive && "bg-gray-700 dark:bg-gray-800 text-gray-400"
                      )}
                    >
                      {day.label}
                    </div>
                  ))}
                </div>
              </div>

              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </Card>

          {/* Card de Puntaje Aproximado */}
          <Card>
            <div>
              {/* Primera fila: Icono, Título y Puntaje */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/status-up.svg"
                    alt="Status Up Icon"
                    className="w-8 h-8"
                  />
                  <h2 className="text-[15px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] leading-tight">
                    Puntaje aproximado en tu prueba
                  </h2>
                </div>
                <div className="bg-[#E7FFE7] dark:bg-[#1E242D] px-2 py-1.5 rounded-lg flex-shrink-0">
                  <div className="text-[20px] font-bold font-[family-name:var(--font-quicksand)] leading-tight" style={{ color: '#47830E' }}>
                    {dashboard?.projectedScore?.score || 20} Pts.
                  </div>
                </div>
              </div>

              {/* Segunda fila: Descripción */}
              <p className="text-[13px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)] mt-2">
                El puntaje reflejado es una aproximación de lo que puedes obtener en tu examen real de la UAEMEX con base en tu progreso hasta ahora.
              </p>
            </div>
          </Card>

          {/* Sección de Logros - Solo 3 Cards en Mobile */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Logros
              </h2>
              <button
                onClick={() => setShowAchievementsDetail(true)}
                className="text-[14px] text-primary-blue dark:text-primary-green font-[family-name:var(--font-rubik)] flex items-center gap-1 hover:underline"
              >
                Ver todos
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Grid de Cards de Logros - Solo 3 en mobile */}
            <div className="grid grid-cols-3 gap-3">
              {/* Logro 1: Primer paso */}
              <Card className="flex-1 min-w-0">
                <div className="flex flex-col items-center text-center gap-2">
                  <img
                    src="/icons/succes-icon.svg"
                    alt="Primer paso"
                    className="w-12 h-12"
                  />
                  <h3 className="text-[13px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] leading-tight">
                    Primer paso
                  </h3>
                </div>
              </Card>

              {/* Logro 2: Progreso constante */}
              <Card className="flex-1 min-w-0">
                <div className="flex flex-col items-center text-center gap-2">
                  <img
                    src="/icons/trend-up-progreso.svg"
                    alt="Progreso constante"
                    className="w-12 h-12 dark:hidden"
                  />
                  <img
                    src="/icons/trend-up-progreso-dark.svg"
                    alt="Progreso constante"
                    className="w-12 h-12 hidden dark:block"
                  />
                  <h3 className="text-[13px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] leading-tight">
                    Progreso constante
                  </h3>
                </div>
              </Card>

              {/* Logro 3: Semana perfecta */}
              <Card className="flex-1 min-w-0">
                <div className="flex flex-col items-center text-center gap-2">
                  <img
                    src="/icons/calendar.svg"
                    alt="Semana perfecta"
                    className="w-12 h-12 dark:hidden"
                  />
                  <img
                    src="/icons/calendar-dark.svg"
                    alt="Semana perfecta"
                    className="w-12 h-12 hidden dark:block"
                  />
                  <h3 className="text-[13px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] leading-tight">
                    Semana perfecta
                  </h3>
                </div>
              </Card>
            </div>
          </div>

          {/* Sección de Estadísticas - 100% width */}
          <div className="relative">
            <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
              Estadísticas
            </h2>

            <Card className="p-4 pb-10">
              {/* Header con título y select */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                  % de Efectividad
                </h3>
                <div className="w-40">
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="year">Este año</SelectItem>
                      <SelectItem value="all">Todo el tiempo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Gráfico */}
              <BarChart
                data={mobileChartData}
                height={250}
                horizontal={true}
                showValues={true}
                color="#95C16B"
              />

              {/* Leyenda */}
              <div className="flex items-center justify-center mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#95C16B' }} />
                  <span className="text-[12px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                    2025
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Botón Reforzar - Centrado en Mobile */}
          <div className="flex justify-center pb-4">
            <Button
              variant="primary"
              size="medium"
              color="green"
              onClick={() => setShowReforzarView(true)}
            >
              Reforzar puntos débiles
            </Button>
          </div>
        </div>
      </main>
    );
  }
);

ProgresoSectionMobile.displayName = 'ProgresoSectionMobile';

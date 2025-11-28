'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, MultiSelectCalendar, BarChart, LineChart, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, Progress } from '@/shared/ui';
import { X, Star, TrendingUp, Calendar, Beaker, Search, BookOpen, Trophy, Target } from 'lucide-react';
import { ReforzarPuntosDebiles } from './ReforzarPuntosDebiles';
import { useMonthlyStatus } from '../hooks/useMonthlyStatus';
import type { Period } from '../hooks/useActivityTimeChart';

interface ProgresoSectionDesktopProps {
  dashboard: any;
  timePeriod: string;
  setTimePeriod: (value: string) => void;
  activityTimePeriod: Period;
  setActivityTimePeriod: (value: Period) => void;
  chartData: Array<{ category: string; value: number }>;
  activityData: Array<{ category: string; value: number }>;
  className?: string;
}

export const ProgresoSectionDesktop = React.forwardRef<HTMLElement, ProgresoSectionDesktopProps>(
  ({ dashboard, timePeriod, setTimePeriod, activityTimePeriod, setActivityTimePeriod, chartData, activityData, className }, ref) => {
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'todos' | 'alcanzados' | 'progreso'>('todos');
    const [showReforzarView, setShowReforzarView] = useState(false);

    // Hook para obtener datos del calendario mensual
    const { activeDates, isLoading: isCalendarLoading, year, month, setYear, setMonth } = useMonthlyStatus();

    // Handle month change from calendar
    const handleCalendarMonthChange = (newYear: number, newMonth: number) => {
      setYear(newYear);
      setMonth(newMonth);
    };

    // Datos de logros
    const achievements = [
      {
        id: '1',
        title: 'Primer paso',
        description: 'Primer reto alcanzado con éxito',
        date: 'dd/mm/aa',
        icon: <Star className="w-5 h-5" />,
        iconBgColor: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        achieved: true,
      },
      {
        id: '2',
        title: 'Progreso constante',
        description: 'Has superado tu efectividad durante la semana',
        date: 'dd/mm/aa',
        icon: <TrendingUp className="w-5 h-5" />,
        iconBgColor: 'bg-orange-100 dark:bg-orange-900/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        achieved: true,
      },
      {
        id: '3',
        title: 'Semana perfecta',
        description: 'Practicaste una semana continua',
        date: 'dd/mm/aa',
        icon: <Calendar className="w-5 h-5" />,
        iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        achieved: true,
      },
      {
        id: '4',
        title: 'Ciencia al máximo',
        description: '100% de aciertos en tu prueba de ciencias',
        date: 'dd/mm/aa',
        icon: <Beaker className="w-5 h-5" />,
        iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        achieved: true,
      },
      {
        id: '5',
        title: 'Explorador de temas',
        description: '0%',
        icon: <Search className="w-5 h-5" />,
        iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        achieved: false,
        progress: 0,
      },
      {
        id: '6',
        title: 'Lector estrella',
        description: '0%',
        icon: <BookOpen className="w-5 h-5" />,
        iconBgColor: 'bg-pink-100 dark:bg-pink-900/30',
        iconColor: 'text-pink-600 dark:text-pink-400',
        achieved: false,
        progress: 0,
      },
      {
        id: '7',
        title: 'Reto cumplido',
        description: '0%',
        icon: <Trophy className="w-5 h-5" />,
        iconBgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        achieved: false,
        progress: 0,
      },
      {
        id: '8',
        title: 'Maestro de las matemáticas',
        description: '0%',
        icon: <Target className="w-5 h-5" />,
        iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        achieved: false,
        progress: 0,
      },
    ];

    const filteredAchievements = achievements.filter(achievement => {
      if (activeTab === 'alcanzados') return achievement.achieved;
      if (activeTab === 'progreso') return !achievement.achieved;
      return true; // todos
    });

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
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-grey-50 dark:bg-dark-900",
          className
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* Primera Columna - Contenido Principal */}
            <div className="space-y-6">
              {/* Card de Puntaje Aproximado - Ocupa 100% del ancho */}
              <Card>
                <div>
                  {/* Primera fila: Icono, Título y Puntaje */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/icons/status-up.svg"
                        alt="Status Up Icon"
                        className="w-10 h-10"
                      />
                      <h2 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Puntaje aproximado en tu prueba
                      </h2>
                    </div>
                    <div className="bg-[#E7FFE7] dark:bg-[#1E242D] px-[10px] py-2 rounded-lg">
                      <div className="text-[23px] font-bold font-[family-name:var(--font-quicksand)] max-h-[29px] leading-[29px]" style={{ color: '#47830E' }}>
                        {dashboard?.projectedScore?.score || 20} Pts.
                      </div>
                    </div>
                  </div>

                  {/* Segunda fila: Descripción */}
                  <p className="text-[14px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)] mt-0">
                    El puntaje reflejado es una aproximación de lo que puedes obtener en tu examen real de la UAEMEX con base en tu progreso hasta ahora.
                  </p>
                </div>
              </Card>

              {/* Sección de Logros */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                    Logros
                  </h2>
                  <button
                    onClick={() => setShowAchievementsModal(true)}
                    className="text-[16px] text-primary-blue dark:text-primary-green font-[family-name:var(--font-rubik)] flex items-center gap-2 hover:underline"
                  >
                    Ver todos
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Grid de Cards de Logros */}
                <div className="flex gap-4">
                  {/* Logro 1: Primer paso */}
                  <Card className="flex-1 min-w-0">
                    <div className="flex flex-col items-center text-center gap-3">
                      <img
                        src="/icons/succes-icon.svg"
                        alt="Primer paso"
                        className="w-16 h-16"
                      />
                      <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Primer paso
                      </h3>
                    </div>
                  </Card>

                  {/* Logro 2: Progreso constante */}
                  <Card className="flex-1 min-w-0">
                    <div className="flex flex-col items-center text-center gap-3">
                      <img
                        src="/icons/trend-up-progreso.svg"
                        alt="Progreso constante"
                        className="w-16 h-16 dark:hidden"
                      />
                      <img
                        src="/icons/trend-up-progreso-dark.svg"
                        alt="Progreso constante"
                        className="w-16 h-16 hidden dark:block"
                      />
                      <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Progreso constante
                      </h3>
                    </div>
                  </Card>

                  {/* Logro 3: Semana perfecta */}
                  <Card className="flex-1 min-w-0">
                    <div className="flex flex-col items-center text-center gap-3">
                      <img
                        src="/icons/calendar.svg"
                        alt="Semana perfecta"
                        className="w-16 h-16 dark:hidden"
                      />
                      <img
                        src="/icons/calendar-dark.svg"
                        alt="Semana perfecta"
                        className="w-16 h-16 hidden dark:block"
                      />
                      <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Semana perfecta
                      </h3>
                    </div>
                  </Card>

                  {/* Logro 4: Ciencia al máximo */}
                  <Card className="flex-1 min-w-0">
                    <div className="flex flex-col items-center text-center gap-3">
                      <img
                        src="/icons/cience.svg"
                        alt="Ciencia al máximo"
                        className="w-16 h-16 dark:hidden"
                      />
                      <img
                        src="/icons/cience-dark.svg"
                        alt="Ciencia al máximo"
                        className="w-16 h-16 hidden dark:block"
                      />
                      <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Ciencia al máximo
                      </h3>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Sección de Estadísticas */}
              <div className="relative">
                <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                  Estadísticas
                </h2>

                <Card className="p-3 md:p-6 pb-10 md:pb-16">
                  {/* Header con título y select */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                      % de Efectividad
                    </h3>
                    <div className="w-48">
                      <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger>
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
                    data={chartData}
                    height={250}
                    horizontal={true}
                    showValues={true}
                    color="#95C16B"
                  />

                  {/* Leyenda */}
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#95C16B' }} />
                      <span className="text-[14px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                        2025
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Botón Reforzar */}
              <div className="flex justify-end">
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

            {/* Segunda Columna - Calendario y Gráfico */}
            <div className="space-y-6">
              <div className="relative">
                <MultiSelectCalendar
                  activeDates={activeDates}
                  readOnly
                  defaultMonth={new Date(year, month - 1)}
                  onMonthChange={handleCalendarMonthChange}
                />
                {isCalendarLoading && (
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
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mes</SelectItem>
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
                      2025
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal de Logros */}
        {showAchievementsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setShowAchievementsModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Modal Content */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-[#171B22] rounded-lg shadow-lg flex flex-col overflow-hidden w-[700px] max-h-[80vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#DEE2E6] dark:border-[#374151]">
                <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                  Logros
                </h2>
                <button
                  onClick={() => setShowAchievementsModal(false)}
                  className="text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="h-6 w-6" strokeWidth={2} />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 py-4 border-b border-[#DEE2E6] dark:border-[#374151]">
                <div className="flex gap-1 bg-grey-100 dark:bg-dark-800 p-1 rounded-lg w-fit">
                  <button
                    onClick={() => setActiveTab('todos')}
                    className={cn(
                      "px-4 py-2 text-[14px] font-medium rounded-md transition-colors font-[family-name:var(--font-rubik)]",
                      activeTab === 'todos'
                        ? "bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-sm"
                        : "text-dark-600 dark:text-grey-400"
                    )}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setActiveTab('alcanzados')}
                    className={cn(
                      "px-4 py-2 text-[14px] font-medium rounded-md transition-colors font-[family-name:var(--font-rubik)]",
                      activeTab === 'alcanzados'
                        ? "bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-sm"
                        : "text-dark-600 dark:text-grey-400"
                    )}
                  >
                    Alcanzados
                  </button>
                  <button
                    onClick={() => setActiveTab('progreso')}
                    className={cn(
                      "px-4 py-2 text-[14px] font-medium rounded-md transition-colors font-[family-name:var(--font-rubik)]",
                      activeTab === 'progreso'
                        ? "bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-sm"
                        : "text-dark-600 dark:text-grey-400"
                    )}
                  >
                    En progreso
                  </button>
                </div>
              </div>

              {/* Content - Lista de Logros con scroll */}
              <div className="overflow-y-auto p-6">
                <div className="space-y-3">
                  {filteredAchievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={cn(
                        achievement.achieved && "bg-[#E7FFE7] dark:bg-[#1E242D] border-none"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icono con fondo circular */}
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          achievement.iconBgColor
                        )}>
                          <div className={achievement.iconColor}>
                            {achievement.icon}
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[15px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] leading-tight">
                              {achievement.title}
                            </h3>
                            {achievement.achieved && (
                              <div className="w-6 h-6 rounded-full bg-primary-green flex items-center justify-center flex-shrink-0">
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-[13px] text-dark-700 dark:text-grey-400 font-[family-name:var(--font-rubik)] mt-1">
                            {achievement.description}
                          </p>
                          {achievement.date && (
                            <p className="text-[12px] text-dark-600 dark:text-grey-500 font-[family-name:var(--font-rubik)] mt-1">
                              {achievement.date}
                            </p>
                          )}

                          {/* Barra de progreso para logros no alcanzados */}
                          {!achievement.achieved && achievement.progress !== undefined && (
                            <div className="mt-3 flex items-center gap-3">
                              <span className="text-[12px] text-dark-600 dark:text-grey-500 font-[family-name:var(--font-rubik)]">
                                {achievement.progress}%
                              </span>
                              <Progress
                                value={achievement.progress}
                                className="flex-1 h-2"
                                indicatorClassName="bg-primary-green"
                              />
                              <span className="text-[12px] text-dark-600 dark:text-grey-500 font-[family-name:var(--font-rubik)]">
                                100%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }
);

ProgresoSectionDesktop.displayName = 'ProgresoSectionDesktop';

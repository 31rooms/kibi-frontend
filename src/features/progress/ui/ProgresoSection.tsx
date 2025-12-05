'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useProgress } from '../hooks/useProgress';
import { useActivityTimeChart } from '../hooks/useActivityTimeChart';
import { useWeeklyStatus } from '@/features/home/hooks/useWeeklyStatus';
import { useProjectedExamScore } from '../hooks/useProjectedExamScore';
import { useEffectivenessHistory } from '../hooks/useEffectivenessHistory';
import { ProgresoSectionMobile } from './ProgresoSectionMobile';
import { ProgresoSectionDesktop } from './ProgresoSectionDesktop';

export interface ProgresoSectionProps extends React.HTMLAttributes<HTMLElement> {
  // Permite pasar props adicionales si es necesario
}

// Hook para detectar ancho de pantalla
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 1920, // Default to desktop to match SSR
    height: 1080,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...windowSize, mounted };
};

export const ProgresoSection = React.forwardRef<HTMLElement, ProgresoSectionProps>(
  ({ className, ...props }, ref) => {
    const { dashboard, loading, loadDashboard } = useProgress();
    const { width, mounted } = useWindowSize();
    const isDesktop = width > 1200;

    // Hook para obtener datos reales del tiempo de actividad
    const {
      data: activityData,
      period: activityTimePeriod,
      setPeriod: setActivityTimePeriod,
      isLoading: isActivityLoading,
    } = useActivityTimeChart('week');

    // Hook para obtener el estado semanal del calendario (datos reales de la API)
    const { weekDays } = useWeeklyStatus();

    // Hook para obtener el puntaje proyectado del examen
    const { data: projectedExamScore, isLoading: isProjectedScoreLoading } = useProjectedExamScore();

    // Hook para obtener el historial de efectividad por materias
    const {
      chartData,
      hasData: hasEffectivenessData,
      period: timePeriod,
      setPeriod: setTimePeriod,
      isLoading: isEffectivenessLoading,
    } = useEffectivenessHistory('week');

    useEffect(() => {
      loadDashboard();
    }, []);

    if (loading) {
      return (
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8",
            "bg-grey-50 dark:bg-dark-900",
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
          </div>
        </main>
      );
    }

    // Render Mobile or Desktop view based on screen width
    // Always render desktop during SSR to prevent hydration mismatch
    if (!mounted || isDesktop) {
      return (
        <ProgresoSectionDesktop
          ref={ref}
          dashboard={dashboard}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          activityTimePeriod={activityTimePeriod}
          setActivityTimePeriod={setActivityTimePeriod}
          chartData={chartData}
          hasEffectivenessData={hasEffectivenessData}
          isEffectivenessLoading={isEffectivenessLoading}
          activityData={activityData}
          projectedExamScore={projectedExamScore}
          className={className}
          {...props}
        />
      );
    }

    return (
      <ProgresoSectionMobile
        ref={ref}
        dashboard={dashboard}
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        activityTimePeriod={activityTimePeriod}
        setActivityTimePeriod={setActivityTimePeriod}
        chartData={chartData}
        hasEffectivenessData={hasEffectivenessData}
        isEffectivenessLoading={isEffectivenessLoading}
        activityData={activityData}
        weekDays={weekDays}
        projectedExamScore={projectedExamScore}
        className={className}
        {...props}
      />
    );
  }
);

ProgresoSection.displayName = 'ProgresoSection';

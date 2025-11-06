'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useProgress } from '../hooks/useProgress';
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

// Get days of the week with activity status
const getDaysOfWeek = () => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayIndex = today === 0 ? 6 : today - 1; // Convert to Monday-based index

  return days.map((day, index) => ({
    label: day,
    isActive: index <= mondayIndex,
    isInactive: index > mondayIndex,
  }));
};

export const ProgresoSection = React.forwardRef<HTMLElement, ProgresoSectionProps>(
  ({ className, ...props }, ref) => {
    const { dashboard, loading, loadDashboard } = useProgress();
    const [timePeriod, setTimePeriod] = useState('week');
    const [activityTimePeriod, setActivityTimePeriod] = useState('week');
    const { width, mounted } = useWindowSize();
    const isDesktop = width > 1200;

    // Datos de ejemplo para el gráfico de barras
    const chartData = [
      { category: 'Biología', value: 69.15 },
      { category: 'Historia', value: 28.3 },
      { category: 'Ciencias', value: 66.36 },
      { category: 'Matemática', value: 83.84 },
      { category: 'Comprensión lectora', value: 44.58 },
      { category: 'Geografía', value: 11.34 },
    ];

    // Datos de ejemplo para el gráfico de línea (tiempo de actividad)
    const activityData = [
      { category: 'Lun', value: 20 },
      { category: 'Mar', value: 45 },
      { category: 'Mier', value: 65 },
      { category: 'Jue', value: 65 },
      { category: 'Vie', value: 50 },
      { category: 'Sab', value: 70 },
      { category: 'Dom', value: 72 },
    ];

    const weekDays = getDaysOfWeek();

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
          activityData={activityData}
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
        activityData={activityData}
        weekDays={weekDays}
        className={className}
        {...props}
      />
    );
  }
);

ProgresoSection.displayName = 'ProgresoSection';

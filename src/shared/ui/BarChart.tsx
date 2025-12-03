'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

// Importar ApexCharts dinámicamente para evitar problemas con SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="w-full h-[350px] animate-pulse bg-grey-100 dark:bg-dark-800 rounded-lg" />
});

export interface BarChartData {
  category: string;
  value: number;
}

export interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  color?: string;
  className?: string;
  yAxisLabel?: string;
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      title,
      height = 350,
      horizontal = true,
      showValues = true,
      color = '#95C16B',
      className,
      yAxisLabel,
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);

      // Detectar modo dark inicial
      const checkDarkMode = () => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      };

      checkDarkMode();

      // Observar cambios en la clase dark
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => observer.disconnect();
    }, []);

    const chartOptions: ApexOptions = {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
        fontFamily: 'var(--font-rubik), sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: horizontal,
          borderRadius: 4,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: showValues,
        formatter: function (val) {
          if (typeof val === 'number') {
            return val.toFixed(2);
          }
          return String(val);
        },
        offsetX: horizontal ? 30 : 0,
        offsetY: horizontal ? 0 : -20,
        style: {
          fontSize: '12px',
          colors: ['#47830E'],
          fontWeight: 600,
          fontFamily: 'var(--font-rubik), sans-serif',
        },
      },
      xaxis: {
        categories: data.map((item) => item.category),
        labels: {
          style: {
            colors: '#6c757d',
            fontSize: '12px',
            fontFamily: 'var(--font-rubik), sans-serif',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: yAxisLabel,
          style: {
            color: '#6c757d',
            fontSize: '12px',
            fontFamily: 'var(--font-rubik), sans-serif',
          },
        },
        labels: {
          style: {
            colors: '#6c757d',
            fontSize: '12px',
            fontFamily: 'var(--font-rubik), sans-serif',
          },
          formatter: function (val) {
            if (typeof val === 'number') {
              return val.toFixed(0);
            }
            return String(val);
          },
        },
      },
      grid: {
        borderColor: isDarkMode ? '#374151' : '#e9ecef',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      colors: [color],
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light',
        y: {
          formatter: function (val) {
            if (typeof val === 'number') {
              return val.toFixed(2);
            }
            return String(val);
          },
        },
      },
      legend: {
        show: false,
      },
    };

    const series = [
      {
        name: title || 'Valor',
        data: data.map((item) => item.value),
      },
    ];

    if (!isMounted) {
      return (
        <div ref={ref} className={cn('w-full', className)}>
          <div className="w-full animate-pulse bg-grey-100 dark:bg-dark-800 rounded-lg" style={{ height: `${height}px` }} />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={height}
        />
      </div>
    );
  }
);

BarChart.displayName = 'BarChart';

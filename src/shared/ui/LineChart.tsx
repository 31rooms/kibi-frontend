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

export interface LineChartData {
  category: string;
  value: number;
}

export interface LineChartProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  showArea?: boolean;
  showPoints?: boolean;
  color?: string;
  className?: string;
  yAxisLabel?: string;
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      title,
      height = 350,
      showArea = true,
      showPoints = true,
      color = '#95C16B',
      className,
      yAxisLabel,
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    const chartOptions: ApexOptions = {
      chart: {
        type: 'area',
        toolbar: {
          show: false,
        },
        fontFamily: 'var(--font-rubik), sans-serif',
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [color],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
        colors: [color],
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: showPoints ? 5 : 0,
        colors: [color],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
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
        ...(yAxisLabel && {
          title: {
            text: yAxisLabel,
            style: {
              color: '#6c757d',
              fontSize: '12px',
              fontFamily: 'var(--font-rubik), sans-serif',
            },
          },
        }),
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
        min: 0,
        max: 100,
      },
      grid: {
        borderColor: '#e9ecef',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      colors: [color],
      tooltip: {
        theme: 'light',
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
          type="area"
          height={height}
        />
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';

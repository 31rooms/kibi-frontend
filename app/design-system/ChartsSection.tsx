'use client';

import { useState } from 'react';
import { Card, BarChart, LineChart, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';

export default function ChartsSection() {
  const [timePeriod, setTimePeriod] = useState('week');
  const [lineTimePeriod, setLineTimePeriod] = useState('week');

  // Datos de ejemplo para el gráfico de barras
  const chartData = [
    { category: 'Biología', value: 69.15 },
    { category: 'Historia', value: 28.3 },
    { category: 'Ciencias', value: 66.36 },
    { category: 'Matemática', value: 83.84 },
    { category: 'Comprensión lectora', value: 44.58 },
    { category: 'Geografía', value: 11.34 },
  ];

  // Datos de ejemplo para el gráfico de línea (días de la semana)
  const lineChartData = [
    { category: 'Lun', value: 45 },
    { category: 'Mar', value: 62 },
    { category: 'Mier', value: 55 },
    { category: 'Jue', value: 78 },
    { category: 'Vie', value: 85 },
    { category: 'Sab', value: 70 },
    { category: 'Dom', value: 60 },
  ];

  return (
    <section id="charts" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
      <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
        Charts
      </h2>

      <div className="space-y-8">
        {/* Bar Chart Horizontal */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Gráfico de Barras Horizontal
          </h3>

          <Card className="p-3 md:p-6">
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
              height={400}
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

        {/* Bar Chart Vertical */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Gráfico de Barras Vertical
          </h3>

          <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Rendimiento por Materia
              </h3>
            </div>

            <BarChart
              data={chartData}
              height={350}
              horizontal={false}
              showValues={true}
              color="#47830E"
            />
          </Card>
        </div>

        {/* Line Chart */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Gráfico de Línea/Área
          </h3>

          <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Tiempo de Actividad
              </h3>
              <div className="w-48">
                <Select value={lineTimePeriod} onValueChange={setLineTimePeriod}>
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

            <LineChart
              data={lineChartData}
              height={350}
              showArea={true}
              showPoints={true}
              color="#95C16B"
              yAxisLabel="Minutos"
            />
          </Card>
        </div>

        {/* Código de ejemplo */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Ejemplo de Uso
          </h3>
          <div className="bg-grey-100 dark:bg-dark-800 p-4 rounded-lg">
            <pre className="text-sm text-dark-900 dark:text-white font-mono overflow-x-auto">
{`import { BarChart, LineChart, Card, Select } from '@/shared/ui';
import { useState } from 'react';

// BarChart - Para comparar valores entre categorías
const barData = [
  { category: 'Biología', value: 69.15 },
  { category: 'Historia', value: 28.3 },
  { category: 'Ciencias', value: 66.36 },
  { category: 'Matemática', value: 83.84 },
];

<Card>
  <BarChart
    data={barData}
    height={400}
    horizontal={true}
    showValues={true}
    color="#95C16B"
  />
</Card>

// LineChart - Para mostrar tendencias en el tiempo
const [timePeriod, setTimePeriod] = useState('week');
const lineData = [
  { category: 'Lun', value: 45 },
  { category: 'Mar', value: 62 },
  { category: 'Mier', value: 55 },
  { category: 'Jue', value: 78 },
  { category: 'Vie', value: 85 },
  { category: 'Sab', value: 70 },
  { category: 'Dom', value: 60 },
];

<Card>
  <div className="flex items-center justify-between mb-6">
    <h3>Tiempo de Actividad</h3>
    <Select value={timePeriod} onValueChange={setTimePeriod}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Esta semana</SelectItem>
        <SelectItem value="month">Este mes</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <LineChart
    data={lineData}
    height={350}
    showArea={true}
    showPoints={true}
    color="#95C16B"
    yAxisLabel="Minutos" // Opcional
  />
</Card>`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

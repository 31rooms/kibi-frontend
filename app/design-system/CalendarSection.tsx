'use client';

import { useState } from 'react';
import { Calendar, MultiSelectCalendar } from '@/shared/ui';
import { addDays, subDays } from 'date-fns';

export default function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    addDays(new Date(), 1),
  ]);

  // Ejemplo de fechas activas e inactivas
  const activeDates = [
    subDays(new Date(), 1),
    new Date(),
    addDays(new Date(), 1),
  ];

  const inactiveDates = [
    subDays(new Date(), 2),
    addDays(new Date(), 5),
  ];

  return (
    <section id="calendar" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
      <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
        Calendar
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Multi-Select Calendar (Modo Lectura)
          </h3>
          <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
            Calendario de solo lectura que muestra estados activo/inactivo sin permitir selección.
          </p>
          <div className="max-w-lg">
            <MultiSelectCalendar
              activeDates={activeDates}
              inactiveDates={inactiveDates}
              readOnly
            />
          </div>
        </div>

        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Multi-Select Calendar (Interactivo)
          </h3>
          <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
            Calendario con selección múltiple de fechas, selectores de mes/año y estados activo/inactivo.
          </p>
          <div className="max-w-lg">
            <MultiSelectCalendar
              selectedDates={selectedDates}
              onDatesChange={setSelectedDates}
              activeDates={activeDates}
              inactiveDates={inactiveDates}
            />
          </div>
          <div className="mt-4 p-4 bg-grey-100 dark:bg-dark-800 rounded-lg">
            <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
              Fechas seleccionadas: {selectedDates.length}
            </p>
            <pre className="text-xs text-dark-600 dark:text-grey-400">
              {selectedDates.map(d => d.toLocaleDateString()).join(', ')}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
            Calendario Completo
          </h3>
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            showActions
            onDone={() => console.log('Done clicked')}
            onRemove={() => console.log('Remove clicked')}
          />
        </div>

        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
            Calendar Sin Acciones
          </h3>
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            showActions={false}
          />
        </div>
      </div>
    </section>
  );
}

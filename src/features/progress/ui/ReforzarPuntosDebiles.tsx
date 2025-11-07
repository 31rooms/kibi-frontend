'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/Card';
import { CareerTag, KibiIcon } from '@/shared/ui';
import { ChevronLeft, BookOpen, FlaskConical, BookText, Globe } from 'lucide-react';

interface WeakPoint {
  id: string;
  subject: string;
  title: string;
  description: string;
  iconUrl?: string;
}

interface ReforzarPuntosDebilesProps {
  onBack: () => void;
  className?: string;
}

export const ReforzarPuntosDebiles = React.forwardRef<HTMLElement, ReforzarPuntosDebilesProps>(
  ({ onBack, className }, ref) => {
    // Datos de ejemplo - estos deberían venir de una API
    const weakPoints: WeakPoint[] = [
      {
        id: '1',
        subject: 'Matemáticas',
        title: 'Ecuaciones lineales y sistemas de ecuaciones',
        description: 'Aumenta hasta 10% la resolución de problemas matemáticos',
      },
      {
        id: '2',
        subject: 'Ciencias',
        title: 'Estructura y función de las células',
        description: 'No has tenido buenos resultados en ciencias, repasa esta lección y sigue progresando',
      },
      {
        id: '3',
        subject: 'Comprensión lectora',
        title: 'Identificación de ideas principales y secundarias',
        description: 'Tu comprensión lectora está en 89% puedes mejorar mas!',
      },
      {
        id: '4',
        subject: 'Historia y Geografía',
        title: 'Revolución Mexicana y sus causas',
        description: 'Tu rendimiento está por debajo de 50% en Historia, lee el siguiente tema y sigue avanzando',
      },
    ];

    const getSubjectIcon = (subjectName: string) => {
      const name = subjectName.toLowerCase();
      if (name.includes('matemática')) return BookOpen;
      if (name.includes('ciencia')) return FlaskConical;
      if (name.includes('lectura') || name.includes('comprensión')) return BookText;
      if (name.includes('historia') || name.includes('geografía')) return Globe;
      return BookOpen;
    };

    const getSubjectColor = (index: number) => {
      const colors = [
        'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      ];
      return colors[index % colors.length];
    };

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
          {/* Header con botón Volver */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 text-dark-900 dark:text-white hover:text-primary-green dark:hover:text-primary-green transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-[16px] font-medium font-[family-name:var(--font-rubik)]">Volver</span>
          </button>

          {/* Título principal con ícono de hands */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <img
                src="/illustrations/hands.svg"
                alt="Hands Icon"
                className="w-16 h-16 dark:hidden"
              />
              <img
                src="/illustrations/hands-dark.svg"
                alt="Hands Icon"
                className="w-16 h-16 hidden dark:block"
              />
              <h1
                className="text-[28px] md:text-[32px] font-bold font-[family-name:var(--font-quicksand)] dark:text-primary-green"
                style={{ color: '#47830E' }}
              >
                Temas recomendados de refuerzo
              </h1>
            </div>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weakPoints.map((point, index) => {
              const IconComponent = getSubjectIcon(point.subject);
              const colorClass = getSubjectColor(index);

              return (
                <Card
                  key={point.id}
                  className="bg-white dark:bg-[#131820] border-grey-200 dark:border-gray-800 hover:border-primary-green/50 dark:hover:border-primary-green/30 cursor-pointer group transition-all duration-200"
                >
                  <CardContent className="p-0">
                    {/* Icon and Subject Tag */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={cn('p-3 rounded-lg flex-shrink-0', colorClass)}>
                        {point.iconUrl ? (
                          <img
                            src={point.iconUrl}
                            alt={point.subject}
                            className="w-6 h-6"
                          />
                        ) : (
                          <IconComponent className="w-6 h-6" />
                        )}
                      </div>
                      <CareerTag career={point.subject} />
                    </div>

                    {/* Title */}
                    <h3 className="text-[16px] md:text-lg font-bold mb-3 text-grey-900 dark:text-white group-hover:text-primary-green transition-colors font-[family-name:var(--font-quicksand)]">
                      {point.title}
                    </h3>

                    {/* Description with KibiIcon */}
                    <div className="flex items-start gap-2">
                      <KibiIcon
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <p className="text-[14px] text-grey-700 dark:text-gray-300 font-[family-name:var(--font-rubik)]">
                        {point.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    );
  }
);

ReforzarPuntosDebiles.displayName = 'ReforzarPuntosDebiles';

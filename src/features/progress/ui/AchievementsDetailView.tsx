'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, Progress } from '@/shared/ui';
import { ArrowLeft, Star, TrendingUp, Calendar, Beaker, Search, BookOpen, Trophy, Target } from 'lucide-react';

interface AchievementsDetailViewProps {
  onBack: () => void;
  className?: string;
}

type Achievement = {
  id: string;
  title: string;
  description: string;
  date?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  achieved: boolean;
  progress?: number;
};

export const AchievementsDetailView = React.forwardRef<HTMLElement, AchievementsDetailViewProps>(
  ({ onBack, className }, ref) => {
    const [activeTab, setActiveTab] = useState<'todos' | 'alcanzados' | 'progreso'>('todos');

    // Datos de ejemplo de logros
    const achievements: Achievement[] = [
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
          {/* Botón Volver */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-dark-900 dark:text-white hover:text-primary-green dark:hover:text-primary-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[16px] font-medium font-[family-name:var(--font-rubik)]">Volver</span>
          </button>

          {/* Header con Título y Tabs */}
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
              Logros
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 bg-grey-100 dark:bg-dark-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('todos')}
                className={cn(
                  "px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors font-[family-name:var(--font-rubik)]",
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
                  "px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors font-[family-name:var(--font-rubik)]",
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
                  "px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors font-[family-name:var(--font-rubik)]",
                  activeTab === 'progreso'
                    ? "bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-sm"
                    : "text-dark-600 dark:text-grey-400"
                )}
              >
                En progreso
              </button>
            </div>
          </div>

          {/* Lista de Logros */}
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
      </main>
    );
  }
);

AchievementsDetailView.displayName = 'AchievementsDetailView';

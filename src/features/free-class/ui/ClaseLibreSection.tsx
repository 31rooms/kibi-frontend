'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Toggle, Card, KibiIcon, CareerTag } from '@/shared/ui';
import Image from 'next/image';

// Mock data para las cards
const mockResults = [
  {
    id: 1,
    subject: 'Matemáticas',
    title: 'Ecuaciones lineales y sistemas de ecuaciones',
    recommended: false,
  },
  {
    id: 2,
    subject: 'Ciencias',
    title: 'Estructura y función de las células',
    recommended: false,
  },
  {
    id: 3,
    subject: 'Comprensión lectora',
    title: 'Identificación de ideas principales y secundarias',
    recommended: true,
    kibiMessage: 'Tu comprensión lectora esta en 89% puedes mejorar mas!',
  },
  {
    id: 4,
    subject: 'Historia y Geografía',
    title: 'Revolución Mexicana y sus causas',
    recommended: false,
  },
];

export const ClaseLibreSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [level, setLevel] = React.useState('');
    const [recomendados, setRecomendados] = React.useState(false);
    const [temasVistos, setTemasVistos] = React.useState(false);

    // Handle card click to navigate to daily session
    const handleCardClick = () => {
      router.push('/home?section=daily-session');
    };

    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-white dark:bg-[#171B22]",
          className
        )}
        {...props}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative w-[113px] h-[113px]">
              <Image
                src="/illustrations/hands.svg"
                alt="Hands"
                fill
                className="dark:hidden"
              />
              <Image
                src="/illustrations/hands-dark.svg"
                alt="Hands"
                fill
                className="hidden dark:block"
              />
            </div>
            <h1 className="text-[36px] font-bold text-[#95C16B] font-[family-name:var(--font-quicksand)]">
              Clase libre
            </h1>
          </div>

          {/* Search bar with filter icon */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="¿Que quieres estudiar hoy?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                leadingIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <button
              className="flex items-center justify-center w-[48px] h-[48px] rounded-lg border border-grey-300 dark:border-[#374151] bg-white dark:bg-[#171B22] hover:bg-grey-50 dark:hover:bg-[#1f2937] transition-colors"
              aria-label="Filtros"
            >
              <SlidersHorizontal className="w-5 h-5 text-grey-600 dark:text-grey-400" />
            </button>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Asignatura dropdown */}
            <div className="w-full sm:w-[200px]">
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Asignatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematicas">Matemáticas</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                  <SelectItem value="quimica">Química</SelectItem>
                  <SelectItem value="biologia">Biología</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nivel dropdown */}
            <div className="w-full sm:w-[200px]">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 ml-auto">
              <Toggle
                checked={recomendados}
                onCheckedChange={setRecomendados}
                label="Recomendados"
                labelPosition="right"
                style="1"
              />
              <Toggle
                checked={temasVistos}
                onCheckedChange={setTemasVistos}
                label="Temas Vistos"
                labelPosition="right"
                style="1"
              />
            </div>
          </div>

          {/* Results section */}
          <div className="mt-8 space-y-4">
            <h2 className="text-[20px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
              Resultados <span className="text-[#95C16B]">({mockResults.length})</span>
            </h2>

            <div className="space-y-4">
              {mockResults.map((result) => (
                <Card
                  key={result.id}
                  className="relative p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={handleCardClick}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Subject tag */}
                      <CareerTag
                        variant="career"
                        career={result.subject}
                        className="text-sm font-[family-name:var(--font-rubik)]"
                      />

                      {/* Title */}
                      <h3 className="text-[18px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        {result.title}
                      </h3>

                      {/* Kibi message if present */}
                      {result.kibiMessage && (
                        <div className="flex items-start gap-2 mt-4">
                          <KibiIcon size={24} className="flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-[#7B7B7B] dark:text-[#B9B9B9] font-[family-name:var(--font-rubik)]">
                            {result.kibiMessage}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Recommended badge */}
                    {result.recommended && (
                      <CareerTag
                        variant="recommended"
                        career="Recomendado"
                        className="font-[family-name:var(--font-rubik)]"
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
);

ClaseLibreSection.displayName = 'ClaseLibreSection';

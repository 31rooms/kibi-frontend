'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingSheet, Button, Logo } from '@/shared/ui';

interface OnboardingSlideData {
  id: number;
  title: string;
  description: string;
  illustration: string;
}

const slides: OnboardingSlideData[] = [
  {
    id: 1,
    illustration: '/illustrations/astronaut.svg',
    title: '¡Tu camino a la UAEMEX empieza aquí!',
    description: 'Has usado a la IA para muchas cosas, pero ¿la has usado para prepararte para tu examen de admisión?',
  },
  {
    id: 2,
    illustration: '/illustrations/notifications.svg',
    title: 'Recibe alertas de fechas de inscripción',
    description: 'Te ayudará a recordar cada fecha importante, avisándote a tiempo los procesos necesarios para que no se te olvide nada.',
  },
  {
    id: 3,
    illustration: '/illustrations/progress.svg',
    title: 'Aprende sólo lo que necesitas saber',
    description: 'Adapto las clases a tu nivel, reforzando lo que necesites y evitando los temas que ya dominas para no perder tiempo.',
  },
  {
    id: 4,
    illustration: '/illustrations/chat.svg',
    title: 'Tu profesor en el bolsillo, 24/7.',
    description: 'Puedes preguntarme lo que quieras. Te guiaré con clases y exámenes simulacro, disponible para ti 24 horas.',
  },
  {
    id: 5,
    illustration: '/illustrations/phone.svg',
    title: '¿Listo para empezar? alcanza tus metas',
    description: 'Da el primer paso hacia tu futuro universitario. Crea tu cuenta y te acompañaremos en cada etapa de este viaje.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = slides.length;
  const currentSlideData = slides[currentSlide];

  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentSlide, totalSlides, isTransitioning]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentSlide, isTransitioning]);

  const handlePageChange = useCallback((page: number) => {
    if (page !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(page);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentSlide, isTransitioning]);

  const handleRegister = useCallback(() => {
    localStorage.setItem('kibi_onboarding_completed', 'true');
    router.push('/auth/register');
  }, [router]);

  const handleLogin = useCallback(() => {
    localStorage.setItem('kibi_onboarding_completed', 'true');
    router.push('/auth/login');
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev - 1);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, currentSlide]);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 lg:h-screen overflow-y-auto lg:overflow-hidden bg-[#1A1F2E]">
      {/* LEFT COLUMN - Dynamic content (illustration + sheet in card container) */}
      <div className="relative flex items-center justify-center p-4 lg:p-8 pb-[150px] lg:pb-8">

        {/* Card container - phone/mockup style */}
        <div className="relative w-full max-w-md lg:max-w-2xl xl:max-w-3xl h-auto lg:h-[750px] bg-dark-900/20 rounded-[40px] overflow-visible lg:overflow-hidden backdrop-blur-sm border border-white/10 shadow-2xl flex flex-col">

          {/* Illustration area */}
          <div className="h-[350px] lg:h-[450px] flex items-center justify-center p-6 lg:p-8 flex-shrink-0">
            <div
              className={`transition-all duration-300 w-full h-full flex items-center justify-center ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <img
                src={currentSlideData.illustration}
                alt={currentSlideData.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Sheet area */}
          <div
            className={`flex-1 lg:flex-none lg:h-[300px] transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <OnboardingSheet
              title={currentSlideData.title}
              description={currentSlideData.description}
              currentPage={currentSlide}
              totalPages={totalSlides}
              onPageChange={handlePageChange}
              onNext={currentSlide < totalSlides - 1 ? handleNext : undefined}
              onPrevious={currentSlide > 0 ? handlePrevious : undefined}
              showNextButton={currentSlide < totalSlides - 1}
              showPreviousButton={currentSlide > 0}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Fixed content (logo + title + buttons) */}
      <div className="hidden lg:flex flex-col items-center justify-center gap-16 px-16 py-12">
        {/* Logo - White version, larger size */}
        <Logo size="large" white />

        {/* Main title - Always the same */}
        <h1 className="text-white text-5xl font-bold text-center leading-tight font-[family-name:var(--font-quicksand)] max-w-md">
          ¡Tu camino a la UAEMEX empieza aquí!
        </h1>

        {/* Action buttons - Always visible */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button
            variant="primary"
            color="green"
            size="large"
            onClick={handleRegister}
            className="w-full"
          >
            Registrarme
          </Button>
          <Button
            variant="secondary"
            color="green"
            size="large"
            onClick={handleLogin}
            className="w-full border-white text-white hover:bg-white dark:bg-[#171B22]/10"
          >
            Ya tengo cuenta
          </Button>
        </div>
      </div>

      {/* Mobile-only buttons at bottom (shown on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#2C3241] p-6 shadow-strong flex flex-col gap-3">
        <Button
          variant="primary"
          color="green"
          size="large"
          onClick={handleRegister}
          className="w-full"
        >
          Registrarme
        </Button>
        <Button
          variant="secondary"
          color="green"
          size="large"
          onClick={handleLogin}
          className="w-full"
        >
          Ya tengo cuenta
        </Button>
      </div>
    </div>
  );
}


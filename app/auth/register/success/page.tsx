'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import Image from 'next/image';

export default function RegisterSuccessPage() {
  const router = useRouter();

  const handleStartTest = () => {
    // TODO: Update this route when diagnostic test page is created
    router.push('/diagnostic-test');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-grey-50">
      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-5">
          {/* Success Icon - Using check.svg */}
          <div className="flex justify-center">
            <Image
              src="/illustrations/check.svg"
              alt="Success"
              width={64}
              height={64}
              priority
            />
          </div>

          {/* Header */}
          <h1 className="text-[28px] font-bold text-dark-900 text-center leading-tight font-[family-name:var(--font-quicksand)]">
            ¡Listo!
          </h1>

          {/* Success Message Box - Speech Bubble Style */}
          <div className="w-full relative">
            <div className="w-full bg-success-50 rounded-2xl py-5 px-6">
              <p className="text-[18px] font-bold text-dark-900 text-center font-[family-name:var(--font-quicksand)] mb-2">
                ¡Te has registrado!
              </p>
              <p className="text-[14px] text-dark-700 text-center font-[family-name:var(--font-rubik)] leading-relaxed">
                Estoy lista para preparar tu ruta de aprendizaje, pero antes necesitamos que tomes tu Test Diagnóstico de 20 preguntas.
              </p>
            </div>
            {/* Speech bubble tail */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-success-50"></div>
          </div>

          {/* Kibi Robot Icon */}
          <div className="flex justify-center mt-2">
            <Image
              src="/illustrations/Kibi Icon.svg"
              alt="Kibi Robot"
              width={100}
              height={100}
              priority
            />
          </div>

          {/* Test Information */}
          <div className="flex flex-col items-center gap-2 text-center mt-2">
            <h2 className="text-[20px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)]">
              Toma el test gratuito
            </h2>
            <p className="text-[14px] text-dark-600 font-[family-name:var(--font-rubik)] leading-relaxed px-4">
              No te preocupes, este examen es totalmente gratis y los resultados te dirán qué tan estás preparado para tu examen y qué temas te falta reforzar.
            </p>
          </div>

          {/* Start Test Button */}
          <Button
            type="button"
            variant="primary"
            color="green"
            size="large"
            className="w-full mt-2"
            onClick={handleStartTest}
          >
            Empezar el Test
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-grey-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-[var(--color-text-medium)]">
            Bienvenido de vuelta a Kibi
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <p className="text-center text-[var(--color-text-medium)]">
            Página de login - En construcción
          </p>
          <Button variant="primary" color="green" className="w-full">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

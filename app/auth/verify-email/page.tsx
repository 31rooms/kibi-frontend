'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Logo } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { authAPI } from '@/lib/api/auth';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('Token de verificación inválido o expirado');
        setIsLoading(false);
        return;
      }

      try {
        console.log('✉️ Verifying email with token...');

        await authAPI.verifyEmail(token);

        console.log('✅ Email verified successfully');
        setSuccess(true);
      } catch (error: any) {
        console.error('❌ Email verification error:', error);

        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setError('El enlace de verificación ha expirado o es inválido. Por favor solicita uno nuevo.');
        } else {
          setError(error.message || 'Ocurrió un error al verificar tu correo electrónico');
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleLoginRedirect = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN - Illustration */}
        <div className="hidden lg:flex bg-gradient-to-br from-cyan-400 via-blue-500 to-primary-green relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary-green/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10">
            <Logo size="large" white />
          </div>
        </div>

        {/* RIGHT COLUMN - Loading */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 flex justify-center">
              <Logo size="medium" />
            </div>

            <div className="flex flex-col items-center gap-6">
              <Loader2 className="w-16 h-16 text-primary-green animate-spin" />
              <div className="text-center">
                <h1 className="text-[28px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-2">
                  Verificando tu correo...
                </h1>
                <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
                  Por favor espera un momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN - Illustration */}
        <div className="hidden lg:flex bg-gradient-to-br from-cyan-400 via-blue-500 to-primary-green relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary-green/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10">
            <Logo size="large" white />
          </div>
        </div>

        {/* RIGHT COLUMN - Success */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 flex justify-center">
              <Logo size="medium" />
            </div>

            <div className="flex flex-col gap-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-success-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center">
                <h1 className="text-[28px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-3">
                  ¡Correo verificado!
                </h1>
                <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)] leading-relaxed">
                  Tu correo electrónico ha sido verificado exitosamente. Ya puedes iniciar sesión y disfrutar de todas las funcionalidades de Kibi.
                </p>
              </div>

              {/* Login Button */}
              <Button
                type="button"
                variant="primary"
                color="green"
                size="large"
                className="w-full mt-4"
                onClick={handleLoginRedirect}
              >
                Ir al inicio de sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT COLUMN - Illustration */}
      <div className="hidden lg:flex bg-gradient-to-br from-cyan-400 via-blue-500 to-primary-green relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-green/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <Logo size="large" white />
        </div>
      </div>

      {/* RIGHT COLUMN - Error */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="medium" />
          </div>

          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-[28px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-2">
                Error de verificación
              </h1>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Back to Login Button */}
            <Button
              type="button"
              variant="primary"
              color="green"
              size="large"
              className="w-full mt-4"
              onClick={handleLoginRedirect}
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

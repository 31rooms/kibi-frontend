'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Logo } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { authAPI } from '@/lib/api/auth';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    setError(null);

    // Validate email
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('📧 Sending password reset request for:', email);

      const response = await authAPI.forgotPassword(email.trim().toLowerCase());

      console.log('✅ Password reset email sent successfully');
      setSuccess(true);
    } catch (error: any) {
      console.error('❌ Forgot password error:', error);
      setError(error.message || 'Ocurrió un error al enviar el correo de recuperación');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleBackToLogin = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

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

        {/* RIGHT COLUMN - Success Message */}
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
                  ¡Correo enviado!
                </h1>
                <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)] leading-relaxed">
                  Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un correo con instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-[14px] text-dark-500 font-[family-name:var(--font-rubik)] mt-4">
                  Por favor revisa tu bandeja de entrada y también la carpeta de spam.
                </p>
              </div>

              {/* Back to Login Button */}
              <Button
                type="button"
                variant="primary"
                color="green"
                size="large"
                className="w-full mt-4"
                onClick={handleBackToLogin}
              >
                Volver al inicio de sesión
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

      {/* RIGHT COLUMN - Forgot Password Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="medium" />
          </div>

          {/* Form card */}
          <div className="flex flex-col gap-6">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="flex items-center gap-2 text-primary-blue hover:underline font-[family-name:var(--font-rubik)] text-[14px] disabled:opacity-50"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </button>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-[32px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-2">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
                No te preocupes, te enviaremos instrucciones para restablecerla
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                required
                disabled={isLoading}
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                color="green"
                size="large"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>
            </form>

            {/* Info text */}
            <p className="text-[14px] text-dark-500 text-center font-[family-name:var(--font-rubik)]">
              Te enviaremos un enlace de recuperación a tu correo electrónico
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

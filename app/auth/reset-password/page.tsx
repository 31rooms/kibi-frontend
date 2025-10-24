'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, Logo } from '@/shared/ui';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { authAPI } from '@/features/authentication';
import { Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token de recuperación inválido o expirado');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    if (!formData.password) {
      setError('Por favor ingresa una contraseña');
      return false;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Check for password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError(null);
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    setError(null);

    // Validate token
    if (!token) {
      setError('Token de recuperación inválido o expirado');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔑 Sending password reset request');

      await authAPI.resetPassword(token, formData.password);

      console.log('✅ Password reset successful');
      setSuccess(true);
    } catch (error) {
      console.error('❌ Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        setError('El enlace de recuperación ha expirado o es inválido. Por favor solicita uno nuevo.');
      } else {
        setError(errorMessage || 'Ocurrió un error al restablecer la contraseña');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, token]);

  const handleLoginRedirect = useCallback(() => {
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
                  ¡Contraseña restablecida!
                </h1>
                <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)] leading-relaxed">
                  Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
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

      {/* RIGHT COLUMN - Reset Password Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="medium" />
          </div>

          {/* Form card */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-[32px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-2">
                Restablecer contraseña
              </h1>
              <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
                Ingresa tu nueva contraseña
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
              {/* Password with eye toggle */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nueva contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading || !token}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password with eye toggle */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading || !token}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="text-xs text-grey-600 -mt-2">
                La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.
              </div>

              <Button
                type="submit"
                variant="primary"
                color="green"
                size="large"
                className="w-full mt-2"
                disabled={isLoading || !token}
              >
                {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </Button>
            </form>

            {/* Login link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="text-[14px] text-primary-blue hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                disabled={isLoading}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <Logo size="medium" />
          <p className="mt-4 text-dark-600">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

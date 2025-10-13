'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Logo, Checkbox } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '', // This will be used as email for backend
    password: '',
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) setError(null);
  }, [error]);

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!formData.password) {
      setError('Por favor ingresa tu contraseña');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Sending login request with:', {
        email: formData.username,
        password: '***HIDDEN***'
      });

      // Call login function from AuthContext
      // Using username field as email (as per backend requirement)
      await login(formData.username, formData.password);

      console.log('✅ Login successful!');

      // If rememberMe is false, we might want to handle session storage differently
      // For now, the tokens are always stored in localStorage

      // Redirect is handled in AuthContext
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);

      // Set user-friendly error message
      if (error.message.includes('credentials') || error.message.includes('Invalid') || error.message.includes('Unauthorized')) {
        setError('Correo electrónico o contraseña incorrectos');
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.code === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que el backend esté corriendo en http://localhost:3000');
      } else {
        setError(error.message || 'Ocurrió un error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  const handleSocialLogin = useCallback((provider: string) => {
    // TODO: Implement social login when backend supports it
    console.log('Login with:', provider);
    setError('El inicio de sesión con redes sociales estará disponible pronto');
  }, []);

  const handleRegisterRedirect = useCallback(() => {
    router.push('/auth/register');
  }, [router]);

  const handleForgotPassword = useCallback(() => {
    // TODO: Implement forgot password flow when backend supports it
    console.log('Forgot password');
    router.push('/auth/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT COLUMN - Illustration/Image */}
      <div className="hidden lg:flex bg-gradient-to-br from-cyan-400 via-blue-500 to-primary-green relative overflow-hidden items-center justify-center p-12">
        {/* Abstract shapes background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-green/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Logo size="large" white />
        </div>
      </div>

      {/* RIGHT COLUMN - Login Form */}
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
                ¡Hola!
              </h1>
              <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
                Inicia sesión para continuar
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
                name="username"
                placeholder="Correo electrónico"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="email"
              />

              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <span className="text-[14px] text-dark-700 font-[family-name:var(--font-rubik)]">
                    Recordarme
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[14px] text-primary-blue hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                color="green"
                size="large"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-grey-300" />
              <span className="text-[14px] text-dark-600 font-[family-name:var(--font-rubik)]">
                O ingresa con:
              </span>
              <div className="flex-1 h-px bg-grey-300" />
            </div>

            {/* Social login buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-12 h-12 rounded-full border border-grey-300 flex items-center justify-center hover:bg-grey-100 transition-colors disabled:opacity-50"
                aria-label="Continuar con Google"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="w-12 h-12 rounded-full border border-grey-300 flex items-center justify-center hover:bg-grey-100 transition-colors disabled:opacity-50"
                aria-label="Continuar con Apple"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="w-12 h-12 rounded-full border border-grey-300 flex items-center justify-center hover:bg-grey-100 transition-colors disabled:opacity-50"
                aria-label="Continuar con Facebook"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

            {/* Register link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="text-[14px] text-primary-blue hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                disabled={isLoading}
              >
                ¿No tienes una cuenta? Regístrate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
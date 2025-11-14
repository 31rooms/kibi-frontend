'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input, Button, PasswordInput, Card, KibiMessage } from '@/shared/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { useAuth, authAPI, type RegisterDto, type Career, Theme } from '@/features/authentication';
import { useTheme } from '@/shared/lib/context';
import { cn } from '@/shared/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    desiredCareer: '',
  });

  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoadingCareers, setIsLoadingCareers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load careers on component mount
  useEffect(() => {
    const loadCareers = async () => {
      try {
        console.log('📚 Loading careers...');
        setIsLoadingCareers(true);
        const data = await authAPI.getCareers();
        console.log('✅ Careers loaded:', data);
        setCareers(data);
      } catch (err) {
        console.error('❌ Error loading careers:', err);
        setError('Error al cargar las carreras. Por favor recarga la página.');
      } finally {
        setIsLoadingCareers(false);
      }
    };

    loadCareers();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError(null);
  }, [error]);

  const handleCareerChange = useCallback((value: string) => {
    console.log('🎓 Career selected:', value);
    setFormData((prev) => ({ ...prev, desiredCareer: value }));
    if (error) setError(null);
  }, [error]);

  const validateForm = useCallback((): boolean => {
    // Email validation
    if (!formData.email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    // Career validation
    if (!formData.desiredCareer) {
      setError('Por favor selecciona una carrera');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Por favor ingresa una contraseña');
      return false;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Check for password complexity (at least one uppercase, one lowercase, and one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      return false;
    }

    return true;
  }, [formData]);

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
      // Extract first name and last name from email (temporary solution)
      // Since Figma design doesn't have name fields but backend requires them
      const emailUsername = formData.email.split('@')[0];
      const nameParts = emailUsername.split(/[._-]/);

      // Detect browser theme preference
      const detectBrowserTheme = (): Theme => {
        if (typeof window === 'undefined') {
          return Theme.SYSTEM;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        if (prefersDark) {
          return Theme.DARK;
        } else if (prefersLight) {
          return Theme.LIGHT;
        }

        return Theme.SYSTEM;
      };

      const registrationData: RegisterDto = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        // Generate names from email username
        firstName: nameParts[0] || 'Usuario',
        lastName: nameParts[1] || 'Kibi',
        phoneNumber: formData.phone.trim() || undefined,
        desiredCareer: formData.desiredCareer,
        theme: detectBrowserTheme(),
      };

      console.log('📤 Sending registration request with data:', {
        ...registrationData,
        password: '***HIDDEN***'
      });

      // Call register function from AuthContext
      await register(registrationData);

      console.log('✅ Registration successful!');

      // Redirect to success page instead of onboarding
      router.push('/auth/register/success');
    } catch (error) {
      console.error('❌ Registration error:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as {code?: string}).code;

      // Set user-friendly error message based on error type
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate') || errorMessage.includes('already registered')) {
        setError('Ya existe una cuenta con este correo electrónico');
      } else if (errorMessage.includes('password')) {
        setError('La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números');
      } else if (errorMessage.includes('email')) {
        setError('Por favor ingresa un correo electrónico válido');
      } else if (errorMessage.includes('Career not found')) {
        setError('La carrera seleccionada no es válida. Por favor selecciona otra.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorCode === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que el backend esté corriendo en http://localhost:3000');
      } else {
        setError(errorMessage || 'Ocurrió un error durante el registro');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, register, validateForm, router]);

  const handleLoginRedirect = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    console.log('Login with:', provider);
    setError('El registro con redes sociales estará disponible pronto');
  };

  const illustrationSrc = isDarkMode
    ? '/illustrations/login-dark.svg'
    : '/illustrations/login-light.svg';

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Column - Illustration (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-grey-50 dark:bg-dark-900">
        <div className="relative w-full h-[calc(100vh-8rem)] rounded-[60px] overflow-hidden">
          <Image
            src={illustrationSrc}
            alt="Register illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-white dark:bg-primary-blue">
        <div className="w-full max-w-[480px]">
          <Card variant="default" padding="large" className="shadow-none border border-[#DEE2E6] dark:border-[#374151]" style={{ borderRadius: '60px' }}>
            <div className="flex flex-col gap-6">
              {/* Header with KibiMessage */}
              <div className="text-center flex flex-col items-center gap-4">
                <KibiMessage
                  message={
                    <>
                      <span className="font-bold text-[23px]">¡Bienvenido al registro!</span>
                      <br />
                      <span className="text-[16px]">Ingresa tus datos</span>
                    </>
                  }
                  iconSize={80}
                  className="w-full"
                />
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  className="border border-[#DEE2E6] dark:border-[#374151]"
                />

                <Input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="tel"
                  className="border border-[#DEE2E6] dark:border-[#374151]"
                />

                {/* Careers Select */}
                <Select
                  value={formData.desiredCareer}
                  onValueChange={handleCareerChange}
                  disabled={isLoading || isLoadingCareers}
                >
                  <SelectTrigger className="border border-[#DEE2E6] dark:border-[#374151]">
                    <SelectValue placeholder={isLoadingCareers ? "Cargando carreras..." : "Carrera deseada"} />
                  </SelectTrigger>
                  <SelectContent>
                    {careers.length === 0 && !isLoadingCareers && (
                      <div className="px-2 py-1.5 text-sm text-grey-500">
                        No hay carreras disponibles
                      </div>
                    )}
                    {careers.map((career) => (
                      <SelectItem key={career._id} value={career._id}>
                        {career.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <PasswordInput
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="border border-[#DEE2E6] dark:border-[#374151]"
                />

                <Button
                  type="submit"
                  variant="primary"
                  color="green"
                  size="medium"
                  className="w-full max-w-[250px] mx-auto mt-2"
                  disabled={isLoading || isLoadingCareers}
                >
                  {isLoading ? 'Registrando...' : 'Registrarme'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#5F6774]"></div>
                <span className="flex-shrink mx-4 text-[14px] text-dark-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                  O regístrate con
                </span>
                <div className="flex-grow border-t border-[#5F6774]"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Registrarse con Google"
                >
                  <img
                    src={isDarkMode ? '/icons/Google-dark.svg' : '/icons/Google-light.svg'}
                    alt="Google"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Registrarse con Apple"
                >
                  <img
                    src={isDarkMode ? '/icons/Apple-dark.svg' : '/icons/Apple-light.svg'}
                    alt="Apple"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Registrarse con Facebook"
                >
                  <img
                    src={isDarkMode ? '/icons/Facebook-dark.svg' : '/icons/Facebook-light.svg'}
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-2 flex flex-col gap-1">
                <p className="text-[14px] text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                  ¿Ya tienes cuenta?
                </p>
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  disabled={isLoading}
                  className="text-[14px] md:text-[17px] font-bold text-[#0074F0] hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                >
                  Inicia sesión aquí
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

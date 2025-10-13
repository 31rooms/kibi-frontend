'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { authAPI, type RegisterDto, type Career } from '@/lib/api/auth';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    desiredCareer: '',
  });

  const [showPassword, setShowPassword] = useState(false);
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

      const registrationData: RegisterDto = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        // Generate names from email username
        firstName: nameParts[0] || 'Usuario',
        lastName: nameParts[1] || 'Kibi',
        phoneNumber: formData.phone.trim() || undefined,
        desiredCareer: formData.desiredCareer,
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
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('Error response:', error.response?.data);

      // Set user-friendly error message based on error type
      if (error.message.includes('already exists') || error.message.includes('duplicate') || error.message.includes('already registered')) {
        setError('Ya existe una cuenta con este correo electrónico');
      } else if (error.message.includes('password')) {
        setError('La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números');
      } else if (error.message.includes('email')) {
        setError('Por favor ingresa un correo electrónico válido');
      } else if (error.message.includes('Career not found')) {
        setError('La carrera seleccionada no es válida. Por favor selecciona otra.');
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.code === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que el backend esté corriendo en http://localhost:3000');
      } else {
        setError(error.message || 'Ocurrió un error durante el registro');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, register, validateForm, router]);

  const handleSocialLogin = useCallback((provider: string) => {
    console.log('Login with:', provider);
    setError('El registro con redes sociales estará disponible pronto');
  }, []);

  const handleLoginRedirect = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT COLUMN - Abstract Illustration */}
      <div className="hidden lg:flex bg-gradient-to-br from-cyan-400 via-blue-500 to-primary-green relative overflow-hidden items-center justify-center p-12">
        {/* Abstract organic shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large blob shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-green/40 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-400/40 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-600/30 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-primary-green/50 rounded-full blur-3xl" />

          {/* Additional accent blobs */}
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-cyan-300/30 rounded-full blur-3xl" />
        </div>
      </div>

      {/* RIGHT COLUMN - Registration Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Form card */}
          <div className="flex flex-col gap-6">
            {/* Header with green background */}
            <div className="text-center bg-success-50 rounded-2xl py-4 px-6">
              <h1 className="text-[28px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)]">
                ¡Bienvenido al registro!
              </h1>
              <p className="text-[14px] text-dark-600 font-[family-name:var(--font-rubik)] mt-1">
                Ingresa tus datos
              </p>
            </div>

            {/* Kibi Robot Icon */}
            <div className="flex justify-center">
              <Image
                src="/illustrations/Kibi Icon.svg"
                alt="Kibi Robot"
                width={80}
                height={80}
                priority
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
              />

              <Input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="tel"
              />

              {/* Careers Select */}
              <Select
                value={formData.desiredCareer}
                onValueChange={handleCareerChange}
                disabled={isLoading || isLoadingCareers}
              >
                <SelectTrigger>
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

              {/* Password with eye toggle */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
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

              <div className="text-xs text-grey-600 -mt-2">
                La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.
              </div>

              <Button
                type="submit"
                variant="primary"
                color="green"
                size="large"
                className="w-full mt-2"
                disabled={isLoading || isLoadingCareers}
              >
                {isLoading ? 'Registrando...' : 'Registrarme'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-grey-300" />
              <span className="text-[14px] text-grey-500 font-[family-name:var(--font-rubik)]">
                O regístrate con
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

            {/* Login link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="text-[14px] text-primary-blue hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                disabled={isLoading}
              >
                Ya tengo una cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

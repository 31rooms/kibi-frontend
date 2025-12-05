'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/features/authentication';
import { useLoginForm, useAuth } from '@/features/authentication';
import type { SocialProvider } from '@/features/authentication';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [googleError, setGoogleError] = useState<string | null>(null);
  const {
    formData,
    isLoading,
    error,
    rememberMe,
    handleChange,
    handleSubmit,
    handleRememberMeChange
  } = useLoginForm();

  const handleGoogleSuccess = useCallback(async (idToken: string) => {
    try {
      setGoogleError(null);
      await loginWithGoogle(idToken);
      // La redirección se maneja en el AuthContext
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión con Google';
      setGoogleError(errorMessage);
      console.error('Google login error:', err);
    }
  }, [loginWithGoogle]);

  const handleGoogleError = useCallback((err: Error) => {
    setGoogleError(err.message);
    console.error('Google Sign-In error:', err);
  }, []);

  const handleSocialLogin = useCallback((provider: SocialProvider) => {
    if (provider === 'google') {
      // Google se maneja con el componente GoogleSignInButton
      return;
    }
    // TODO: Implement Apple and Facebook login when backend supports it
    console.log('Login with:', provider);
    alert('El inicio de sesión con redes sociales estará disponible pronto');
  }, []);

  const handleRegisterRedirect = useCallback(() => {
    router.push('/auth/register');
  }, [router]);

  const handleForgotPassword = useCallback(() => {
    router.push('/auth/forgot-password');
  }, [router]);

  return (
    <LoginForm
      formData={formData}
      isLoading={isLoading}
      error={error || googleError}
      rememberMe={rememberMe}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onRememberMeChange={handleRememberMeChange}
      onSocialLogin={handleSocialLogin}
      onGoogleSuccess={handleGoogleSuccess}
      onGoogleError={handleGoogleError}
      onRegisterClick={handleRegisterRedirect}
      onForgotPassword={handleForgotPassword}
    />
  );
}

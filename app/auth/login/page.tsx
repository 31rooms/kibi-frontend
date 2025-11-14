'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/features/authentication';
import { useLoginForm } from '@/features/authentication';
import type { SocialProvider } from '@/features/authentication';

export default function LoginPage() {
  const router = useRouter();
  const {
    formData,
    isLoading,
    error,
    rememberMe,
    handleChange,
    handleSubmit,
    handleRememberMeChange
  } = useLoginForm();

  const handleSocialLogin = useCallback((provider: SocialProvider) => {
    // TODO: Implement social login when backend supports it
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
      error={error}
      rememberMe={rememberMe}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onRememberMeChange={handleRememberMeChange}
      onSocialLogin={handleSocialLogin}
      onRegisterClick={handleRegisterRedirect}
      onForgotPassword={handleForgotPassword}
    />
  );
}

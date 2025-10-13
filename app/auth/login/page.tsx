'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, SocialLoginButtons, AuthLayout } from '@/features/authentication';
import { useLoginForm } from '@/features/authentication';
import type { SocialProvider } from '@/features/authentication';

export default function LoginPage() {
  const router = useRouter();
  const { formData, isLoading, error, handleChange, handleCheckboxChange, handleSubmit } = useLoginForm();

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
    <AuthLayout>
      <LoginForm
        formData={formData}
        isLoading={isLoading}
        error={error}
        onChange={handleChange}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
      />

      <SocialLoginButtons
        onSocialLogin={handleSocialLogin}
        disabled={isLoading}
      />

      {/* Register link */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleRegisterRedirect}
          className="text-[14px] text-primary-blue hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
          disabled={isLoading}
        >
          ¿No tienes una cuenta? Regístrate
        </button>
      </div>
    </AuthLayout>
  );
}

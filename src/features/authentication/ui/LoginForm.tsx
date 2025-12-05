'use client';

import React from 'react';
import Image from 'next/image';
import { Input, Button, PasswordInput, Card, KibiMessage, Checkbox } from '@/shared/ui';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { useTheme } from '@/shared/lib/context';
import { cn } from '@/shared/lib/utils';
import type { LoginFormData } from '../types/auth.types';
import { GoogleSignInButton } from './GoogleSignInButton';

export interface LoginFormProps {
  formData: LoginFormData;
  isLoading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin?: (provider: 'google' | 'apple' | 'facebook') => void;
  onGoogleSuccess?: (idToken: string) => void | Promise<void>;
  onGoogleError?: (error: Error) => void;
  onRegisterClick?: () => void;
  rememberMe?: boolean;
  onRememberMeChange?: (checked: boolean | "indeterminate") => void;
  onForgotPassword?: () => void;
}

export const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  ({
    formData,
    isLoading,
    error,
    onChange,
    onSubmit,
    onSocialLogin,
    onGoogleSuccess,
    onGoogleError,
    onRegisterClick,
    rememberMe = false,
    onRememberMeChange,
    onForgotPassword
  }, ref) => {
    const { isDarkMode } = useTheme();

    const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
      if (onSocialLogin) {
        onSocialLogin(provider);
      }
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
              alt="Login illustration"
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
                        <span className="font-bold text-[23px]">Inicia sesión</span>
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
                <form ref={ref} onSubmit={onSubmit} className="flex flex-col gap-4">
                  <Input
                    type="email"
                    name="username"
                    placeholder="Correo electrónico"
                    value={formData.username}
                    onChange={onChange}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="border border-[#DEE2E6] dark:border-[#374151]"
                  />

                  <PasswordInput
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={onChange}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="border border-[#DEE2E6] dark:border-[#374151]"
                  />

                  {/* Recordarme y Olvidé mi contraseña */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={rememberMe}
                        onCheckedChange={onRememberMeChange}
                        disabled={isLoading}
                      />
                      <span className="text-[14px] text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                        Recordar
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-[14px] md:text-[17px] font-bold text-[#0074F0] hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Olvidé mi contraseña
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    color="green"
                    size="medium"
                    className="w-full max-w-[250px] mx-auto mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[#5F6774]"></div>
                  <span className="flex-shrink mx-4 text-[14px] text-dark-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                    O ingresa con
                  </span>
                  <div className="flex-grow border-t border-[#5F6774]"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex items-center justify-center gap-4">
                  {/* Google Sign-In Button */}
                  {onGoogleSuccess ? (
                    <GoogleSignInButton
                      onSuccess={onGoogleSuccess}
                      onError={onGoogleError}
                      disabled={isLoading}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      aria-label="Iniciar sesión con Google"
                    >
                      <img
                        src={isDarkMode ? '/icons/Google-dark.svg' : '/icons/Google-light.svg'}
                        alt="Google"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </button>
                  )}

                  {/* TODO: Implementar Apple Sign-In cuando el backend lo soporte */}
                  {/* <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    disabled={isLoading}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Iniciar sesión con Apple"
                  >
                    <img
                      src={isDarkMode ? '/icons/Apple-dark.svg' : '/icons/Apple-light.svg'}
                      alt="Apple"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </button> */}

                  {/* TODO: Implementar Facebook Sign-In cuando el backend lo soporte */}
                  {/* <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isLoading}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Iniciar sesión con Facebook"
                  >
                    <img
                      src={isDarkMode ? '/icons/Facebook-dark.svg' : '/icons/Facebook-light.svg'}
                      alt="Facebook"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </button> */}
                </div>

                {/* Register Link */}
                <div className="text-center mt-2 flex flex-col gap-1">
                  <p className="text-[14px] text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                    ¿No tienes cuenta?
                  </p>
                  <button
                    type="button"
                    onClick={onRegisterClick}
                    disabled={isLoading}
                    className="text-[14px] md:text-[17px] font-bold text-[#0074F0] hover:underline font-[family-name:var(--font-rubik)] disabled:opacity-50"
                  >
                    Regístrate aquí
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
);

LoginForm.displayName = 'LoginForm';

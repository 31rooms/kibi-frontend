import React from 'react';
import { Input, Button, Checkbox } from '@/shared/ui';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import type { LoginFormData } from '../types/auth.types';

export interface LoginFormProps {
  formData: LoginFormData;
  isLoading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (checked: boolean | "indeterminate") => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  ({ formData, isLoading, error, onChange, onCheckboxChange, onSubmit, onForgotPassword }, ref) => {
    return (
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
          />

          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={onChange}
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
                onCheckedChange={onCheckboxChange}
                disabled={isLoading}
              />
              <span className="text-[14px] text-dark-700 font-[family-name:var(--font-rubik)]">
                Recordarme
              </span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
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
      </div>
    );
  }
);

LoginForm.displayName = 'LoginForm';

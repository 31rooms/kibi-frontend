'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'trailingIcon'> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={props.className}
        />
        {showToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-300 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

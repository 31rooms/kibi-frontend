'use client';

import { useState } from 'react';
import { accountAPI } from '../api/account-service';

/**
 * Hook for password change functionality
 * Handles password validation and API call
 */
export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Validate password strength
   */
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    return null;
  };

  /**
   * Change password
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError('Por favor ingresa tu contraseña actual');
      return false;
    }

    if (!newPassword) {
      setError('Por favor ingresa una nueva contraseña');
      return false;
    }

    if (!confirmPassword) {
      setError('Por favor confirma tu nueva contraseña');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (currentPassword === newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    // API call
    setIsLoading(true);
    try {
      await accountAPI.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(errorMessage);
      setSuccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  };
};

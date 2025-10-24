'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import type { LoginFormData } from '../types/auth.types';

export const useLoginForm = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
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

  const handleCheckboxChange = useCallback((checked: boolean | "indeterminate") => {
    // Convert "indeterminate" to false for boolean field
    const booleanValue = checked === true;
    setFormData((prev) => ({ ...prev, rememberMe: booleanValue }));
  }, []);

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }

    if (!validateEmail(formData.username)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!formData.password) {
      setError('Por favor ingresa tu contraseña');
      return false;
    }

    if (!validatePassword(formData.password)) {
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
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorResponse = error as { response?: { data?: unknown }; code?: string };
      console.error('Error response:', errorResponse.response?.data);
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Set user-friendly error message
      if (errorMessage.includes('credentials') || errorMessage.includes('Invalid') || errorMessage.includes('Unauthorized')) {
        setError('Correo electrónico o contraseña incorrectos');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorResponse.code === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que el backend esté corriendo en http://localhost:3000');
      } else {
        setError(errorMessage || 'Ocurrió un error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
  };
};

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/authentication';
import { NotificationProvider } from './NotificationContext';

/**
 * Wrapper que obtiene el accessToken de localStorage
 * y lo pasa al NotificationProvider
 */
export function NotificationProviderWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('access_token');
      // Solo setear el token si es válido (no null, undefined, o cadena vacía)
      if (token && token.trim() !== '') {
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
    } else {
      setAccessToken(null);
    }
  }, [isAuthenticated]);

  return (
    <NotificationProvider accessToken={accessToken}>
      {children}
    </NotificationProvider>
  );
}

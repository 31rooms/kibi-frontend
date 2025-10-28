'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, Theme } from '@/features/authentication';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Determine theme whenever user changes
  useEffect(() => {
    if (!user) {
      setIsDarkMode(false);
      return;
    }

    const determineTheme = () => {
      if (user.theme === Theme.DARK) {
        return true;
      } else if (user.theme === Theme.LIGHT) {
        return false;
      } else {
        // Theme.SYSTEM - detect from browser
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
      }
    };

    setIsDarkMode(determineTheme());
  }, [user]);

  // Apply dark mode class to html element for Tailwind
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;

    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen for system theme changes if user preference is SYSTEM
  useEffect(() => {
    if (!user || user.theme !== Theme.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render by triggering auth context update
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user]);

  const value: ThemeContextType = {
    isDarkMode,
    theme: user?.theme || Theme.SYSTEM,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

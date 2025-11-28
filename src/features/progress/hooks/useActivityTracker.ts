'use client';

import { useEffect, useRef, useCallback } from 'react';
import { progressAPI } from '../api/progressAPI';

const INACTIVITY_THRESHOLD_MS = 15000; // 15 segundos sin actividad
const SYNC_INTERVAL_MS = 30000; // Verificar cada 30 segundos si hay tiempo para sincronizar
const MIN_SECONDS_TO_SYNC = 60; // Mínimo de segundos para sincronizar (1 minuto)
const DEBUG = false;

interface UseActivityTrackerOptions {
  enabled?: boolean;
}

/**
 * Hook para rastrear el tiempo activo del usuario en la aplicación.
 *
 * Características:
 * - Detecta inactividad después de 15 segundos sin interacción
 * - Pausa el contador cuando la pestaña no está visible
 * - Sincroniza el tiempo con el servidor cada 60 segundos
 * - Envía el tiempo restante al cerrar la pestaña (beacon)
 *
 * @param options.enabled - Si el tracking está habilitado (default: true)
 */
export function useActivityTracker(options: UseActivityTrackerOptions = {}) {
  const { enabled = true } = options;

  const activeTimeRef = useRef(0);
  const isActiveRef = useRef(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const counterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef(0);
  const isMountedRef = useRef(true);

  // Función para enviar tiempo al servidor
  const syncActivityTime = useCallback(async () => {
    const secondsToSync = activeTimeRef.current - lastSyncRef.current;

    if (DEBUG) {
      console.log('[ActivityTracker] Attempting sync:', {
        totalActiveTime: activeTimeRef.current,
        lastSync: lastSyncRef.current,
        secondsToSync,
        willSync: secondsToSync >= MIN_SECONDS_TO_SYNC,
      });
    }

    // Solo sincronizar si hay al menos 60 segundos (1 minuto completo)
    if (secondsToSync >= MIN_SECONDS_TO_SYNC) {
      try {
        if (DEBUG) console.log('[ActivityTracker] Sending to server:', secondsToSync, 'seconds');
        const result = await progressAPI.addActivityTime(secondsToSync);
        if (DEBUG) console.log('[ActivityTracker] Server response:', result);
        lastSyncRef.current = activeTimeRef.current;
      } catch (error) {
        console.error('[ActivityTracker] Error syncing activity time:', error);
      }
    }
  }, []);

  // Reiniciar timer de inactividad
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Si el usuario estaba inactivo, marcarlo como activo
    if (!isActiveRef.current) {
      isActiveRef.current = true;
    }

    // Establecer nuevo temporizador de inactividad
    inactivityTimerRef.current = setTimeout(() => {
      isActiveRef.current = false;
    }, INACTIVITY_THRESHOLD_MS);
  }, []);

  useEffect(() => {
    if (DEBUG) console.log('[ActivityTracker] Hook mounted, enabled:', enabled);

    if (!enabled) {
      if (DEBUG) console.log('[ActivityTracker] Not enabled, skipping');
      return;
    }

    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      if (DEBUG) console.log('[ActivityTracker] Not in browser, skipping');
      return;
    }

    // Verificar que el usuario está autenticado
    const token = localStorage.getItem('access_token');
    if (!token) {
      if (DEBUG) console.log('[ActivityTracker] No token found, skipping');
      return;
    }

    if (DEBUG) console.log('[ActivityTracker] Starting activity tracking');
    isMountedRef.current = true;

    // Contador principal (cada segundo)
    counterIntervalRef.current = setInterval(() => {
      if (isActiveRef.current && isMountedRef.current) {
        activeTimeRef.current++;
        // Log cada 10 segundos para debug
        if (DEBUG && activeTimeRef.current % 10 === 0) {
          console.log('[ActivityTracker] Active time:', activeTimeRef.current, 'seconds');
        }
      }
    }, 1000);

    // Sincronización periódica cada 60 segundos
    if (DEBUG) console.log('[ActivityTracker] Setting up sync timer for every', SYNC_INTERVAL_MS / 1000, 'seconds');
    syncTimerRef.current = setInterval(() => {
      if (DEBUG) console.log('[ActivityTracker] Sync timer triggered');
      if (isMountedRef.current) {
        syncActivityTime();
      }
    }, SYNC_INTERVAL_MS);

    // Event listeners para detectar actividad
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Control de visibilidad de pestaña
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pestaña oculta: pausar y sincronizar
        isActiveRef.current = false;
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        // Sincronizar inmediatamente al ocultar
        syncActivityTime();
      } else {
        // Pestaña visible: reanudar
        resetInactivityTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Sincronizar antes de cerrar/salir usando fetch con keepalive
    const handleBeforeUnload = () => {
      const secondsToSync = activeTimeRef.current - lastSyncRef.current;
      if (secondsToSync >= 60) {
        const token = localStorage.getItem('access_token');
        if (token) {
          const baseUrl = process.env.NODE_ENV === 'production'
            ? '/api'
            : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

          // Usar fetch con keepalive para enviar con headers de auth
          fetch(`${baseUrl}/progress/activity-time`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ activeSeconds: secondsToSync }),
            keepalive: true, // Permite que la request se complete después de cerrar la página
          }).catch(() => {
            // Ignorar errores silenciosamente
          });
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Iniciar timer de inactividad
    resetInactivityTimer();

    // Cleanup
    return () => {
      if (DEBUG) console.log('[ActivityTracker] Cleanup called - effect is being re-run or unmounted');
      isMountedRef.current = false;

      if (counterIntervalRef.current) {
        clearInterval(counterIntervalRef.current);
      }
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Sincronizar al desmontar
      syncActivityTime();
    };
  }, [enabled]); // Removidas dependencias innecesarias que causaban re-renders

  return {
    /** Tiempo activo actual en segundos (para debug/display) */
    getActiveTime: () => activeTimeRef.current,
    /** Si el usuario está actualmente activo */
    isActive: () => isActiveRef.current,
  };
}

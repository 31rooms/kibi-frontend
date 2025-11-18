'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isPushNotificationSupported,
  getDeviceInfo,
  urlBase64ToUint8Array,
  registerServiceWorker,
  requestNotificationPermission,
  getNotificationPermission,
} from '../utils/pushNotification';
import {
  getVapidPublicKey,
  savePushSubscription,
  deletePushSubscription,
} from '../api/pushSubscriptionApi';
import type { PushNotificationState } from '../types/notification.types';

export function usePushNotifications(accessToken: string | null) {
  const [state, setState] = useState<PushNotificationState>({
    permission: 'default',
    isSupported: false,
    isSubscribed: false,
    subscription: null,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Check initial support and permission
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = isPushNotificationSupported();
      const permission = getNotificationPermission();

      setState(prev => ({
        ...prev,
        isSupported,
        permission,
      }));

      // Si tiene permiso, verificar si ya está suscrito
      if (permission === 'granted' && isSupported && accessToken) {
        await checkExistingSubscription();
      }
    };

    checkSupport();
  }, [accessToken]);

  /**
   * Verifica si ya existe una suscripción activa
   */
  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        const subscription = {
          endpoint: existingSubscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(existingSubscription.getKey('p256dh')),
            auth: arrayBufferToBase64(existingSubscription.getKey('auth')),
          },
        };

        setState(prev => ({
          ...prev,
          isSubscribed: true,
          subscription,
        }));
      }
    } catch (error) {
      console.error('Error checking existing subscription:', error);
    }
  }, []);

  /**
   * Subscribe to push notifications
   */
  const subscribe = useCallback(async () => {
    console.log('🔔 [Subscribe] Starting subscription process...');

    if (!accessToken) {
      console.error('❌ [Subscribe] No access token available');
      setState(prev => ({ ...prev, error: 'No access token available' }));
      return false;
    }

    setIsLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      // 1. Verificar soporte
      console.log('1️⃣ [Subscribe] Checking push notification support...');
      if (!isPushNotificationSupported()) {
        throw new Error('Push notifications are not supported in this browser');
      }
      console.log('✅ [Subscribe] Push notifications are supported');

      // 2. Solicitar permiso
      console.log('2️⃣ [Subscribe] Requesting notification permission...');
      const permission = await requestNotificationPermission();
      console.log('✅ [Subscribe] Permission result:', permission);
      setState(prev => ({ ...prev, permission }));

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // 3. Registrar service worker
      console.log('3️⃣ [Subscribe] Registering service worker...');
      const registration = await registerServiceWorker();
      console.log('✅ [Subscribe] Service worker registered:', registration);

      // 4. Obtener clave pública VAPID
      console.log('4️⃣ [Subscribe] Fetching VAPID public key...');
      const vapidPublicKey = await getVapidPublicKey();
      console.log('✅ [Subscribe] VAPID key received:', vapidPublicKey.substring(0, 20) + '...');
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      // 5. Suscribirse a push
      console.log('5️⃣ [Subscribe] Subscribing to push manager...');
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      });
      console.log('✅ [Subscribe] Push subscription created:', pushSubscription.endpoint);

      // 6. Convertir suscripción a formato JSON
      console.log('6️⃣ [Subscribe] Converting subscription to JSON...');
      const subscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')),
          auth: arrayBufferToBase64(pushSubscription.getKey('auth')),
        },
      };
      console.log('✅ [Subscribe] Subscription converted');

      // 7. Guardar en el servidor
      console.log('7️⃣ [Subscribe] Saving subscription to server...');
      const deviceInfo = getDeviceInfo();
      await savePushSubscription({ ...subscription, deviceInfo });
      console.log('✅ [Subscribe] Subscription saved to server');

      // 8. Actualizar estado
      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription,
      }));

      console.log('✅ Successfully subscribed to push notifications');
      return true;
    } catch (error: any) {
      console.error('❌ [Subscribe] Error subscribing to push notifications:', error);
      console.error('❌ [Subscribe] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      setState(prev => ({
        ...prev,
        error: error.message,
        isSubscribed: false,
      }));
      return false;
    } finally {
      console.log('🏁 [Subscribe] Finishing subscription process, setting isLoading to false');
      setIsLoading(false);
    }
  }, [accessToken]);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = useCallback(async () => {
    if (!accessToken || !state.subscription) {
      return false;
    }

    setIsLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      // 1. Obtener suscripción del service worker
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();

      if (pushSubscription) {
        // 2. Desuscribirse del navegador
        await pushSubscription.unsubscribe();
      }

      // 3. Eliminar del servidor
      await deletePushSubscription(state.subscription.endpoint);

      // 4. Actualizar estado
      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
      }));

      console.log('✅ Successfully unsubscribed from push notifications');
      return true;
    } catch (error: any) {
      console.error('Error unsubscribing from push notifications:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, state.subscription]);

  return {
    ...state,
    isLoading,
    subscribe,
    unsubscribe,
    checkExistingSubscription,
  };
}

/**
 * Helper: Convierte ArrayBuffer a Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

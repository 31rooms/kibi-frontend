/**
 * Verifica si el navegador soporta notificaciones push
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Verifica si la aplicación está corriendo en modo PWA (standalone)
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Verificar display mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari standalone mode
  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Obtiene información del dispositivo para la suscripción
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {};
  }

  const userAgent = navigator.userAgent;

  // Detectar tipo de dispositivo
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);

  let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  if (isTablet) {
    deviceType = 'tablet';
  } else if (isMobile) {
    deviceType = 'mobile';
  }

  // Detectar navegador
  let browser = 'unknown';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'safari';
  } else if (userAgent.includes('Firefox')) {
    browser = 'firefox';
  } else if (userAgent.includes('Edg')) {
    browser = 'edge';
  }

  // Detectar OS
  let os = 'unknown';
  if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  } else if (userAgent.includes('Win')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }

  return {
    userAgent,
    deviceType,
    browser,
    os,
  };
}

/**
 * Convierte un base64 URL-safe a Uint8Array (para VAPID key)
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Registra el service worker si no está registrado
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported');
  }

  try {
    console.log('[SW] Checking existing service worker registration...');

    // Primero, verificar si ya hay un service worker registrado
    const existingRegistration = await navigator.serviceWorker.getRegistration();

    if (existingRegistration) {
      console.log('[SW] Service worker already registered:', existingRegistration);

      // Esperar a que esté activo
      if (existingRegistration.active) {
        console.log('[SW] Service worker is active');
        return existingRegistration;
      } else {
        console.log('[SW] Waiting for service worker to be ready...');
        return await navigator.serviceWorker.ready;
      }
    }

    // Si no hay registro, intentar registrar el service worker
    console.log('[SW] No service worker found, registering /sw.js...');
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service worker registered:', registration);

    // Esperar a que esté activo
    if (registration.installing) {
      console.log('[SW] Service worker is installing, waiting...');
      await new Promise<void>((resolve) => {
        registration.installing!.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker;
          console.log('[SW] State changed to:', sw.state);
          if (sw.state === 'activated') {
            resolve();
          }
        });
      });
    }

    return registration;
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error);
    throw error;
  }
}

/**
 * Solicita permiso para notificaciones
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Verifica el estado del permiso de notificaciones
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }

  return Notification.permission;
}

# Guía de Componentes PWA - Next.js

## 🎯 Concepto Clave

**Los componentes de Next.js NO cambian con PWA**. Una PWA es simplemente tu app Next.js normal + funcionalidades adicionales opcionales.

---

## 📦 Componentes Normales - Sin Cambios

### ❌ NO existe esto:
```tsx
// NO hay "componentes PWA" separados
import { PWAButton } from 'next-pwa'; // ❌ No existe
```

### ✅ Los componentes son iguales:
```tsx
// app/components/Card.tsx
export default function Card({ title, description }: Props) {
  return (
    <div className="rounded-lg shadow-lg p-6">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

// Este componente funciona IGUAL en:
// - Navegador web
// - PWA instalada
// - Mobile
// - Desktop
```

---

## 🎨 Estilos - Sin Cambios

### Tailwind CSS
```tsx
// Funciona exactamente igual
<div className="bg-blue-500 hover:bg-blue-700 transition-colors">
  <h1 className="text-2xl font-bold">Hola</h1>
</div>
```

### CSS Modules
```tsx
// styles/Card.module.css
.card {
  background: white;
  border-radius: 8px;
}

// components/Card.tsx
import styles from './Card.module.css';

export default function Card() {
  return <div className={styles.card}>Card</div>;
}
```

### Styled Components / Emotion
```tsx
'use client';

import styled from 'styled-components';

const Button = styled.button`
  background: blue;
  color: white;
  padding: 1rem;
`;

export default function MyButton() {
  return <Button>Click me</Button>;
}
```

**Todo funciona igual en PWA y web.**

---

## 🆕 Componentes Específicos PWA (Opcionales)

Estos son componentes **adicionales** que puedes agregar para mejorar la experiencia PWA:

### 1. Botón de Instalación

```tsx
// components/InstallPrompt.tsx
'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      setShowInstallButton(false);
      return;
    }

    // Capturar el evento de instalación
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    await deferredPrompt.prompt();

    // Esperar la decisión del usuario
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
      setShowInstallButton(false);
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Guardar en localStorage que el usuario no quiere instalar
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallButton) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white shadow-2xl rounded-lg p-6 border border-gray-200">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Cerrar"
      >
        ✕
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl">
          📱
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            Instalar Kibi
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Instala la aplicación para acceso rápido y funcionalidad offline
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Uso:**
```tsx
// app/layout.tsx
import InstallPrompt from '@/components/InstallPrompt';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
```

### 2. Indicador de Estado de Instalación

```tsx
// components/PWAStatus.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PWAStatus() {
  const [isPWA, setIsPWA] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Detectar si está corriendo como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(standalone);

    // Detectar conexión
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isPWA) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm">
          📡 Sin conexión - Trabajando en modo offline
        </div>
      )}
    </div>
  );
}
```

### 3. Notificación de Actualización Disponible

```tsx
// components/UpdateNotification.tsx
'use client';

import { useEffect, useState } from 'react';

export default function UpdateNotification() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker?.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // Nueva versión disponible
            setShowReload(true);
            setWaitingWorker(newWorker);
          }
        });
      });
    });

    // Escuchar mensajes del service worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
  };

  if (!showReload) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🎉</span>
        <div className="flex-1">
          <h4 className="font-bold mb-1">Nueva versión disponible</h4>
          <p className="text-sm opacity-90 mb-3">
            Hay una actualización disponible. Recarga para obtener la última versión.
          </p>
          <button
            onClick={handleUpdate}
            className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded hover:bg-green-50 transition-colors"
          >
            Actualizar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 4. Hook Personalizado para Detectar PWA

```tsx
// hooks/usePWA.ts
'use client';

import { useEffect, useState } from 'react';

interface UsePWAReturn {
  isPWA: boolean;
  isOnline: boolean;
  isInstallable: boolean;
  installApp: () => Promise<void>;
}

export function usePWA(): UsePWAReturn {
  const [isPWA, setIsPWA] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detectar si está en modo PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(standalone);

    // Estado de conexión
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Capturar prompt de instalación
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
      setIsPWA(true);
    }

    setDeferredPrompt(null);
  };

  return { isPWA, isOnline, isInstallable, installApp };
}
```

**Uso del hook:**
```tsx
// components/MyComponent.tsx
'use client';

import { usePWA } from '@/hooks/usePWA';

export default function MyComponent() {
  const { isPWA, isOnline, isInstallable, installApp } = usePWA();

  return (
    <div>
      {isPWA && <p>✅ Corriendo como PWA</p>}
      {!isOnline && <p>📡 Modo offline</p>}
      {isInstallable && (
        <button onClick={installApp}>
          Instalar aplicación
        </button>
      )}
    </div>
  );
}
```

### 5. Componente de Share (Compartir nativo)

```tsx
// components/ShareButton.tsx
'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false);

  useState(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  });

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(url || window.location.href);
      alert('Link copiado al portapapeles');
      return;
    }

    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href,
      });
    } catch (error) {
      // Usuario canceló o error
      console.error('Error al compartir:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      <span>📤</span>
      <span>Compartir</span>
    </button>
  );
}
```

### 6. Componente de Notificaciones

```tsx
// components/NotificationButton.tsx
'use client';

import { useState, useEffect } from 'react';

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      // Mostrar notificación de prueba
      new Notification('¡Notificaciones activadas!', {
        body: 'Ahora recibirás notificaciones de Kibi',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      });
    }
  };

  if (!supported) return null;

  if (permission === 'granted') {
    return (
      <div className="text-green-600 flex items-center gap-2">
        <span>✅</span>
        <span>Notificaciones activadas</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="text-red-600 flex items-center gap-2">
        <span>❌</span>
        <span>Notificaciones bloqueadas</span>
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
    >
      🔔 Activar notificaciones
    </button>
  );
}
```

---

## 🎯 Diferencias de UX según Contexto

### Ajustar Layout según PWA

```tsx
// app/layout.tsx
'use client';

import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(standalone);
  }, []);

  return (
    <html>
      <body>
        {/* Header diferente según contexto */}
        {isPWA ? (
          // Header para PWA (sin botón de instalar)
          <header className="bg-blue-500 text-white p-4">
            <h1>Kibi App</h1>
          </header>
        ) : (
          // Header para web (con botón de instalar)
          <header className="bg-blue-500 text-white p-4 flex justify-between">
            <h1>Kibi Web</h1>
            <button>📱 Instalar</button>
          </header>
        )}

        <main>{children}</main>

        {/* Footer con safe area para PWA en móvil */}
        <footer
          className="bg-gray-100 p-4"
          style={{
            paddingBottom: isPWA ? 'env(safe-area-inset-bottom)' : '1rem',
          }}
        >
          Footer
        </footer>
      </body>
    </html>
  );
}
```

### Navegación adaptativa

```tsx
// components/Navigation.tsx
'use client';

import { usePWA } from '@/hooks/usePWA';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { isPWA } = usePWA();
  const router = useRouter();

  return (
    <nav className="flex gap-4">
      {/* En PWA, usar navegación interna */}
      {isPWA ? (
        <>
          <button onClick={() => router.push('/')}>Inicio</button>
          <button onClick={() => router.push('/about')}>Acerca</button>
        </>
      ) : (
        // En web, links normales
        <>
          <a href="/">Inicio</a>
          <a href="/about">Acerca</a>
        </>
      )}
    </nav>
  );
}
```

---

## 🎨 Estilos Específicos para PWA

### Safe Area (para notch en móviles)

```css
/* globals.css */

/* Padding para dispositivos con notch */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right);
}
```

```tsx
// Uso
<header className="safe-area-top bg-blue-500 p-4">
  Header
</header>
```

### Media query para detectar PWA en CSS

```css
/* Estilos solo cuando está instalada como PWA */
@media (display-mode: standalone) {
  .header {
    /* No mostrar botón de instalar */
    .install-button {
      display: none;
    }
  }

  .app-container {
    /* Ajustar para pantalla completa */
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Estilos solo en navegador */
@media (display-mode: browser) {
  .pwa-only-feature {
    display: none;
  }
}
```

### Tailwind con variante personalizada

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'standalone': { 'raw': '(display-mode: standalone)' },
      },
    },
  },
};
```

```tsx
// Uso
<div className="p-4 standalone:pb-safe">
  Contenido con padding extra en PWA
</div>
```

---

## 📱 Componentes Responsive (Web + PWA)

```tsx
// components/ResponsiveCard.tsx
'use client';

import { usePWA } from '@/hooks/usePWA';

interface CardProps {
  title: string;
  description: string;
}

export default function ResponsiveCard({ title, description }: CardProps) {
  const { isPWA } = usePWA();

  return (
    <div
      className={`
        rounded-lg shadow-lg p-6
        ${isPWA ? 'bg-blue-50' : 'bg-white'}
        hover:shadow-xl transition-shadow
      `}
    >
      {isPWA && <span className="text-xs text-blue-600">📱 PWA Mode</span>}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

---

## ✅ Resumen

### Lo que NO cambia:
- ❌ Estructura de componentes
- ❌ Estilos (Tailwind, CSS, etc.)
- ❌ Lógica de negocio
- ❌ Hooks de React
- ❌ Server Components / Client Components
- ❌ API Routes

### Lo que SÍ puedes agregar (opcional):
- ✅ Botón de instalación
- ✅ Indicador de conexión offline/online
- ✅ Notificación de actualización disponible
- ✅ Compartir nativo (Web Share API)
- ✅ Notificaciones push
- ✅ Ajustes de UI según contexto (PWA vs Web)

### Regla de oro:
**Desarrolla tu app Next.js normalmente. PWA es solo un extra.**

No necesitas componentes especiales ni cambiar tu forma de trabajar. Los componentes PWA específicos son completamente opcionales y solo mejoran la experiencia del usuario.

---

**Tu flujo de trabajo:**
1. Crear componentes Next.js normalmente
2. Aplicar estilos con Tailwind normalmente
3. (Opcional) Agregar componentes PWA para mejorar UX
4. Build y disfrutar de PWA automáticamente

¡Es así de simple! 🎉

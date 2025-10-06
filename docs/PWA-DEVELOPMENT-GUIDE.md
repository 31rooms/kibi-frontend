# Guía de Desarrollo PWA - Kibi Frontend

## 📚 Índice
- [Conceptos Básicos](#conceptos-básicos)
- [Entorno de Desarrollo vs Producción](#entorno-de-desarrollo-vs-producción)
- [Cómo Probar la PWA](#cómo-probar-la-pwa)
- [Verificación y Testing](#verificación-y-testing)
- [Flujo de Trabajo Recomendado](#flujo-de-trabajo-recomendado)
- [Solución de Problemas](#solución-de-problemas)
- [FAQs](#faqs)

---

## Conceptos Básicos

### ¿Qué es una PWA?

Una **Progressive Web App (PWA)** es una aplicación web que funciona como una app nativa:
- Se puede **instalar** en el dispositivo
- Funciona **offline** (sin conexión)
- Recibe **notificaciones push**
- Tiene una **pantalla de inicio** dedicada
- Se ejecuta en **modo standalone** (sin barra del navegador)

### Componentes clave de una PWA

1. **Service Worker** (`sw.js`)
   - Script que corre en segundo plano
   - Intercepta peticiones de red
   - Gestiona el caché
   - Permite funcionalidad offline

2. **Manifest** (`manifest.json`)
   - Define nombre, iconos, colores
   - Configura cómo se muestra la app
   - Establece el comportamiento de instalación

3. **HTTPS**
   - Requerido para service workers
   - En desarrollo: localhost es excepción

---

## Entorno de Desarrollo vs Producción

### ⚠️ Diferencia Crítica

| Comando | PWA Habilitado | Service Worker | Uso |
|---------|---------------|----------------|-----|
| `npm run dev` | ❌ NO | No generado | Desarrollo normal |
| `npm run build && npm start` | ✅ SÍ | Generado | Testing PWA |

### ¿Por qué la PWA está deshabilitada en desarrollo?

```typescript
// next.config.ts
disable: process.env.NODE_ENV === "development"
```

**Razones:**
1. **Caché agresivo** - Los cambios no se reflejan inmediatamente
2. **Hot Reload** - Puede interferir con la recarga automática
3. **Debugging** - Más difícil depurar con service worker activo
4. **Performance** - Desarrollo más rápido sin overhead de PWA

### Cómo habilitar PWA en desarrollo (No recomendado)

Si realmente necesitas PWA en desarrollo:

```typescript
// next.config.ts
export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false, // ⚠️ Cambiar esto
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);
```

**Después de cambiar:**
```bash
# Limpiar caché y reiniciar
rm -rf .next
npm run dev
```

**Efectos secundarios:**
- Tendrás que limpiar el service worker manualmente
- Los cambios pueden no reflejarse inmediatamente
- Debugging más complejo

---

## Cómo Probar la PWA

### Método 1: Build de Producción (Recomendado)

```bash
# 1. Hacer build de producción
npm run build

# 2. Iniciar servidor de producción
npm start

# 3. Abrir navegador
# http://localhost:3000
```

**Salida esperada del build:**
```
○ (pwa) Service worker: /mnt/e/31rooms/kibi-frontend/public/sw.js
○ (pwa)   URL: /sw.js
○ (pwa)   Scope: /
```

### Método 2: Servidor HTTPS local

Las PWA funcionan mejor con HTTPS. Para testing local con HTTPS:

#### Opción A: Usando mkcert

```bash
# Instalar mkcert (macOS)
brew install mkcert
mkcert -install

# Generar certificados
mkcert localhost

# Crear servidor HTTPS
# (Necesitarás configurar Next.js custom server)
```

#### Opción B: Usando ngrok

```bash
# Instalar ngrok
npm install -g ngrok

# Hacer build y start
npm run build
npm start

# En otra terminal
ngrok http 3000

# Usar la URL HTTPS que te da ngrok
```

---

## Verificación y Testing

### 1. Chrome DevTools

#### Verificar Manifest

1. Abrir DevTools (F12)
2. Ir a **Application** tab
3. En el sidebar: **Manifest**

**Verificar:**
- ✅ Name: "Kibi Frontend"
- ✅ Short name: "Kibi"
- ✅ Start URL: "/"
- ✅ Display: "standalone"
- ✅ Theme color: "#ffffff"
- ✅ Icons: Lista de 8 iconos

**⚠️ Errores comunes:**
```
No manifest detected
```
→ El service worker no se generó. Verifica que hiciste `npm run build`

```
Icon could not be loaded
```
→ Los iconos no existen. Genera los iconos siguiendo `public/icons/README.md`

#### Verificar Service Worker

1. DevTools > **Application** tab
2. Sidebar: **Service Workers**

**Verificar:**
- ✅ Source: `/sw.js`
- ✅ Status: "activated and is running"
- ✅ No hay errores en la consola

**Comandos útiles:**
```javascript
// En la consola de DevTools

// Ver service workers registrados
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log(regs));

// Desregistrar service worker (útil para limpiar)
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));

// Ver caché
caches.keys().then(keys => console.log(keys));

// Limpiar caché
caches.keys().then(keys =>
  Promise.all(keys.map(key => caches.delete(key)))
);
```

#### Verificar Caché

1. DevTools > **Application** tab
2. Sidebar: **Cache Storage**

**Verás:**
- `workbox-precache-v2-http://localhost:3000/` - Archivos pre-cacheados
- Archivos estáticos (JS, CSS, imágenes)

#### Simular Offline

1. DevTools > **Application** tab
2. Sidebar: **Service Workers**
3. Checkbox: ☑️ **Offline**

O también:
1. DevTools > **Network** tab
2. Throttling dropdown: **Offline**

**Prueba:**
- Marca offline
- Recarga la página
- Debería cargar desde caché

### 2. Lighthouse Audit

1. DevTools > **Lighthouse** tab
2. Seleccionar: ☑️ **Progressive Web App**
3. Click **Analyze page load**

**Puntaje objetivo:**
- 🟢 90-100: Excelente
- 🟡 50-89: Necesita mejoras
- 🔴 0-49: Problemas críticos

**Criterios evaluados:**
- ✅ Instala service worker
- ✅ Responde con 200 cuando offline
- ✅ Tiene manifest válido
- ✅ Iconos configurados
- ✅ Viewport configurado
- ✅ Tema de color configurado

### 3. Instalar la PWA

#### Desktop (Chrome/Edge/Brave)

**Indicador de instalación:**
- Ícono ⊕ o 🖥️ en la barra de direcciones

**Pasos:**
1. Click en el ícono de instalación
2. Diálogo: "Instalar Kibi?"
3. Click **Instalar**
4. La app se abre en ventana independiente

**Verificar instalación exitosa:**
- Ventana sin barra de direcciones
- Ícono de app en el dock/barra de tareas
- Se puede cerrar y abrir como app nativa

#### Android (Chrome)

1. Abrir la URL en Chrome
2. Menú (⋮) > **Agregar a pantalla de inicio**
   - O banner automático: "Agregar Kibi a la pantalla de inicio"
3. Se crea ícono en la pantalla principal
4. Abrir desde el ícono

**Verificar:**
- Se abre en pantalla completa (sin barra de Chrome)
- Aparece en el drawer de apps
- Puede ser desinstalada como app nativa

#### iOS (Safari)

⚠️ **Limitaciones en iOS:**
- Safari tiene soporte limitado de PWA
- No soporta service workers completamente
- Algunas features pueden no funcionar

**Pasos:**
1. Abrir en Safari
2. Tap en botón **Compartir** 📤
3. **Agregar a pantalla de inicio**
4. Editar nombre si es necesario
5. Tap **Añadir**

**Configuración específica iOS en layout.tsx:**
```typescript
appleWebApp: {
  capable: true,
  statusBarStyle: "default",
  title: "Kibi",
}
```

---

## Flujo de Trabajo Recomendado

### Para Desarrollo Normal

```bash
# Desarrollar features normales
npm run dev

# Ver cambios en http://localhost:3000
# Hot reload activo
# Sin service worker
```

### Para Testing PWA

```bash
# 1. Hacer cambios en código
# 2. Build de producción
npm run build

# 3. Verificar que SW se generó
ls public/sw.js

# 4. Iniciar servidor
npm start

# 5. Probar en navegador
# http://localhost:3000

# 6. Verificar en DevTools
# Application > Service Workers
# Application > Manifest

# 7. Probar instalación
# Click en ícono de instalar
```

### Workflow con Git

```bash
# Desarrollo
git checkout -b feature/nueva-funcionalidad
npm run dev
# ... hacer cambios ...

# Testing PWA
npm run build
npm start
# Probar que PWA funciona

# Commit
git add .
git commit -m "feat: nueva funcionalidad"

# Los archivos PWA están en .gitignore
# No se commitean: sw.js, workbox-*.js, worker-*.js
```

### Workflow con Deploy

```bash
# Vercel/Netlify/Otros
# Automáticamente ejecutan:
npm run build  # ✅ Genera service worker
npm start      # ✅ PWA habilitada

# Tu app será PWA en producción
```

---

## Solución de Problemas

### Problema: "No se genera sw.js"

**Síntomas:**
```bash
ls public/sw.js
# No such file or directory
```

**Solución:**
```bash
# 1. Verificar que estés usando webpack
# En package.json:
"build": "next build"  # ✅ Correcto
"build": "next build --turbopack"  # ❌ No genera SW

# 2. Limpiar y rebuildar
rm -rf .next
npm run build

# 3. Verificar output
# Deberías ver:
# ○ (pwa) Service worker: /path/to/public/sw.js
```

### Problema: "Los cambios no se reflejan"

**Causa:** Service worker cacheó versión vieja

**Solución:**
```javascript
// En DevTools Console
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));

// Luego hacer hard refresh
// Ctrl + Shift + R (Windows/Linux)
// Cmd + Shift + R (Mac)
```

O en DevTools:
1. Application > Service Workers
2. Click **Unregister**
3. Hard refresh

### Problema: "404 en iconos"

**Síntomas:**
```
GET http://localhost:3000/icons/icon-192x192.png 404
```

**Solución:**
Los iconos no existen. Tienes 3 opciones:

#### Opción 1: Crear iconos placeholder
```bash
# Crear un SVG simple como base
cat > public/icon-base.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#4F46E5"/>
  <text x="50%" y="50%" font-size="200" fill="white"
        text-anchor="middle" dy=".3em">K</text>
</svg>
EOF

# Usar herramienta online para generar PNG
# https://www.pwabuilder.com/imageGenerator
```

#### Opción 2: Comentar temporalmente
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  // icons: {
  //   icon: "/icons/icon-192x192.png",
  //   apple: "/icons/icon-192x192.png",
  // },
};
```

#### Opción 3: Usar favicon.ico como placeholder
```typescript
icons: {
  icon: "/favicon.ico",
  apple: "/favicon.ico",
}
```

### Problema: "PWA no se puede instalar"

**Verificar requisitos:**

1. **HTTPS requerido** (excepto localhost)
   ```bash
   # ❌ No funciona
   http://192.168.1.100:3000

   # ✅ Funciona
   https://192.168.1.100:3000
   http://localhost:3000  # Excepción
   ```

2. **Manifest válido**
   - DevTools > Application > Manifest
   - No debe tener errores

3. **Service Worker activo**
   - DevTools > Application > Service Workers
   - Status: "activated and is running"

4. **Criterios de instalabilidad**
   - Manifest con name, icons, start_url
   - Service worker con fetch handler
   - Servido sobre HTTPS

**Debug:**
```javascript
// Ver criterios de instalabilidad
// DevTools Console
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('App es instalable!', e);
});
```

### Problema: "App no funciona offline"

**Verificar:**

1. **Service worker cacheando archivos**
```javascript
// DevTools > Application > Cache Storage
// Debería mostrar archivos cacheados
```

2. **Estrategia de caché configurada**
```typescript
// next.config.ts
cacheOnFrontEndNav: true,
aggressiveFrontEndNavCaching: true,
```

3. **Probar modo offline**
```
DevTools > Application > Service Workers
☑️ Offline
```

### Problema: "Errores en consola de manifest"

**Error común:**
```
Manifest: Line 1, column 1, Syntax error.
```

**Causa:** JSON inválido en manifest.json

**Solución:**
```bash
# Validar JSON
cat public/manifest.json | jq .

# Si falla, revisar:
# - Comas finales
# - Comillas dobles vs simples
# - Estructura válida
```

---

## FAQs

### ¿Necesito certificado SSL para desarrollo?

**No** para localhost:
- `http://localhost:3000` ✅ Service workers funcionan
- `http://127.0.0.1:3000` ✅ Service workers funcionan

**Sí** para red local:
- `http://192.168.1.100:3000` ❌ Requiere HTTPS
- `https://192.168.1.100:3000` ✅ Con certificado

### ¿Cómo desinstalar la PWA?

**Chrome Desktop:**
1. Abrir la app instalada
2. Menú (⋮) > **Desinstalar [nombre]**

O:
1. chrome://apps
2. Click derecho en la app > **Eliminar de Chrome**

**Android:**
1. Mantener presionado el ícono
2. **Desinstalar** o arrastrar a papelera

**iOS:**
1. Mantener presionado el ícono
2. **Eliminar App**

### ¿Puedo tener diferentes configuraciones PWA para dev/prod?

**Sí:**

```typescript
// next.config.ts
const isProd = process.env.NODE_ENV === 'production';

export default withPWA({
  dest: "public",
  disable: !isProd, // Solo en producción
  register: isProd,
  cacheOnFrontEndNav: isProd,
  workboxOptions: {
    disableDevLogs: !isProd,
  },
})(nextConfig);
```

### ¿Cómo actualizar la PWA cuando hay nueva versión?

**Automático:**
El service worker detecta cambios y actualiza automáticamente.

**Manual (recomendado para UX):**

```typescript
// components/UpdatePrompt.tsx
'use client';

import { useEffect, useState } from 'react';

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowPrompt(true);
            }
          });
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <p>Nueva versión disponible</p>
      <button onClick={handleUpdate} className="mt-2 bg-white text-blue-500 px-4 py-2 rounded">
        Actualizar
      </button>
    </div>
  );
}
```

### ¿Cómo depurar service workers?

**Chrome DevTools:**

1. **Console logs:**
```javascript
// En el service worker
self.addEventListener('install', (event) => {
  console.log('SW: Install event', event);
});
```

2. **Ver en DevTools:**
```
Application > Service Workers > Source
```

3. **Breakpoints:**
- Abrir sw.js desde Sources tab
- Agregar breakpoints normalmente

4. **Ver eventos:**
```
Application > Service Workers >
☑️ Update on reload
☑️ Bypass for network
```

### ¿Puedo usar PWA con otras features de Next.js?

**Sí, compatible con:**
- ✅ App Router
- ✅ Pages Router
- ✅ Static Export
- ✅ Incremental Static Regeneration (ISR)
- ✅ Server-Side Rendering (SSR)
- ✅ API Routes
- ✅ Middleware

**Consideraciones:**
- SSR: Contenido se cachea en el cliente
- ISR: Actualización de caché automática
- API Routes: Configurar estrategia de caché

### ¿Cómo configurar notificaciones push?

**1. Agregar permisos al manifest:**
```json
{
  "permissions": ["notifications"]
}
```

**2. Solicitar permiso:**
```typescript
const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notificaciones permitidas');
  }
};
```

**3. Enviar notificación:**
```typescript
navigator.serviceWorker.ready.then((registration) => {
  registration.showNotification('Título', {
    body: 'Mensaje de la notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
  });
});
```

---

## Recursos Adicionales

### Documentación Oficial
- [Next PWA Docs](https://github.com/DuCanhGH/next-pwa)
- [Next.js PWA Guide](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### Herramientas
- [PWA Builder](https://www.pwabuilder.com/) - Generador de assets PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoría PWA
- [Real Favicon Generator](https://realfavicongenerator.net/) - Generador de iconos

### Testing
- [PWA Testing Guide](https://web.dev/pwa-checklist/)
- [Workbox Testing](https://developer.chrome.com/docs/workbox/modules/workbox-window/)

### Comunidad
- [Next.js Discord](https://nextjs.org/discord)
- [Stack Overflow: next-pwa](https://stackoverflow.com/questions/tagged/next-pwa)

---

## Changelog de este proyecto

### Versión Actual: 1.0.0

**Configuración PWA:**
- ✅ Next.js 15.5.4
- ✅ @ducanh2912/next-pwa 10.2.9
- ✅ Manifest configurado
- ✅ Service worker automático
- ✅ Metadata completa
- ✅ Soporte iOS/Android
- ⚠️ Iconos pendientes

**Próximos pasos:**
1. Generar iconos PWA
2. Configurar notificaciones push (opcional)
3. Optimizar estrategia de caché
4. Agregar página offline personalizada

---

**Última actualización:** 2025-10-05
**Autor:** Claude Code
**Proyecto:** Kibi Frontend

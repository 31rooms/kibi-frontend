# Configuración PWA - Kibi Frontend

Este proyecto está completamente configurado como Progressive Web App (PWA) usando Next.js 15.

## ✅ Configuración Completada

### 1. Dependencias Instaladas
- `@ducanh2912/next-pwa` - Plugin moderno para PWA en Next.js

### 2. Archivos Configurados

#### `next.config.ts`
- Configurado con `withPWA` wrapper
- Service Worker generado en `public/`
- Caché optimizado para navegación
- Deshabilitado en desarrollo para facilitar debugging

#### `app/layout.tsx`
- Metadata completa para PWA
- Soporte para Apple Web App
- Configuración de viewport optimizada
- Referencias a iconos y manifest

#### `public/manifest.json`
- Configuración completa de la app
- Referencias a todos los tamaños de iconos
- Modo standalone para experiencia nativa
- Theme colors configurados

### 3. Estructura de Iconos
- Carpeta `public/icons/` creada
- README con instrucciones para generar iconos
- Requiere iconos en 8 tamaños diferentes (72px a 512px)

## 🚀 Cómo Usar

### Desarrollo Local
```bash
npm run dev
```
**Nota:** El Service Worker está deshabilitado en desarrollo para facilitar el debugging.

### Build para Producción
```bash
npm run build
npm start
```

### Testing PWA
1. Hacer build de producción
2. Servir la aplicación
3. Abrir Chrome DevTools > Application > Manifest
4. Verificar que el manifest se cargue correctamente
5. Probar instalación desde el navegador

## ⚠️ Pendientes

### 1. Iconos
Debes generar los iconos PWA. Ver instrucciones en `public/icons/README.md`

Tamaños requeridos:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

### 2. Personalización

#### Actualizar `manifest.json`:
```json
{
  "name": "Tu App Name",
  "short_name": "App",
  "theme_color": "#tu-color",
  "background_color": "#tu-color"
}
```

#### Actualizar `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Tu App Title",
  description: "Tu descripción",
  themeColor: "#tu-color"
}
```

## 🔧 Características PWA

### Implementadas
- ✅ Service Worker automático
- ✅ Caché de assets
- ✅ Offline fallback
- ✅ Instalable como app
- ✅ Metadata completa
- ✅ Soporte iOS/Android

### Configurables
- Estrategia de caché (en `next.config.ts`)
- Runtime caching (en `workboxOptions`)
- Archivos a pre-cachear
- Rutas offline

## 📱 Testing en Dispositivos

### Android
1. Build de producción
2. Servir con HTTPS (requerido para PWA)
3. Abrir en Chrome móvil
4. Tap en "Agregar a pantalla de inicio"

### iOS
1. Build de producción
2. Servir con HTTPS
3. Abrir en Safari
4. Tap en botón de compartir
5. "Agregar a pantalla de inicio"

## 🔍 Debugging

### Service Worker
```javascript
// En DevTools Console
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    console.log(registrations);
  });
```

### Caché
```javascript
// Ver qué está en caché
caches.keys().then(keys => console.log(keys));
```

### Manifest
- Chrome DevTools > Application > Manifest
- Verificar errores y warnings

## 📚 Recursos

- [Next PWA Docs](https://github.com/DuCanhGH/next-pwa)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

## 🎯 Próximos Pasos

1. **Generar iconos** siguiendo `public/icons/README.md`
2. **Personalizar colores y nombres** en manifest.json
3. **Testing en producción** con HTTPS
4. **Probar instalación** en dispositivos reales
5. **Configurar estrategias de caché** según necesidades

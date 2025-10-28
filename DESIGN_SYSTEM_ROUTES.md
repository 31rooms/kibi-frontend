# 🎨 Sistema de Diseño Kibi - Rutas de Demostración

Documentación completa de todas las rutas disponibles para visualizar componentes, estilos y flujos de la aplicación Kibi.

---

## 📋 Tabla de Contenidos

- [Componentes UI](#-componentes-ui)
- [Sistema de Colores](#-sistema-de-colores)
- [Autenticación](#-autenticación)
- [Onboarding](#-onboarding)
- [Navegación Rápida](#-navegación-rápida)

---

## 🧩 Componentes UI

### Botones
**Ruta:** `/test-buttons`
**URL:** http://localhost:3001/test-buttons

**Características:**
- ✅ Variantes: Primary, Secondary, Outline, Ghost, Link, Danger
- ✅ Colores: Blue, Green
- ✅ Tamaños: Small, Medium, Large
- ✅ Estados: Normal, Hover, Disabled, Loading
- ✅ Con/sin iconos (Lucide React)

**Componentes demostrados:**
- `<Button variant="primary" color="green" size="large">`
- `<Button variant="outline" color="blue">`
- `<Button variant="ghost" disabled>`
- Botones con iconos (ej: `<Mail className="mr-2" />`)

---

### Badges (Insignias)
**Ruta:** `/test-badges`
**URL:** http://localhost:3001/test-badges

**Características:**
- ✅ Variantes: Default, Secondary, Outline, Success, Warning, Error
- ✅ Tamaños: Small, Medium, Large
- ✅ Con/sin iconos
- ✅ Bordes redondeados vs cuadrados

**Componentes demostrados:**
- `<Badge variant="success">Activo</Badge>`
- `<Badge variant="error" size="large">Error</Badge>`
- `<Badge variant="outline">Pendiente</Badge>`

---

### Inputs (Campos de Texto)
**Ruta:** `/test-input`
**URL:** http://localhost:3001/test-input

**Características:**
- ✅ Tipos: Text, Email, Password, Number, Tel, Search
- ✅ Estados: Normal, Focus, Disabled, Error, Success
- ✅ Con/sin placeholders
- ✅ Con/sin iconos (prefijo/sufijo)
- ✅ Textarea

**Componentes demostrados:**
- `<Input type="email" placeholder="correo@ejemplo.com" />`
- `<Input type="password" error />`
- `<Input type="search" icon={<Search />} />`
- `<Textarea rows={4} />`

---

### Dropdown / Select
**Ruta:** `/test-dropdown`
**URL:** http://localhost:3001/test-dropdown

**Características:**
- ✅ Select básico
- ✅ Select con múltiples opciones
- ✅ Radix UI primitives
- ✅ Estados: Normal, Disabled, Con valor seleccionado

**Componentes demostrados:**
- `<Select><SelectTrigger /><SelectContent><SelectItem /></SelectContent></Select>`
- Select con placeholder
- Select con valor predeterminado

---

### Tooltip (Info Flotante)
**Ruta:** `/test-tooltip`
**URL:** http://localhost:3001/test-tooltip

**Características:**
- ✅ Posiciones: Top, Bottom, Left, Right
- ✅ Con diferentes contenidos
- ✅ Activación: Hover
- ✅ Radix UI Tooltip

**Componentes demostrados:**
- `<Tooltip><TooltipTrigger><TooltipContent side="top" /></Tooltip>`
- Tooltip en botones
- Tooltip en íconos

---

### Top Menu (Menú Superior)
**Ruta:** `/test-topmenu`
**URL:** http://localhost:3001/test-topmenu

**Características:**
- ✅ Barra de navegación principal
- ✅ Logo de Kibi
- ✅ Enlaces de navegación
- ✅ Botón de perfil/usuario
- ✅ Responsive (hamburger en móvil)

**Componentes demostrados:**
- `<TopMenu />`
- Navegación con tabs activas
- Menú desplegable de usuario

---

### Elementos Interactivos
**Ruta:** `/test-interactive`
**URL:** http://localhost:3001/test-interactive

**Características:**
- ✅ Checkboxes
- ✅ Radio buttons
- ✅ Switches/Toggles
- ✅ Estados: Checked, Unchecked, Disabled, Indeterminate

**Componentes demostrados:**
- `<Checkbox checked />`
- `<Toggle checked />`
- `<ToggleWithText label="Recordarme" />`
- Radio groups

---

## 🎨 Sistema de Colores

### Paleta Completa
**Ruta:** `/test-colors`
**URL:** http://localhost:3001/test-colors

**Características:**
- ✅ **Colores Principales:**
  - Primary Blue: `#171B22`
  - Primary Green: `#95C16B`

- ✅ **Colores Semánticos:**
  - Success (50-900)
  - Error (50-900)
  - Warning (50-900)

- ✅ **Colores de UI:**
  - Grey (50-900)
  - Dark (50-900)

- ✅ **Colores de Acento:**
  - Blue, Cyan, Teal, Orange, Violet, Rose, Purple

**Visualización:**
- Cada color con su escala 50-900
- Códigos HEX visibles
- Nombres de las variables CSS
- Ejemplos de uso en componentes

---

## 🔐 Autenticación

### Login (Inicio de Sesión)
**Ruta:** `/auth/login`
**URL:** http://localhost:3001/auth/login

**Características:**
- ✅ Diseño de dos columnas (ilustración + formulario)
- ✅ Fondo abstracto con gradientes (blobs)
- ✅ Campos: Email, Password
- ✅ Checkbox "Recordarme"
- ✅ Link "¿Olvidaste tu contraseña?"
- ✅ Botones de redes sociales (Google, Apple, Facebook)
- ✅ Link "¿No tienes cuenta? Regístrate"
- ✅ Validación de formulario
- ✅ Mensajes de error con Alert component

**Flujo:**
```
/auth/login → [Login exitoso] → Dashboard
            → [Olvidé contraseña] → /auth/forgot-password
            → [Registrarse] → /auth/register
```

---

### Register (Registro)
**Ruta:** `/auth/register`
**URL:** http://localhost:3001/auth/register

**Características:**
- ✅ Diseño de dos columnas con fondo abstracto
- ✅ Campos: Email, Teléfono (opcional), Carrera, Contraseña
- ✅ Dropdown con carreras cargadas del backend
- ✅ Toggle de visibilidad de contraseña (Eye/EyeOff)
- ✅ Validación de contraseña (8 caracteres, mayúscula, minúscula, número)
- ✅ Botones de redes sociales
- ✅ Link "Ya tengo una cuenta"
- ✅ Header con fondo verde

**Flujo:**
```
/auth/register → [Registro exitoso] → /auth/register/success
               → [Ya tengo cuenta] → /auth/login
```

---

### Registration Success
**Ruta:** `/auth/register/success`
**URL:** http://localhost:3001/auth/register/success

**Características:**
- ✅ Card blanco sobre fondo gris
- ✅ Ícono de check verde (check.svg)
- ✅ Mensaje "¡Listo! ¡Te has registrado!"
- ✅ Burbuja de mensaje (speech bubble) apuntando a Kibi
- ✅ Kibi Icon robot con gorro de graduación
- ✅ Sección "Toma el test gratuito"
- ✅ Botón "Empezar el Test" → `/form-diagnostic-test`

**Flujo:**
```
/auth/register/success → [Empezar el Test] → /form-diagnostic-test
```

---

### Forgot Password (Recuperación de Contraseña)
**Ruta:** `/auth/forgot-password`
**URL:** http://localhost:3001/auth/forgot-password

**Características:**
- ✅ Diseño similar a login
- ✅ Solo campo de email
- ✅ Botón "Volver al inicio de sesión"
- ✅ Botón "Enviar instrucciones"
- ✅ Pantalla de éxito después de enviar
- ✅ Mensaje sobre revisar bandeja de entrada y spam

**Flujo:**
```
/auth/forgot-password → [Email enviado] → Pantalla de éxito
                      → [Volver] → /auth/login
                      → [Email recibido] → /auth/reset-password?token=xxx
```

---

### Reset Password (Restablecer Contraseña)
**Ruta:** `/auth/reset-password?token=xxx`
**URL:** http://localhost:3001/auth/reset-password?token=xxx

**Características:**
- ✅ Recibe token por query params
- ✅ Campos: Nueva contraseña, Confirmar contraseña
- ✅ Toggles de visibilidad en ambos campos
- ✅ Validación de coincidencia
- ✅ Validación de complejidad
- ✅ Pantalla de éxito al completar
- ✅ Mensaje de error si token inválido/expirado

**Flujo:**
```
/auth/reset-password?token=xxx → [Contraseña actualizada] → /auth/login
```

---

### Email Verification
**Ruta:** `/auth/verify-email?token=xxx`
**URL:** http://localhost:3001/auth/verify-email?token=xxx

**Características:**
- ✅ Recibe token por query params
- ✅ Verificación automática al cargar
- ✅ Spinner de loading durante verificación
- ✅ Pantalla de éxito
- ✅ Pantalla de error si token inválido
- ✅ Botón "Ir al inicio de sesión"

**Flujo:**
```
/auth/verify-email?token=xxx → [Auto-verificación] → Pantalla de éxito → /auth/login
```

---

## 🚀 Onboarding

### Flujo de Bienvenida
**Ruta:** `/test-onboarding`
**URL:** http://localhost:3001/test-onboarding

**Características:**
- ✅ Pantallas paso a paso
- ✅ Progreso visual (dots/steps)
- ✅ Botones "Siguiente" / "Anterior" / "Empezar"
- ✅ Animaciones entre pasos

**Flujo:**
```
/test-onboarding → Paso 1 → Paso 2 → Paso 3 → Completado
```

---

## 🗺️ Navegación Rápida

### Mapa Completo de Rutas

```
Kibi Frontend
├── / (Home/Dashboard)
│
├── /auth
│   ├── /login ...................... Inicio de sesión
│   ├── /register ................... Registro de usuario
│   ├── /register/success ........... Confirmación de registro
│   ├── /forgot-password ............ Solicitar recuperación
│   ├── /reset-password?token=xxx ... Crear nueva contraseña
│   └── /verify-email?token=xxx ..... Verificar email
│
├── /test-buttons ................... Demo de botones
├── /test-badges .................... Demo de badges
├── /test-input ..................... Demo de inputs
├── /test-dropdown .................. Demo de selects
├── /test-tooltip ................... Demo de tooltips
├── /test-topmenu ................... Demo de menú superior
├── /test-interactive ............... Demo de checkboxes/toggles
├── /test-colors .................... Paleta de colores
└── /test-onboarding ................ Demo de onboarding
```

---

## 🎯 Acceso Rápido a Componentes

Para desarrollo y testing, puedes acceder directamente a:

**Componentes UI:**
- http://localhost:3001/test-buttons
- http://localhost:3001/test-badges
- http://localhost:3001/test-input
- http://localhost:3001/test-dropdown
- http://localhost:3001/test-tooltip
- http://localhost:3001/test-interactive

**Sistema Visual:**
- http://localhost:3001/test-colors
- http://localhost:3001/test-topmenu

**Flujos de Usuario:**
- http://localhost:3001/auth/login
- http://localhost:3001/auth/register
- http://localhost:3001/test-onboarding

---

## 📝 Notas de Desarrollo

### Componentes Base
Todos los componentes están en `/components/ui/` y se exportan desde `/components/ui/index.ts`:

```typescript
import { Button, Badge, Input, Select, Checkbox, Toggle } from '@/components/ui';
```

### Estilos Globales
Los colores y tokens están definidos en `/app/globals.css` usando Tailwind CSS v4:

```css
@theme inline {
  --color-primary-blue: #171B22;
  --color-primary-green: #95c16b;
  /* etc... */
}
```

### Fuentes Utilizadas
- **Quicksand:** Títulos y encabezados (font-[family-name:var(--font-quicksand)])
- **Rubik:** Texto de cuerpo (font-[family-name:var(--font-rubik)])
- **Roboto:** Secundario

### Dark Mode
Todos los componentes soportan dark mode con las clases `dark:`:

```tsx
<div className="bg-white dark:bg-dark-900 text-dark-900 dark:text-white">
```

---

## 🔧 Para Desarrolladores

### Agregar Nueva Ruta de Test

1. Crea directorio: `/app/test-nombrecomponente/`
2. Crea `page.tsx` con el demo
3. Agrega link en este documento
4. Prueba en http://localhost:3001/test-nombrecomponente

### Crear Nuevo Componente UI

1. Crea archivo en `/components/ui/NuevoComponente.tsx`
2. Usa CVA para variantes:
   ```tsx
   import { cva } from 'class-variance-authority';

   const variants = cva('base-classes', {
     variants: {
       variant: { default: '...', primary: '...' }
     }
   });
   ```
3. Exporta desde `/components/ui/index.ts`
4. Crea página de demo en `/app/test-nuevo/page.tsx`
5. Documenta en `DESIGN_SYSTEM_ROUTES.md`

---

## 📚 Recursos Adicionales

- **Documentación de Componentes:** `/docs/components/`
- **Guía de Colores:** `/docs/design-system-colors.md`
- **Brand Guidelines:** `/docs/brand/BrandBoard.md`
- **CLAUDE.md del Frontend:** `/CLAUDE.md`

---

## ✨ Características del Sistema de Diseño

- ✅ **Componentes Reutilizables:** Todos los componentes están en `/components/ui/`
- ✅ **TypeScript Completo:** Todos los props están tipados
- ✅ **Variantes con CVA:** Sistema de variantes type-safe
- ✅ **Dark Mode:** Soporte completo para tema oscuro
- ✅ **Responsive:** Optimizado para móvil, tablet y desktop
- ✅ **Accesibilidad:** ARIA labels, keyboard navigation, focus states
- ✅ **Iconos:** Lucide React integrado
- ✅ **Radix UI:** Primitives para componentes complejos (Select, Tooltip)

---

**Última actualización:** Octubre 10, 2025
**Versión del Sistema de Diseño:** 1.0
**Framework:** Next.js 15 + Tailwind CSS v4
**Proyecto:** Kibi - Plataforma de Preparación Académica

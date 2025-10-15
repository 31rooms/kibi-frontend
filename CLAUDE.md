# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kibi Frontend** is a Progressive Web Application (PWA) built with Next.js 15 for the Kibi educational platform. The project features a custom design system extracted from Figma with reusable UI components built using Tailwind CSS v4, class-variance-authority, and Radix UI primitives.

## Tech Stack

- **Framework:** Next.js 15.5.4 with App Router and Turbopack
- **React:** 19.1.0
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS v4 with custom design tokens
- **UI Utilities:**
  - `class-variance-authority` for component variants
  - `clsx` and `tailwind-merge` (via `cn` utility)
  - Radix UI primitives (Select, Tooltip)
- **PWA:** `@ducanh2912/next-pwa` for Progressive Web App capabilities
- **Icons:** Lucide React

## Development Commands

```bash
# Start development server with Turbopack on port 3001
npm run dev

# Build for production
npm run build

# Start production server on port 3001
npm start

# Lint code
npm run lint
```

**Note:** The development and production servers run on port 3001 (configured in package.json).

## Project Structure

This project follows **Screaming Architecture** principles, organizing code by business domain (features) rather than technical layers. This makes the codebase self-documenting and easier to maintain.

### Core Directories

```
/src                    # Source code (features + shared)
  /features            # Business domain features (SCREAMING ARCHITECTURE)
    /authentication    # Auth feature (login, register, password reset)
      /ui             # Auth-specific UI components
      /api            # Auth API service
      /hooks          # Custom hooks (useAuth, useLoginForm)
      /context        # AuthContext and AuthProvider
      /utils          # Validation utilities
      /types          # TypeScript types
      /config         # Auth configuration
      index.ts        # Public API (barrel export)

    /dashboard        # Student dashboard feature
      /ui             # Dashboard components
      /hooks          # Dashboard hooks
      /types          # Types
      index.ts        # Public API

  /shared             # Shared/reusable code (NOT feature-specific)
    /ui               # Design system components (Button, Input, etc.)
      Alert.tsx
      Badge.tsx
      Button.tsx
      Calendar.tsx
      CalendarMobile.tsx
      Checkbox.tsx
      CircleButton.tsx
      Input.tsx
      ListDropdown.tsx
      Logo.tsx
      Modal.tsx
      OnboardingSheet.tsx
      OnboardingSlide.tsx
      PageIndicator.tsx
      Select.tsx
      Tag.tsx
      Toggle.tsx
      ToggleWithText.tsx
      Tooltip.tsx
      index.ts        # Barrel exports

    /lib              # Shared utilities and configs
      /utils          # General utilities (storage, etc.)
      /api            # API base config
      /context        # Global contexts (if any)
      utils.ts        # cn() utility for class merging

/app                  # Next.js App Router (routes ONLY)
  /auth              # Auth routes (thin wrappers)
    /login
    /register
    /forgot-password
    /reset-password
    /verify-email
  /dashboard         # Dashboard route
  /onboarding        # Onboarding route
  /design-system     # Design system demo page
  layout.tsx        # Root layout with AuthProvider
  globals.css       # Tailwind config and design tokens
  page.tsx          # Home page

/components          # Global components (not feature-specific)
  ProtectedRoute.tsx # Route protection HOC

/docs                # PWA documentation
  PWA-COMPONENTS-GUIDE.md
  PWA-DEVELOPMENT-GUIDE.md

/public              # Static assets
  /icons            # PWA icons
  manifest.json     # PWA manifest
```

### Architecture Principles

1. **Features are self-contained:** All code related to a feature lives in `/src/features/[feature-name]`
2. **Clear boundaries:** Features don't import from each other (use shared code instead)
3. **Public API:** Each feature exports only what's needed via `index.ts` (barrel exports)
4. **Shared for reusability:** `/src/shared` contains truly reusable code (UI components, utilities)
5. **Routes are thin:** `/app` routes are just wrappers that compose features

**Current Features:**
- `authentication` - Login, register, password management, auth context
- `dashboard` - Student dashboard with course cards and progress tracking

## Design System

### Color System

The project uses a comprehensive color system defined in `app/globals.css` with Tailwind CSS v4's `@theme inline` directive:

- **Brand Colors:** `primary-blue` (#20263D), `primary-green` (#95C16B)
- **Semantic Colors:** `error-*`, `success-*`, `warning-*` (50-900 scale)
- **UI Colors:** `grey-*`, `dark-*` (50-900 scale)
- **Accent Colors:** `blue-*`, `cyan-*`, `teal-*`, `orange-*`, `violet-*`, `rose-*`, `purple-*`
- **Design Tokens:** Custom shadows, border radius, typography

**Usage:**
```tsx
// Tailwind classes
<div className="bg-primary-blue text-white" />
<button className="bg-success-500 hover:bg-success-600" />

// CSS variables
style={{ backgroundColor: 'var(--color-primary-green)' }}
```

All colors are defined in `app/globals.css` using the `@theme inline` directive.

### Component Pattern

All UI components follow this structure:

1. **Variants with CVA:** Use `class-variance-authority` for type-safe variants
2. **TypeScript Props:** Full TypeScript definitions exported
3. **cn() Utility:** Merge classes with `cn()` from `@/shared/lib/utils`
4. **Forwarded Refs:** Use `React.forwardRef` for ref access when needed
5. **Barrel Exports:** Export from `/src/shared/ui/index.ts`

**Example:**
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const componentVariants = cva('base-classes', {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
});

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <element
        className={cn(componentVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Component Showcase

Components can be viewed in the design system showcase at `/design-system` route, which displays all available UI components and their variants.

## PWA Configuration

The app is fully configured as a Progressive Web App:

- **Service Worker:** Auto-generated via `@ducanh2912/next-pwa`
- **Config:** `next.config.ts` with caching strategies
- **Manifest:** `public/manifest.json` with app metadata
- **Icons:** Multiple sizes in `public/icons/`
- **Metadata:** PWA metadata in `app/layout.tsx`
- **Development:** Service Worker disabled in dev mode

**Important:** PWA features only work in production builds. Use `npm run build && npm start` to test.

See `docs/PWA-DEVELOPMENT-GUIDE.md` and `docs/PWA-COMPONENTS-GUIDE.md` for detailed PWA configuration and development instructions.

## Styling Guidelines

### Using Tailwind CSS v4

This project uses Tailwind CSS v4 with the new `@theme inline` directive in `app/globals.css`:

```css
@theme inline {
  --color-primary-blue: #20263d;
  --color-grey-500: #dee2e6;
  /* etc */
}
```

Classes are auto-generated from these tokens:
```tsx
<div className="bg-primary-blue text-grey-500" />
```

### The cn() Utility

Always use `cn()` from `@/lib/utils` to merge classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-classes', conditionalClass && 'conditional', className)} />
```

This properly handles Tailwind class conflicts using `tailwind-merge`.

## Import Paths

The project uses TypeScript path aliases for clean imports:

```tsx
// Shared UI components
import { Button, Input, Badge } from '@/shared/ui';
import { Button } from '@/shared/ui/Button'; // specific import

// Shared utilities
import { cn } from '@/shared/lib/utils';
import { storage } from '@/shared/lib/utils/storage';

// Features (import from public API only)
import { useAuth, LoginForm, AuthProvider } from '@/features/authentication';
import { DashboardLayout, DashboardHeader } from '@/features/dashboard';

// DO NOT import from feature internals:
// ❌ import { validateEmail } from '@/features/authentication/utils/validation';
// ✅ Only import from feature's index.ts

// Global components
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Note: The project uses @ as the root alias
// @/ maps to the project root directory
```

### Import Rules

1. **Features → Shared:** Features CAN import from `@/shared/*` ✅
2. **Features → Features:** Features CANNOT import from other features ❌
3. **Shared → Features:** Shared code CANNOT import from features ❌
4. **App → Features:** App routes CAN import from `@/features/*` (public API) ✅
5. **Always use barrel exports:** Import from `index.ts`, not internal files

## Brand Guidelines

The Kibi brand features:
- **Logo:** Robot character with graduation cap
- **Colors:** Blue (#20263D) and Green (#95C16B)
- **Fonts:** Geist (default Next.js font)

## Common Development Patterns

### Creating a New Feature

When adding a new business feature (e.g., "courses", "exams", "chat"):

1. **Create feature structure:**
   ```bash
   mkdir -p src/features/[feature-name]/{ui,hooks,api,types,utils,config}
   ```

2. **Organize by responsibility:**
   - `/ui` - Feature-specific UI components
   - `/hooks` - Custom hooks for feature logic
   - `/api` - API calls and services
   - `/types` - TypeScript interfaces/types
   - `/utils` - Feature-specific utilities
   - `/config` - Configuration constants

3. **Create public API (index.ts):**
   ```typescript
   // Export only what other parts of the app need
   export { CourseList, CourseCard } from './ui/CourseList';
   export { useCourses } from './hooks/useCourses';
   export type * from './types/course.types';
   // Internal utils/config stay private
   ```

4. **Create route in /app:**
   ```tsx
   // app/courses/page.tsx
   import { CourseList, useCourses } from '@/features/courses';

   export default function CoursesPage() {
     return <CourseList />;
   }
   ```

5. **Follow principles:**
   - Feature is self-contained
   - Uses shared UI components from `@/shared/ui`
   - Doesn't import from other features
   - Exports minimal public API

### Creating Shared UI Components

For reusable design system components (used across multiple features):

1. Create component file in `/src/shared/ui/ComponentName.tsx`
2. Use CVA for variants, TypeScript for props, forwardRef for refs when needed
3. Export from `/src/shared/ui/index.ts`
4. Test component in `/app/design-system/page.tsx` if needed

**Example:**
```tsx
// src/shared/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva('base-classes', {
  variants: { /* ... */ },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
};

// src/shared/ui/index.ts
export { Badge } from './Badge';
```

### Adding New Colors

1. Add color tokens to `app/globals.css` under `@theme inline`
2. Use immediately via Tailwind classes (e.g., `bg-new-color-500`)

### When to Create a Feature vs Shared Component

**Create a Feature** when:
- It represents a business domain (courses, exams, profile)
- It has its own data/state management
- It has specific business logic
- Example: `/src/features/courses`

**Create Shared Component** when:
- It's purely presentational
- Used across multiple features
- Part of the design system
- Example: `/src/shared/ui/Button`

## Configuration Notes

- **TypeScript:** Strict mode enabled with path aliases configured in `tsconfig.json`
- **ESLint:** Configured to ignore errors during builds (temporary during development)
- **Service Worker:** Disabled in development mode for easier debugging, enabled in production
- **Accessibility:** All components support keyboard navigation, ARIA attributes, and focus states

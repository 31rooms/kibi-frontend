/**
 * Google Sign-In Utility
 * Maneja la inicialización y el flujo de autenticación con Google Identity Services
 */

// Extender el tipo Window para incluir la API de Google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitConfig) => void;
          renderButton: (element: HTMLElement, options: GoogleButtonOptions) => void;
          prompt: () => void;
          revoke: (email: string, callback: () => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleInitConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  ux_mode?: 'popup' | 'redirect';
  auto_select?: boolean;
}

interface GoogleButtonOptions {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  width?: number;
  logo_alignment?: 'left' | 'center';
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

type GoogleSignInCallback = (idToken: string) => void | Promise<void>;

interface InitGoogleSignInOptions {
  callback: GoogleSignInCallback;
  onError?: (error: Error) => void;
}

let initialized = false;
let currentCallback: GoogleSignInCallback | null = null;
let currentOnError: ((error: Error) => void) | null = null;

/**
 * Inicializa Google Sign-In con el callback proporcionado
 */
export function initGoogleSignIn({ callback, onError }: InitGoogleSignInOptions): boolean {
  if (typeof window === 'undefined') return false;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId || clientId === 'TU_GOOGLE_CLIENT_ID_AQUI') {
    console.warn('⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID no está configurado');
    return false;
  }

  if (!window.google) {
    console.warn('⚠️ Google Identity Services no está cargado');
    return false;
  }

  // Actualizar callbacks
  currentCallback = callback;
  currentOnError = onError || null;

  // Solo inicializar una vez
  if (!initialized) {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        ux_mode: 'popup',
        auto_select: false,
      });
      initialized = true;
      console.log('✅ Google Sign-In inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Google Sign-In:', error);
      return false;
    }
  }

  return true;
}

/**
 * Maneja la respuesta de Google después de la autenticación
 */
async function handleGoogleResponse(response: GoogleCredentialResponse) {
  try {
    if (!response.credential) {
      throw new Error('No se recibió el token de Google');
    }

    console.log('🔐 Token de Google recibido');

    if (currentCallback) {
      await currentCallback(response.credential);
    }
  } catch (error) {
    console.error('❌ Error procesando respuesta de Google:', error);
    if (currentOnError && error instanceof Error) {
      currentOnError(error);
    }
  }
}

/**
 * Renderiza el botón oficial de Google Sign-In
 */
export function renderGoogleButton(
  container: HTMLElement,
  options?: Partial<GoogleButtonOptions>
): boolean {
  if (!window.google || !initialized) {
    console.warn('⚠️ Google Sign-In no está inicializado');
    return false;
  }

  // Limpiar el contenedor
  container.innerHTML = '';

  // Detectar tema oscuro
  const isDark = document.documentElement.classList.contains('dark');

  const defaultOptions: GoogleButtonOptions = {
    theme: isDark ? 'filled_black' : 'outline',
    size: 'large',
    shape: 'pill',
    text: 'signin_with',
    logo_alignment: 'center',
  };

  try {
    window.google.accounts.id.renderButton(container, {
      ...defaultOptions,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('❌ Error renderizando botón de Google:', error);
    return false;
  }
}

/**
 * Muestra el prompt de One Tap de Google
 */
export function promptOneTap(): void {
  if (window.google && initialized) {
    window.google.accounts.id.prompt();
  }
}

/**
 * Revoca el acceso de Google y deshabilita auto-select
 */
export function revokeGoogleAccess(email?: string): void {
  try {
    if (email && window.google) {
      window.google.accounts.id.revoke(email, () => {
        console.log('🔓 Acceso de Google revocado');
      });
    }
    window.google?.accounts?.id?.disableAutoSelect?.();
  } catch (error) {
    // Manejo silencioso de errores
    console.warn('Error revocando acceso de Google:', error);
  }
}

/**
 * Verifica si Google Sign-In está disponible
 */
export function isGoogleSignInAvailable(): boolean {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    typeof window !== 'undefined' &&
    !!window.google &&
    !!clientId &&
    clientId !== 'TU_GOOGLE_CLIENT_ID_AQUI'
  );
}

/**
 * Resetea el estado de inicialización (útil para testing)
 */
export function resetGoogleSignIn(): void {
  initialized = false;
  currentCallback = null;
  currentOnError = null;
}

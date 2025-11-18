import {
  PushSubscriptionWithDevice,
  PushSubscriptionResponse,
  VapidPublicKeyResponse,
} from '../types/notification.types';
import { fetchWithAuth, fetchJSON } from '@/shared/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Obtiene la clave pública VAPID del servidor
 * No requiere autenticación (público)
 */
export async function getVapidPublicKey(): Promise<string> {
  const data = await fetchJSON<VapidPublicKeyResponse>(
    `${API_BASE_URL}/push-subscriptions/vapid-public-key`,
    { skipAuth: true }
  );
  return data.publicKey;
}

/**
 * Guarda una suscripción push en el servidor
 * El token se obtiene automáticamente de localStorage via fetchWithAuth
 */
export async function savePushSubscription(
  subscription: PushSubscriptionWithDevice
): Promise<PushSubscriptionResponse> {
  return await fetchJSON<PushSubscriptionResponse>(
    `${API_BASE_URL}/push-subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    }
  );
}

/**
 * Elimina una suscripción push del servidor
 * El token se obtiene automáticamente de localStorage via fetchWithAuth
 */
export async function deletePushSubscription(
  endpoint: string
): Promise<PushSubscriptionResponse> {
  return await fetchJSON<PushSubscriptionResponse>(
    `${API_BASE_URL}/push-subscriptions`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    }
  );
}

/**
 * Obtiene todas las suscripciones push del usuario
 * El token se obtiene automáticamente de localStorage via fetchWithAuth
 */
export async function getUserSubscriptions(): Promise<any[]> {
  return await fetchJSON<any[]>(`${API_BASE_URL}/push-subscriptions`);
}

/**
 * Elimina todas las suscripciones push del usuario
 * El token se obtiene automáticamente de localStorage via fetchWithAuth
 */
export async function deleteAllSubscriptions(): Promise<PushSubscriptionResponse> {
  return await fetchJSON<PushSubscriptionResponse>(
    `${API_BASE_URL}/push-subscriptions/all`,
    {
      method: 'DELETE',
    }
  );
}

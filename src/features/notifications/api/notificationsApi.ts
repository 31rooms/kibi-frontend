import { Notification } from '../types/notification.types';
import { fetchWithAuth, fetchJSON } from '@/shared/lib/api';

// Use Next.js API proxy in production to avoid CORS and Mixed Content issues
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

/**
 * Obtiene todas las notificaciones in-app del usuario
 */
export async function getNotifications(
  token: string,
  isRead?: boolean,
  page: number = 1,
  limit: number = 20
): Promise<NotificationsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (isRead !== undefined) {
    params.append('isRead', isRead.toString());
  }

  try {
    console.log(`🔔 [getNotifications] Fetching notifications with limit=${limit}, isRead=${isRead}`);
    const response = await fetchJSON<NotificationsResponse>(
      `${API_BASE_URL}/notifications?${params}`
    );
    console.log(`✅ [getNotifications] Got ${response.notifications?.length || 0} notifications, unreadCount: ${response.unreadCount}`);
    return response;
  } catch (error) {
    console.error('❌ [getNotifications] Error fetching notifications:', error);
    return {
      notifications: [],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 1
      },
      unreadCount: 0
    };
  }
}

/**
 * Obtiene solo las notificaciones no leídas
 */
export async function getUnreadNotifications(token: string): Promise<Notification[]> {
  const response = await getNotifications(token, false, 1, 20);
  return response.notifications;
}

/**
 * Marca una notificación como leída
 * El token se obtiene automáticamente de localStorage via fetchWithAuth
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
}

/**
 * Marca todas las notificaciones como leídas
 * El token se obtiene automáticamente de localStorage via fetchWithAuth
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/notifications/mark-all-read`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
}

/**
 * Obtiene el contador de notificaciones no leídas
 */
export async function getUnreadCount(token: string): Promise<number> {
  const response = await getNotifications(token, false, 1, 1);
  return response.unreadCount;
}

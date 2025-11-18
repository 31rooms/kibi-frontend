'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from '../api/notificationsApi';
import type { Notification } from '../types/notification.types';

export function useNotifications(accessToken: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch unread notifications
   */
  const fetchNotifications = useCallback(async () => {
    // Validación más estricta: null, undefined, o cadena vacía
    if (!accessToken || accessToken.trim() === '') {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUnreadNotifications(accessToken);
      setNotifications(data);
      setUnreadCount(data.length);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      // No propagar el error, solo loguearlo
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  /**
   * Fetch unread count only
   */
  const fetchUnreadCount = useCallback(async () => {
    // Validación más estricta: null, undefined, o cadena vacía
    if (!accessToken || accessToken.trim() === '') {
      return;
    }

    try {
      const count = await getUnreadCount(accessToken);
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
      // No propagar el error, solo loguearlo
    }
  }, [accessToken]);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!accessToken) return;

    try {
      await markNotificationAsRead(notificationId);

      // Remove notification from state (since we only show unread notifications)
      setNotifications(prev => prev.filter(n => n._id !== notificationId));

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
    }
  }, [accessToken]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!accessToken) return;

    try {
      await markAllNotificationsAsRead();

      // Clear all notifications (since we only show unread notifications)
      setNotifications([]);

      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
    }
  }, [accessToken]);

  // Load notifications on mount and when token changes
  useEffect(() => {
    // Validación más estricta: null, undefined, o cadena vacía
    if (!accessToken || accessToken.trim() === '') {
      // Reset state when no token
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      return;
    }

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]); // Only depend on accessToken, not fetchNotifications

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    // Validación más estricta: null, undefined, o cadena vacía
    if (!accessToken || accessToken.trim() === '') {
      return;
    }

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [accessToken, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}

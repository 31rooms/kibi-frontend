'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { usePushNotifications } from '../hooks/usePushNotifications';
import type { Notification, PushNotificationState } from '../types/notification.types';

interface NotificationContextValue {
  // In-app notifications
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;

  // Push notifications
  pushState: PushNotificationState & {
    isLoading: boolean;
  };
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  accessToken: string | null;
}

export function NotificationProvider({ children, accessToken }: NotificationProviderProps) {
  // In-app notifications
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications(accessToken);

  // Push notifications
  const pushNotifications = usePushNotifications(accessToken);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
    pushState: {
      permission: pushNotifications.permission,
      isSupported: pushNotifications.isSupported,
      isSubscribed: pushNotifications.isSubscribed,
      subscription: pushNotifications.subscription,
      error: pushNotifications.error,
      isLoading: pushNotifications.isLoading,
    },
    subscribeToPush: pushNotifications.subscribe,
    unsubscribeFromPush: pushNotifications.unsubscribe,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }

  return context;
}

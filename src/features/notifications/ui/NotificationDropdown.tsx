'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import type { Notification } from '../types/notification.types';
import { useRouter } from 'next/navigation';

export interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  className?: string;
}

/**
 * Notification Dropdown Component
 * Displays a dropdown list of notifications with read/unread states
 * Supports both light and dark mode themes
 */
export const NotificationDropdown = React.forwardRef<HTMLDivElement, NotificationDropdownProps>(
  (
    {
      notifications,
      unreadCount,
      isOpen,
      onClose,
      onNotificationClick,
      onMarkAsRead,
      onMarkAllAsRead,
      className,
    },
    ref
  ) => {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync local notifications with props
    useEffect(() => {
      setLocalNotifications(notifications);
    }, [notifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          // Check if click is not on the bell button
          const target = event.target as HTMLElement;
          if (!target.closest('button[aria-label="Notificaciones"]')) {
            onClose();
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleMarkAsRead = (notificationId: string) => {
      // Remove notification from local state immediately for better UX
      setLocalNotifications(prev => prev.filter(n => n._id !== notificationId));
      // Call parent handler
      onMarkAsRead(notificationId);
    };

    const handleMarkAllAsRead = () => {
      // Clear all local notifications
      setLocalNotifications([]);
      // Call parent handler
      onMarkAllAsRead();
    };

    const handleNotificationClick = (notification: Notification) => {
      if (!notification.isRead) {
        handleMarkAsRead(notification._id);
      }

      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      }

      onNotificationClick(notification);
      // NO cerrar el dropdown al hacer clic en una notificación
      // Solo se cierra al hacer clic fuera o en el overlay
    };

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Dropdown */}
        <div
          ref={dropdownRef}
          className={cn(
            'absolute top-full right-0 mt-2',
            'w-[360px] max-w-[90vw]',
            'rounded-lg shadow-xl',
            'z-50 overflow-hidden',
            'border',
            className
          )}
          style={{
            backgroundColor: isDarkMode ? '#1E242D' : '#ffffff',
            borderColor: isDarkMode ? '#374151' : '#DEE2E6',
          }}
        >
          {/* Header */}
          <div
            className={cn(
              'px-4 py-3',
              'flex items-center justify-between',
              'border-b'
            )}
            style={{
              borderColor: isDarkMode ? '#374151' : '#DEE2E6',
            }}
          >
            <h3
              className="text-lg font-semibold font-[family-name:var(--font-rubik)]"
              style={{ color: isDarkMode ? '#ffffff' : '#171B22' }}
            >
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className={cn(
                  'text-sm flex items-center gap-1',
                  'hover:opacity-80 transition-opacity',
                  'font-[family-name:var(--font-rubik)]'
                )}
                style={{ color: '#95C16B' }}
                aria-label="Marcar todas como leídas"
              >
                <CheckCheck className="w-4 h-4" />
                Marcar todas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {localNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell
                  className="w-12 h-12 mx-auto mb-3"
                  style={{ color: isDarkMode ? '#6B7280' : '#ADB5BD' }}
                />
                <p
                  className="text-sm font-[family-name:var(--font-rubik)]"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6C757D' }}
                >
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              <div>
                {localNotifications.map((notification, index) => (
                  <div
                    key={notification._id}
                    className={cn(
                      'w-full px-4 py-3',
                      'text-left transition-colors cursor-pointer',
                      'hover:bg-opacity-80',
                      index > 0 && 'border-t'
                    )}
                    style={{
                      backgroundColor: !notification.isRead
                        ? (isDarkMode ? 'rgba(45, 104, 248, 0.1)' : 'rgba(239, 246, 255, 0.6)')
                        : 'transparent',
                      borderColor: isDarkMode ? '#374151' : '#DEE2E6',
                    }}
                  >
                    <div
                      className="flex items-start gap-3"
                      onClick={() => handleNotificationClick(notification)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNotificationClick(notification);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className="text-sm font-semibold truncate font-[family-name:var(--font-rubik)]"
                            style={{ color: isDarkMode ? '#ffffff' : '#171B22' }}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span
                              className="flex-shrink-0 w-2 h-2 rounded-full"
                              style={{ backgroundColor: '#2D68F8' }}
                              aria-label="No leída"
                            />
                          )}
                        </div>
                        <p
                          className="text-sm line-clamp-2 font-[family-name:var(--font-rubik)]"
                          style={{ color: isDarkMode ? '#D1D5DB' : '#495057' }}
                        >
                          {notification.message}
                        </p>
                        <p
                          className="text-xs mt-1 font-[family-name:var(--font-rubik)]"
                          style={{ color: isDarkMode ? '#9CA3AF' : '#6C757D' }}
                        >
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className={cn(
                            'flex-shrink-0 p-1.5 rounded-md',
                            'hover:opacity-80 transition-opacity'
                          )}
                          style={{
                            backgroundColor: isDarkMode
                              ? 'rgba(149, 193, 107, 0.15)'
                              : 'rgba(149, 193, 107, 0.1)',
                          }}
                          aria-label="Marcar como leída"
                        >
                          <Check className="w-4 h-4" style={{ color: '#95C16B' }} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {localNotifications.length > 0 && (
            <div
              className={cn(
                'px-4 py-3 text-center',
                'border-t'
              )}
              style={{
                borderColor: isDarkMode ? '#374151' : '#DEE2E6',
              }}
            >
              <button
                onClick={() => {
                  router.push('/notifications');
                  onClose();
                }}
                className={cn(
                  'text-sm font-medium hover:opacity-80 transition-opacity',
                  'font-[family-name:var(--font-rubik)]'
                )}
                style={{ color: '#95C16B' }}
                aria-label="Ver todas las notificaciones"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      </>
    );
  }
);

NotificationDropdown.displayName = 'NotificationDropdown';

/**
 * Formatea la fecha de forma relativa (hace X minutos/horas/días)
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} d`;

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

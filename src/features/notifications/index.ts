// Context
export { NotificationProvider, useNotificationContext } from './context/NotificationContext';
export { NotificationProviderWrapper } from './context/NotificationProviderWrapper';

// Hooks
export { useNotifications } from './hooks/useNotifications';
export { usePushNotifications } from './hooks/usePushNotifications';

// UI Components
export { NotificationDropdown, NotificationPrompt } from './ui';
export type { NotificationDropdownProps, NotificationPromptProps } from './ui';

// Types
export type {
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationPriority,
  PushNotificationState,
  PushSubscription,
  DeviceInfo,
} from './types/notification.types';

// Utils
export * from './utils/pushNotification';

// API exports
export {
  getVapidPublicKey,
  savePushSubscription,
  deletePushSubscription,
  getUserSubscriptions,
  deleteAllSubscriptions,
} from './api/pushSubscriptionApi';

export {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from './api/notificationsApi';

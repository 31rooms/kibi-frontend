/**
 * Tipos de notificaciones
 */
export enum NotificationType {
  // Rachas
  STREAK_AT_RISK = 'STREAK_AT_RISK',
  STREAK_BROKEN = 'STREAK_BROKEN',
  STREAK_MILESTONE = 'STREAK_MILESTONE',

  // Logros
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',

  // Tests y Evaluaciones
  DAILY_TEST_AVAILABLE = 'DAILY_TEST_AVAILABLE',
  REVIEW_PENDING = 'REVIEW_PENDING',

  // Progreso
  LEVEL_UP = 'LEVEL_UP',
  EFFECTIVENESS_IMPROVED = 'EFFECTIVENESS_IMPROVED',

  // General
  REMINDER = 'REMINDER',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

/**
 * Canales de notificación
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

/**
 * Prioridad de notificación
 */
export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Notificación in-app
 */
export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  sentInApp: boolean;
  sentEmail: boolean;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

/**
 * Push Subscription Keys
 */
export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

/**
 * Device Info
 */
export interface DeviceInfo {
  userAgent?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  browser?: string;
  os?: string;
}

/**
 * Push Subscription
 */
export interface PushSubscription {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

/**
 * Push Subscription con info de dispositivo
 */
export interface PushSubscriptionWithDevice extends PushSubscription {
  deviceInfo?: DeviceInfo;
}

/**
 * Respuesta del API para suscripciones
 */
export interface PushSubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  deletedCount?: number;
  error?: string;
}

/**
 * VAPID Public Key Response
 */
export interface VapidPublicKeyResponse {
  publicKey: string;
}

/**
 * Permisos de notificación del navegador
 */
export type NotificationPermission = 'default' | 'granted' | 'denied';

/**
 * Estado de las notificaciones push
 */
export interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  error: string | null;
}

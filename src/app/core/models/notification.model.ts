// ============================================================
// NOTIFICATION MODELS
// Toast / message notification types
// ============================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration: number;
  createdAt: number;
}

export interface ShowNotificationOptions {
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

// ============================================================
// NOTIFICATION SERVICE
// Global toast notifications for user actions & errors
// ============================================================

import { Injectable, signal } from '@angular/core';
import {
  NotificationType,
  ShowNotificationOptions,
  ToastNotification,
} from '../models/notification.model';

const DEFAULT_DURATION = 4000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<ToastNotification[]>([]);

  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  show(options: ShowNotificationOptions): string {
    const notification: ToastNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: options.type ?? 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? DEFAULT_DURATION,
      createdAt: Date.now(),
    };

    this.notifications.update(items => [...items, notification]);
    this.scheduleDismiss(notification.id, notification.duration);
    return notification.id;
  }

  success(message: string, title = 'Thành công'): string {
    return this.show({ type: 'success', title, message });
  }

  error(message: string, title = 'Lỗi'): string {
    return this.show({ type: 'error', title, message, duration: 6000 });
  }

  warning(message: string, title = 'Cảnh báo'): string {
    return this.show({ type: 'warning', title, message, duration: 5000 });
  }

  info(message: string, title = 'Thông báo'): string {
    return this.show({ type: 'info', title, message });
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.notifications.update(items => items.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.notifications.set([]);
  }

  private scheduleDismiss(id: string, duration: number): void {
    if (duration <= 0) return;

    const timer = setTimeout(() => this.dismiss(id), duration);
    this.timers.set(id, timer);
  }
}

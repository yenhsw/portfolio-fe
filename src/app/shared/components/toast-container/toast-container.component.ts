// ============================================================
// TOAST CONTAINER COMPONENT
// Global notification display
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastNotification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of notificationService.notifications(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" role="alert">
          <div class="toast-icon">{{ getIcon(toast) }}</div>
          <div class="toast-body">
            @if (toast.title) {
              <strong class="toast-title">{{ toast.title }}</strong>
            }
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="toast-close"
            aria-label="Đóng thông báo"
            (click)="notificationService.dismiss(toast.id)"
          >
            ✕
          </button>
          <span class="toast-progress" [style.animation-duration.ms]="toast.duration"></span>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  readonly notificationService = inject(NotificationService);

  getIcon(toast: ToastNotification): string {
    const icons: Record<ToastNotification['type'], string> = {
      success: '✓',
      error: '✕',
      warning: '!',
      info: 'i',
    };
    return icons[toast.type];
  }
}

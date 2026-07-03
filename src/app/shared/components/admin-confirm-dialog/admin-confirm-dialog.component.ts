// ============================================================
// ADMIN CONFIRM DIALOG COMPONENT
// Confirmation Dialog for Delete Actions
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDialogComponent } from '../admin-dialog/admin-dialog.component';
import { ConfirmConfig } from '../../models/crud.models';

@Component({
  selector: 'app-admin-confirm-dialog',
  standalone: true,
  imports: [CommonModule, AdminDialogComponent],
  template: `
    <app-admin-dialog
      [isOpen]="isOpen"
      [hasCustomFooter]="true"
      [config]="{ title: config?.title || 'Xác nhận', size: 'sm', closable: true, maskClosable: true, footer: true }"
      (closed)="onCancel()"
    >
      <div class="confirm-content">
        <div class="confirm-icon" [class.danger]="config?.confirmType === 'danger'">
          @if (config?.icon) {
            <span [innerHTML]="config!.icon"></span>
          } @else if (config?.confirmType === 'danger') {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          }
        </div>
        <p class="confirm-message">{{ config?.message || 'Bạn có chắc muốn tiếp tục?' }}</p>
        @if (config?.detail) {
          <p class="confirm-detail">{{ config!.detail }}</p>
        }
      </div>

      <ng-container slot="footer">
        <button type="button" class="confirm-btn secondary" (click)="onCancel()">
          {{ config?.cancelText || 'Hủy' }}
        </button>
        <button type="button" class="confirm-btn" [class.danger]="config?.confirmType === 'danger'" (click)="onConfirm()">
          {{ config?.confirmText || 'Xác nhận' }}
        </button>
      </ng-container>
    </app-admin-dialog>
  `,
  styles: [`
    .confirm-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      padding: 8px 0 4px;
    }

    .confirm-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: rgba(168, 85, 247, 0.1);
      border-radius: 50%;
      color: var(--primary);

      svg, span {
        width: 32px;
        height: 32px;
      }

      &.danger {
        background: rgba(239, 68, 68, 0.12);
        color: var(--danger);
      }
    }

    .confirm-message {
      font-size: 15px;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.5;
    }

    .confirm-detail {
      font-size: 13px;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.5;
    }

    .confirm-btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: var(--background);
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(168, 85, 247, 0.3);
      }

      &.secondary {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border);

        &:hover {
          border-color: var(--primary);
          box-shadow: none;
        }
      }

      &.danger {
        background: linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%);
        color: #ffffff;
        border: 1px solid rgba(239, 68, 68, 0.5);
        box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);

        &:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--danger-light) 0%, var(--danger) 100%);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.45);
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() config: ConfirmConfig | null = null;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

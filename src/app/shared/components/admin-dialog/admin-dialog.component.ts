// ============================================================
// ADMIN DIALOG COMPONENT
// Generic Modal Dialog with Animation
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfig, DialogSize } from '../../models/crud.models';

@Component({
  selector: 'app-admin-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="dialog-overlay" (click)="onOverlayClick($event)">
        <div
          class="dialog-container"
          [class]="'size-' + (config?.size || 'md')"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-dialog-title"
        >
          <!-- Header -->
          @if (config?.title || showDefaultHeader) {
            <div class="dialog-header">
              <h3 class="dialog-title" id="admin-dialog-title">{{ config?.title || 'Dialog' }}</h3>
              @if (config?.closable !== false) {
                <button class="dialog-close" (click)="close()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div class="dialog-content">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (config?.footer !== false) {
            <div class="dialog-footer">
              <ng-content select="[slot=footer]"></ng-content>
              @if (!hasCustomFooter) {
                <button class="dialog-btn secondary" (click)="close()">
                  {{ config?.cancelText || 'Cancel' }}
                </button>
                <button class="dialog-btn primary" (click)="onConfirm()">
                  {{ config?.confirmText || 'Confirm' }}
                </button>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './admin-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDialogComponent {
  @Input() isOpen = false;
  @Input() config: DialogConfig | null = null;
  @Input() showDefaultHeader = true;
  @Input() hasCustomFooter = false;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.config?.closable !== false) {
      this.close();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.config?.maskClosable !== false && event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }
}

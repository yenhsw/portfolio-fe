// ============================================================
// ADMIN DRAWER COMPONENT
// Slide-in Panel for Forms and Details
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerConfig, DrawerPosition } from '../../models/crud.models';

@Component({
  selector: 'app-admin-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="drawer-overlay" (click)="onOverlayClick($event)">
        <div
          class="drawer-container"
          [class]="'position-' + (config?.position || 'right')"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          @if (config?.title || showDefaultHeader) {
            <div class="drawer-header">
              <h3 class="drawer-title">{{ config?.title || 'Drawer' }}</h3>
              @if (config?.closable !== false) {
                <button class="drawer-close" (click)="close()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div class="drawer-content">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (config?.footer !== false) {
            <div class="drawer-footer">
              <ng-content select="[slot=footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './admin-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDrawerComponent {
  @Input() isOpen = false;
  @Input() config: DrawerConfig | null = null;
  @Input() showDefaultHeader = true;

  @Output() closed = new EventEmitter<void>();

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
}

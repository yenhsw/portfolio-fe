// ============================================================
// EMPTY STATE COMPONENT
// Placeholder for empty content
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          @switch (icon) {
            @case ('inbox') {
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            }
            @case ('search') {
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            }
            @case ('folder') {
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            }
            @case ('document') {
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            }
            @default {
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            }
          }
        </svg>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      @if (description) {
        <p class="empty-description">{{ description }}</p>
      }
      <div class="empty-action">
        <ng-content select="[empty-action]"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input() icon: 'inbox' | 'search' | 'folder' | 'document' | 'info' = 'inbox';
  @Input() title = 'No data';
  @Input() description = '';
}

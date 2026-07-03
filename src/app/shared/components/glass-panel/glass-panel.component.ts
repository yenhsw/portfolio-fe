// ============================================================
// GLASS PANEL COMPONENT
// Glassmorphism panel
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-panel',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="'glass-panel glass-panel--' + blur + ' ' + (hoverable ? 'glass-panel--hoverable' : '')">
    <ng-content></ng-content>
  </div>`,
  styles: [`
    .glass-panel {
      background: rgba(10, 15, 26, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);

      &--sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
      &--md { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      &--lg { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      &--xl { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }

      &--hoverable:hover {
        background: rgba(10, 15, 26, 0.8);
        border-color: rgba(0, 245, 255, 0.3);
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.1);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlassPanelComponent {
  @Input() blur: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() hoverable = true;
}

// ============================================================
// TECH BADGE COMPONENT
// Status badge with variants
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="'tech-badge tech-badge--' + variant + ' tech-badge--' + size"><ng-content></ng-content></span>`,
  styleUrl: './tech-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
}

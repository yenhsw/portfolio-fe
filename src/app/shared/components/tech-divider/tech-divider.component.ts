// ============================================================
// TECH DIVIDER COMPONENT
// Horizontal or vertical divider
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-divider',
  standalone: true,
  imports: [CommonModule],
  template: `<hr [class]="'tech-divider tech-divider--' + orientation + ' tech-divider--' + variant" />`,
  styleUrl: './tech-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechDividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() variant: 'solid' | 'gradient' | 'glow' = 'solid';
}

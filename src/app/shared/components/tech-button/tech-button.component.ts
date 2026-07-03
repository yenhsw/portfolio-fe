// ============================================================
// TECH BUTTON - ENHANCED
// Cyber technology button with border beam
// ============================================================

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TechButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'glow';
export type TechButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';
export type TechButtonBorderBeam = 'none' | 'cw' | 'ccw' | 'contour' | 'pulse' | 'diagonal';

@Component({
  selector: 'button[techButton], a[techButton]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="btn-content" [class.loading]="loading">
      @if (loading) {
        <span class="btn-spinner">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
              <animate attributeName="stroke-dashoffset" values="32;0;32" dur="1.5s" repeatCount="indefinite"/>
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </span>
      }
      <span class="btn-text"><ng-content></ng-content></span>
    </span>
  `,
  styleUrl: './tech-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses',
    '[class.btn-disabled]': 'disabled || loading',
    '[attr.disabled]': 'disabled || loading ? true : null',
  },
})
export class TechButtonComponent {
  @Input() variant: TechButtonVariant = 'primary';
  @Input() size: TechButtonSize = 'md';
  @Input() borderBeam: TechButtonBorderBeam = 'none';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() href: string | null = null;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get hostClasses(): string {
    const classes = [
      'tech-btn',
      `tech-btn--${this.variant}`,
      `tech-btn--${this.size}`,
      `border-beam-${this.borderBeam}`,
    ];

    if (this.fullWidth) classes.push('tech-btn--full');
    if (this.disabled) classes.push('tech-btn--disabled');
    if (this.loading) classes.push('tech-btn--loading');

    return classes.join(' ');
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

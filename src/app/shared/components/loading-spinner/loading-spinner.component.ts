// ============================================================
// LOADING SPINNER COMPONENT
// Reusable loading indicator
// ============================================================

import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrapper" [class]="'spinner-wrapper--' + size">
      <div class="spinner">
        <svg class="spinner-svg" viewBox="0 0 50 50">
          <circle
            class="spinner-circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="4"
          />
        </svg>
      </div>
      @if (text) {
        <span class="spinner-text">{{ text }}</span>
      }
    </div>
  `,
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() text = '';
  @Input() fullScreen = false;
}

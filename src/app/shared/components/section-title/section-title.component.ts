// ============================================================
// SECTION TITLE COMPONENT
// Reusable section header with decorative elements
// ============================================================

import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-title" [class]="'section-title--' + align">
      @if (showLabel) {
        <span class="section-label">
          <span class="label-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </span>
          {{ label }}
        </span>
      }
      
      <h2 class="section-heading">
        @if (showLine) {
          <span class="heading-line"></span>
        }
        {{ title }}
        @if (highlight) {
          <span class="heading-highlight"> {{ highlight }}</span>
        }
      </h2>
      
      @if (subtitle) {
        <p class="section-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styleUrl: './section-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  @Input() label = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() highlight = '';
  @Input() align: 'left' | 'center' | 'right' = 'center';
  @Input() showLabel = true;
  @Input() showLine = true;
}

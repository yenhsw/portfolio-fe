// ============================================================
// LOADING SPINNER COMPONENT
// Animated loading indicator
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'loading loading--' + size + ' loading--' + variant">
      @if (variant === 'spinner') {
        <div class="spinner">
          <svg viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
      } @else if (variant === 'dots') {
        <div class="dots">
          <span></span><span></span><span></span>
        </div>
      } @else if (variant === 'bars') {
        <div class="bars">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      }
      
      @if (text) {
        <span class="loading-text">{{ text }}</span>
      }
    </div>
  `,
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'spinner' | 'dots' | 'bars' = 'spinner';
  @Input() text = '';
}

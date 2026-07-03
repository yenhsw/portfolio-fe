// ============================================================
// ADMIN BUTTON COMPONENT
// Reusable Button with Variants
// ============================================================

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-admin-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="admin-btn"
      [class]="variant"
      [class]="size"
      [class.loading]="loading"
      [class.full-width]="fullWidth"
      [disabled]="disabled || loading"
      [type]="type"
    >
      @if (loading) {
        <span class="btn-loader"></span>
      }
      @if (icon && !loading) {
        <span class="btn-icon" [innerHTML]="icon"></span>
      }
      <span class="btn-text"><ng-content></ng-content></span>
    </button>
  `,
  styles: [`
    .admin-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      outline: none;
      white-space: nowrap;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.full-width { width: 100%; }

      // Sizes
      &.sm { padding: 6px 12px; font-size: 12px; }
      &.md { padding: 10px 20px; font-size: 14px; }
      &.lg { padding: 14px 28px; font-size: 16px; }

      // Variants
      &.primary {
        color: var(--background);
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(168, 85, 247, 0.3); }
      }

      &.secondary {
        color: var(--text-primary);
        background: transparent;
        border: 1px solid var(--border);
        &:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
      }

      &.danger {
        color: var(--background);
        background: var(--error);
        &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); }
      }

      &.ghost {
        color: var(--text-secondary);
        background: transparent;
        &:hover:not(:disabled) { color: var(--primary); background: rgba(168, 85, 247, 0.1); }
      }

      &.link {
        color: var(--primary);
        background: transparent;
        padding: 0;
        &:hover:not(:disabled) { text-decoration: underline; }
      }

      &.loading {
        .btn-text { visibility: hidden; }
        .btn-icon { visibility: hidden; }
      }
    }

    .btn-icon {
      display: flex;
      align-items: center;
      svg { width: 18px; height: 18px; }
    }

    .btn-loader {
      position: absolute;
      width: 18px;
      height: 18px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .btn-text { position: relative; z-index: 1; }

    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon: SafeHtml | null = null;
}

// ============================================================
// ADMIN PAGE COMPONENT
// Base Page Layout for Admin CRUD Pages
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page" [class.visible]="isVisible">
      <!-- Background -->
      <div class="page-bg">
        <div class="bg-grid"></div>
        <div class="bg-glow glow-1"></div>
        <div class="bg-glow glow-2"></div>
      </div>

      <!-- Page Header -->
      @if (title) {
        <div class="page-header" [class.has-breadcrumb]="breadcrumb">
          <div class="header-content">
            @if (breadcrumb) {
              <nav class="breadcrumb" aria-label="breadcrumb">
                @for (crumb of breadcrumb; track crumb.label; let last = $last) {
                  @if (!last) {
                    <a [href]="crumb.path || '#'" class="breadcrumb-link">{{ crumb.label }}</a>
                    <span class="breadcrumb-separator">/</span>
                  } @else {
                    <span class="breadcrumb-current">{{ crumb.label }}</span>
                  }
                }
              </nav>
            }
            <div class="header-row">
              <div class="header-info">
                @if (icon) {
                  <div class="header-icon" [innerHTML]="icon"></div>
                }
                <div>
                  <h1 class="page-title">{{ title }}</h1>
                  @if (subtitle) {
                    <p class="page-subtitle">{{ subtitle }}</p>
                  }
                </div>
              </div>
              <div class="header-actions">
                <ng-content select="[slot=header-actions]"></ng-content>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Page Content -->
      <div class="page-content" [class.has-header]="title">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon: SafeHtml | null = null;
  @Input() breadcrumb: { label: string; path?: string }[] = [];
  @Input() isVisible = true;
}

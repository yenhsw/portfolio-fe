// ============================================================
// SIDEBAR COMPONENT
// Admin Sidebar with Navigation Menu
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthStore } from '../../store/auth.store';
import { LocaleService } from '../../../../core/services/locale.service';

interface MenuItemConfig {
  icon: SafeHtml;
  labelKey: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo -->
      <div class="sidebar-header">
        <a href="#" class="logo">
          <span class="logo-icon">H</span>
          @if (!collapsed) {
            <span class="logo-text">YHS<span class="logo-accent">.DEV</span></span>
          }
        </a>
        <button class="collapse-btn" (click)="toggleCollapse.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (collapsed) {
              <polyline points="9 18 15 12 9 6"/>
            } @else {
              <polyline points="15 18 9 12 15 6"/>
            }
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          @for (item of menuItems(); track item.route) {
            <li>
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                class="nav-item"
                [title]="collapsed ? item.label : ''"
              >
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                @if (!collapsed) {
                  <span class="nav-label">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="nav-badge">{{ item.badge }}</span>
                  }
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Divider -->
      <div class="sidebar-divider"></div>

      <!-- User Section -->
      <div class="sidebar-user">
        @if (!collapsed) {
          <div class="user-info">
            <img [src]="authStore.userAvatar()" [alt]="authStore.userName()" class="user-avatar" />
            <div class="user-details">
              <span class="user-name">{{ authStore.userName() }}</span>
              <span class="user-role">{{ locale.t('admin.sidebar.administrator') }}</span>
            </div>
          </div>
        } @else {
          <img [src]="authStore.userAvatar()" [alt]="authStore.userName()" class="user-avatar small" />
        }
      </div>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()" [title]="collapsed ? locale.t('admin.sidebar.logout') : ''">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          @if (!collapsed) {
            <span class="nav-label">{{ locale.t('admin.sidebar.logout') }}</span>
          }
        </button>
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  readonly authStore = inject(AuthStore);
  readonly locale = inject(LocaleService);
  private sanitizer = inject(DomSanitizer);

  private readonly menuConfig: MenuItemConfig[] = [
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'),
      labelKey: 'admin.sidebar.dashboard',
      route: '/admin/dashboard',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'),
      labelKey: 'admin.sidebar.hero',
      route: '/admin/hero-section',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/></svg>'),
      labelKey: 'admin.sidebar.educational',
      route: '/admin/educational',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>'),
      labelKey: 'admin.sidebar.careerJourney',
      route: '/admin/career-journey',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'),
      labelKey: 'admin.sidebar.techStack',
      route: '/admin/tech-stack',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'),
      labelKey: 'admin.sidebar.featuredProjects',
      route: '/admin/featured-projects',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'),
      labelKey: 'admin.sidebar.contact',
      route: '/admin/contact-section',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>'),
      labelKey: 'admin.sidebar.footer',
      route: '/admin/footer-section',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'),
      labelKey: 'admin.sidebar.blogs',
      route: '/admin/blogs',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'),
      labelKey: 'admin.sidebar.messages',
      route: '/admin/messages',
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'),
      labelKey: 'admin.sidebar.settings',
      route: '/admin/settings',
    },
  ];

  readonly menuItems = computed(() =>
    this.menuConfig.map(item => ({
      ...item,
      label: this.locale.t(item.labelKey),
    })),
  );

  ngOnInit(): void {
    this.locale.init();
  }

  logout(): void {
    this.authStore.logout();
  }
}

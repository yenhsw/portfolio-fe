// ============================================================
// TOPBAR COMPONENT
// Admin Topbar with Search, Notifications, User Menu, Language
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  Input,
  Output,
  EventEmitter,
  signal,
  DestroyRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthStore } from '../../store/auth.store';
import { LocaleService } from '../../../../core/services/locale.service';
import type { LocaleCode } from '../../../../core/i18n/translations';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <nav class="breadcrumb">
          <span class="breadcrumb-item">{{ locale.t('admin.breadcrumb') }}</span>
          <svg class="breadcrumb-separator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="breadcrumb-item active">{{ currentPageLabel() }}</span>
        </nav>
      </div>

      <div class="topbar-right">
        <!-- Language EN / VI -->
        <div class="lang-switch" aria-label="Language">
          <button
            type="button"
            class="lang-btn"
            [class.active]="locale.locale() === 'en'"
            (click)="setLocale('en')"
          >
            EN
          </button>
          <button
            type="button"
            class="lang-btn"
            [class.active]="locale.locale() === 'vi'"
            (click)="setLocale('vi')"
          >
            VI
          </button>
        </div>

        <div class="search-wrapper" [class.active]="searchActive()">
          <button class="icon-btn" (click)="toggleSearch()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          @if (searchActive()) {
            <input
              type="text"
              class="search-input"
              [placeholder]="locale.t('admin.topbar.search')"
              (blur)="toggleSearch()"
            />
          }
        </div>

        <div class="notification-wrapper">
          <button class="icon-btn" (click)="toggleNotifications()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            @if (unreadCount() > 0) {
              <span class="notification-badge">{{ unreadCount() }}</span>
            }
          </button>

          @if (notificationsOpen()) {
            <div class="notification-dropdown">
              <div class="dropdown-header">
                <h4>{{ locale.t('admin.topbar.notifications') }}</h4>
                <button class="mark-read-btn" (click)="markAllRead()">{{ locale.t('admin.topbar.markAllRead') }}</button>
              </div>
              <div class="notification-list">
                @for (notification of notifications; track notification.id) {
                  <div class="notification-item" [class.unread]="!notification.read">
                    <div class="notification-content">
                      <span class="notification-title">{{ notification.title }}</span>
                      <span class="notification-message">{{ notification.message }}</span>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <button class="icon-btn" (click)="toggleTheme()">
          @if (darkTheme()) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <div class="user-menu-wrapper">
          <button class="user-btn" (click)="toggleUserMenu()">
            <img [src]="authStore.userAvatar()" [alt]="authStore.userName()" class="user-avatar" />
            <span class="user-name">{{ authStore.userName() }}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          @if (userMenuOpen()) {
            <div class="user-dropdown">
              <a href="#" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ locale.t('admin.topbar.profile') }}
              </a>
              <a href="#" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                {{ locale.t('admin.topbar.settings') }}
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" (click)="logout()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {{ locale.t('admin.topbar.logout') }}
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly authStore = inject(AuthStore);
  readonly locale = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly currentPageLabel = signal('Dashboard');

  readonly searchActive = signal(false);
  readonly notificationsOpen = signal(false);
  readonly userMenuOpen = signal(false);
  readonly darkTheme = signal(true);

  readonly notifications: Notification[] = [
    { id: 1, title: 'New Message', message: 'You have a new message from John', time: '5 min ago', read: false },
    { id: 2, title: 'Project Updated', message: 'Portfolio project was updated', time: '1 hour ago', read: false },
    { id: 3, title: 'Blog Published', message: 'Your blog post is now live', time: '2 hours ago', read: true },
  ];

  readonly unreadCount = signal(2);

  constructor() {
    this.locale.init();
    this.updatePageLabel(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => this.updatePageLabel(event.urlAfterRedirects));
  }

  setLocale(code: LocaleCode): void {
    this.locale.setLocale(code);
    this.updatePageLabel(this.router.url);
    this.cdr.markForCheck();
  }

  private updatePageLabel(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const adminIndex = segments.indexOf('admin');
    const pageSegment = adminIndex >= 0 ? segments[adminIndex + 1] : segments.at(-1);
    const key = pageSegment?.toLowerCase() ?? 'dashboard';
    this.currentPageLabel.set(this.locale.adminPageLabel(key));
  }

  toggleSearch(): void {
    this.searchActive.update(v => !v);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
    this.notificationsOpen.set(false);
  }

  toggleTheme(): void {
    this.darkTheme.update(v => !v);
  }

  markAllRead(): void {
    this.notifications.forEach(n => (n.read = true));
    this.unreadCount.set(0);
  }

  logout(): void {
    this.authStore.logout();
  }
}

// ============================================================
// LOGIN PAGE COMPONENT
// Admin Login - Cyber Technology Design
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="bg-gradient"></div>
        <div class="bg-grid"></div>
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
      </div>

      <div class="login-shell">
        <aside class="login-brand">
          <div class="brand-content">
            <a routerLink="/" class="brand-logo">
              <span class="logo-bracket">&lt;</span>
              <span class="logo-icon">Y</span>
              <span class="logo-text">YHS<span class="logo-accent">.DEV</span></span>
              <span class="logo-bracket"> /&gt;</span>
            </a>

            <h1 class="brand-title">Portfolio Admin</h1>
            <p class="brand-desc">
              Manage your portfolio sections, content, and messages from a single dashboard.
            </p>

            <ul class="brand-features">
              <li class="feature-item">
                <span class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </span>
                <span class="feature-text">
                  <span class="feature-title">Section management</span>
                  <span class="feature-desc">Hero, projects, skills, contact &amp; footer</span>
                </span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <span class="feature-text">
                  <span class="feature-title">Messages inbox</span>
                  <span class="feature-desc">Review contact form submissions</span>
                </span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </span>
                <span class="feature-text">
                  <span class="feature-title">Site settings</span>
                  <span class="feature-desc">Profile, SEO, and appearance</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="brand-scanline"></div>
        </aside>

        <main class="login-main">
          <div class="mobile-logo">
            <span class="logo-bracket">&lt;</span>
            YHS<span class="logo-accent">.DEV</span>
            <span class="logo-bracket"> /&gt;</span>
          </div>

          <div class="login-card" [class.visible]="isVisible()">
            <div class="card-header">
              <div class="login-badge">
                <span class="badge-dot"></span>
                Admin Portal
              </div>
              <h2 class="login-title">Welcome back</h2>
              <p class="login-subtitle">Sign in to continue to your dashboard</p>
            </div>

            @if (authStore.error()) {
              <div class="error-alert">
                <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ authStore.error() }}</span>
              </div>
            }

            <form class="login-form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    class="form-input"
                    placeholder="admin@yenhs.dev"
                    [(ngModel)]="email"
                    name="email"
                    required
                    autocomplete="email"
                    [disabled]="authStore.isLoading()"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    id="password"
                    class="form-input"
                    placeholder="Enter your password"
                    [(ngModel)]="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    [disabled]="authStore.isLoading()"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    (click)="togglePassword()"
                    [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                  >
                    @if (showPassword()) {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="checkbox-wrapper">
                  <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe"/>
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-label">Remember me</span>
                </label>
                <a href="#" class="forgot-link" (click)="$event.preventDefault()">Forgot password?</a>
              </div>

              <button
                type="submit"
                class="submit-btn"
                [class.loading]="authStore.isLoading()"
                [disabled]="authStore.isLoading()"
              >
                <span class="btn-text">
                  @if (authStore.isLoading()) {
                    Signing in...
                  } @else {
                    Sign In
                  }
                </span>
                @if (!authStore.isLoading()) {
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                }
                <span class="btn-loader"></span>
              </button>
            </form>

            <div class="demo-info">
              <span class="demo-label">Demo credentials</span>
              <code>admin&#64;yenhs.dev / admin123</code>
            </div>
          </div>

          <div class="login-meta">
            <a routerLink="/" class="back-home">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to portfolio
            </a>
            <p class="login-footer">© {{ currentYear }} YHS.DEV. All rights reserved.</p>
          </div>
        </main>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  readonly isVisible = signal(false);
  readonly showPassword = signal(false);

  email = '';
  password = '';
  rememberMe = false;

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated() && !this.authStore.isLoading()) {
        void this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.isVisible.set(true), 100);
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.authStore.login(this.email, this.password, this.rememberMe);
  }
}

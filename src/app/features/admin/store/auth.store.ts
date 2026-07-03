// ============================================================
// AUTH STORE
// Signal-based Authentication State Management
// ============================================================

import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State Signals
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Computed Values
  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => {
    return this._token() !== null && this._user() !== null;
  });

  readonly userName = computed(() => this._user()?.name ?? '');
  readonly userEmail = computed(() => this._user()?.email ?? '');
  readonly userAvatar = computed(() => this._user()?.avatar ?? '');

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this._token.set(storedToken);
        this._user.set(user);
      } catch {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('auth_token');
  }

  private saveToStorage(token: string, user: User, refreshToken?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  login(email: string, password: string, rememberMe: boolean): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.authService.login({ email, password, rememberMe }).subscribe({
      next: response => {
        if (response.success && response.data?.accessToken && response.data.user) {
          const { accessToken, refreshToken, user } = response.data;
          this._token.set(accessToken);
          this._user.set(user);
          this._isLoading.set(false);

          if (rememberMe) {
            this.saveToStorage(accessToken, user, refreshToken);
          }

          return;
        }

        this._error.set(response.message || 'Login failed');
        this._isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this._error.set(err.message || 'Invalid email or password');
        this._isLoading.set(false);
      },
    });
  }

  logout(): void {
    const finish = () => {
      this.resetSession();
      this.redirectToLogin();
    };

    if (this._token()) {
      this.authService.logout().subscribe({
        next: () => finish(),
        error: () => finish(),
      });
      return;
    }

    finish();
  }

  private redirectToLogin(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void this.router.navigate(['/admin/login']);
  }

  private resetSession(): void {
    this._token.set(null);
    this._user.set(null);
    this._isLoading.set(false);
    this._error.set(null);
    this.clearStorage();
  }

  clearError(): void {
    this._error.set(null);
  }

  updateUser(userData: Partial<User>): void {
    const currentUser = this._user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this._user.set(updatedUser);

      if (this._token()) {
        this.saveToStorage(this._token()!, updatedUser);
      }
    }
  }

  getToken(): string | null {
    return this._token();
  }
}

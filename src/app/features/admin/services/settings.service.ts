// ============================================================
// SETTINGS SERVICE
// Settings API Service (Mock Implementation)
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { WebsiteSettings, DEFAULT_SETTINGS } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings: WebsiteSettings = { ...DEFAULT_SETTINGS };

  getSettings(): Observable<WebsiteSettings> {
    return of(this.settings).pipe(delay(300));
  }

  updateSettings(settings: Partial<WebsiteSettings>): Observable<WebsiteSettings> {
    this.settings = { ...this.settings, ...settings };
    return of(this.settings).pipe(delay(500));
  }

  resetSettings(): Observable<WebsiteSettings> {
    this.settings = { ...DEFAULT_SETTINGS };
    return of(this.settings).pipe(delay(300));
  }

  validateSettings(settings: WebsiteSettings): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!settings.name.trim()) {
      errors.push('Website name is required');
    }

    if (!settings.contact.email.trim()) {
      errors.push('Contact email is required');
    } else if (!this.isValidEmail(settings.contact.email)) {
      errors.push('Invalid email format');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

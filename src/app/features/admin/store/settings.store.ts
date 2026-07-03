// ============================================================
// SETTINGS STORE
// Website Settings State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { WebsiteSettings, DEFAULT_SETTINGS, ThemeMode } from '../models/settings.model';

export type SettingsTab = 'general' | 'appearance' | 'seo' | 'social' | 'contact' | 'analytics' | 'animation' | 'system';

@Injectable({
  providedIn: 'root',
})
export class SettingsStore {
  // State
  readonly settings = signal<WebsiteSettings>({ ...DEFAULT_SETTINGS });
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly activeTab = signal<SettingsTab>('general');
  readonly isDirty = signal(false);

  // Computed
  readonly currentTheme = computed(() => this.settings().theme);

  readonly themeColors = computed(() => {
    const colors = this.settings().colors;
    return {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      border: colors.border,
    };
  });

  readonly cssVariables = computed(() => {
    const settings = this.settings();
    const colors = settings.colors;
    return `
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --background: ${colors.background};
      --surface: ${colors.surface};
      --border: ${colors.border};
      --radius: ${settings.borderRadius}px;
      --text-primary: ${this.getContrastColor(colors.background)};
      --text-secondary: ${this.getMutedColor(colors.background)};
      --text-muted: ${this.getMutedColor(colors.background)};
    `;
  });

  // Actions
  loadSettings(): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      this.settings.set({ ...DEFAULT_SETTINGS });
      this.loading.set(false);
      this.isDirty.set(false);
    }, 500);
  }

  updateSettings(updates: Partial<WebsiteSettings>): void {
    this.settings.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateGeneral(updates: Partial<WebsiteSettings>): void {
    this.settings.update(current => ({
      ...current,
      name: updates.name ?? current.name,
      title: updates.title ?? current.title,
      description: updates.description ?? current.description,
      companyName: updates.companyName ?? current.companyName,
      copyright: updates.copyright ?? current.copyright,
      language: updates.language ?? current.language,
      timezone: updates.timezone ?? current.timezone,
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateLogo(updates: Partial<WebsiteSettings['logo']>): void {
    this.settings.update(current => ({
      ...current,
      logo: { ...current.logo, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateColors(updates: Partial<WebsiteSettings['colors']>): void {
    this.settings.update(current => ({
      ...current,
      colors: { ...current.colors, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateTheme(theme: ThemeMode): void {
    this.settings.update(current => ({
      ...current,
      theme,
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateAppearance(updates: {
    borderRadius?: number;
    glassEffect?: boolean;
    shadow?: boolean;
    glow?: boolean;
  }): void {
    this.settings.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateHero(updates: Partial<WebsiteSettings['hero']>): void {
    this.settings.update(current => ({
      ...current,
      hero: { ...current.hero, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateSEO(updates: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    twitterImage?: string;
    robots?: string;
  }): void {
    this.settings.update(current => ({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateSocial(updates: Partial<WebsiteSettings['social']>): void {
    this.settings.update(current => ({
      ...current,
      social: { ...current.social, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateContact(updates: Partial<WebsiteSettings['contact']>): void {
    this.settings.update(current => ({
      ...current,
      contact: { ...current.contact, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateAnalytics(updates: Partial<WebsiteSettings['analytics']>): void {
    this.settings.update(current => ({
      ...current,
      analytics: { ...current.analytics, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateAnimation(updates: Partial<WebsiteSettings['animation']>): void {
    this.settings.update(current => ({
      ...current,
      animation: { ...current.animation, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  updateSystem(updates: Partial<WebsiteSettings['system']>): void {
    this.settings.update(current => ({
      ...current,
      system: { ...current.system, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    this.isDirty.set(true);
  }

  setActiveTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  saveSettings(): boolean {
    this.saving.set(true);

    try {
      // Mock save - in real app, this would call API
      const settings = this.settings();
      localStorage.setItem('website_settings', JSON.stringify(settings));
      this.saving.set(false);
      this.isDirty.set(false);
      return true;
    } catch {
      this.error.set('Failed to save settings');
      this.saving.set(false);
      return false;
    }
  }

  resetSettings(): void {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      this.settings.set({ ...DEFAULT_SETTINGS });
      this.isDirty.set(true);
    }
  }

  exportSettings(): string {
    return JSON.stringify({
      settings: this.settings(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importSettings(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.settings) {
        this.settings.set(data.settings);
        this.isDirty.set(true);
        return true;
      }
      return false;
    } catch {
      this.error.set('Invalid JSON format');
      return false;
    }
  }

  // Utilities
  private getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#0f172a' : '#f8fafc';
  }

  private getMutedColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#64748b' : '#94a3b8';
  }

  clearError(): void {
    this.error.set(null);
  }
}

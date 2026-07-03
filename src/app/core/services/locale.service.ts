// ============================================================
// LOCALE SERVICE
// Label-only language switch (EN / VI) — reads translations.ts
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  LocaleCode,
  LOCALE_STORAGE_KEY,
  TRANSLATIONS,
  NAV_SECTION_IDS,
  ADMIN_ROUTE_PAGE_KEY,
} from '../i18n/translations';
import { PlatformService } from './platform.service';

export interface NavItemView {
  id: string;
  icon: string;
  label: string;
}

const NAV_ICONS: Record<string, string> = {
  home: 'home',
  career: 'graduation',
  skills: 'code',
  experience: 'briefcase',
  projects: 'folder',
  contact: 'mail',
};

const BREADCRUMB_SIDEBAR_KEY: Record<string, string> = {
  educational: 'admin.sidebar.educational',
  'career-journey': 'admin.sidebar.careerJourney',
  'tech-stack': 'admin.sidebar.techStack',
  'featured-projects': 'admin.sidebar.featuredProjects',
  'contact-section': 'admin.sidebar.contact',
  'footer-section': 'admin.sidebar.footer',
  messages: 'admin.sidebar.messages',
  settings: 'admin.sidebar.settings',
  'hero-section': 'admin.sidebar.hero',
  dashboard: 'admin.sidebar.dashboard',
  blogs: 'admin.sidebar.blogs',
};

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly platform = inject(PlatformService);

  private readonly _locale = signal<LocaleCode>('en');

  readonly locale = this._locale.asReadonly();

  readonly navItems = computed((): NavItemView[] =>
    NAV_SECTION_IDS.map(id => ({
      id,
      icon: NAV_ICONS[id] ?? 'home',
      label: this.t(`nav.${id}`),
    })),
  );

  init(): void {
    if (!this.platform.isBrowser) return;
    const stored = this.platform.localStorage?.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'en' || stored === 'vi') {
      this._locale.set(stored);
    }
  }

  setLocale(code: LocaleCode): void {
    this._locale.set(code);
    if (this.platform.isBrowser) {
      this.platform.localStorage?.setItem(LOCALE_STORAGE_KEY, code);
    }
  }

  toggleLocale(): void {
    this.setLocale(this._locale() === 'en' ? 'vi' : 'en');
  }

  t(key: string): string {
    const lang = this._locale();
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
  }

  adminPageLabel(routeSegment: string): string {
    const sidebarKey = BREADCRUMB_SIDEBAR_KEY[routeSegment];
    if (sidebarKey) {
      return this.t(sidebarKey);
    }
    const translationKey = ADMIN_ROUTE_PAGE_KEY[routeSegment];
    if (translationKey) {
      return this.t(translationKey);
    }
    return routeSegment
      .split('-')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  pageTabs<T extends string>(
    page: string,
    keys: readonly T[],
  ): { key: T; label: string; description: string }[] {
    this._locale();
    return keys.map(key => ({
      key,
      label: this.t(`admin.pages.${page}.tabs.${key}.label`),
      description: this.t(`admin.pages.${page}.tabs.${key}.description`),
    }));
  }
}

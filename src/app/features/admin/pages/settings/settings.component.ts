// ============================================================
// SETTINGS COMPONENT
// Site-wide configuration (SEO, Analytics, system)
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsStore, SettingsTab } from '../../store/settings.store';
import { WebsiteSettings, TIMEZONES, LANGUAGES } from '../../models/settings.model';
import { AdminPageComponent, AdminButtonComponent } from '../../../../shared/components';
import { NotificationService } from '../../../../core/services/notification.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  description: string;
  icon: string;
}

const SETTINGS_TAB_KEYS: SettingsTab[] = ['general', 'seo', 'analytics', 'system'];

const SETTINGS_TAB_ICONS: Record<SettingsTab, string> = {
  general: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  seo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  appearance: '',
  social: '',
  contact: '',
  animation: '',
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPageComponent, AdminButtonComponent, TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  readonly store = inject(SettingsStore);
  private readonly notify = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly locale = inject(LocaleService);

  readonly isReady = signal(false);
  formData!: WebsiteSettings;

  readonly timezones = TIMEZONES;
  readonly languages = LANGUAGES;

  readonly tabList = computed((): SettingsTabItem[] => {
    this.locale.locale();
    return SETTINGS_TAB_KEYS.map(id => ({
      id,
      icon: SETTINGS_TAB_ICONS[id],
      label: this.locale.t(`admin.pages.settings.tabs.${id}.label`),
      description: this.locale.t(`admin.pages.settings.tabs.${id}.description`),
    }));
  });

  readonly scopeByTab: Record<SettingsTab, string[]> = {
    general: ['Browser title tag (will wire when API is ready)', 'Footer copyright', 'Admin language & timezone'],
    appearance: [],
    seo: ['Home page meta tags', 'Open Graph when sharing links', 'Canonical URL'],
    social: [],
    contact: [],
    analytics: ['GA4 / GTM script injected into <head>', 'Microsoft Clarity heatmap'],
    animation: [],
    system: ['Maintenance mode', 'Enable/disable Contact form site-wide', 'Enable/disable Download CV button'],
  };

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

  ngOnInit(): void {
    this.store.loadSettings();
    this.syncFormData();
    setTimeout(() => this.isReady.set(true), 100);
  }

  activeTabMeta(): SettingsTabItem | undefined {
    return this.tabList().find(t => t.id === this.store.activeTab());
  }

  private syncFormData(): void {
    this.formData = JSON.parse(JSON.stringify(this.store.settings()));
  }

  setTab(tab: SettingsTab): void {
    this.store.setActiveTab(tab);
    this.syncFormData();
  }

  updateKeywords(keywords: string): void {
    this.formData.keywords = keywords.split(',').map(k => k.trim()).filter(k => k);
  }

  saveSettings(): void {
    this.store.updateSettings(this.formData);
    if (this.store.saveSettings()) {
      this.notify.success('Website settings saved.');
    }
  }

  resetSettings(): void {
    this.store.resetSettings();
    this.syncFormData();
    this.notify.info('Default settings restored.');
  }

  exportSettings(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const json = this.store.exportSettings();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.notify.success('Settings file exported.');
  }
}

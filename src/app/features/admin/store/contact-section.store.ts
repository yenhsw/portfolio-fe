// ============================================================
// CONTACT SECTION STORE
// State quản lý section CONTACT (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  ContactSectionConfig,
  ContactMapConfig,
  ContactCtaConfig,
  ContactFormSettings,
  ContactInfoItem,
  ContactInfoFormData,
  ContactSocialItem,
  ContactSocialFormData,
  CONTACT_SECTION_TYPE_CODE,
  DEFAULT_CONTACT_SECTION,
  DEFAULT_CONTACT_MAP,
  DEFAULT_CONTACT_CTA,
  DEFAULT_CONTACT_FORM,
  MOCK_CONTACT_INFO,
  MOCK_CONTACT_SOCIAL,
} from '../models/contact-section.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_contact_section_data';

interface ContactSectionData {
  type: typeof CONTACT_SECTION_TYPE_CODE;
  section: ContactSectionConfig;
  map: ContactMapConfig;
  cta: ContactCtaConfig;
  form: ContactFormSettings;
  contactInfo: ContactInfoItem[];
  socialLinks: ContactSocialItem[];
}

function ensureContactSection(config: ContactSectionConfig): ContactSectionConfig {
  return { ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactMap(config: ContactMapConfig): ContactMapConfig {
  return { ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactCta(config: ContactCtaConfig): ContactCtaConfig {
  return { ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactForm(config: ContactFormSettings): ContactFormSettings {
  return { ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactInfo(item: ContactInfoItem): ContactInfoItem {
  return { ...item, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactSocial(item: ContactSocialItem): ContactSocialItem {
  return { ...item, type: CONTACT_SECTION_TYPE_CODE };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index + 1 }));
}

function nextSortOrder(items: { sortOrder: number }[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map(i => i.sortOrder)) + 1;
}

@Injectable({ providedIn: 'root' })
export class ContactSectionStore {
  private readonly platform = inject(PlatformService);

  readonly section = signal<ContactSectionConfig>({ ...DEFAULT_CONTACT_SECTION });
  readonly map = signal<ContactMapConfig>({ ...DEFAULT_CONTACT_MAP });
  readonly cta = signal<ContactCtaConfig>({ ...DEFAULT_CONTACT_CTA });
  readonly form = signal<ContactFormSettings>({ ...DEFAULT_CONTACT_FORM });
  readonly contactInfo = signal<ContactInfoItem[]>([...MOCK_CONTACT_INFO]);
  readonly socialLinks = signal<ContactSocialItem[]>([...MOCK_CONTACT_SOCIAL]);
  readonly sectionType = CONTACT_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  private loaded = false;

  readonly activeContactInfo = computed(() => sortByOrder(this.contactInfo().filter(i => i.isActive)));
  readonly activeSocialLinks = computed(() => sortByOrder(this.socialLinks().filter(s => s.isActive)));
  readonly sortedContactInfo = computed(() => sortByOrder(this.contactInfo()));
  readonly sortedSocialLinks = computed(() => sortByOrder(this.socialLinks()));

  readonly hasAnyContent = computed(() => {
    const s = this.section();
    const hasSectionText =
      !!s.sectionTag?.trim() ||
      !!s.titleAccent?.trim() ||
      !!s.titleText?.trim() ||
      !!s.subtitle?.trim();
    return (
      hasSectionText ||
      this.activeContactInfo().length > 0 ||
      this.activeSocialLinks().length > 0 ||
      this.form().enabled ||
      (this.map().isActive && !!this.map().text?.trim()) ||
      (this.cta().isActive && !!this.cta().title?.trim())
    );
  });

  load(): void {
    if (this.loaded) return;

    if (!this.platform.isBrowser) {
      this.applyMockData();
      this.loaded = true;
      return;
    }

    this.loading.set(true);
    try {
      const storage = this.platform.localStorage;
      const raw = storage?.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as ContactSectionData;
        this.section.set(ensureContactSection(data.section ?? { ...DEFAULT_CONTACT_SECTION }));
        this.map.set(ensureContactMap(data.map ?? { ...DEFAULT_CONTACT_MAP }));
        this.cta.set(ensureContactCta(data.cta ?? { ...DEFAULT_CONTACT_CTA }));
        this.form.set(ensureContactForm(data.form ?? { ...DEFAULT_CONTACT_FORM }));
        this.contactInfo.set(normalizeSortOrder(data.contactInfo ?? [...MOCK_CONTACT_INFO]).map(ensureContactInfo));
        this.socialLinks.set(normalizeSortOrder(data.socialLinks ?? [...MOCK_CONTACT_SOCIAL]).map(ensureContactSocial));
      } else {
        this.applyMockData();
        this.persist();
      }
    } catch {
      this.applyMockData();
      this.persist();
    } finally {
      this.loading.set(false);
      this.loaded = true;
    }
  }

  private applyMockData(): void {
    this.section.set({ ...DEFAULT_CONTACT_SECTION });
    this.map.set({ ...DEFAULT_CONTACT_MAP });
    this.cta.set({ ...DEFAULT_CONTACT_CTA });
    this.form.set({ ...DEFAULT_CONTACT_FORM });
    this.contactInfo.set([...MOCK_CONTACT_INFO]);
    this.socialLinks.set([...MOCK_CONTACT_SOCIAL]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;
    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: ContactSectionData = {
      type: CONTACT_SECTION_TYPE_CODE,
      section: this.section(),
      map: this.map(),
      cta: this.cta(),
      form: this.form(),
      contactInfo: this.contactInfo(),
      socialLinks: this.socialLinks(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveSection(config: ContactSectionConfig): void {
    this.section.set(ensureContactSection(config));
    this.persist();
  }

  saveMap(config: ContactMapConfig): void {
    this.map.set(ensureContactMap(config));
    this.persist();
  }

  saveCta(config: ContactCtaConfig): void {
    this.cta.set(ensureContactCta(config));
    this.persist();
  }

  saveFormSettings(config: ContactFormSettings): void {
    this.form.set(ensureContactForm(config));
    this.persist();
  }

  saveSettingsPanel(map: ContactMapConfig, cta: ContactCtaConfig, form: ContactFormSettings): void {
    this.map.set(ensureContactMap(map));
    this.cta.set(ensureContactCta(cta));
    this.form.set(ensureContactForm(form));
    this.persist();
  }

  addContactInfo(data: ContactInfoFormData): void {
    const items = this.contactInfo();
    const item: ContactInfoItem = ensureContactInfo({
      id: generateId(),
      ...data,
      link: data.link ?? '',
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.contactInfo.set([...items, item]);
    this.persist();
  }

  updateContactInfo(id: string, data: ContactInfoFormData): void {
    this.contactInfo.update(items =>
      items.map(i =>
        i.id === id ? ensureContactInfo({ ...i, ...data, type: CONTACT_SECTION_TYPE_CODE }) : i
      )
    );
    this.persist();
  }

  deleteContactInfo(id: string): void {
    this.contactInfo.update(items => items.filter(i => i.id !== id));
    this.persist();
  }

  setContactInfoStatus(id: string, isActive: boolean): void {
    this.contactInfo.update(items => items.map(i => (i.id === id ? { ...i, isActive } : i)));
    this.persist();
  }

  addSocialLink(data: ContactSocialFormData): void {
    const items = this.socialLinks();
    const item: ContactSocialItem = ensureContactSocial({
      id: generateId(),
      ...data,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.socialLinks.set([...items, item]);
    this.persist();
  }

  updateSocialLink(id: string, data: ContactSocialFormData): void {
    this.socialLinks.update(items =>
      items.map(s =>
        s.id === id ? ensureContactSocial({ ...s, ...data, type: CONTACT_SECTION_TYPE_CODE }) : s
      )
    );
    this.persist();
  }

  deleteSocialLink(id: string): void {
    this.socialLinks.update(items => items.filter(s => s.id !== id));
    this.persist();
  }

  setSocialLinkStatus(id: string, isActive: boolean): void {
    this.socialLinks.update(items => items.map(s => (s.id === id ? { ...s, isActive } : s)));
    this.persist();
  }
}

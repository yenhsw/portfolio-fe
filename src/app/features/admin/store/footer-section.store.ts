// ============================================================
// FOOTER SECTION STORE
// Footer config (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  FooterBrandConfig,
  FooterColumnTitles,
  FooterDividerConfig,
  FooterTechConfig,
  FooterBottomConfig,
  FooterLinkItem,
  FooterLinkFormData,
  FooterServiceItem,
  FooterServiceFormData,
  FooterContactItem,
  FooterContactFormData,
  FooterSocialItem,
  FooterSocialFormData,
  FooterTechBadge,
  FooterTechBadgeFormData,
  FOOTER_SECTION_TYPE_CODE,
  DEFAULT_FOOTER_BRAND,
  DEFAULT_FOOTER_COLUMN_TITLES,
  DEFAULT_FOOTER_DIVIDER,
  DEFAULT_FOOTER_TECH,
  DEFAULT_FOOTER_BOTTOM,
  MOCK_FOOTER_QUICK_LINKS,
  MOCK_FOOTER_SERVICES,
  MOCK_FOOTER_CONTACT,
  MOCK_FOOTER_SOCIAL,
  MOCK_FOOTER_TECH_BADGES,
} from '../models/footer-section.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_footer_section_data';

interface FooterSectionData {
  type: typeof FOOTER_SECTION_TYPE_CODE;
  brand: FooterBrandConfig;
  columnTitles: FooterColumnTitles;
  divider: FooterDividerConfig;
  tech: FooterTechConfig;
  bottom: FooterBottomConfig;
  quickLinks: FooterLinkItem[];
  services: FooterServiceItem[];
  contactItems: FooterContactItem[];
  socialLinks: FooterSocialItem[];
  techBadges: FooterTechBadge[];
}

function ensureBrand(config: FooterBrandConfig): FooterBrandConfig {
  return { ...config, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureColumnTitles(config: FooterColumnTitles): FooterColumnTitles {
  return { ...config, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureDivider(config: FooterDividerConfig): FooterDividerConfig {
  return { ...config, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureTechConfig(config: FooterTechConfig): FooterTechConfig {
  return { ...config, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureBottom(config: FooterBottomConfig): FooterBottomConfig {
  return { ...config, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureQuickLink(item: FooterLinkItem): FooterLinkItem {
  return { ...item, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureService(item: FooterServiceItem): FooterServiceItem {
  return { ...item, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureContactItem(item: FooterContactItem): FooterContactItem {
  return { ...item, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureSocialLink(item: FooterSocialItem): FooterSocialItem {
  return { ...item, type: FOOTER_SECTION_TYPE_CODE };
}

function ensureTechBadge(item: FooterTechBadge): FooterTechBadge {
  return { ...item, type: FOOTER_SECTION_TYPE_CODE };
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
export class FooterSectionStore {
  private readonly platform = inject(PlatformService);

  readonly brand = signal<FooterBrandConfig>({ ...DEFAULT_FOOTER_BRAND });
  readonly columnTitles = signal<FooterColumnTitles>({ ...DEFAULT_FOOTER_COLUMN_TITLES });
  readonly divider = signal<FooterDividerConfig>({ ...DEFAULT_FOOTER_DIVIDER });
  readonly tech = signal<FooterTechConfig>({ ...DEFAULT_FOOTER_TECH });
  readonly bottom = signal<FooterBottomConfig>({ ...DEFAULT_FOOTER_BOTTOM });
  readonly quickLinks = signal<FooterLinkItem[]>([...MOCK_FOOTER_QUICK_LINKS]);
  readonly services = signal<FooterServiceItem[]>([...MOCK_FOOTER_SERVICES]);
  readonly contactItems = signal<FooterContactItem[]>([...MOCK_FOOTER_CONTACT]);
  readonly socialLinks = signal<FooterSocialItem[]>([...MOCK_FOOTER_SOCIAL]);
  readonly techBadges = signal<FooterTechBadge[]>([...MOCK_FOOTER_TECH_BADGES]);
  readonly sectionType = FOOTER_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  private loaded = false;

  readonly activeQuickLinks = computed(() => sortByOrder(this.quickLinks().filter(i => i.isActive)));
  readonly activeServices = computed(() => sortByOrder(this.services().filter(i => i.isActive)));
  readonly activeContactItems = computed(() => sortByOrder(this.contactItems().filter(i => i.isActive)));
  readonly activeSocialLinks = computed(() => sortByOrder(this.socialLinks().filter(s => s.isActive)));
  readonly activeTechBadges = computed(() => sortByOrder(this.techBadges().filter(t => t.isActive)));

  readonly sortedQuickLinks = computed(() => sortByOrder(this.quickLinks()));
  readonly sortedServices = computed(() => sortByOrder(this.services()));
  readonly sortedContactItems = computed(() => sortByOrder(this.contactItems()));
  readonly sortedSocialLinks = computed(() => sortByOrder(this.socialLinks()));
  readonly sortedTechBadges = computed(() => sortByOrder(this.techBadges()));

  load(): void {
    if (this.loaded) return;

    if (!this.platform.isBrowser) {
      this.applyMockData();
      this.loaded = true;
      return;
    }

    this.loading.set(true);
    try {
      const raw = this.platform.localStorage?.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as FooterSectionData;
        this.brand.set(ensureBrand(data.brand ?? { ...DEFAULT_FOOTER_BRAND }));
        this.columnTitles.set(ensureColumnTitles(data.columnTitles ?? { ...DEFAULT_FOOTER_COLUMN_TITLES }));
        this.divider.set(ensureDivider(data.divider ?? { ...DEFAULT_FOOTER_DIVIDER }));
        this.tech.set(ensureTechConfig(data.tech ?? { ...DEFAULT_FOOTER_TECH }));
        this.bottom.set(ensureBottom(data.bottom ?? { ...DEFAULT_FOOTER_BOTTOM }));
        this.quickLinks.set(normalizeSortOrder(data.quickLinks ?? [...MOCK_FOOTER_QUICK_LINKS]).map(ensureQuickLink));
        this.services.set(normalizeSortOrder(data.services ?? [...MOCK_FOOTER_SERVICES]).map(ensureService));
        this.contactItems.set(normalizeSortOrder(data.contactItems ?? [...MOCK_FOOTER_CONTACT]).map(ensureContactItem));
        this.socialLinks.set(normalizeSortOrder(data.socialLinks ?? [...MOCK_FOOTER_SOCIAL]).map(ensureSocialLink));
        this.techBadges.set(normalizeSortOrder(data.techBadges ?? [...MOCK_FOOTER_TECH_BADGES]).map(ensureTechBadge));
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
    this.brand.set({ ...DEFAULT_FOOTER_BRAND });
    this.columnTitles.set({ ...DEFAULT_FOOTER_COLUMN_TITLES });
    this.divider.set({ ...DEFAULT_FOOTER_DIVIDER });
    this.tech.set({ ...DEFAULT_FOOTER_TECH });
    this.bottom.set({ ...DEFAULT_FOOTER_BOTTOM });
    this.quickLinks.set([...MOCK_FOOTER_QUICK_LINKS]);
    this.services.set([...MOCK_FOOTER_SERVICES]);
    this.contactItems.set([...MOCK_FOOTER_CONTACT]);
    this.socialLinks.set([...MOCK_FOOTER_SOCIAL]);
    this.techBadges.set([...MOCK_FOOTER_TECH_BADGES]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;
    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: FooterSectionData = {
      type: FOOTER_SECTION_TYPE_CODE,
      brand: this.brand(),
      columnTitles: this.columnTitles(),
      divider: this.divider(),
      tech: this.tech(),
      bottom: this.bottom(),
      quickLinks: this.quickLinks(),
      services: this.services(),
      contactItems: this.contactItems(),
      socialLinks: this.socialLinks(),
      techBadges: this.techBadges(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveBrandPanel(
    brand: FooterBrandConfig,
    columnTitles: FooterColumnTitles,
    divider: FooterDividerConfig,
    tech: FooterTechConfig,
    bottom: FooterBottomConfig,
  ): void {
    this.brand.set(ensureBrand(brand));
    this.columnTitles.set(ensureColumnTitles(columnTitles));
    this.divider.set(ensureDivider(divider));
    this.tech.set(ensureTechConfig(tech));
    this.bottom.set(ensureBottom(bottom));
    this.persist();
  }

  addQuickLink(data: FooterLinkFormData): void {
    const item: FooterLinkItem = ensureQuickLink({ id: generateId(), ...data, isActive: true });
    this.quickLinks.set([...this.quickLinks(), item]);
    this.persist();
  }

  updateQuickLink(id: string, data: FooterLinkFormData, isActive: boolean): void {
    this.quickLinks.set(
      this.quickLinks().map(i =>
        i.id === id ? ensureQuickLink({ ...i, ...data, isActive, type: FOOTER_SECTION_TYPE_CODE }) : i
      ),
    );
    this.persist();
  }

  deleteQuickLink(id: string): void {
    this.quickLinks.set(this.quickLinks().filter(i => i.id !== id));
    this.persist();
  }

  setQuickLinkStatus(id: string, isActive: boolean): void {
    this.quickLinks.set(this.quickLinks().map(i => (i.id === id ? { ...i, isActive } : i)));
    this.persist();
  }

  addService(data: FooterServiceFormData): void {
    const item: FooterServiceItem = ensureService({
      id: generateId(),
      ...data,
      href: data.href || '#',
      isActive: true,
    });
    this.services.set([...this.services(), item]);
    this.persist();
  }

  updateService(id: string, data: FooterServiceFormData, isActive: boolean): void {
    this.services.set(
      this.services().map(i =>
        i.id === id
          ? ensureService({ ...i, ...data, href: data.href || '#', isActive, type: FOOTER_SECTION_TYPE_CODE })
          : i,
      ),
    );
    this.persist();
  }

  deleteService(id: string): void {
    this.services.set(this.services().filter(i => i.id !== id));
    this.persist();
  }

  setServiceStatus(id: string, isActive: boolean): void {
    this.services.set(this.services().map(i => (i.id === id ? { ...i, isActive } : i)));
    this.persist();
  }

  addContactItem(data: FooterContactFormData): void {
    const item: FooterContactItem = ensureContactItem({
      id: generateId(),
      ...data,
      link: data.link ?? '',
      isActive: true,
    });
    this.contactItems.set([...this.contactItems(), item]);
    this.persist();
  }

  updateContactItem(id: string, data: FooterContactFormData, isActive: boolean): void {
    this.contactItems.set(
      this.contactItems().map(i =>
        i.id === id
          ? ensureContactItem({ ...i, ...data, link: data.link ?? '', isActive, type: FOOTER_SECTION_TYPE_CODE })
          : i,
      ),
    );
    this.persist();
  }

  deleteContactItem(id: string): void {
    this.contactItems.set(this.contactItems().filter(i => i.id !== id));
    this.persist();
  }

  setContactItemStatus(id: string, isActive: boolean): void {
    this.contactItems.set(this.contactItems().map(i => (i.id === id ? { ...i, isActive } : i)));
    this.persist();
  }

  addSocialLink(data: FooterSocialFormData): void {
    const item: FooterSocialItem = ensureSocialLink({ id: generateId(), ...data, isActive: true });
    this.socialLinks.set([...this.socialLinks(), item]);
    this.persist();
  }

  updateSocialLink(id: string, data: FooterSocialFormData, isActive: boolean): void {
    this.socialLinks.set(
      this.socialLinks().map(i =>
        i.id === id ? ensureSocialLink({ ...i, ...data, isActive, type: FOOTER_SECTION_TYPE_CODE }) : i
      ),
    );
    this.persist();
  }

  deleteSocialLink(id: string): void {
    this.socialLinks.set(this.socialLinks().filter(i => i.id !== id));
    this.persist();
  }

  setSocialLinkStatus(id: string, isActive: boolean): void {
    this.socialLinks.set(this.socialLinks().map(i => (i.id === id ? { ...i, isActive } : i)));
    this.persist();
  }

  addTechBadge(data: FooterTechBadgeFormData): void {
    const item: FooterTechBadge = ensureTechBadge({ id: generateId(), ...data, isActive: true });
    this.techBadges.set([...this.techBadges(), item]);
    this.persist();
  }

  updateTechBadge(id: string, data: FooterTechBadgeFormData, isActive: boolean): void {
    this.techBadges.set(
      this.techBadges().map(i =>
        i.id === id ? ensureTechBadge({ ...i, ...data, isActive, type: FOOTER_SECTION_TYPE_CODE }) : i
      ),
    );
    this.persist();
  }

  deleteTechBadge(id: string): void {
    this.techBadges.set(this.techBadges().filter(i => i.id !== id));
    this.persist();
  }

  setTechBadgeStatus(id: string, isActive: boolean): void {
    this.techBadges.set(this.techBadges().map(i => (i.id === id ? { ...i, isActive } : i)));
    this.persist();
  }

  nextQuickLinkOrder(): number {
    return nextSortOrder(this.quickLinks());
  }

  nextServiceOrder(): number {
    return nextSortOrder(this.services());
  }

  nextContactOrder(): number {
    return nextSortOrder(this.contactItems());
  }

  nextSocialOrder(): number {
    return nextSortOrder(this.socialLinks());
  }

  nextTechBadgeOrder(): number {
    return nextSortOrder(this.techBadges());
  }
}

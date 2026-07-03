// ============================================================
// HERO SECTION STORE
// State quản lý section HERO (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  HeroSectionConfig,
  HeroAvatarConfig,
  HeroButtonsConfig,
  HeroSocialLink,
  HeroSocialFormData,
  HeroTypingLine,
  HeroTypingFormData,
  HERO_SECTION_TYPE_CODE,
  DEFAULT_HERO_SECTION,
  DEFAULT_HERO_AVATAR,
  DEFAULT_HERO_BUTTONS,
  MOCK_HERO_TYPING_LINES,
  MOCK_HERO_SOCIAL_LINKS,
} from '../models/hero-section.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_hero_section_data';

interface HeroSectionData {
  type: typeof HERO_SECTION_TYPE_CODE;
  section: HeroSectionConfig;
  avatar: HeroAvatarConfig;
  buttons: HeroButtonsConfig;
  typingLines: HeroTypingLine[];
  socialLinks: HeroSocialLink[];
}

function withHeroType<T extends object>(payload: T): T & { type: typeof HERO_SECTION_TYPE_CODE } {
  return { type: HERO_SECTION_TYPE_CODE, ...payload };
}

function ensureHeroTypeSection(config: HeroSectionConfig): HeroSectionConfig {
  return { ...config, type: HERO_SECTION_TYPE_CODE };
}

function ensureHeroTypeAvatar(config: HeroAvatarConfig): HeroAvatarConfig {
  return { ...config, type: HERO_SECTION_TYPE_CODE };
}

function ensureHeroTypeButtons(config: HeroButtonsConfig): HeroButtonsConfig {
  return { ...config, type: HERO_SECTION_TYPE_CODE };
}

function ensureHeroTypeTypingLine(item: HeroTypingLine): HeroTypingLine {
  return { ...item, type: HERO_SECTION_TYPE_CODE };
}

function ensureHeroTypeSocialLink(item: HeroSocialLink): HeroSocialLink {
  return { ...item, type: HERO_SECTION_TYPE_CODE };
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
export class HeroSectionStore {
  private readonly platform = inject(PlatformService);

  readonly section = signal<HeroSectionConfig>({ ...DEFAULT_HERO_SECTION });
  readonly avatar = signal<HeroAvatarConfig>({ ...DEFAULT_HERO_AVATAR });
  readonly buttons = signal<HeroButtonsConfig>({ ...DEFAULT_HERO_BUTTONS });
  readonly typingLines = signal<HeroTypingLine[]>([...MOCK_HERO_TYPING_LINES]);
  readonly socialLinks = signal<HeroSocialLink[]>([...MOCK_HERO_SOCIAL_LINKS]);
  readonly sectionType = HERO_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  private loaded = false;

  readonly activeTypingLines = computed(() => sortByOrder(this.typingLines().filter(t => t.isActive)));
  readonly activeSocialLinks = computed(() => sortByOrder(this.socialLinks().filter(s => s.isActive)));
  readonly sortedTypingLines = computed(() => sortByOrder(this.typingLines()));
  readonly sortedSocialLinks = computed(() => sortByOrder(this.socialLinks()));

  readonly hasAnyContent = computed(() => {
    const s = this.section();
    const hasSectionText =
      !!s.greeting?.trim() ||
      !!s.nameText?.trim() ||
      !!s.nameAccent?.trim() ||
      !!s.description?.trim();
    return (
      hasSectionText ||
      this.activeTypingLines().length > 0 ||
      this.activeSocialLinks().length > 0 ||
      (this.avatar().isActive && !!this.avatar().imageUrl?.trim()) ||
      this.buttons().contactEnabled ||
      this.buttons().cvEnabled
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
        const data = JSON.parse(raw) as HeroSectionData;
        this.section.set(ensureHeroTypeSection(data.section ?? { ...DEFAULT_HERO_SECTION }));
        this.avatar.set(ensureHeroTypeAvatar(data.avatar ?? { ...DEFAULT_HERO_AVATAR }));
        this.buttons.set(ensureHeroTypeButtons(data.buttons ?? { ...DEFAULT_HERO_BUTTONS }));
        this.typingLines.set(
          normalizeSortOrder(data.typingLines ?? [...MOCK_HERO_TYPING_LINES]).map(ensureHeroTypeTypingLine),
        );
        this.socialLinks.set(
          normalizeSortOrder(data.socialLinks ?? [...MOCK_HERO_SOCIAL_LINKS]).map(ensureHeroTypeSocialLink),
        );
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
    this.section.set({ ...DEFAULT_HERO_SECTION });
    this.avatar.set({ ...DEFAULT_HERO_AVATAR });
    this.buttons.set({ ...DEFAULT_HERO_BUTTONS });
    this.typingLines.set([...MOCK_HERO_TYPING_LINES]);
    this.socialLinks.set([...MOCK_HERO_SOCIAL_LINKS]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;
    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: HeroSectionData = {
      type: HERO_SECTION_TYPE_CODE,
      section: this.section(),
      avatar: this.avatar(),
      buttons: this.buttons(),
      typingLines: this.typingLines(),
      socialLinks: this.socialLinks(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveSection(config: HeroSectionConfig, avatar: HeroAvatarConfig): void {
    this.section.set(ensureHeroTypeSection(config));
    this.avatar.set(ensureHeroTypeAvatar(avatar));
    this.persist();
  }

  saveButtons(config: HeroButtonsConfig): void {
    this.buttons.set(ensureHeroTypeButtons(config));
    this.persist();
  }

  addTypingLine(data: HeroTypingFormData): void {
    const items = this.typingLines();
    const item: HeroTypingLine = ensureHeroTypeTypingLine({
      id: generateId(),
      ...data,
      type: HERO_SECTION_TYPE_CODE,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.typingLines.set([...items, item]);
    this.persist();
  }

  updateTypingLine(id: string, data: HeroTypingFormData): void {
    this.typingLines.update(items =>
      items.map(t => (t.id === id ? ensureHeroTypeTypingLine({ ...t, ...data, type: HERO_SECTION_TYPE_CODE }) : t)),
    );
    this.persist();
  }

  deleteTypingLine(id: string): void {
    this.typingLines.update(items => items.filter(t => t.id !== id));
    this.persist();
  }

  setTypingLineStatus(id: string, isActive: boolean): void {
    this.typingLines.update(items => items.map(t => (t.id === id ? { ...t, isActive } : t)));
    this.persist();
  }

  addSocialLink(data: HeroSocialFormData): void {
    const items = this.socialLinks();
    const item: HeroSocialLink = ensureHeroTypeSocialLink({
      id: generateId(),
      ...data,
      type: HERO_SECTION_TYPE_CODE,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.socialLinks.set([...items, item]);
    this.persist();
  }

  updateSocialLink(id: string, data: HeroSocialFormData): void {
    this.socialLinks.update(items =>
      items.map(s => (s.id === id ? ensureHeroTypeSocialLink({ ...s, ...data, type: HERO_SECTION_TYPE_CODE }) : s)),
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

// ============================================================
// HERO SECTION STORE
// State quản lý section HERO — API backend
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, Observable, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  HeroSectionConfig,
  HeroAvatarConfig,
  HeroButtonsConfig,
  HeroSocialLink,
  HeroSocialFormData,
  HeroTypingLine,
  HeroTypingFormData,
  HERO_SECTION_TYPE_CODE,
} from '../models/hero-section.model';
import { HeroPublicAggregate, HeroSectionService } from '../services/hero-section.service';
import { PlatformService } from '../../../core/services/platform.service';

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

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index + 1 }));
}

function emptyHeroSection(): HeroSectionConfig {
  return { type: HERO_SECTION_TYPE_CODE, greeting: '', nameText: '', nameAccent: '', description: '', typingPrefix: '' };
}

function emptyHeroAvatar(): HeroAvatarConfig {
  return { type: HERO_SECTION_TYPE_CODE, imageUrl: '', alt: '', fallbackInitials: '', isActive: false };
}

function emptyHeroButtons(): HeroButtonsConfig {
  return {
    type: HERO_SECTION_TYPE_CODE,
    contactLabel: '',
    contactScrollTarget: '',
    contactVariant: 'outline',
    contactBorderBeam: 'cw',
    contactEnabled: false,
    cvLabel: '',
    cvUrl: '',
    cvVariant: 'glow',
    cvBorderBeam: 'contour',
    cvEnabled: false,
  };
}

@Injectable({ providedIn: 'root' })
export class HeroSectionStore {
  private readonly heroService = inject(HeroSectionService);
  private readonly platform = inject(PlatformService);

  readonly section = signal<HeroSectionConfig>(emptyHeroSection());
  readonly avatar = signal<HeroAvatarConfig>(emptyHeroAvatar());
  readonly buttons = signal<HeroButtonsConfig>(emptyHeroButtons());
  readonly typingLines = signal<HeroTypingLine[]>([]);
  readonly socialLinks = signal<HeroSocialLink[]>([]);
  readonly sectionType = HERO_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);

  private publicLoaded = false;
  private adminLoaded = false;

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

  /** Public Home — `GET /api/public/hero?type=1` */
  load(): void {
    if (this.publicLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.publicLoaded = true;
      return;
    }

    this.loading.set(true);
    this.heroService.getPublic().subscribe({
      next: response => {
        if (response.success && response.data) {
          this.applyAggregate(response.data);
          this.publicLoaded = true;
        }
        this.loading.set(false);
      },
      error: () => {
        this.applyEmptyState();
        this.loading.set(false);
      },
    });
  }

  /** Admin panel — parallel admin GET endpoints (Bearer JWT) */
  loadAdmin(): void {
    if (this.adminLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.adminLoaded = true;
      return;
    }

    this.loading.set(true);
    forkJoin({
      section: this.heroService.getSection(),
      avatar: this.heroService.getAvatar(),
      buttons: this.heroService.getButtons(),
      typingLines: this.heroService.getTypingLines(),
      socialLinks: this.heroService.getSocialLinks(),
    }).subscribe({
      next: ({ section, avatar, buttons, typingLines, socialLinks }) => {
        if (section.success && section.data) {
          this.section.set(ensureHeroTypeSection(section.data));
        }
        if (avatar.success && avatar.data) {
          this.avatar.set(ensureHeroTypeAvatar(avatar.data));
        }
        if (buttons.success && buttons.data) {
          this.buttons.set(ensureHeroTypeButtons(buttons.data));
        }
        if (typingLines.success && typingLines.data) {
          this.typingLines.set(normalizeSortOrder(typingLines.data).map(ensureHeroTypeTypingLine));
        }
        if (socialLinks.success && socialLinks.data) {
          this.socialLinks.set(normalizeSortOrder(socialLinks.data).map(ensureHeroTypeSocialLink));
        }
        this.adminLoaded = true;
        this.loading.set(false);
      },
      error: () => {
        this.applyEmptyState();
        this.loading.set(false);
      },
    });
  }

  saveSection(config: HeroSectionConfig, avatar: HeroAvatarConfig): Observable<void> {
    this.saving.set(true);
    const sectionPayload = ensureHeroTypeSection(config);
    const avatarPayload = ensureHeroTypeAvatar(avatar);

    return forkJoin({
      section: this.heroService.updateSection(sectionPayload),
      avatar: this.heroService.updateAvatar(avatarPayload),
    }).pipe(
      tap(({ section, avatar: avatarRes }) => {
        if (section.success && section.data) {
          this.section.set(ensureHeroTypeSection(section.data));
        }
        if (avatarRes.success && avatarRes.data) {
          this.avatar.set(ensureHeroTypeAvatar(avatarRes.data));
        }
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  saveButtons(config: HeroButtonsConfig): Observable<void> {
    this.saving.set(true);
    const payload = ensureHeroTypeButtons(config);

    return this.heroService.updateButtons(payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.buttons.set(ensureHeroTypeButtons(response.data));
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addTypingLine(data: HeroTypingFormData, isActive = true): Observable<void> {
    this.saving.set(true);
    return this.heroService.createTypingLine(data).pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Failed to create typing line' }));
        }
        if (!isActive) {
          return this.heroService.setTypingLineStatus(response.data.id, false);
        }
        return of(response);
      }),
      tap(response => {
        if (response.success && response.data) {
          this.upsertTypingLine(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  updateTypingLine(id: string, data: HeroTypingFormData, isActive: boolean): Observable<void> {
    this.saving.set(true);
    return this.heroService.updateTypingLine(id, data).pipe(
      switchMap(response => {
        if (!response.success) {
          return throwError(() => ({ message: response.message || 'Failed to update typing line' }));
        }
        return this.heroService.setTypingLineStatus(id, isActive);
      }),
      tap(response => {
        if (response.success && response.data) {
          this.upsertTypingLine(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  deleteTypingLine(id: string): Observable<void> {
    this.saving.set(true);
    return this.heroService.deleteTypingLine(id).pipe(
      tap(() => {
        this.typingLines.update(items => items.filter(t => t.id !== id));
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  setTypingLineStatus(id: string, isActive: boolean): Observable<void> {
    this.saving.set(true);
    return this.heroService.setTypingLineStatus(id, isActive).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.upsertTypingLine(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addSocialLink(data: HeroSocialFormData, isActive = true): Observable<void> {
    this.saving.set(true);
    return this.heroService.createSocialLink(data).pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Failed to create social link' }));
        }
        if (!isActive) {
          return this.heroService.setSocialLinkStatus(response.data.id, false);
        }
        return of(response);
      }),
      tap(response => {
        if (response.success && response.data) {
          this.upsertSocialLink(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  updateSocialLink(id: string, data: HeroSocialFormData, isActive: boolean): Observable<void> {
    this.saving.set(true);
    return this.heroService.updateSocialLink(id, data).pipe(
      switchMap(response => {
        if (!response.success) {
          return throwError(() => ({ message: response.message || 'Failed to update social link' }));
        }
        return this.heroService.setSocialLinkStatus(id, isActive);
      }),
      tap(response => {
        if (response.success && response.data) {
          this.upsertSocialLink(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  deleteSocialLink(id: string): Observable<void> {
    this.saving.set(true);
    return this.heroService.deleteSocialLink(id).pipe(
      tap(() => {
        this.socialLinks.update(items => items.filter(s => s.id !== id));
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  setSocialLinkStatus(id: string, isActive: boolean): Observable<void> {
    this.saving.set(true);
    return this.heroService.setSocialLinkStatus(id, isActive).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.upsertSocialLink(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private upsertTypingLine(item: HeroTypingLine): void {
    const normalized = ensureHeroTypeTypingLine(item);
    this.typingLines.update(items => {
      const exists = items.some(t => t.id === normalized.id);
      const next = exists
        ? items.map(t => (t.id === normalized.id ? normalized : t))
        : [...items, normalized];
      return sortByOrder(next);
    });
  }

  private upsertSocialLink(item: HeroSocialLink): void {
    const normalized = ensureHeroTypeSocialLink(item);
    this.socialLinks.update(items => {
      const exists = items.some(s => s.id === normalized.id);
      const next = exists
        ? items.map(s => (s.id === normalized.id ? normalized : s))
        : [...items, normalized];
      return sortByOrder(next);
    });
  }

  private applyAggregate(data: HeroPublicAggregate): void {
    if (data.section) this.section.set(ensureHeroTypeSection(data.section));
    if (data.avatar) this.avatar.set(ensureHeroTypeAvatar(data.avatar));
    if (data.buttons) this.buttons.set(ensureHeroTypeButtons(data.buttons));
    if (data.typingLines) {
      this.typingLines.set(normalizeSortOrder(data.typingLines).map(ensureHeroTypeTypingLine));
    }
    if (data.socialLinks) {
      this.socialLinks.set(normalizeSortOrder(data.socialLinks).map(ensureHeroTypeSocialLink));
    }
  }

  private applyEmptyState(): void {
    this.section.set(emptyHeroSection());
    this.avatar.set(emptyHeroAvatar());
    this.buttons.set(emptyHeroButtons());
    this.typingLines.set([]);
    this.socialLinks.set([]);
  }
}

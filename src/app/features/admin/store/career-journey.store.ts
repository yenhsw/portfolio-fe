// ============================================================
// CAREER JOURNEY STORE
// State quản lý section CAREER JOURNEY (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  CareerJourneySectionConfig,
  WorkExperience,
  WorkExperienceFormData,
  EXPERIENCE_SECTION_TYPE_CODE,
  DEFAULT_CAREER_JOURNEY_SECTION,
  MOCK_WORK_EXPERIENCES,
} from '../models/career-journey.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_career_journey_data';

interface CareerJourneyData {
  type: typeof EXPERIENCE_SECTION_TYPE_CODE;
  section: CareerJourneySectionConfig;
  experiences: WorkExperience[];
}

function ensureExperienceSection(config: CareerJourneySectionConfig): CareerJourneySectionConfig {
  return { ...config, type: EXPERIENCE_SECTION_TYPE_CODE };
}

function ensureWorkExperience(item: WorkExperience): WorkExperience {
  return { ...item, type: EXPERIENCE_SECTION_TYPE_CODE };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: item.sortOrder ?? index + 1,
  }));
}

function nextSortOrder(items: { sortOrder: number }[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map(i => i.sortOrder)) + 1;
}

@Injectable({ providedIn: 'root' })
export class CareerJourneyStore {
  private readonly platform = inject(PlatformService);

  readonly section = signal<CareerJourneySectionConfig>({ ...DEFAULT_CAREER_JOURNEY_SECTION });
  readonly experiences = signal<WorkExperience[]>([...MOCK_WORK_EXPERIENCES]);
  readonly sectionType = EXPERIENCE_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);
  private loaded = false;

  readonly activeExperiences = computed(() =>
    sortByOrder(this.experiences().filter(e => e.isActive))
  );

  readonly sortedExperiences = computed(() => sortByOrder(this.experiences()));

  readonly hasAnyContent = computed(() => {
    const s = this.section();
    const hasSectionText =
      !!s.sectionTag?.trim() ||
      !!s.titleAccent?.trim() ||
      !!s.titleText?.trim() ||
      !!s.subtitle?.trim();
    return hasSectionText || this.activeExperiences().length > 0;
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
        const data = JSON.parse(raw) as CareerJourneyData;
        this.section.set(ensureExperienceSection(data.section ?? { ...DEFAULT_CAREER_JOURNEY_SECTION }));
        this.experiences.set(
          normalizeSortOrder(data.experiences ?? [...MOCK_WORK_EXPERIENCES]).map(ensureWorkExperience)
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
    this.section.set({ ...DEFAULT_CAREER_JOURNEY_SECTION });
    this.experiences.set([...MOCK_WORK_EXPERIENCES]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;
    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: CareerJourneyData = {
      type: EXPERIENCE_SECTION_TYPE_CODE,
      section: this.section(),
      experiences: this.experiences(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveSection(config: CareerJourneySectionConfig): void {
    this.saving.set(true);
    this.section.set(ensureExperienceSection(config));
    this.persist();
    this.saving.set(false);
  }

  addExperience(data: WorkExperienceFormData): void {
    const items = this.experiences();
    const item: WorkExperience = ensureWorkExperience({
      id: generateId(),
      ...data,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.experiences.set([...items, item]);
    this.persist();
  }

  updateExperience(id: string, data: WorkExperienceFormData): void {
    this.experiences.update(items =>
      items.map(e =>
        e.id === id ? ensureWorkExperience({ ...e, ...data, type: EXPERIENCE_SECTION_TYPE_CODE }) : e
      )
    );
    this.persist();
  }

  deleteExperience(id: string): void {
    this.experiences.update(items => items.filter(e => e.id !== id));
    this.persist();
  }

  setExperienceStatus(id: string, isActive: boolean): void {
    this.experiences.update(items =>
      items.map(e => (e.id === id ? { ...e, isActive } : e))
    );
    this.persist();
  }
}

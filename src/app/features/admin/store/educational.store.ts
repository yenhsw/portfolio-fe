// ============================================================
// EDUCATIONAL STORE
// State quản lý section EDUCATIONAL (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  EducationalSectionConfig,
  EducationalHighlight,
  EducationalHighlightFormData,
  EducationRecord,
  EducationRecordFormData,
  EducationalCertificate,
  EducationalCertificateFormData,
  FutureGoal,
  FutureGoalFormData,
  EDUCATIONAL_SECTION_TYPE_CODE,
  DEFAULT_EDUCATIONAL_SECTION,
  MOCK_EDUCATIONAL_HIGHLIGHTS,
  MOCK_EDUCATION_RECORDS,
  MOCK_EDUCATIONAL_CERTIFICATES,
  MOCK_FUTURE_GOALS,
} from '../models/educational.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_educational_data';

interface EducationalData {
  type: typeof EDUCATIONAL_SECTION_TYPE_CODE;
  section: EducationalSectionConfig;
  highlights: EducationalHighlight[];
  timeline: EducationRecord[];
  certificates: EducationalCertificate[];
  futureGoals: FutureGoal[];
}

function ensureEducationalSection(config: EducationalSectionConfig): EducationalSectionConfig {
  return { ...config, type: EDUCATIONAL_SECTION_TYPE_CODE };
}

function ensureHighlight(item: EducationalHighlight): EducationalHighlight {
  return { ...item, type: EDUCATIONAL_SECTION_TYPE_CODE };
}

function ensureTimelineItem(item: EducationRecord): EducationRecord {
  return { ...item, type: EDUCATIONAL_SECTION_TYPE_CODE };
}

function ensureCertificate(item: EducationalCertificate): EducationalCertificate {
  return { ...item, type: EDUCATIONAL_SECTION_TYPE_CODE };
}

function ensureFutureGoal(item: FutureGoal): FutureGoal {
  return { ...item, type: EDUCATIONAL_SECTION_TYPE_CODE };
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
export class EducationalStore {
  private readonly platform = inject(PlatformService);

  readonly section = signal<EducationalSectionConfig>({ ...DEFAULT_EDUCATIONAL_SECTION });
  readonly highlights = signal<EducationalHighlight[]>([...MOCK_EDUCATIONAL_HIGHLIGHTS]);
  readonly timeline = signal<EducationRecord[]>([...MOCK_EDUCATION_RECORDS]);
  readonly certificates = signal<EducationalCertificate[]>([...MOCK_EDUCATIONAL_CERTIFICATES]);
  readonly futureGoals = signal<FutureGoal[]>([...MOCK_FUTURE_GOALS]);
  readonly sectionType = EDUCATIONAL_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);
  private loaded = false;

  readonly activeHighlights = computed(() =>
    sortByOrder(this.highlights().filter(h => h.isActive))
  );
  readonly activeTimeline = computed(() =>
    sortByOrder(this.timeline().filter(t => t.isActive))
  );
  readonly activeCertificates = computed(() =>
    sortByOrder(this.certificates().filter(c => c.isActive))
  );
  readonly activeFutureGoals = computed(() =>
    sortByOrder(this.futureGoals().filter(g => g.isActive))
  );

  readonly sortedHighlights = computed(() => sortByOrder(this.highlights()));
  readonly sortedTimeline = computed(() => sortByOrder(this.timeline()));
  readonly sortedCertificates = computed(() => sortByOrder(this.certificates()));
  readonly sortedFutureGoals = computed(() => sortByOrder(this.futureGoals()));

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
        const data = JSON.parse(raw) as EducationalData;
        this.section.set(ensureEducationalSection(data.section ?? { ...DEFAULT_EDUCATIONAL_SECTION }));
        this.highlights.set(normalizeSortOrder(data.highlights ?? [...MOCK_EDUCATIONAL_HIGHLIGHTS]).map(ensureHighlight));
        this.timeline.set(normalizeSortOrder(data.timeline ?? [...MOCK_EDUCATION_RECORDS]).map(ensureTimelineItem));
        this.certificates.set(normalizeSortOrder(data.certificates ?? [...MOCK_EDUCATIONAL_CERTIFICATES]).map(ensureCertificate));
        this.futureGoals.set(normalizeSortOrder(data.futureGoals ?? [...MOCK_FUTURE_GOALS]).map(ensureFutureGoal));
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
    this.section.set({ ...DEFAULT_EDUCATIONAL_SECTION });
    this.highlights.set([...MOCK_EDUCATIONAL_HIGHLIGHTS]);
    this.timeline.set([...MOCK_EDUCATION_RECORDS]);
    this.certificates.set([...MOCK_EDUCATIONAL_CERTIFICATES]);
    this.futureGoals.set([...MOCK_FUTURE_GOALS]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;

    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: EducationalData = {
      type: EDUCATIONAL_SECTION_TYPE_CODE,
      section: this.section(),
      highlights: this.highlights(),
      timeline: this.timeline(),
      certificates: this.certificates(),
      futureGoals: this.futureGoals(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveSection(config: EducationalSectionConfig): void {
    this.saving.set(true);
    this.section.set(ensureEducationalSection(config));
    this.persist();
    this.saving.set(false);
  }

  // --- Highlights ---
  addHighlight(data: EducationalHighlightFormData): void {
    const items = this.highlights();
    const item: EducationalHighlight = ensureHighlight({
      id: generateId(),
      ...data,
      type: EDUCATIONAL_SECTION_TYPE_CODE,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.highlights.set([...items, item]);
    this.persist();
  }

  updateHighlight(id: string, data: EducationalHighlightFormData): void {
    this.highlights.update(items =>
      items.map(h => (h.id === id ? ensureHighlight({ ...h, ...data, type: EDUCATIONAL_SECTION_TYPE_CODE }) : h))
    );
    this.persist();
  }

  deleteHighlight(id: string): void {
    this.highlights.update(items => items.filter(h => h.id !== id));
    this.persist();
  }

  toggleHighlightStatus(id: string): void {
    this.highlights.update(items =>
      items.map(h => (h.id === id ? { ...h, isActive: !h.isActive } : h))
    );
    this.persist();
  }

  setHighlightStatus(id: string, isActive: boolean): void {
    this.highlights.update(items =>
      items.map(h => (h.id === id ? { ...h, isActive } : h))
    );
    this.persist();
  }

  // --- Timeline ---
  addTimelineItem(data: EducationRecordFormData): void {
    const items = this.timeline();
    const item: EducationRecord = ensureTimelineItem({
      id: generateId(),
      ...data,
      type: EDUCATIONAL_SECTION_TYPE_CODE,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.timeline.set([...items, item]);
    this.persist();
  }

  updateTimelineItem(id: string, data: EducationRecordFormData): void {
    this.timeline.update(items =>
      items.map(t => (t.id === id ? ensureTimelineItem({ ...t, ...data, type: EDUCATIONAL_SECTION_TYPE_CODE }) : t))
    );
    this.persist();
  }

  deleteTimelineItem(id: string): void {
    this.timeline.update(items => items.filter(t => t.id !== id));
    this.persist();
  }

  toggleTimelineStatus(id: string): void {
    this.timeline.update(items =>
      items.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    this.persist();
  }

  setTimelineStatus(id: string, isActive: boolean): void {
    this.timeline.update(items =>
      items.map(t => (t.id === id ? { ...t, isActive } : t))
    );
    this.persist();
  }

  // --- Certificates ---
  addCertificate(data: EducationalCertificateFormData): void {
    const items = this.certificates();
    const item: EducationalCertificate = ensureCertificate({
      id: generateId(),
      ...data,
      type: EDUCATIONAL_SECTION_TYPE_CODE,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.certificates.set([...items, item]);
    this.persist();
  }

  updateCertificate(id: string, data: EducationalCertificateFormData): void {
    this.certificates.update(items =>
      items.map(c => (c.id === id ? ensureCertificate({ ...c, ...data, type: EDUCATIONAL_SECTION_TYPE_CODE }) : c))
    );
    this.persist();
  }

  deleteCertificate(id: string): void {
    this.certificates.update(items => items.filter(c => c.id !== id));
    this.persist();
  }

  toggleCertificateStatus(id: string): void {
    this.certificates.update(items =>
      items.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    this.persist();
  }

  setCertificateStatus(id: string, isActive: boolean): void {
    this.certificates.update(items =>
      items.map(c => (c.id === id ? { ...c, isActive } : c))
    );
    this.persist();
  }

  // --- Future Goals ---
  addFutureGoal(data: FutureGoalFormData): void {
    const items = this.futureGoals();
    const item: FutureGoal = ensureFutureGoal({
      id: generateId(),
      ...data,
      type: EDUCATIONAL_SECTION_TYPE_CODE,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.futureGoals.set([...items, item]);
    this.persist();
  }

  updateFutureGoal(id: string, data: FutureGoalFormData): void {
    this.futureGoals.update(items =>
      items.map(g => (g.id === id ? ensureFutureGoal({ ...g, ...data, type: EDUCATIONAL_SECTION_TYPE_CODE }) : g))
    );
    this.persist();
  }

  deleteFutureGoal(id: string): void {
    this.futureGoals.update(items => items.filter(g => g.id !== id));
    this.persist();
  }

  toggleFutureGoalStatus(id: string): void {
    this.futureGoals.update(items =>
      items.map(g => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
    this.persist();
  }

  setFutureGoalStatus(id: string, isActive: boolean): void {
    this.futureGoals.update(items =>
      items.map(g => (g.id === id ? { ...g, isActive } : g))
    );
    this.persist();
  }
}

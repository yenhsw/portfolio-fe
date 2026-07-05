// ============================================================
// EDUCATIONAL STORE
// State quản lý section EDUCATIONAL — API backend
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
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
} from '../models/educational.model';
import { EducationalPublicAggregate, EducationalService } from '../services/educational.service';
import { PlatformService } from '../../../core/services/platform.service';

function ensureSection(config: EducationalSectionConfig): EducationalSectionConfig {
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

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index + 1 }));
}

function emptyEducationalSection(): EducationalSectionConfig {
  return {
    type: EDUCATIONAL_SECTION_TYPE_CODE,
    sectionTag: '',
    titleAccent: '',
    titleText: '',
    subtitle: '',
    certificatesDividerText: '',
    certificatesSubTitle: '',
    futureGoalsDividerText: '',
    futureGoalsSubTitle: '',
  };
}

@Injectable({ providedIn: 'root' })
export class EducationalStore {
  private readonly educationalService = inject(EducationalService);
  private readonly platform = inject(PlatformService);

  readonly section = signal<EducationalSectionConfig>(emptyEducationalSection());
  readonly highlights = signal<EducationalHighlight[]>([]);
  readonly timeline = signal<EducationRecord[]>([]);
  readonly certificates = signal<EducationalCertificate[]>([]);
  readonly futureGoals = signal<FutureGoal[]>([]);
  readonly sectionType = EDUCATIONAL_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);

  private publicLoaded = false;
  private adminLoaded = false;

  readonly activeHighlights = computed(() => sortByOrder(this.highlights().filter(h => h.isActive)));
  readonly activeTimeline = computed(() => sortByOrder(this.timeline().filter(t => t.isActive)));
  readonly activeCertificates = computed(() => sortByOrder(this.certificates().filter(c => c.isActive)));
  readonly activeFutureGoals = computed(() => sortByOrder(this.futureGoals().filter(g => g.isActive)));

  readonly sortedHighlights = computed(() => sortByOrder(this.highlights()));
  readonly sortedTimeline = computed(() => sortByOrder(this.timeline()));
  readonly sortedCertificates = computed(() => sortByOrder(this.certificates()));
  readonly sortedFutureGoals = computed(() => sortByOrder(this.futureGoals()));

  /** Public Home — `GET /api/public/educational?type=1` */
  load(): void {
    if (this.publicLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.publicLoaded = true;
      return;
    }

    this.loading.set(true);
    this.educationalService.getPublic().subscribe({
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
  loadAdmin(): Observable<void> {
    if (this.adminLoaded) {
      return of(void 0);
    }

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.adminLoaded = true;
      return of(void 0);
    }

    this.loading.set(true);
    return forkJoin({
      section: this.educationalService.getSection(),
      highlights: this.educationalService.getHighlights(),
      timeline: this.educationalService.getTimeline(),
      certificates: this.educationalService.getCertificates(),
      futureGoals: this.educationalService.getFutureGoals(),
    }).pipe(
      tap(({ section, highlights, timeline, certificates, futureGoals }) => {
        if (section.success && section.data) {
          this.section.set(ensureSection(section.data));
        }
        if (highlights.success && highlights.data) {
          this.highlights.set(normalizeSortOrder(highlights.data).map(ensureHighlight));
        }
        if (timeline.success && timeline.data) {
          this.timeline.set(normalizeSortOrder(timeline.data).map(ensureTimelineItem));
        }
        if (certificates.success && certificates.data) {
          this.certificates.set(normalizeSortOrder(certificates.data).map(ensureCertificate));
        }
        if (futureGoals.success && futureGoals.data) {
          this.futureGoals.set(normalizeSortOrder(futureGoals.data).map(ensureFutureGoal));
        }
        this.adminLoaded = true;
      }),
      map(() => void 0),
      catchError(err => {
        this.applyEmptyState();
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  saveSection(config: EducationalSectionConfig): Observable<void> {
    this.saving.set(true);
    const payload = ensureSection(config);

    return this.educationalService.updateSection(payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.section.set(ensureSection(response.data));
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addHighlight(data: EducationalHighlightFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.educationalService.createHighlight(data),
      id => this.educationalService.setHighlightStatus(id, false),
      isActive,
      item => this.upsertHighlight(item)
    );
  }

  updateHighlight(id: string, data: EducationalHighlightFormData, isActive: boolean): Observable<void> {
    const current = this.highlights().find(h => h.id === id);
    return this.updateCollectionItem(
      this.educationalService.updateHighlight(id, data),
      () => this.educationalService.setHighlightStatus(id, isActive),
      item => this.upsertHighlight(item),
      current?.isActive,
      isActive
    );
  }

  deleteHighlight(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.educationalService.deleteHighlight(id),
      () => this.highlights.update(items => items.filter(h => h.id !== id))
    );
  }

  toggleHighlightStatus(id: string): Observable<void> {
    const item = this.highlights().find(h => h.id === id);
    return item ? this.setHighlightStatus(id, !item.isActive) : of(void 0);
  }

  setHighlightStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.educationalService.setHighlightStatus(id, isActive),
      item => this.upsertHighlight(item)
    );
  }

  addTimelineItem(data: EducationRecordFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.educationalService.createTimelineItem(data),
      id => this.educationalService.setTimelineStatus(id, false),
      isActive,
      item => this.upsertTimelineItem(item)
    );
  }

  updateTimelineItem(id: string, data: EducationRecordFormData, isActive: boolean): Observable<void> {
    const current = this.timeline().find(t => t.id === id);
    return this.updateCollectionItem(
      this.educationalService.updateTimelineItem(id, data),
      () => this.educationalService.setTimelineStatus(id, isActive),
      item => this.upsertTimelineItem(item),
      current?.isActive,
      isActive
    );
  }

  deleteTimelineItem(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.educationalService.deleteTimelineItem(id),
      () => this.timeline.update(items => items.filter(t => t.id !== id))
    );
  }

  toggleTimelineStatus(id: string): Observable<void> {
    const item = this.timeline().find(t => t.id === id);
    return item ? this.setTimelineStatus(id, !item.isActive) : of(void 0);
  }

  setTimelineStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.educationalService.setTimelineStatus(id, isActive),
      item => this.upsertTimelineItem(item)
    );
  }

  addCertificate(data: EducationalCertificateFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.educationalService.createCertificate(data),
      id => this.educationalService.setCertificateStatus(id, false),
      isActive,
      item => this.upsertCertificate(item)
    );
  }

  updateCertificate(id: string, data: EducationalCertificateFormData, isActive: boolean): Observable<void> {
    const current = this.certificates().find(c => c.id === id);
    return this.updateCollectionItem(
      this.educationalService.updateCertificate(id, data),
      () => this.educationalService.setCertificateStatus(id, isActive),
      item => this.upsertCertificate(item),
      current?.isActive,
      isActive
    );
  }

  deleteCertificate(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.educationalService.deleteCertificate(id),
      () => this.certificates.update(items => items.filter(c => c.id !== id))
    );
  }

  toggleCertificateStatus(id: string): Observable<void> {
    const item = this.certificates().find(c => c.id === id);
    return item ? this.setCertificateStatus(id, !item.isActive) : of(void 0);
  }

  setCertificateStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.educationalService.setCertificateStatus(id, isActive),
      item => this.upsertCertificate(item)
    );
  }

  addFutureGoal(data: FutureGoalFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.educationalService.createFutureGoal(data),
      id => this.educationalService.setFutureGoalStatus(id, false),
      isActive,
      item => this.upsertFutureGoal(item)
    );
  }

  updateFutureGoal(id: string, data: FutureGoalFormData, isActive: boolean): Observable<void> {
    const current = this.futureGoals().find(g => g.id === id);
    return this.updateCollectionItem(
      this.educationalService.updateFutureGoal(id, data),
      () => this.educationalService.setFutureGoalStatus(id, isActive),
      item => this.upsertFutureGoal(item),
      current?.isActive,
      isActive
    );
  }

  deleteFutureGoal(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.educationalService.deleteFutureGoal(id),
      () => this.futureGoals.update(items => items.filter(g => g.id !== id))
    );
  }

  toggleFutureGoalStatus(id: string): Observable<void> {
    const item = this.futureGoals().find(g => g.id === id);
    return item ? this.setFutureGoalStatus(id, !item.isActive) : of(void 0);
  }

  setFutureGoalStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.educationalService.setFutureGoalStatus(id, isActive),
      item => this.upsertFutureGoal(item)
    );
  }

  private createCollectionItem<T extends { id: string }>(
    create$: Observable<{ success: boolean; data?: T; message?: string }>,
    deactivate: (id: string) => Observable<{ success: boolean; data?: T; message?: string }>,
    isActive: boolean,
    upsert: (item: T) => void
  ): Observable<void> {
    this.saving.set(true);
    return create$.pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Create failed' }));
        }
        if (!isActive) {
          return deactivate(response.data.id);
        }
        return of(response);
      }),
      tap(response => {
        if (response.success && response.data) {
          upsert(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private updateCollectionItem<T extends { id: string; isActive: boolean }>(
    update$: Observable<{ success: boolean; data?: T; message?: string }>,
    patchStatus: () => Observable<{ success: boolean; data?: T; message?: string }>,
    upsert: (item: T) => void,
    currentIsActive?: boolean,
    nextIsActive?: boolean
  ): Observable<void> {
    this.saving.set(true);
    return update$.pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Update failed' }));
        }
        const statusChanged =
          currentIsActive === undefined || nextIsActive === undefined || currentIsActive !== nextIsActive;
        if (!statusChanged) {
          return of(response);
        }
        return patchStatus();
      }),
      tap(response => {
        if (response.success && response.data) {
          upsert(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private deleteCollectionItem(
    delete$: Observable<{ success: boolean; message?: string }>,
    removeLocal: () => void
  ): Observable<void> {
    this.saving.set(true);
    return delete$.pipe(
      tap(() => {
        removeLocal();
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private patchCollectionStatus<T extends { id: string }>(
    patch$: Observable<{ success: boolean; data?: T; message?: string }>,
    upsert: (item: T) => void
  ): Observable<void> {
    this.saving.set(true);
    return patch$.pipe(
      tap(response => {
        if (response.success && response.data) {
          upsert(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private upsertHighlight(item: EducationalHighlight): void {
    const normalized = ensureHighlight(item);
    this.highlights.update(items => this.upsertSorted(items, normalized));
  }

  private upsertTimelineItem(item: EducationRecord): void {
    const normalized = ensureTimelineItem(item);
    this.timeline.update(items => this.upsertSorted(items, normalized));
  }

  private upsertCertificate(item: EducationalCertificate): void {
    const normalized = ensureCertificate(item);
    this.certificates.update(items => this.upsertSorted(items, normalized));
  }

  private upsertFutureGoal(item: FutureGoal): void {
    const normalized = ensureFutureGoal(item);
    this.futureGoals.update(items => this.upsertSorted(items, normalized));
  }

  private upsertSorted<T extends { id: string; sortOrder: number }>(items: T[], item: T): T[] {
    const next = items.some(i => i.id === item.id)
      ? items.map(i => (i.id === item.id ? item : i))
      : [...items, item];
    return sortByOrder(next);
  }

  private applyAggregate(data: EducationalPublicAggregate): void {
    if (data.section) this.section.set(ensureSection(data.section));
    if (data.highlights) {
      this.highlights.set(normalizeSortOrder(data.highlights).map(ensureHighlight));
    }
    if (data.timeline) {
      this.timeline.set(normalizeSortOrder(data.timeline).map(ensureTimelineItem));
    }
    if (data.certificates) {
      this.certificates.set(normalizeSortOrder(data.certificates).map(ensureCertificate));
    }
    if (data.futureGoals) {
      this.futureGoals.set(normalizeSortOrder(data.futureGoals).map(ensureFutureGoal));
    }
  }

  private applyEmptyState(): void {
    this.section.set(emptyEducationalSection());
    this.highlights.set([]);
    this.timeline.set([]);
    this.certificates.set([]);
    this.futureGoals.set([]);
  }
}

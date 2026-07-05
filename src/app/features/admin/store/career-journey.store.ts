// ============================================================
// CAREER JOURNEY STORE
// State quản lý section EXPERIENCE — API backend
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  CareerJourneySectionConfig,
  WorkExperience,
  WorkExperienceFormData,
  EXPERIENCE_SECTION_TYPE_CODE,
} from '../models/career-journey.model';
import { ExperiencePublicAggregate, ExperienceService } from '../services/experience.service';
import { PlatformService } from '../../../core/services/platform.service';

function ensureExperienceSection(config: CareerJourneySectionConfig): CareerJourneySectionConfig {
  return { ...config, type: EXPERIENCE_SECTION_TYPE_CODE };
}

function ensureWorkExperience(item: Partial<WorkExperience> & Pick<WorkExperience, 'id'>): WorkExperience {
  return {
    ...item,
    type: EXPERIENCE_SECTION_TYPE_CODE,
    position: item.position ?? '',
    positionIcon: item.positionIcon ?? '💼',
    company: item.company ?? '',
    period: item.period ?? '',
    location: item.location ?? '',
    description: item.description ?? '',
    technologies: item.technologies ?? [],
    responsibilities: item.responsibilities ?? [],
    projects: item.projects ?? [],
    achievements: item.achievements ?? [],
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
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

function emptyCareerJourneySection(): CareerJourneySectionConfig {
  return { type: EXPERIENCE_SECTION_TYPE_CODE, sectionTag: '', titleAccent: '', titleText: '', subtitle: '' };
}

@Injectable({ providedIn: 'root' })
export class CareerJourneyStore {
  private readonly experienceService = inject(ExperienceService);
  private readonly platform = inject(PlatformService);

  readonly section = signal<CareerJourneySectionConfig>(emptyCareerJourneySection());
  readonly experiences = signal<WorkExperience[]>([]);
  readonly sectionType = EXPERIENCE_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);

  private publicLoaded = false;
  private adminLoaded = false;

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

  /** Public Home — `GET /api/public/experience?type=1` */
  load(): void {
    if (this.publicLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.publicLoaded = true;
      return;
    }

    this.loading.set(true);
    this.experienceService.getPublic().subscribe({
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

  /** Admin panel — `GET section` + `GET experiences` (Bearer JWT) */
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
      section: this.experienceService.getSection(),
      experiences: this.experienceService.getExperiences(),
    }).pipe(
      tap(({ section, experiences }) => {
        if (section.success && section.data) {
          this.section.set(ensureExperienceSection(section.data));
        }
        if (experiences.success && experiences.data) {
          this.experiences.set(
            normalizeSortOrder(experiences.data).map(item => ensureWorkExperience(item))
          );
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

  saveSection(config: CareerJourneySectionConfig): Observable<void> {
    this.saving.set(true);
    const payload = ensureExperienceSection(config);

    return this.experienceService.updateSection(payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.section.set(ensureExperienceSection(response.data));
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addExperience(data: WorkExperienceFormData, isActive = true): Observable<void> {
    this.saving.set(true);
    return this.experienceService.createExperience(data).pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Failed to create experience' }));
        }
        if (!isActive) {
          return this.experienceService.setExperienceStatus(response.data.id, false);
        }
        return of(response);
      }),
      tap(response => {
        if (response.success && response.data) {
          this.upsertExperience(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  updateExperience(id: string, data: WorkExperienceFormData, isActive: boolean): Observable<void> {
    const current = this.experiences().find(e => e.id === id);
    this.saving.set(true);

    return this.experienceService.updateExperience(id, data).pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Failed to update experience' }));
        }
        const statusChanged = current === undefined || current.isActive !== isActive;
        if (!statusChanged) {
          return of(response);
        }
        return this.experienceService.setExperienceStatus(id, isActive);
      }),
      tap(response => {
        if (response.success && response.data) {
          this.upsertExperience(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  deleteExperience(id: string): Observable<void> {
    this.saving.set(true);
    return this.experienceService.deleteExperience(id).pipe(
      tap(() => {
        this.experiences.update(items => items.filter(e => e.id !== id));
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  setExperienceStatus(id: string, isActive: boolean): Observable<void> {
    this.saving.set(true);
    return this.experienceService.setExperienceStatus(id, isActive).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.upsertExperience(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private upsertExperience(item: WorkExperience): void {
    const normalized = ensureWorkExperience(item);
    this.experiences.update(items => {
      const next = items.some(e => e.id === normalized.id)
        ? items.map(e => (e.id === normalized.id ? normalized : e))
        : [...items, normalized];
      return sortByOrder(next);
    });
  }

  private applyAggregate(data: ExperiencePublicAggregate): void {
    if (data.section) {
      this.section.set(ensureExperienceSection(data.section));
    }
    if (data.experiences) {
      this.experiences.set(
        normalizeSortOrder(data.experiences).map(item => ensureWorkExperience(item))
      );
    }
  }

  private applyEmptyState(): void {
    this.section.set(emptyCareerJourneySection());
    this.experiences.set([]);
  }
}

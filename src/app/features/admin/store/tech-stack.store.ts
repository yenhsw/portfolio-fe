// ============================================================
// TECH STACK STORE
// State quản lý section TECH STACK — API backend
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  TechStackSectionConfig,
  TechStackStatistic,
  TechStackStatisticFormData,
  TechStackCategory,
  TechStackCategoryFormData,
  TechStackSkill,
  TechStackSkillFormData,
  PublicSkillCategory,
  SKILLS_SECTION_TYPE_CODE,
} from '../models/tech-stack.model';
import { SkillsPublicAggregate, TechStackService } from '../services/tech-stack.service';
import { PlatformService } from '../../../core/services/platform.service';

function ensureSkillsSection(config: TechStackSectionConfig): TechStackSectionConfig {
  return { ...config, type: SKILLS_SECTION_TYPE_CODE };
}

function ensureStatistic(item: Partial<TechStackStatistic> & Pick<TechStackStatistic, 'id'>): TechStackStatistic {
  return {
    ...item,
    type: SKILLS_SECTION_TYPE_CODE,
    valueNumber: item.valueNumber ?? 0,
    valueSuffix: item.valueSuffix ?? '+',
    label: item.label ?? '',
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
}

function ensureCategory(item: Partial<TechStackCategory> & Pick<TechStackCategory, 'id'>): TechStackCategory {
  return {
    ...item,
    type: SKILLS_SECTION_TYPE_CODE,
    name: item.name ?? '',
    icon: item.icon ?? '🎨',
    color: item.color ?? '#00f5ff',
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
}

function ensureSkill(item: Partial<TechStackSkill> & Pick<TechStackSkill, 'id'>): TechStackSkill {
  return {
    ...item,
    type: SKILLS_SECTION_TYPE_CODE,
    categoryId: item.categoryId ?? '',
    name: item.name ?? '',
    logo: item.logo ?? '',
    level: item.level ?? 0,
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index + 1 }));
}

function emptyTechStackSection(): TechStackSectionConfig {
  return { type: SKILLS_SECTION_TYPE_CODE, sectionTag: '', titleAccent: '', titleText: '', subtitle: '' };
}

@Injectable({ providedIn: 'root' })
export class TechStackStore {
  private readonly techStackService = inject(TechStackService);
  private readonly platform = inject(PlatformService);

  readonly section = signal<TechStackSectionConfig>(emptyTechStackSection());
  readonly statistics = signal<TechStackStatistic[]>([]);
  readonly categories = signal<TechStackCategory[]>([]);
  readonly skills = signal<TechStackSkill[]>([]);
  readonly sectionType = SKILLS_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);

  private publicLoaded = false;
  private adminLoaded = false;

  readonly activeStatistics = computed(() =>
    sortByOrder(this.statistics().filter(s => s.isActive))
  );

  readonly activeCategories = computed(() =>
    sortByOrder(this.categories().filter(c => c.isActive))
  );

  readonly sortedStatistics = computed(() => sortByOrder(this.statistics()));
  readonly sortedCategories = computed(() => sortByOrder(this.categories()));
  readonly sortedSkills = computed(() => sortByOrder(this.skills()));

  readonly skillCategories = computed((): PublicSkillCategory[] => {
    const activeCats = this.activeCategories();
    const activeSkills = sortByOrder(this.skills().filter(s => s.isActive));

    return activeCats
      .map(cat => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        skills: activeSkills
          .filter(s => s.categoryId === cat.id)
          .map(s => ({
            name: s.name,
            level: s.level,
            icon: s.name.slice(0, 2),
            logo: s.logo,
          })),
      }))
      .filter(cat => cat.skills.length > 0);
  });

  readonly hasAnyContent = computed(() => {
    const s = this.section();
    const hasSectionText =
      !!s.sectionTag?.trim() ||
      !!s.titleAccent?.trim() ||
      !!s.titleText?.trim() ||
      !!s.subtitle?.trim();
    return hasSectionText || this.activeStatistics().length > 0 || this.skillCategories().length > 0;
  });

  /** Public Home — `GET /api/public/skills?type=1` */
  load(): void {
    if (this.publicLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.publicLoaded = true;
      return;
    }

    this.loading.set(true);
    this.techStackService.getPublic().subscribe({
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
      section: this.techStackService.getSection(),
      statistics: this.techStackService.getStatistics(),
      categories: this.techStackService.getCategories(),
      skills: this.techStackService.getSkills(),
    }).pipe(
      tap(({ section, statistics, categories, skills }) => {
        if (section.success && section.data) {
          this.section.set(ensureSkillsSection(section.data));
        }
        if (statistics.success && statistics.data) {
          this.statistics.set(normalizeSortOrder(statistics.data).map(item => ensureStatistic(item)));
        }
        if (categories.success && categories.data) {
          this.categories.set(normalizeSortOrder(categories.data).map(item => ensureCategory(item)));
        }
        if (skills.success && skills.data) {
          this.skills.set(normalizeSortOrder(skills.data).map(item => ensureSkill(item)));
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

  saveSection(config: TechStackSectionConfig): Observable<void> {
    this.saving.set(true);
    const payload = ensureSkillsSection(config);

    return this.techStackService.updateSection(payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.section.set(ensureSkillsSection(response.data));
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addStatistic(data: TechStackStatisticFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.techStackService.createStatistic(data),
      id => this.techStackService.setStatisticStatus(id, false),
      isActive,
      item => this.upsertStatistic(item)
    );
  }

  updateStatistic(id: string, data: TechStackStatisticFormData, isActive: boolean): Observable<void> {
    const current = this.statistics().find(s => s.id === id);
    return this.updateCollectionItem(
      this.techStackService.updateStatistic(id, data),
      () => this.techStackService.setStatisticStatus(id, isActive),
      item => this.upsertStatistic(item),
      current?.isActive,
      isActive
    );
  }

  deleteStatistic(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.techStackService.deleteStatistic(id),
      () => this.statistics.update(items => items.filter(s => s.id !== id))
    );
  }

  setStatisticStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.techStackService.setStatisticStatus(id, isActive),
      item => this.upsertStatistic(item)
    );
  }

  addCategory(data: TechStackCategoryFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.techStackService.createCategory(data),
      id => this.techStackService.setCategoryStatus(id, false),
      isActive,
      item => this.upsertCategory(item)
    );
  }

  updateCategory(id: string, data: TechStackCategoryFormData, isActive: boolean): Observable<void> {
    const current = this.categories().find(c => c.id === id);
    return this.updateCollectionItem(
      this.techStackService.updateCategory(id, data),
      () => this.techStackService.setCategoryStatus(id, isActive),
      item => this.upsertCategory(item),
      current?.isActive,
      isActive
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.techStackService.deleteCategory(id),
      () => {
        this.categories.update(items => items.filter(c => c.id !== id));
        this.skills.update(items => items.filter(s => s.categoryId !== id));
      }
    );
  }

  setCategoryStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.techStackService.setCategoryStatus(id, isActive),
      item => this.upsertCategory(item)
    );
  }

  addSkill(data: TechStackSkillFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.techStackService.createSkill(data),
      id => this.techStackService.setSkillStatus(id, false),
      isActive,
      item => this.upsertSkill(item)
    );
  }

  updateSkill(id: string, data: TechStackSkillFormData, isActive: boolean): Observable<void> {
    const current = this.skills().find(s => s.id === id);
    return this.updateCollectionItem(
      this.techStackService.updateSkill(id, data),
      () => this.techStackService.setSkillStatus(id, isActive),
      item => this.upsertSkill(item),
      current?.isActive,
      isActive
    );
  }

  deleteSkill(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.techStackService.deleteSkill(id),
      () => this.skills.update(items => items.filter(s => s.id !== id))
    );
  }

  setSkillStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.techStackService.setSkillStatus(id, isActive),
      item => this.upsertSkill(item)
    );
  }

  categoryName(id: string): string {
    return this.categories().find(c => c.id === id)?.name ?? id;
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

  private upsertStatistic(item: TechStackStatistic): void {
    this.statistics.update(items => this.upsertSorted(items, ensureStatistic(item)));
  }

  private upsertCategory(item: TechStackCategory): void {
    this.categories.update(items => this.upsertSorted(items, ensureCategory(item)));
  }

  private upsertSkill(item: TechStackSkill): void {
    this.skills.update(items => this.upsertSorted(items, ensureSkill(item)));
  }

  private upsertSorted<T extends { id: string; sortOrder: number }>(items: T[], item: T): T[] {
    const next = items.some(i => i.id === item.id)
      ? items.map(i => (i.id === item.id ? item : i))
      : [...items, item];
    return sortByOrder(next);
  }

  private applyAggregate(data: SkillsPublicAggregate): void {
    if (data.section) {
      this.section.set(ensureSkillsSection(data.section));
    }
    if (data.statistics) {
      this.statistics.set(normalizeSortOrder(data.statistics).map(item => ensureStatistic(item)));
    }
    if (data.categories) {
      const categories: TechStackCategory[] = [];
      const skills: TechStackSkill[] = [];

      for (const cat of normalizeSortOrder(data.categories)) {
        const { skills: nestedSkills, ...catData } = cat;
        categories.push(ensureCategory(catData));
        if (nestedSkills) {
          for (const skill of nestedSkills) {
            skills.push(ensureSkill({ ...skill, categoryId: cat.id }));
          }
        }
      }

      this.categories.set(categories);
      this.skills.set(sortByOrder(skills));
    }
  }

  private applyEmptyState(): void {
    this.section.set(emptyTechStackSection());
    this.statistics.set([]);
    this.categories.set([]);
    this.skills.set([]);
  }
}

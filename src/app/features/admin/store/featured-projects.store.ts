// ============================================================
// FEATURED PROJECTS STORE
// State quản lý section FEATURED PROJECTS — API backend
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  FeaturedProjectsSectionConfig,
  ProjectFilterItem,
  ProjectFilterFormData,
  FeaturedProject,
  FeaturedProjectFormData,
  PROJECTS_SECTION_TYPE_CODE,
} from '../models/featured-projects.model';
import { FeaturedProjectsService, ProjectsPublicAggregate } from '../services/featured-projects.service';
import { PlatformService } from '../../../core/services/platform.service';

function ensureProjectsSection(config: FeaturedProjectsSectionConfig): FeaturedProjectsSectionConfig {
  return { ...config, type: PROJECTS_SECTION_TYPE_CODE };
}

function ensureFilter(item: Partial<ProjectFilterItem> & Pick<ProjectFilterItem, 'id'>): ProjectFilterItem {
  return {
    ...item,
    type: PROJECTS_SECTION_TYPE_CODE,
    key: item.key ?? '',
    label: item.label ?? '',
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
}

function ensureProject(item: Partial<FeaturedProject> & Pick<FeaturedProject, 'id'>): FeaturedProject {
  return {
    ...item,
    type: PROJECTS_SECTION_TYPE_CODE,
    name: item.name ?? '',
    role: item.role ?? '',
    description: item.description ?? '',
    longDescription: item.longDescription ?? '',
    technologies: item.technologies ?? [],
    status: item.status ?? 'completed',
    isFeatured: item.isFeatured ?? false,
    isActive: item.isActive ?? true,
    image: item.image ?? '',
    demoUrl: item.demoUrl,
    githubUrl: item.githubUrl,
    statistics: item.statistics ?? [],
    startDate: item.startDate ?? '',
    endDate: item.endDate ?? '',
    responsibilities: item.responsibilities ?? [],
    features: item.features ?? [],
    achievements: item.achievements ?? [],
    teamSize: item.teamSize ?? 1,
    duration: item.duration ?? '',
    sortOrder: item.sortOrder ?? 1,
  };
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index + 1 }));
}

function emptyFeaturedProjectsSection(): FeaturedProjectsSectionConfig {
  return { type: PROJECTS_SECTION_TYPE_CODE, sectionTag: '', titleAccent: '', titleText: '', subtitle: '' };
}

@Injectable({ providedIn: 'root' })
export class FeaturedProjectsStore {
  private readonly projectsService = inject(FeaturedProjectsService);
  private readonly platform = inject(PlatformService);

  readonly section = signal<FeaturedProjectsSectionConfig>(emptyFeaturedProjectsSection());
  readonly filters = signal<ProjectFilterItem[]>([]);
  readonly projects = signal<FeaturedProject[]>([]);
  readonly sectionType = PROJECTS_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);

  private publicLoaded = false;
  private adminLoaded = false;

  readonly activeFilters = computed(() => sortByOrder(this.filters().filter(f => f.isActive)));
  readonly activeProjects = computed(() => sortByOrder(this.projects().filter(p => p.isActive)));
  readonly sortedFilters = computed(() => sortByOrder(this.filters()));
  readonly sortedProjects = computed(() => sortByOrder(this.projects()));

  readonly hasAnyContent = computed(() => {
    const s = this.section();
    const hasSectionText =
      !!s.sectionTag?.trim() ||
      !!s.titleAccent?.trim() ||
      !!s.titleText?.trim() ||
      !!s.subtitle?.trim();
    return hasSectionText || this.activeProjects().length > 0;
  });

  /** Public Home — `GET /api/public/projects?type=1` */
  load(): void {
    if (this.publicLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.publicLoaded = true;
      return;
    }

    this.loading.set(true);
    this.projectsService.getPublic().subscribe({
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
      section: this.projectsService.getSection(),
      filters: this.projectsService.getFilters(),
      projects: this.projectsService.getProjects(),
    }).pipe(
      tap(({ section, filters, projects }) => {
        if (section.success && section.data) {
          this.section.set(ensureProjectsSection(section.data));
        }
        if (filters.success && filters.data) {
          this.filters.set(normalizeSortOrder(filters.data).map(item => ensureFilter(item)));
        }
        if (projects.success && projects.data) {
          this.projects.set(normalizeSortOrder(projects.data).map(item => ensureProject(item)));
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

  saveSection(config: FeaturedProjectsSectionConfig): Observable<void> {
    this.saving.set(true);
    const payload = ensureProjectsSection(config);

    return this.projectsService.updateSection(payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.section.set(ensureProjectsSection(response.data));
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addFilter(data: ProjectFilterFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.projectsService.createFilter(data),
      id => this.projectsService.setFilterStatus(id, false),
      isActive,
      item => this.upsertFilter(item)
    );
  }

  updateFilter(id: string, data: ProjectFilterFormData, isActive: boolean): Observable<void> {
    const current = this.filters().find(f => f.id === id);
    return this.updateCollectionItem(
      this.projectsService.updateFilter(id, data),
      () => this.projectsService.setFilterStatus(id, isActive),
      item => this.upsertFilter(item),
      current?.isActive,
      isActive
    );
  }

  deleteFilter(id: string): Observable<void> {
    const filter = this.filters().find(f => f.id === id);
    if (filter?.key === 'all') {
      return throwError(() => ({ message: 'Cannot delete the "All" filter.' }));
    }

    return this.deleteCollectionItem(
      this.projectsService.deleteFilter(id),
      () => this.filters.update(items => items.filter(f => f.id !== id))
    );
  }

  setFilterStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.projectsService.setFilterStatus(id, isActive),
      item => this.upsertFilter(item)
    );
  }

  addProject(data: FeaturedProjectFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.projectsService.createProject(data),
      id => this.projectsService.setProjectStatus(id, false),
      isActive,
      item => this.upsertProject(item)
    );
  }

  updateProject(id: string, data: FeaturedProjectFormData, isActive: boolean): Observable<void> {
    const current = this.projects().find(p => p.id === id);
    return this.updateCollectionItem(
      this.projectsService.updateProject(id, data),
      () => this.projectsService.setProjectStatus(id, isActive),
      item => this.upsertProject(item),
      current?.isActive,
      isActive
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.projectsService.deleteProject(id),
      () => this.projects.update(items => items.filter(p => p.id !== id))
    );
  }

  setProjectStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.projectsService.setProjectStatus(id, isActive),
      item => this.upsertProject(item)
    );
  }

  setProjectFeatured(id: string, isFeatured: boolean): Observable<void> {
    this.saving.set(true);
    return this.projectsService.setProjectFeatured(id, isFeatured).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.upsertProject(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  filterProjects(filterKey: string): FeaturedProject[] {
    const active = this.activeProjects();
    if (filterKey === 'all') return active;
    return active.filter(project =>
      project.technologies.some(tech => tech.name.toLowerCase().includes(filterKey.toLowerCase()))
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

  private upsertFilter(item: ProjectFilterItem): void {
    this.filters.update(items => this.upsertSorted(items, ensureFilter(item)));
  }

  private upsertProject(item: FeaturedProject): void {
    this.projects.update(items => this.upsertSorted(items, ensureProject(item)));
  }

  private upsertSorted<T extends { id: string; sortOrder: number }>(items: T[], item: T): T[] {
    const next = items.some(i => i.id === item.id)
      ? items.map(i => (i.id === item.id ? item : i))
      : [...items, item];
    return sortByOrder(next);
  }

  private applyAggregate(data: ProjectsPublicAggregate): void {
    if (data.section) {
      this.section.set(ensureProjectsSection(data.section));
    }
    if (data.filters) {
      this.filters.set(normalizeSortOrder(data.filters).map(item => ensureFilter(item)));
    }
    if (data.projects) {
      this.projects.set(normalizeSortOrder(data.projects).map(item => ensureProject(item)));
    }
  }

  private applyEmptyState(): void {
    this.section.set(emptyFeaturedProjectsSection());
    this.filters.set([]);
    this.projects.set([]);
  }
}

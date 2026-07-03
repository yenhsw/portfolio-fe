// ============================================================
// FEATURED PROJECTS STORE
// State quản lý section FEATURED PROJECTS (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  FeaturedProjectsSectionConfig,
  ProjectFilterItem,
  ProjectFilterFormData,
  FeaturedProject,
  FeaturedProjectFormData,
  PROJECTS_SECTION_TYPE_CODE,
  DEFAULT_FEATURED_PROJECTS_SECTION,
  MOCK_PROJECT_FILTERS,
  MOCK_FEATURED_PROJECTS,
} from '../models/featured-projects.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_featured_projects_data';

interface FeaturedProjectsData {
  type: typeof PROJECTS_SECTION_TYPE_CODE;
  section: FeaturedProjectsSectionConfig;
  filters: ProjectFilterItem[];
  projects: FeaturedProject[];
}

function ensureProjectsSection(config: FeaturedProjectsSectionConfig): FeaturedProjectsSectionConfig {
  return { ...config, type: PROJECTS_SECTION_TYPE_CODE };
}

function ensureFilter(item: ProjectFilterItem): ProjectFilterItem {
  return { ...item, type: PROJECTS_SECTION_TYPE_CODE };
}

function ensureProject(item: FeaturedProject): FeaturedProject {
  return { ...item, type: PROJECTS_SECTION_TYPE_CODE };
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
export class FeaturedProjectsStore {
  private readonly platform = inject(PlatformService);

  readonly section = signal<FeaturedProjectsSectionConfig>({ ...DEFAULT_FEATURED_PROJECTS_SECTION });
  readonly filters = signal<ProjectFilterItem[]>([...MOCK_PROJECT_FILTERS]);
  readonly projects = signal<FeaturedProject[]>([...MOCK_FEATURED_PROJECTS]);
  readonly sectionType = PROJECTS_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  private loaded = false;

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
        const data = JSON.parse(raw) as FeaturedProjectsData;
        this.section.set(ensureProjectsSection(data.section ?? { ...DEFAULT_FEATURED_PROJECTS_SECTION }));
        this.filters.set(normalizeSortOrder(data.filters ?? [...MOCK_PROJECT_FILTERS]).map(ensureFilter));
        this.projects.set(normalizeSortOrder(data.projects ?? [...MOCK_FEATURED_PROJECTS]).map(ensureProject));
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
    this.section.set({ ...DEFAULT_FEATURED_PROJECTS_SECTION });
    this.filters.set([...MOCK_PROJECT_FILTERS]);
    this.projects.set([...MOCK_FEATURED_PROJECTS]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;
    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: FeaturedProjectsData = {
      type: PROJECTS_SECTION_TYPE_CODE,
      section: this.section(),
      filters: this.filters(),
      projects: this.projects(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveSection(config: FeaturedProjectsSectionConfig): void {
    this.section.set(ensureProjectsSection(config));
    this.persist();
  }

  addFilter(data: ProjectFilterFormData): void {
    const items = this.filters();
    const item: ProjectFilterItem = ensureFilter({
      id: generateId(),
      ...data,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.filters.set([...items, item]);
    this.persist();
  }

  updateFilter(id: string, data: ProjectFilterFormData): void {
    this.filters.update(items =>
      items.map(f =>
        f.id === id ? ensureFilter({ ...f, ...data, type: PROJECTS_SECTION_TYPE_CODE }) : f
      )
    );
    this.persist();
  }

  deleteFilter(id: string): void {
    if (id === 'all') return;
    this.filters.update(items => items.filter(f => f.id !== id));
    this.persist();
  }

  setFilterStatus(id: string, isActive: boolean): void {
    this.filters.update(items => items.map(f => (f.id === id ? { ...f, isActive } : f)));
    this.persist();
  }

  addProject(data: FeaturedProjectFormData): void {
    const items = this.projects();
    const item: FeaturedProject = ensureProject({
      id: generateId(),
      ...data,
      demoUrl: data.demoUrl || undefined,
      githubUrl: data.githubUrl || undefined,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.projects.set([...items, item]);
    this.persist();
  }

  updateProject(id: string, data: FeaturedProjectFormData): void {
    this.projects.update(items =>
      items.map(p =>
        p.id === id
          ? ensureProject({
              ...p,
              ...data,
              demoUrl: data.demoUrl || undefined,
              githubUrl: data.githubUrl || undefined,
              type: PROJECTS_SECTION_TYPE_CODE,
            })
          : p
      )
    );
    this.persist();
  }

  deleteProject(id: string): void {
    this.projects.update(items => items.filter(p => p.id !== id));
    this.persist();
  }

  setProjectStatus(id: string, isActive: boolean): void {
    this.projects.update(items => items.map(p => (p.id === id ? { ...p, isActive } : p)));
    this.persist();
  }

  setProjectFeatured(id: string, isFeatured: boolean): void {
    this.projects.update(items => items.map(p => (p.id === id ? { ...p, isFeatured } : p)));
    this.persist();
  }

  filterProjects(filterKey: string): FeaturedProject[] {
    const active = this.activeProjects();
    if (filterKey === 'all') return active;
    return active.filter(project =>
      project.technologies.some(tech => tech.name.toLowerCase().includes(filterKey.toLowerCase()))
    );
  }
}

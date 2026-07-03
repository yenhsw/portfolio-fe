// ============================================================
// PROJECT STORE
// Signal-based state management for projects
// ============================================================

import { Injectable, computed, signal } from '@angular/core';
import {
  Project,
  ProjectCategory,
  ProjectFilter,
  ProjectListResponse,
  ProjectStatus,
} from '../shared/models';

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  featuredProjects: Project[];
  filter: ProjectFilter;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProjectStore {
  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _projects = signal<Project[]>([]);
  private readonly _selectedProject = signal<Project | null>(null);
  private readonly _featuredProjects = signal<Project[]>([]);
  private readonly _filter = signal<ProjectFilter>({});
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _pagination = signal({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // ============================================================
  // COMPUTED
  // ============================================================

  readonly projects = this._projects.asReadonly();
  readonly selectedProject = this._selectedProject.asReadonly();
  readonly featuredProjects = this._featuredProjects.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  readonly projectCount = computed(() => this._projects().length);
  readonly hasProjects = computed(() => this._projects().length > 0);
  readonly hasSelectedProject = computed(
    () => this._selectedProject() !== null
  );

  readonly projectsByCategory = computed(() => {
    const projects = this._projects();
    const grouped = new Map<ProjectCategory, Project[]>();

    projects.forEach((project) => {
      const existing = grouped.get(project.category) ?? [];
      grouped.set(project.category, [...existing, project]);
    });

    return grouped;
  });

  readonly filteredProjects = computed(() => {
    const projects = this._projects();
    const filter = this._filter();

    return projects.filter((project) => {
      if (filter.category && project.category !== filter.category) return false;
      if (filter.status && project.status !== filter.status) return false;
      if (filter.featured !== undefined && project.featured !== filter.featured)
        return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  });

  // ============================================================
  // ACTIONS
  // ============================================================

  setProjects(projects: Project[]): void {
    this._projects.set(projects);
  }

  setSelectedProject(project: Project | null): void {
    this._selectedProject.set(project);
  }

  setFeaturedProjects(projects: Project[]): void {
    this._featuredProjects.set(projects);
  }

  setFilter(filter: ProjectFilter): void {
    this._filter.set(filter);
  }

  updateFilter(partial: Partial<ProjectFilter>): void {
    this._filter.update((current) => ({ ...current, ...partial }));
  }

  clearFilter(): void {
    this._filter.set({});
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  setPagination(pagination: Partial<ProjectState['pagination']>): void {
    this._pagination.update((current) => ({ ...current, ...pagination }));
  }

  clearProjects(): void {
    this._projects.set([]);
    this._selectedProject.set(null);
    this._pagination.set({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }

  reset(): void {
    this._projects.set([]);
    this._selectedProject.set(null);
    this._featuredProjects.set([]);
    this._filter.set({});
    this._loading.set(false);
    this._error.set(null);
    this._pagination.set({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }

  // ============================================================
  // SELECTORS
  // ============================================================

  selectProjectById(id: string): Project | undefined {
    return this._projects().find((p) => p.id === id);
  }

  selectProjectsByCategory(category: ProjectCategory): Project[] {
    return this._projects().filter((p) => p.category === category);
  }

  selectProjectsByStatus(status: ProjectStatus): Project[] {
    return this._projects().filter((p) => p.status === status);
  }
}

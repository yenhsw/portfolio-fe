// ============================================================
// PROJECT STORE
// Project Management State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectFormData, ProjectCategory, ProjectFeature, TeamMember, MOCK_PROJECTS, PROJECT_CATEGORIES } from '../models/project.model';

export interface ProjectState {
  projects: Project[];
  categories: ProjectCategory[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedProject: Project | null;
  searchQuery: string;
  filterCategory: string;
  filterStatus: string;
  filterTechnology: string;
  filterFeatured: boolean | null;
  filterYear: number | null;
  selectedIds: Set<string>;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectStore {
  // State
  readonly projects = signal<Project[]>([]);
  readonly categories = signal<ProjectCategory[]>(PROJECT_CATEGORIES);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedProject = signal<Project | null>(null);
  readonly searchQuery = signal('');
  readonly filterCategory = signal('');
  readonly filterStatus = signal('');
  readonly filterTechnology = signal('');
  readonly filterFeatured = signal<boolean | null>(null);
  readonly filterYear = signal<number | null>(null);
  readonly selectedIds = signal<Set<string>>(new Set());

  // Computed
  readonly filteredProjects = computed(() => {
    let result = [...this.projects()];
    const query = this.searchQuery().toLowerCase();
    const category = this.filterCategory();
    const status = this.filterStatus();
    const technology = this.filterTechnology();
    const featured = this.filterFeatured();
    const year = this.filterYear();

    // Search filter
    if (query) {
      result = result.filter(proj =>
        proj.name.toLowerCase().includes(query) ||
        proj.shortDescription.toLowerCase().includes(query) ||
        proj.technologies.some(t => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (category) {
      result = result.filter(proj => proj.categoryId === category);
    }

    // Status filter
    if (status) {
      result = result.filter(proj => proj.status === status);
    }

    // Technology filter
    if (technology) {
      result = result.filter(proj =>
        proj.technologies.some(t => t.toLowerCase().includes(technology.toLowerCase()))
      );
    }

    // Featured filter
    if (featured !== null) {
      result = result.filter(proj => proj.isFeatured === featured);
    }

    // Year filter
    if (year !== null) {
      result = result.filter(proj => {
        const startYear = new Date(proj.startDate).getFullYear();
        return startYear === year;
      });
    }

    // Sort by sortOrder
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  });

  readonly featuredProjects = computed(() => {
    return this.projects()
      .filter(p => p.isFeatured && p.status !== 'archived')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  readonly publishedProjects = computed(() => {
    return this.filteredProjects()
      .filter(p => p.status === 'published' || p.status === 'completed');
  });

  readonly years = computed(() => {
    const yearsSet = new Set<number>();
    this.projects().forEach(proj => {
      yearsSet.add(new Date(proj.startDate).getFullYear());
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  });

  readonly hasSelectedItems = computed(() => this.selectedIds().size > 0);
  readonly selectedCount = computed(() => this.selectedIds().size);

  // Actions
  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      this.projects.set([...MOCK_PROJECTS]);
      this.loading.set(false);
    }, 500);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects().find(p => p.id === id);
  }

  createProject(data: ProjectFormData): Project {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      ...data,
      sortOrder: this.projects().length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.update(projs => [...projs, newProject]);
    return newProject;
  }

  updateProject(id: string, data: Partial<ProjectFormData>): boolean {
    const index = this.projects().findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.update(projs => {
      const updated = [...projs];
      updated[index] = {
        ...updated[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });

    return true;
  }

  deleteProject(id: string): boolean {
    const index = this.projects().findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.update(projs => projs.filter(p => p.id !== id));
    return true;
  }

  deleteProjects(ids: string[]): void {
    this.projects.update(projs => projs.filter(p => !ids.includes(p.id)));
    this.selectedIds.set(new Set());
  }

  duplicateProject(id: string): Project | null {
    const proj = this.getProjectById(id);
    if (!proj) return null;

    const duplicated: Project = {
      ...proj,
      id: `proj_${Date.now()}`,
      name: `${proj.name} (Copy)`,
      slug: `${proj.slug}-copy`,
      status: 'draft',
      isFeatured: false,
      sortOrder: this.projects().length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.update(projs => [...projs, duplicated]);
    return duplicated;
  }

  toggleFeatured(id: string): void {
    this.projects.update(projs =>
      projs.map(p =>
        p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
      )
    );
  }

  publishProject(id: string): void {
    this.projects.update(projs =>
      projs.map(p =>
        p.id === id ? { ...p, status: 'published', updatedAt: new Date().toISOString() } : p
      )
    );
  }

  unpublishProject(id: string): void {
    this.projects.update(projs =>
      projs.map(p =>
        p.id === id ? { ...p, status: 'draft', updatedAt: new Date().toISOString() } : p
      )
    );
  }

  bulkPublish(ids: string[]): void {
    this.projects.update(projs =>
      projs.map(p =>
        ids.includes(p.id) ? { ...p, status: 'published', updatedAt: new Date().toISOString() } : p
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkUnpublish(ids: string[]): void {
    this.projects.update(projs =>
      projs.map(p =>
        ids.includes(p.id) ? { ...p, status: 'draft', updatedAt: new Date().toISOString() } : p
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkToggleFeatured(ids: string[], featured: boolean): void {
    this.projects.update(projs =>
      projs.map(p =>
        ids.includes(p.id) ? { ...p, isFeatured: featured } : p
      )
    );
  }

  bulkChangeCategory(ids: string[], categoryId: string): void {
    this.projects.update(projs =>
      projs.map(p =>
        ids.includes(p.id) ? { ...p, categoryId, updatedAt: new Date().toISOString() } : p
      )
    );
  }

  reorderProjects(orderedIds: string[]): void {
    this.projects.update(projs => {
      return projs.map(proj => {
        const newOrder = orderedIds.indexOf(proj.id);
        if (newOrder !== -1) {
          return { ...proj, sortOrder: newOrder + 1 };
        }
        return proj;
      });
    });
  }

  reorderFeaturedProjects(orderedIds: string[]): void {
    this.projects.update(projs => {
      return projs.map(proj => {
        if (proj.isFeatured) {
          const newOrder = orderedIds.indexOf(proj.id);
          if (newOrder !== -1) {
            return { ...proj, sortOrder: newOrder + 1 };
          }
        }
        return proj;
      });
    });
  }

  // Filters
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilterCategory(category: string): void {
    this.filterCategory.set(category);
  }

  setFilterStatus(status: string): void {
    this.filterStatus.set(status);
  }

  setFilterTechnology(technology: string): void {
    this.filterTechnology.set(technology);
  }

  setFilterFeatured(featured: boolean | null): void {
    this.filterFeatured.set(featured);
  }

  setFilterYear(year: number | null): void {
    this.filterYear.set(year);
  }

  // Selection
  toggleSelection(id: string): void {
    this.selectedIds.update(ids => {
      const newSet = new Set(ids);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  selectAll(): void {
    const allIds = this.filteredProjects().map(p => p.id);
    this.selectedIds.set(new Set(allIds));
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  toggleSelectAll(): void {
    if (this.hasSelectedItems()) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }

  // Category management
  addCategory(name: string, icon: string): ProjectCategory {
    const newCategory: ProjectCategory = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      icon,
    };

    this.categories.update(cats => [...cats, newCategory]);
    return newCategory;
  }

  // Feature management
  addFeature(projectId: string, feature: Omit<ProjectFeature, 'id'>): void {
    const index = this.projects().findIndex(p => p.id === projectId);
    if (index === -1) return;

    const newFeature: ProjectFeature = {
      id: `feat_${Date.now()}`,
      ...feature,
    };

    this.projects.update(projs => {
      const updated = [...projs];
      updated[index] = {
        ...updated[index],
        features: [...updated[index].features, newFeature],
      };
      return updated;
    });
  }

  updateFeature(projectId: string, featureId: string, data: Partial<ProjectFeature>): void {
    const projIndex = this.projects().findIndex(p => p.id === projectId);
    if (projIndex === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      const features = updated[projIndex].features.map(f =>
        f.id === featureId ? { ...f, ...data } : f
      );
      updated[projIndex] = { ...updated[projIndex], features };
      return updated;
    });
  }

  deleteFeature(projectId: string, featureId: string): void {
    const projIndex = this.projects().findIndex(p => p.id === projectId);
    if (projIndex === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      updated[projIndex] = {
        ...updated[projIndex],
        features: updated[projIndex].features.filter(f => f.id !== featureId),
      };
      return updated;
    });
  }

  reorderFeatures(projectId: string, orderedIds: string[]): void {
    const projIndex = this.projects().findIndex(p => p.id === projectId);
    if (projIndex === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      const features = orderedIds
        .map(id => updated[projIndex].features.find(f => f.id === id))
        .filter((f): f is ProjectFeature => f !== undefined);
      updated[projIndex] = { ...updated[projIndex], features };
      return updated;
    });
  }

  // Team management
  addTeamMember(projectId: string, member: Omit<TeamMember, 'id'>): void {
    const index = this.projects().findIndex(p => p.id === projectId);
    if (index === -1) return;

    const newMember: TeamMember = {
      id: `team_${Date.now()}`,
      ...member,
    };

    this.projects.update(projs => {
      const updated = [...projs];
      updated[index] = {
        ...updated[index],
        team: [...updated[index].team, newMember],
      };
      return updated;
    });
  }

  updateTeamMember(projectId: string, memberId: string, data: Partial<TeamMember>): void {
    const projIndex = this.projects().findIndex(p => p.id === projectId);
    if (projIndex === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      const team = updated[projIndex].team.map(m =>
        m.id === memberId ? { ...m, ...data } : m
      );
      updated[projIndex] = { ...updated[projIndex], team };
      return updated;
    });
  }

  deleteTeamMember(projectId: string, memberId: string): void {
    const projIndex = this.projects().findIndex(p => p.id === projectId);
    if (projIndex === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      updated[projIndex] = {
        ...updated[projIndex],
        team: updated[projIndex].team.filter(m => m.id !== memberId),
      };
      return updated;
    });
  }

  // Gallery management
  addGalleryImage(projectId: string, imageUrl: string): void {
    const index = this.projects().findIndex(p => p.id === projectId);
    if (index === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      updated[index] = {
        ...updated[index],
        gallery: [...updated[index].gallery, imageUrl],
      };
      return updated;
    });
  }

  removeGalleryImage(projectId: string, imageUrl: string): void {
    const index = this.projects().findIndex(p => p.id === projectId);
    if (index === -1) return;

    this.projects.update(projs => {
      const updated = [...projs];
      updated[index] = {
        ...updated[index],
        gallery: updated[index].gallery.filter(img => img !== imageUrl),
      };
      return updated;
    });
  }

  // Export/Import
  exportProjects(): string {
    return JSON.stringify({
      projects: this.projects(),
      categories: this.categories(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importProjects(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects && Array.isArray(data.projects)) {
        this.projects.set(data.projects);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.categories.update(existing => {
          const existingIds = new Set(existing.map(c => c.id));
          const newCategories = data.categories.filter((c: ProjectCategory) => !existingIds.has(c.id));
          return [...existing, ...newCategories];
        });
      }
      return true;
    } catch {
      this.error.set('Invalid JSON format');
      return false;
    }
  }

  // Utilities
  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  getStatusLabel(status: string): string {
    const found = this.getStatusConfig(status);
    return found?.label || status;
  }

  getStatusColor(status: string): string {
    const found = this.getStatusConfig(status);
    return found?.color || '#64748B';
  }

  private getStatusConfig(status: string): { value: string; label: string; color: string } | undefined {
    const configs: Record<string, { value: string; label: string; color: string }> = {
      'draft': { value: 'draft', label: 'Draft', color: '#64748B' },
      'published': { value: 'published', label: 'Published', color: '#10B981' },
      'private': { value: 'private', label: 'Private', color: '#6366F1' },
      'archived': { value: 'archived', label: 'Archived', color: '#78716C' },
      'completed': { value: 'completed', label: 'Completed', color: '#06B6D4' },
      'in-progress': { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
    };
    return configs[status];
  }

  clearError(): void {
    this.error.set(null);
  }

  reset(): void {
    this.searchQuery.set('');
    this.filterCategory.set('');
    this.filterStatus.set('');
    this.filterTechnology.set('');
    this.filterFeatured.set(null);
    this.filterYear.set(null);
    this.selectedIds.set(new Set());
    this.error.set(null);
  }
}

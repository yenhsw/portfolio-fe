// ============================================================
// EXPERIENCE STORE
// Experience Management State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { Experience, ExperienceFormData, Project, Achievement, MOCK_EXPERIENCES } from '../models/experience.model';

export interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedExperience: Experience | null;
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'inactive';
  filterEmploymentType: string;
  filterYear: number | null;
  filterCurrent: boolean | null;
  selectedIds: Set<string>;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceStore {
  // State
  readonly experiences = signal<Experience[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedExperience = signal<Experience | null>(null);
  readonly searchQuery = signal('');
  readonly filterStatus = signal<'all' | 'active' | 'inactive'>('all');
  readonly filterEmploymentType = signal('');
  readonly filterYear = signal<number | null>(null);
  readonly filterCurrent = signal<boolean | null>(null);
  readonly selectedIds = signal<Set<string>>(new Set());

  // Computed
  readonly filteredExperiences = computed(() => {
    let result = [...this.experiences()];
    const query = this.searchQuery().toLowerCase();
    const status = this.filterStatus();
    const employmentType = this.filterEmploymentType();
    const year = this.filterYear();
    const current = this.filterCurrent();

    // Search filter
    if (query) {
      result = result.filter(exp =>
        exp.companyName.toLowerCase().includes(query) ||
        exp.position.toLowerCase().includes(query) ||
        exp.technologies.some(t => t.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (status !== 'all') {
      result = result.filter(exp =>
        status === 'active' ? exp.isActive : !exp.isActive
      );
    }

    // Employment type filter
    if (employmentType) {
      result = result.filter(exp => exp.employmentType === employmentType);
    }

    // Year filter
    if (year !== null) {
      result = result.filter(exp => {
        const startYear = new Date(exp.startDate).getFullYear();
        const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear();
        return startYear <= year && endYear >= year;
      });
    }

    // Current working filter
    if (current !== null) {
      result = result.filter(exp => exp.isCurrent === current);
    }

    // Sort by sortOrder
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  });

  readonly timelineExperiences = computed(() => {
    return this.filteredExperiences().filter(e => e.isActive);
  });

  readonly years = computed(() => {
    const yearsSet = new Set<number>();
    this.experiences().forEach(exp => {
      yearsSet.add(new Date(exp.startDate).getFullYear());
      if (exp.endDate) {
        yearsSet.add(new Date(exp.endDate).getFullYear());
      } else {
        yearsSet.add(new Date().getFullYear());
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  });

  readonly hasSelectedItems = computed(() => this.selectedIds().size > 0);
  readonly selectedCount = computed(() => this.selectedIds().size);

  // Actions
  loadExperiences(): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      this.experiences.set([...MOCK_EXPERIENCES]);
      this.loading.set(false);
    }, 500);
  }

  getExperienceById(id: string): Experience | undefined {
    return this.experiences().find(e => e.id === id);
  }

  addExperience(data: ExperienceFormData): Experience {
    const newExperience: Experience = {
      id: `exp_${Date.now()}`,
      ...data,
      sortOrder: this.experiences().length + 1,
      isActive: true,
    };

    this.experiences.update(exps => [...exps, newExperience]);
    return newExperience;
  }

  updateExperience(id: string, data: Partial<ExperienceFormData>): boolean {
    const index = this.experiences().findIndex(e => e.id === id);
    if (index === -1) return false;

    this.experiences.update(exps => {
      const updated = [...exps];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });

    return true;
  }

  deleteExperience(id: string): boolean {
    const index = this.experiences().findIndex(e => e.id === id);
    if (index === -1) return false;

    this.experiences.update(exps => exps.filter(e => e.id !== id));
    return true;
  }

  deleteExperiences(ids: string[]): void {
    this.experiences.update(exps => exps.filter(e => !ids.includes(e.id)));
    this.selectedIds.set(new Set());
  }

  duplicateExperience(id: string): Experience | null {
    const exp = this.getExperienceById(id);
    if (!exp) return null;

    const duplicated: Experience = {
      ...exp,
      id: `exp_${Date.now()}`,
      companyName: `${exp.companyName} (Copy)`,
      position: `${exp.position} (Copy)`,
      isCurrent: false,
      endDate: exp.startDate,
      sortOrder: this.experiences().length + 1,
    };

    this.experiences.update(exps => [...exps, duplicated]);
    return duplicated;
  }

  toggleExperienceStatus(id: string): void {
    this.experiences.update(exps =>
      exps.map(e =>
        e.id === id ? { ...e, isActive: !e.isActive } : e
      )
    );
  }

  setCurrentWorking(id: string, isCurrent: boolean): void {
    this.experiences.update(exps =>
      exps.map(e => {
        if (e.id === id) {
          return {
            ...e,
            isCurrent,
            endDate: isCurrent ? null : e.endDate || this.formatDate(new Date()),
          };
        }
        return e;
      })
    );
  }

  bulkToggleStatus(ids: string[], status: boolean): void {
    this.experiences.update(exps =>
      exps.map(e =>
        ids.includes(e.id) ? { ...e, isActive: status } : e
      )
    );
    this.selectedIds.set(new Set());
  }

  reorderExperiences(orderedIds: string[]): void {
    this.experiences.update(exps => {
      return exps.map(exp => {
        const newOrder = orderedIds.indexOf(exp.id);
        if (newOrder !== -1) {
          return { ...exp, sortOrder: newOrder + 1 };
        }
        return exp;
      });
    });
  }

  // Project management
  addProject(experienceId: string, project: Omit<Project, 'id'>): void {
    const index = this.experiences().findIndex(e => e.id === experienceId);
    if (index === -1) return;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      ...project,
    };

    this.experiences.update(exps => {
      const updated = [...exps];
      updated[index] = {
        ...updated[index],
        projects: [...updated[index].projects, newProject],
      };
      return updated;
    });
  }

  updateProject(experienceId: string, projectId: string, data: Partial<Project>): void {
    const expIndex = this.experiences().findIndex(e => e.id === experienceId);
    if (expIndex === -1) return;

    this.experiences.update(exps => {
      const updated = [...exps];
      const projects = updated[expIndex].projects.map(p =>
        p.id === projectId ? { ...p, ...data } : p
      );
      updated[expIndex] = { ...updated[expIndex], projects };
      return updated;
    });
  }

  deleteProject(experienceId: string, projectId: string): void {
    const expIndex = this.experiences().findIndex(e => e.id === experienceId);
    if (expIndex === -1) return;

    this.experiences.update(exps => {
      const updated = [...exps];
      updated[expIndex] = {
        ...updated[expIndex],
        projects: updated[expIndex].projects.filter(p => p.id !== projectId),
      };
      return updated;
    });
  }

  // Achievement management
  addAchievement(experienceId: string, achievement: Omit<Achievement, 'id'>): void {
    const index = this.experiences().findIndex(e => e.id === experienceId);
    if (index === -1) return;

    const newAchievement: Achievement = {
      id: `ach_${Date.now()}`,
      ...achievement,
    };

    this.experiences.update(exps => {
      const updated = [...exps];
      updated[index] = {
        ...updated[index],
        achievements: [...updated[index].achievements, newAchievement],
      };
      return updated;
    });
  }

  updateAchievement(experienceId: string, achievementId: string, data: Partial<Achievement>): void {
    const expIndex = this.experiences().findIndex(e => e.id === experienceId);
    if (expIndex === -1) return;

    this.experiences.update(exps => {
      const updated = [...exps];
      const achievements = updated[expIndex].achievements.map(a =>
        a.id === achievementId ? { ...a, ...data } : a
      );
      updated[expIndex] = { ...updated[expIndex], achievements };
      return updated;
    });
  }

  deleteAchievement(experienceId: string, achievementId: string): void {
    const expIndex = this.experiences().findIndex(e => e.id === experienceId);
    if (expIndex === -1) return;

    this.experiences.update(exps => {
      const updated = [...exps];
      updated[expIndex] = {
        ...updated[expIndex],
        achievements: updated[expIndex].achievements.filter(a => a.id !== achievementId),
      };
      return updated;
    });
  }

  // Filters
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilterStatus(status: 'all' | 'active' | 'inactive'): void {
    this.filterStatus.set(status);
  }

  setFilterEmploymentType(type: string): void {
    this.filterEmploymentType.set(type);
  }

  setFilterYear(year: number | null): void {
    this.filterYear.set(year);
  }

  setFilterCurrent(current: boolean | null): void {
    this.filterCurrent.set(current);
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
    const allIds = this.filteredExperiences().map(e => e.id);
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

  // Export/Import
  exportExperiences(): string {
    return JSON.stringify({
      experiences: this.experiences(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importExperiences(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.experiences && Array.isArray(data.experiences)) {
        this.experiences.set(data.experiences);
      }
      return true;
    } catch {
      this.error.set('Invalid JSON format');
      return false;
    }
  }

  // Utilities
  formatDate(date: Date): string {
    return date.toISOString().slice(0, 7); // YYYY-MM format
  }

  getDuration(experience: Experience): string {
    const start = new Date(experience.startDate);
    const end = experience.endDate ? new Date(experience.endDate) : new Date();
    const months = Math.abs((end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  reset(): void {
    this.searchQuery.set('');
    this.filterStatus.set('all');
    this.filterEmploymentType.set('');
    this.filterYear.set(null);
    this.filterCurrent.set(null);
    this.selectedIds.set(new Set());
    this.error.set(null);
  }
}

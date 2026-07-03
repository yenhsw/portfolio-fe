// ============================================================
// SKILL STORE
// Signal-based state management for skills
// ============================================================

import { Injectable, computed, signal } from '@angular/core';
import { Skill, SkillCategory, SkillFilter, SkillGroup, SkillLevel } from '../shared/models';

export interface SkillState {
  skills: Skill[];
  selectedSkill: Skill | null;
  featuredSkills: Skill[];
  filter: SkillFilter;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SkillStore {
  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _skills = signal<Skill[]>([]);
  private readonly _selectedSkill = signal<Skill | null>(null);
  private readonly _featuredSkills = signal<Skill[]>([]);
  private readonly _filter = signal<SkillFilter>({});
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ============================================================
  // COMPUTED
  // ============================================================

  readonly skills = this._skills.asReadonly();
  readonly selectedSkill = this._selectedSkill.asReadonly();
  readonly featuredSkills = this._featuredSkills.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly skillCount = computed(() => this._skills().length);
  readonly hasSkills = computed(() => this._skills().length > 0);
  readonly hasSelectedSkill = computed(() => this._selectedSkill() !== null);

  readonly skillsByCategory = computed(() => {
    const skills = this._skills();
    const grouped = new Map<SkillCategory, Skill[]>();

    skills.forEach((skill) => {
      const existing = grouped.get(skill.category) ?? [];
      grouped.set(skill.category, [...existing, skill]);
    });

    return grouped;
  });

  readonly skillGroups = computed((): SkillGroup[] => {
    const grouped = this.skillsByCategory();
    const categoryLabels: Record<SkillCategory, { label: string; icon: string }> = {
      frontend: { label: 'Frontend', icon: 'layout' },
      backend: { label: 'Backend', icon: 'server' },
      database: { label: 'Database', icon: 'database' },
      devops: { label: 'DevOps', icon: 'cloud' },
      tools: { label: 'Tools', icon: 'tool' },
      'soft-skills': { label: 'Soft Skills', icon: 'users' },
    };

    return Array.from(grouped.entries()).map(([category, skills]) => ({
      category,
      label: categoryLabels[category]?.label ?? category,
      icon: categoryLabels[category]?.icon ?? 'star',
      skills,
    }));
  });

  readonly filteredSkills = computed(() => {
    const skills = this._skills();
    const filter = this._filter();

    return skills.filter((skill) => {
      if (filter.category && skill.category !== filter.category) return false;
      if (filter.level && skill.level !== filter.level) return false;
      if (filter.featured !== undefined && skill.featured !== filter.featured)
        return false;
      return true;
    });
  });

  readonly skillCategories = computed(() => {
    const skills = this._skills();
    const categories = new Map<SkillCategory, number>();

    skills.forEach((skill) => {
      const count = categories.get(skill.category) ?? 0;
      categories.set(skill.category, count + 1);
    });

    return Array.from(categories.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  });

  // ============================================================
  // ACTIONS
  // ============================================================

  setSkills(skills: Skill[]): void {
    this._skills.set(skills);
  }

  setSelectedSkill(skill: Skill | null): void {
    this._selectedSkill.set(skill);
  }

  setFeaturedSkills(skills: Skill[]): void {
    this._featuredSkills.set(skills);
  }

  setFilter(filter: SkillFilter): void {
    this._filter.set(filter);
  }

  updateFilter(partial: Partial<SkillFilter>): void {
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

  clearSkills(): void {
    this._skills.set([]);
    this._selectedSkill.set(null);
  }

  reset(): void {
    this._skills.set([]);
    this._selectedSkill.set(null);
    this._featuredSkills.set([]);
    this._filter.set({});
    this._loading.set(false);
    this._error.set(null);
  }

  // ============================================================
  // SELECTORS
  // ============================================================

  selectSkillsByCategory(category: SkillCategory): Skill[] {
    return this._skills().filter((s) => s.category === category);
  }

  selectSkillsByLevel(level: SkillLevel): Skill[] {
    return this._skills().filter((s) => s.level === level);
  }

  selectFeaturedSkills(): Skill[] {
    return this._skills().filter((s) => s.featured);
  }
}

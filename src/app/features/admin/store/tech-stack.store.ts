// ============================================================
// TECH STACK STORE
// State quản lý section TECH STACK (mock localStorage)
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
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
  DEFAULT_TECH_STACK_SECTION,
  MOCK_TECH_STACK_STATISTICS,
  MOCK_TECH_STACK_CATEGORIES,
  MOCK_TECH_STACK_SKILLS,
} from '../models/tech-stack.model';
import { PlatformService } from '../../../core/services/platform.service';

const STORAGE_KEY = 'portfolio_tech_stack_data';

interface TechStackData {
  type: typeof SKILLS_SECTION_TYPE_CODE;
  section: TechStackSectionConfig;
  statistics: TechStackStatistic[];
  categories: TechStackCategory[];
  skills: TechStackSkill[];
}

function ensureSkillsSection(config: TechStackSectionConfig): TechStackSectionConfig {
  return { ...config, type: SKILLS_SECTION_TYPE_CODE };
}

function ensureStatistic(item: TechStackStatistic): TechStackStatistic {
  return { ...item, type: SKILLS_SECTION_TYPE_CODE };
}

function ensureCategory(item: TechStackCategory): TechStackCategory {
  return { ...item, type: SKILLS_SECTION_TYPE_CODE };
}

function ensureSkill(item: TechStackSkill): TechStackSkill {
  return { ...item, type: SKILLS_SECTION_TYPE_CODE };
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
export class TechStackStore {
  private readonly platform = inject(PlatformService);

  readonly section = signal<TechStackSectionConfig>({ ...DEFAULT_TECH_STACK_SECTION });
  readonly statistics = signal<TechStackStatistic[]>([...MOCK_TECH_STACK_STATISTICS]);
  readonly categories = signal<TechStackCategory[]>([...MOCK_TECH_STACK_CATEGORIES]);
  readonly skills = signal<TechStackSkill[]>([...MOCK_TECH_STACK_SKILLS]);
  readonly sectionType = SKILLS_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);
  private loaded = false;

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
        const data = JSON.parse(raw) as TechStackData;
        this.section.set(ensureSkillsSection(data.section ?? { ...DEFAULT_TECH_STACK_SECTION }));
        this.statistics.set(normalizeSortOrder(data.statistics ?? [...MOCK_TECH_STACK_STATISTICS]).map(ensureStatistic));
        this.categories.set(normalizeSortOrder(data.categories ?? [...MOCK_TECH_STACK_CATEGORIES]).map(ensureCategory));
        this.skills.set(normalizeSortOrder(data.skills ?? [...MOCK_TECH_STACK_SKILLS]).map(ensureSkill));
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
    this.section.set({ ...DEFAULT_TECH_STACK_SECTION });
    this.statistics.set([...MOCK_TECH_STACK_STATISTICS]);
    this.categories.set([...MOCK_TECH_STACK_CATEGORIES]);
    this.skills.set([...MOCK_TECH_STACK_SKILLS]);
  }

  private persist(): void {
    if (!this.platform.isBrowser) return;
    const storage = this.platform.localStorage;
    if (!storage) return;

    const data: TechStackData = {
      type: SKILLS_SECTION_TYPE_CODE,
      section: this.section(),
      statistics: this.statistics(),
      categories: this.categories(),
      skills: this.skills(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  saveSection(config: TechStackSectionConfig): void {
    this.section.set(ensureSkillsSection(config));
    this.persist();
  }

  addStatistic(data: TechStackStatisticFormData): void {
    const items = this.statistics();
    const item: TechStackStatistic = ensureStatistic({
      id: generateId(),
      ...data,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.statistics.set([...items, item]);
    this.persist();
  }

  updateStatistic(id: string, data: TechStackStatisticFormData): void {
    this.statistics.update(items =>
      items.map(s =>
        s.id === id ? ensureStatistic({ ...s, ...data, type: SKILLS_SECTION_TYPE_CODE }) : s
      )
    );
    this.persist();
  }

  deleteStatistic(id: string): void {
    this.statistics.update(items => items.filter(s => s.id !== id));
    this.persist();
  }

  setStatisticStatus(id: string, isActive: boolean): void {
    this.statistics.update(items => items.map(s => (s.id === id ? { ...s, isActive } : s)));
    this.persist();
  }

  addCategory(data: TechStackCategoryFormData): void {
    const items = this.categories();
    const item: TechStackCategory = ensureCategory({
      id: generateId(),
      ...data,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items),
      isActive: true,
    });
    this.categories.set([...items, item]);
    this.persist();
  }

  updateCategory(id: string, data: TechStackCategoryFormData): void {
    this.categories.update(items =>
      items.map(c =>
        c.id === id ? ensureCategory({ ...c, ...data, type: SKILLS_SECTION_TYPE_CODE }) : c
      )
    );
    this.persist();
  }

  deleteCategory(id: string): void {
    this.categories.update(items => items.filter(c => c.id !== id));
    this.skills.update(items => items.filter(s => s.categoryId !== id));
    this.persist();
  }

  setCategoryStatus(id: string, isActive: boolean): void {
    this.categories.update(items => items.map(c => (c.id === id ? { ...c, isActive } : c)));
    this.persist();
  }

  addSkill(data: TechStackSkillFormData): void {
    const items = this.skills();
    const item: TechStackSkill = ensureSkill({
      id: generateId(),
      ...data,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : nextSortOrder(items.filter(s => s.categoryId === data.categoryId)),
      isActive: true,
    });
    this.skills.set([...items, item]);
    this.persist();
  }

  updateSkill(id: string, data: TechStackSkillFormData): void {
    this.skills.update(items =>
      items.map(s =>
        s.id === id ? ensureSkill({ ...s, ...data, type: SKILLS_SECTION_TYPE_CODE }) : s
      )
    );
    this.persist();
  }

  deleteSkill(id: string): void {
    this.skills.update(items => items.filter(s => s.id !== id));
    this.persist();
  }

  setSkillStatus(id: string, isActive: boolean): void {
    this.skills.update(items => items.map(s => (s.id === id ? { ...s, isActive } : s)));
    this.persist();
  }

  categoryName(id: string): string {
    return this.categories().find(c => c.id === id)?.name ?? id;
  }
}

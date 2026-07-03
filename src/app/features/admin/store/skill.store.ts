// ============================================================
// SKILL STORE
// Skills Management State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { Skill, SkillCategory, SkillFormData, SKILL_CATEGORIES } from '../models/skill.model';

export interface SkillState {
  skills: Skill[];
  categories: SkillCategory[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedSkill: Skill | null;
  searchQuery: string;
  filterCategory: string;
  filterLevel: { min: number; max: number };
  filterStatus: 'all' | 'active' | 'inactive';
}

const INITIAL_MOCK_SKILLS: Skill[] = [
  { id: '1', name: 'Angular', displayName: 'Angular', icon: 'angular', iconType: 'class', categoryId: 'frontend', level: 95, color: '#DD0031', sortOrder: 1, isActive: true, description: 'Framework JavaScript mạnh mẽ cho việc xây dựng ứng dụng web.' },
  { id: '2', name: 'TypeScript', displayName: 'TypeScript', icon: 'typescript', iconType: 'class', categoryId: 'frontend', level: 90, color: '#3178C6', sortOrder: 2, isActive: true, description: 'Ngôn ngữ lập trình hướng đối tượng dựa trên JavaScript.' },
  { id: '3', name: 'React', displayName: 'React', icon: 'react', iconType: 'class', categoryId: 'frontend', level: 85, color: '#61DAFB', sortOrder: 3, isActive: true, description: 'Thư viện JavaScript để xây dựng giao diện người dùng.' },
  { id: '4', name: 'Java Spring Boot', displayName: 'Spring Boot', icon: 'spring', iconType: 'class', categoryId: 'backend', level: 88, color: '#6DB33F', sortOrder: 1, isActive: true, description: 'Framework Java cho xây dựng ứng dụng microservice.' },
  { id: '5', name: 'Java', displayName: 'Java', icon: 'java', iconType: 'class', categoryId: 'backend', level: 92, color: '#007396', sortOrder: 2, isActive: true, description: 'Ngôn ngữ lập trình hướng đối tượng phổ biến.' },
  { id: '6', name: 'Node.js', displayName: 'Node.js', icon: 'nodejs', iconType: 'class', categoryId: 'backend', level: 82, color: '#339933', sortOrder: 3, isActive: true, description: 'Runtime JavaScript cho phía server.' },
  { id: '7', name: 'Python', displayName: 'Python', icon: 'python', iconType: 'class', categoryId: 'backend', level: 75, color: '#3776AB', sortOrder: 4, isActive: true, description: 'Ngôn ngữ lập trình đa năng, dễ học.' },
  { id: '8', name: 'PostgreSQL', displayName: 'PostgreSQL', icon: 'postgresql', iconType: 'class', categoryId: 'database', level: 85, color: '#336791', sortOrder: 1, isActive: true, description: 'Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở.' },
  { id: '9', name: 'MongoDB', displayName: 'MongoDB', icon: 'mongodb', iconType: 'class', categoryId: 'database', level: 78, color: '#47A248', sortOrder: 2, isActive: true, description: 'Cơ sở dữ liệu NoSQL phổ biến.' },
  { id: '10', name: 'Redis', displayName: 'Redis', icon: 'redis', iconType: 'class', categoryId: 'database', level: 72, color: '#DC382D', sortOrder: 3, isActive: true, description: 'Cơ sở dữ liệu in-memory.' },
  { id: '11', name: 'Oracle', displayName: 'Oracle', icon: 'oracle', iconType: 'class', categoryId: 'database', level: 70, color: '#F80000', sortOrder: 4, isActive: true, description: 'Hệ quản trị cơ sở dữ liệu doanh nghiệp.' },
  { id: '12', name: 'Docker', displayName: 'Docker', icon: 'docker', iconType: 'class', categoryId: 'devops', level: 88, color: '#2496ED', sortOrder: 1, isActive: true, description: 'Nền tảng container hóa ứng dụng.' },
  { id: '13', name: 'Kubernetes', displayName: 'Kubernetes', icon: 'kubernetes', iconType: 'class', categoryId: 'devops', level: 75, color: '#326CE5', sortOrder: 2, isActive: true, description: 'Hệ thống điều phối container.' },
  { id: '14', name: 'Git', displayName: 'Git', icon: 'git', iconType: 'class', categoryId: 'tools', level: 95, color: '#F05032', sortOrder: 1, isActive: true, description: 'Hệ thống quản lý phiên bản phân tán.' },
  { id: '15', name: 'Linux', displayName: 'Linux', icon: 'linux', iconType: 'class', categoryId: 'tools', level: 82, color: '#FCC624', sortOrder: 2, isActive: true, description: 'Hệ điều hành mã nguồn mở.' },
  { id: '16', name: 'AWS', displayName: 'AWS', icon: 'aws', iconType: 'class', categoryId: 'cloud', level: 78, color: '#FF9900', sortOrder: 1, isActive: true, description: 'Nền tảng điện toán đám mây của Amazon.' },
  { id: '17', name: 'Communication', displayName: 'Communication', icon: 'message-circle', iconType: 'class', categoryId: 'soft-skills', level: 90, color: '#A855F7', sortOrder: 1, isActive: true, description: 'Kỹ năng giao tiếp hiệu quả.' },
  { id: '18', name: 'Teamwork', displayName: 'Teamwork', icon: 'users', iconType: 'class', categoryId: 'soft-skills', level: 92, color: '#A855F7', sortOrder: 2, isActive: true, description: 'Làm việc nhóm hiệu quả.' },
  { id: '19', name: 'Problem Solving', displayName: 'Problem Solving', icon: 'lightbulb', iconType: 'class', categoryId: 'soft-skills', level: 88, color: '#A855F7', sortOrder: 3, isActive: true, description: 'Kỹ năng giải quyết vấn đề.' },
  { id: '20', name: 'Leadership', displayName: 'Leadership', icon: 'compass', iconType: 'class', categoryId: 'soft-skills', level: 80, color: '#A855F7', sortOrder: 4, isActive: false, description: 'Kỹ năng lãnh đạo và quản lý.' },
];

@Injectable({
  providedIn: 'root',
})
export class SkillStore {
  // State
  readonly skills = signal<Skill[]>([]);
  readonly categories = signal<SkillCategory[]>(SKILL_CATEGORIES);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedSkill = signal<Skill | null>(null);
  readonly searchQuery = signal('');
  readonly filterCategory = signal('');
  readonly filterLevel = signal<{ min: number; max: number }>({ min: 0, max: 100 });
  readonly filterStatus = signal<'all' | 'active' | 'inactive'>('all');
  readonly selectedIds = signal<Set<string>>(new Set());

  // Computed
  readonly filteredSkills = computed(() => {
    let result = [...this.skills()];
    const query = this.searchQuery().toLowerCase();
    const category = this.filterCategory();
    const level = this.filterLevel();
    const status = this.filterStatus();

    // Search filter
    if (query) {
      result = result.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.displayName.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category) {
      result = result.filter(skill => skill.categoryId === category);
    }

    // Level filter
    result = result.filter(skill =>
      skill.level >= level.min && skill.level <= level.max
    );

    // Status filter
    if (status !== 'all') {
      result = result.filter(skill =>
        status === 'active' ? skill.isActive : !skill.isActive
      );
    }

    // Sort by sortOrder
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  });

  readonly skillsByCategory = computed(() => {
    const grouped: Record<string, Skill[]> = {};
    const activeSkills = this.filteredSkills().filter(s => s.isActive);

    for (const skill of activeSkills) {
      if (!grouped[skill.categoryId]) {
        grouped[skill.categoryId] = [];
      }
      grouped[skill.categoryId].push(skill);
    }

    // Sort skills within each category
    for (const key in grouped) {
      grouped[key].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return grouped;
  });

  readonly activeCategories = computed(() => {
    return this.categories().filter(c => c.isActive);
  });

  readonly hasSelectedItems = computed(() => this.selectedIds().size > 0);

  readonly selectedCount = computed(() => this.selectedIds().size);

  // Actions
  loadSkills(): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      this.skills.set([...INITIAL_MOCK_SKILLS]);
      this.loading.set(false);
    }, 500);
  }

  getSkillById(id: string): Skill | undefined {
    return this.skills().find(s => s.id === id);
  }

  addSkill(data: SkillFormData): Skill {
    const category = this.categories().find(c => c.id === data.categoryId);
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      ...data,
      iconType: data.iconType || 'class',
      sortOrder: this.skills().length + 1,
      isActive: true,
    };

    this.skills.update(skills => [...skills, newSkill]);
    return newSkill;
  }

  updateSkill(id: string, data: Partial<SkillFormData>): boolean {
    const skillIndex = this.skills().findIndex(s => s.id === id);
    if (skillIndex === -1) return false;

    this.skills.update(skills => {
      const updated = [...skills];
      updated[skillIndex] = { ...updated[skillIndex], ...data };
      return updated;
    });

    return true;
  }

  deleteSkill(id: string): boolean {
    const skillIndex = this.skills().findIndex(s => s.id === id);
    if (skillIndex === -1) return false;

    this.skills.update(skills => skills.filter(s => s.id !== id));
    return true;
  }

  deleteSkills(ids: string[]): void {
    this.skills.update(skills => skills.filter(s => !ids.includes(s.id)));
    this.selectedIds.set(new Set());
  }

  duplicateSkill(id: string): Skill | null {
    const skill = this.getSkillById(id);
    if (!skill) return null;

    const duplicated: Skill = {
      ...skill,
      id: `skill_${Date.now()}`,
      name: `${skill.name} (Copy)`,
      displayName: `${skill.displayName} (Copy)`,
      sortOrder: this.skills().length + 1,
    };

    this.skills.update(skills => [...skills, duplicated]);
    return duplicated;
  }

  toggleSkillStatus(id: string): void {
    this.skills.update(skills =>
      skills.map(s =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  }

  bulkToggleStatus(ids: string[], status: boolean): void {
    this.skills.update(skills =>
      skills.map(s =>
        ids.includes(s.id) ? { ...s, isActive: status } : s
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkChangeCategory(ids: string[], categoryId: string): void {
    this.skills.update(skills =>
      skills.map(s =>
        ids.includes(s.id) ? { ...s, categoryId } : s
      )
    );
  }

  reorderSkills(categoryId: string, orderedIds: string[]): void {
    this.skills.update(skills => {
      return skills.map(skill => {
        if (skill.categoryId === categoryId) {
          const newOrder = orderedIds.indexOf(skill.id);
          if (newOrder !== -1) {
            return { ...skill, sortOrder: newOrder + 1 };
          }
        }
        return skill;
      });
    });
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilterCategory(category: string): void {
    this.filterCategory.set(category);
  }

  setFilterLevel(min: number, max: number): void {
    this.filterLevel.set({ min, max });
  }

  setFilterStatus(status: 'all' | 'active' | 'inactive'): void {
    this.filterStatus.set(status);
  }

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
    const allIds = this.filteredSkills().map(s => s.id);
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
  addCategory(name: string, color: string): SkillCategory {
    const newCategory: SkillCategory = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      icon: 'folder',
      color,
      sortOrder: this.categories().length + 1,
      isActive: true,
    };

    this.categories.update(cats => [...cats, newCategory]);
    return newCategory;
  }

  updateCategory(id: string, data: Partial<SkillCategory>): boolean {
    const index = this.categories().findIndex(c => c.id === id);
    if (index === -1) return false;

    this.categories.update(cats => {
      const updated = [...cats];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });

    return true;
  }

  deleteCategory(id: string): boolean {
    // Check if there are skills in this category
    const skillsInCategory = this.skills().filter(s => s.categoryId === id);
    if (skillsInCategory.length > 0) {
      this.error.set(`Cannot delete category with ${skillsInCategory.length} skills. Move or delete them first.`);
      return false;
    }

    this.categories.update(cats => cats.filter(c => c.id !== id));
    return true;
  }

  // Export/Import
  exportSkills(): string {
    return JSON.stringify({
      skills: this.skills(),
      categories: this.categories(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importSkills(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.skills && Array.isArray(data.skills)) {
        this.skills.set(data.skills);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.categories.update(existing => {
          const existingIds = new Set(existing.map(c => c.id));
          const newCategories = data.categories.filter((c: SkillCategory) => !existingIds.has(c.id));
          return [...existing, ...newCategories];
        });
      }
      return true;
    } catch {
      this.error.set('Invalid JSON format');
      return false;
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  reset(): void {
    this.searchQuery.set('');
    this.filterCategory.set('');
    this.filterLevel.set({ min: 0, max: 100 });
    this.filterStatus.set('all');
    this.selectedIds.set(new Set());
    this.error.set(null);
  }
}

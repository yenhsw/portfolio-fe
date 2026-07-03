// ============================================================
// SKILL SERVICE
// Skills API Service (Mock Implementation)
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Skill, SkillCategory } from '../models/skill.model';
import { SKILL_CATEGORIES } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private mockSkills: Skill[] = [];
  private mockCategories: SkillCategory[] = [...SKILL_CATEGORIES];

  getSkills(): Observable<Skill[]> {
    return of(this.mockSkills).pipe(delay(300));
  }

  getCategories(): Observable<SkillCategory[]> {
    return of(this.mockCategories).pipe(delay(200));
  }

  createSkill(skill: Partial<Skill>): Observable<Skill> {
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name: skill.name || '',
      displayName: skill.displayName || skill.name || '',
      icon: skill.icon || 'code',
      iconType: skill.iconType || 'class',
      categoryId: skill.categoryId || 'frontend',
      level: skill.level || 50,
      color: skill.color || '#6366F1',
      sortOrder: skill.sortOrder || 1,
      isActive: skill.isActive ?? true,
      description: skill.description,
    };
    return of(newSkill).pipe(delay(500));
  }

  updateSkill(id: string, skill: Partial<Skill>): Observable<Skill | null> {
    const index = this.mockSkills.findIndex(s => s.id === id);
    if (index === -1) return of(null).pipe(delay(500));

    const updated = { ...this.mockSkills[index], ...skill };
    this.mockSkills[index] = updated;
    return of(updated).pipe(delay(500));
  }

  deleteSkill(id: string): Observable<boolean> {
    const index = this.mockSkills.findIndex(s => s.id === id);
    if (index === -1) return of(false).pipe(delay(500));

    this.mockSkills.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  deleteSkills(ids: string[]): Observable<boolean> {
    this.mockSkills = this.mockSkills.filter(s => !ids.includes(s.id));
    return of(true).pipe(delay(500));
  }

  uploadIcon(file: File): Observable<string> {
    // Mock: return a placeholder URL
    const url = URL.createObjectURL(file);
    return of(url).pipe(delay(1500));
  }
}

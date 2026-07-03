// ============================================================
// EXPERIENCE SERVICE
// Experience API Service (Mock Implementation)
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Experience } from '../models/experience.model';
import { MOCK_EXPERIENCES } from '../models/experience.model';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private mockExperiences: Experience[] = [...MOCK_EXPERIENCES];

  getExperiences(): Observable<Experience[]> {
    return of(this.mockExperiences).pipe(delay(300));
  }

  getExperienceById(id: string): Observable<Experience | null> {
    const exp = this.mockExperiences.find(e => e.id === id);
    return of(exp || null).pipe(delay(200));
  }

  createExperience(experience: Partial<Experience>): Observable<Experience> {
    const newExperience: Experience = {
      id: `exp_${Date.now()}`,
      companyName: experience.companyName || '',
      companyLogo: experience.companyLogo || '',
      position: experience.position || '',
      employmentType: experience.employmentType || 'full-time',
      location: experience.location || '',
      startDate: experience.startDate || '',
      endDate: experience.endDate || null,
      isCurrent: experience.isCurrent || false,
      summary: experience.summary || '',
      description: experience.description || '',
      technologies: experience.technologies || [],
      responsibilities: experience.responsibilities || [],
      achievements: experience.achievements || [],
      projects: experience.projects || [],
      sortOrder: experience.sortOrder || this.mockExperiences.length + 1,
      isActive: experience.isActive ?? true,
    };

    this.mockExperiences.push(newExperience);
    return of(newExperience).pipe(delay(500));
  }

  updateExperience(id: string, experience: Partial<Experience>): Observable<Experience | null> {
    const index = this.mockExperiences.findIndex(e => e.id === id);
    if (index === -1) return of(null).pipe(delay(500));

    const updated = { ...this.mockExperiences[index], ...experience };
    this.mockExperiences[index] = updated;
    return of(updated).pipe(delay(500));
  }

  deleteExperience(id: string): Observable<boolean> {
    const index = this.mockExperiences.findIndex(e => e.id === id);
    if (index === -1) return of(false).pipe(delay(500));

    this.mockExperiences.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  deleteExperiences(ids: string[]): Observable<boolean> {
    this.mockExperiences = this.mockExperiences.filter(e => !ids.includes(e.id));
    return of(true).pipe(delay(500));
  }

  reorderExperiences(orderedIds: string[]): Observable<boolean> {
    // Mock implementation
    return of(true).pipe(delay(300));
  }

  uploadLogo(file: File): Observable<string> {
    // Mock: return a placeholder URL
    const url = URL.createObjectURL(file);
    return of(url).pipe(delay(1500));
  }
}

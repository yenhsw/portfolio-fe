// ============================================================
// EXPERIENCE STORE
// Signal-based state management for experiences and timeline
// ============================================================

import { Injectable, computed, signal } from '@angular/core';
import { Experience, Education, TimelineItem, ExperienceType } from '../shared/models';

export interface ExperienceState {
  experiences: Experience[];
  educations: Education[];
  timeline: TimelineItem[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceStore {
  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _experiences = signal<Experience[]>([]);
  private readonly _educations = signal<Education[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ============================================================
  // COMPUTED
  // ============================================================

  readonly experiences = this._experiences.asReadonly();
  readonly educations = this._educations.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly experienceCount = computed(() => this._experiences().length);
  readonly educationCount = computed(() => this._educations().length);

  readonly currentExperience = computed(() => {
    return this._experiences().find((e) => e.isCurrent) ?? null;
  });

  readonly currentEducation = computed(() => {
    return this._educations().find((e) => e.isCurrent) ?? null;
  });

  readonly sortedExperiences = computed(() => {
    return [...this._experiences()].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA;
    });
  });

  readonly sortedEducations = computed(() => {
    return [...this._educations()].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA;
    });
  });

  readonly timeline = computed((): TimelineItem[] => {
    const experiences = this.sortedExperiences();
    const educations = this.sortedEducations();

    const experienceItems: TimelineItem[] = experiences.map((exp) => ({
      id: exp.id,
      type: 'experience' as const,
      title: exp.title,
      subtitle: exp.company,
      organization: exp.company,
      organizationLogo: exp.companyLogo,
      location: exp.location,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      order: new Date(exp.startDate).getTime(),
    }));

    const educationItems: TimelineItem[] = educations.map((edu) => ({
      id: edu.id,
      type: 'education' as const,
      title: edu.degree,
      subtitle: edu.institution,
      organization: edu.institution,
      organizationLogo: edu.institutionLogo,
      location: edu.location,
      description: edu.description,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrent: edu.isCurrent,
      order: new Date(edu.startDate).getTime(),
    }));

    return [...experienceItems, ...educationItems].sort((a, b) => b.order - a.order);
  });

  readonly experiencesByType = computed(() => {
    const experiences = this._experiences();
    const grouped = new Map<ExperienceType, Experience[]>();

    experiences.forEach((exp) => {
      const existing = grouped.get(exp.type) ?? [];
      grouped.set(exp.type, [...existing, exp]);
    });

    return grouped;
  });

  readonly totalYearsOfExperience = computed(() => {
    const experiences = this._experiences();
    let totalMonths = 0;

    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += months;
    });

    return Math.round(totalMonths / 12 * 10) / 10;
  });

  // ============================================================
  // ACTIONS
  // ============================================================

  setExperiences(experiences: Experience[]): void {
    this._experiences.set(experiences);
  }

  setEducations(educations: Education[]): void {
    this._educations.set(educations);
  }

  addExperience(experience: Experience): void {
    this._experiences.update((current) => [...current, experience]);
  }

  updateExperience(id: string, experience: Partial<Experience>): void {
    this._experiences.update((current) =>
      current.map((exp) => (exp.id === id ? { ...exp, ...experience } : exp))
    );
  }

  deleteExperience(id: string): void {
    this._experiences.update((current) => current.filter((exp) => exp.id !== id));
  }

  addEducation(education: Education): void {
    this._educations.update((current) => [...current, education]);
  }

  updateEducation(id: string, education: Partial<Education>): void {
    this._educations.update((current) =>
      current.map((edu) => (edu.id === id ? { ...edu, ...education } : edu))
    );
  }

  deleteEducation(id: string): void {
    this._educations.update((current) => current.filter((edu) => edu.id !== id));
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  reset(): void {
    this._experiences.set([]);
    this._educations.set([]);
    this._loading.set(false);
    this._error.set(null);
  }

  // ============================================================
  // SELECTORS
  // ============================================================

  selectExperienceById(id: string): Experience | undefined {
    return this._experiences().find((e) => e.id === id);
  }

  selectEducationById(id: string): Education | undefined {
    return this._educations().find((e) => e.id === id);
  }

  selectExperiencesByType(type: ExperienceType): Experience[] {
    return this._experiences().filter((e) => e.type === type);
  }
}

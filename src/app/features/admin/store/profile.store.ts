// ============================================================
// PROFILE STORE
// Profile Management State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';

export interface Social {
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  instagram?: string;
  portfolio?: string;
}

export interface Profile {
  id: string;
  avatar: string;
  background: string;
  fullName: string;
  displayName: string;
  jobTitle: string;
  company: string;
  experience: number;
  location: string;
  email: string;
  phone: string;
  website: string;
  cvUrl: string;
  shortIntro: string;
  longIntro: string;
  careerObjective: string;
  workingStyle: string;
  personalValue: string;
  social: Social;
  techStack: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    canonical: string;
  };
}

const DEFAULT_PROFILE: Profile = {
  id: '1',
  avatar: '',
  background: '',
  fullName: 'John Doe',
  displayName: 'John',
  jobTitle: 'Full Stack Developer',
  company: 'Tech Company',
  experience: 5,
  location: 'Ho Chi Minh City, Vietnam',
  email: 'john@example.com',
  phone: '+84 123 456 789',
  website: 'https://johndoe.dev',
  cvUrl: '',
  shortIntro: 'A passionate full-stack developer with expertise in Angular and Spring Boot.',
  longIntro: 'I am a dedicated full-stack developer with over 5 years of experience building modern web applications. My expertise spans both frontend and backend development, with a strong focus on creating scalable, performant, and user-friendly solutions.',
  careerObjective: 'To leverage my technical skills and experience to contribute to innovative projects while continuing to grow as a developer.',
  workingStyle: 'Detail-oriented, collaborative, and always seeking to improve code quality and developer experience.',
  personalValue: 'Continuous learning, clean code, user-centric design, and ethical development practices.',
  social: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    facebook: '',
    youtube: '',
    tiktok: '',
    twitter: '',
    instagram: '',
    portfolio: '',
  },
  techStack: ['Angular', 'Spring Boot', 'TypeScript', 'Java', 'PostgreSQL', 'Docker'],
  seo: {
    title: 'John Doe - Full Stack Developer',
    description: 'Portfolio of John Doe, a full-stack developer specializing in Angular and Spring Boot.',
    keywords: 'developer, full stack, angular, spring boot, portfolio',
    ogImage: '',
    canonical: 'https://johndoe.dev',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  // State
  readonly profile = signal<Profile>({ ...DEFAULT_PROFILE });
  readonly originalProfile = signal<Profile>({ ...DEFAULT_PROFILE });
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  // Computed
  readonly isDirty = computed(() => {
    return JSON.stringify(this.profile()) !== JSON.stringify(this.originalProfile());
  });

  readonly hasChanges = computed(() => this.isDirty());

  // Actions
  loadProfile(profile?: Profile): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      const loaded = profile || DEFAULT_PROFILE;
      this.profile.set({ ...loaded });
      this.originalProfile.set({ ...loaded });
      this.loading.set(false);
    }, 500);
  }

  updateProfile(updates: Partial<Profile>): void {
    this.profile.update(current => ({
      ...current,
      ...updates,
    }));
  }

  updateBasicInfo(data: Partial<Profile>): void {
    this.profile.update(current => ({
      ...current,
      ...data,
    }));
  }

  updateIntroduction(data: Partial<Profile>): void {
    this.profile.update(current => ({
      ...current,
      ...data,
    }));
  }

  updateSocial(social: Partial<Social>): void {
    this.profile.update(current => ({
      ...current,
      social: { ...current.social, ...social },
    }));
  }

  updateTechStack(techStack: string[]): void {
    this.profile.update(current => ({
      ...current,
      techStack,
    }));
  }

  updateSeo(seo: Partial<Profile['seo']>): void {
    this.profile.update(current => ({
      ...current,
      seo: { ...current.seo, ...seo },
    }));
  }

  async saveProfile(): Promise<boolean> {
    if (!this.isDirty()) return true;

    this.saving.set(true);
    this.error.set(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update original to mark as saved
      this.originalProfile.set({ ...this.profile() });
      this.saving.set(false);
      return true;
    } catch (err) {
      this.error.set('Failed to save profile. Please try again.');
      this.saving.set(false);
      return false;
    }
  }

  resetProfile(): void {
    this.profile.set({ ...this.originalProfile() });
    this.error.set(null);
  }

  clearError(): void {
    this.error.set(null);
  }
}

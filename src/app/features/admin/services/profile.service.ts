// ============================================================
// PROFILE SERVICE
// Profile API Service (Mock Implementation)
// ============================================================

import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Profile } from '../store/profile.store';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // Mock data for development
  private mockProfile: Profile = {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    background: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=600&fit=crop',
    fullName: 'John Doe',
    displayName: 'John',
    jobTitle: 'Full Stack Developer',
    company: 'Tech Innovation Corp',
    experience: 5,
    location: 'Ho Chi Minh City, Vietnam',
    email: 'john.doe@example.com',
    phone: '+84 123 456 789',
    website: 'https://johndoe.dev',
    cvUrl: '/assets/cv/john-doe-cv.pdf',
    shortIntro: 'A passionate full-stack developer with expertise in Angular and Spring Boot, creating modern web applications that make a difference.',
    longIntro: 'I am a dedicated full-stack developer with over 5 years of experience building modern web applications. My expertise spans both frontend and backend development, with a strong focus on creating scalable, performant, and user-friendly solutions.\n\nThroughout my career, I have worked with various technologies including Angular, React, Spring Boot, Node.js, and cloud platforms. I am passionate about clean code, best practices, and continuous learning.',
    careerObjective: 'To leverage my technical skills and experience to contribute to innovative projects while continuing to grow as a developer.',
    workingStyle: 'Detail-oriented, collaborative, and always seeking to improve code quality and developer experience. I believe in writing clean, maintainable code and following industry best practices.',
    personalValue: 'Continuous learning, clean code, user-centric design, and ethical development practices.',
    social: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      facebook: 'https://facebook.com/johndoe',
      youtube: 'https://youtube.com/@johndoe',
      tiktok: '',
      twitter: 'https://twitter.com/johndoe',
      instagram: '',
      portfolio: 'https://johndoe.dev',
    },
    techStack: ['Angular', 'Spring Boot', 'TypeScript', 'Java', 'PostgreSQL', 'Docker'],
    seo: {
      title: 'John Doe - Full Stack Developer',
      description: 'Portfolio of John Doe, a full-stack developer specializing in Angular and Spring Boot.',
      keywords: 'developer, full stack, angular, spring boot, portfolio, vietnam',
      ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop',
      canonical: 'https://johndoe.dev',
    },
  };

  getProfile(): Observable<Profile> {
    return of(this.mockProfile).pipe(delay(500));
  }

  saveProfile(profile: Profile): Observable<Profile> {
    this.mockProfile = { ...profile };
    return of(this.mockProfile).pipe(delay(1000));
  }

  uploadImage(file: File): Observable<string> {
    // Mock: return a placeholder URL
    const url = URL.createObjectURL(file);
    return of(url).pipe(delay(1500));
  }
}

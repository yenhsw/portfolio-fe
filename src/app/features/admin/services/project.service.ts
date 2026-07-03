// ============================================================
// PROJECT SERVICE
// Project API Service (Mock Implementation)
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Project } from '../models/project.model';
import { MOCK_PROJECTS } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private mockProjects: Project[] = [...MOCK_PROJECTS];

  getProjects(): Observable<Project[]> {
    return of(this.mockProjects).pipe(delay(300));
  }

  getProjectById(id: string): Observable<Project | null> {
    const proj = this.mockProjects.find(p => p.id === id);
    return of(proj || null).pipe(delay(200));
  }

  getFeaturedProjects(): Observable<Project[]> {
    const featured = this.mockProjects.filter(p => p.isFeatured);
    return of(featured).pipe(delay(200));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: project.name || '',
      slug: project.slug || '',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      role: project.role || '',
      client: project.client,
      categoryId: project.categoryId || 'web-app',
      status: project.status || 'draft',
      sortOrder: project.sortOrder || this.mockProjects.length + 1,
      isFeatured: project.isFeatured || false,
      startDate: project.startDate || '',
      endDate: project.endDate,
      thumbnail: project.thumbnail || '',
      banner: project.banner || '',
      gallery: project.gallery || [],
      videoUrl: project.videoUrl,
      youtubeUrl: project.youtubeUrl,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      documentationUrl: project.documentationUrl,
      figmaUrl: project.figmaUrl,
      technologies: project.technologies || [],
      features: project.features || [],
      team: project.team || [],
      seo: project.seo || {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockProjects.push(newProject);
    return of(newProject).pipe(delay(500));
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project | null> {
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index === -1) return of(null).pipe(delay(500));

    const updated = {
      ...this.mockProjects[index],
      ...project,
      updatedAt: new Date().toISOString(),
    };
    this.mockProjects[index] = updated;
    return of(updated).pipe(delay(500));
  }

  deleteProject(id: string): Observable<boolean> {
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index === -1) return of(false).pipe(delay(500));

    this.mockProjects.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  deleteProjects(ids: string[]): Observable<boolean> {
    this.mockProjects = this.mockProjects.filter(p => !ids.includes(p.id));
    return of(true).pipe(delay(500));
  }

  reorderProjects(orderedIds: string[]): Observable<boolean> {
    // Mock implementation
    return of(true).pipe(delay(300));
  }

  uploadImage(file: File): Observable<string> {
    // Mock: return a placeholder URL
    const url = URL.createObjectURL(file);
    return of(url).pipe(delay(1500));
  }
}

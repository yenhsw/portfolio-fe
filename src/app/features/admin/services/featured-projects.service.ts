// ============================================================
// FEATURED PROJECTS SERVICE
// Projects Admin + Public API
// ============================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { sectionTypeQuery, withSectionType } from '../../../core/constants/section-type.constants';
import { ApiResponse } from '../../../core/models/api-response.interface';
import {
  FeaturedProject,
  FeaturedProjectFormData,
  FeaturedProjectsSectionConfig,
  ProjectFilterFormData,
  ProjectFilterItem,
} from '../models/featured-projects.model';

export interface ProjectsPublicAggregate {
  type: number;
  section: FeaturedProjectsSectionConfig;
  filters: Array<Omit<ProjectFilterItem, 'isActive'> & { isActive?: boolean }>;
  projects: Array<Omit<FeaturedProject, 'isActive'> & { isActive?: boolean }>;
}

@Injectable({ providedIn: 'root' })
export class FeaturedProjectsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly typeQuery = sectionTypeQuery();

  getPublic(): Observable<ApiResponse<ProjectsPublicAggregate>> {
    return this.http
      .get<ApiResponse<ProjectsPublicAggregate>>(`${this.baseUrl}${API_ENDPOINTS.PROJECTS_PUBLIC}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSection(): Observable<ApiResponse<FeaturedProjectsSectionConfig>> {
    return this.http
      .get<ApiResponse<FeaturedProjectsSectionConfig>>(`${this.baseUrl}${API_ENDPOINTS.PROJECTS_SECTION}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getFilters(): Observable<ApiResponse<ProjectFilterItem[]>> {
    return this.http
      .get<ApiResponse<ProjectFilterItem[]>>(`${this.baseUrl}${API_ENDPOINTS.PROJECTS_FILTERS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getProjects(): Observable<ApiResponse<FeaturedProject[]>> {
    return this.http
      .get<ApiResponse<FeaturedProject[]>>(`${this.baseUrl}${API_ENDPOINTS.PROJECTS_ITEMS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSection(config: FeaturedProjectsSectionConfig): Observable<ApiResponse<FeaturedProjectsSectionConfig>> {
    return this.http
      .put<ApiResponse<FeaturedProjectsSectionConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_SECTION}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createFilter(data: ProjectFilterFormData): Observable<ApiResponse<ProjectFilterItem>> {
    return this.http
      .post<ApiResponse<ProjectFilterItem>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_FILTERS}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateFilter(id: string, data: ProjectFilterFormData): Observable<ApiResponse<ProjectFilterItem>> {
    return this.http
      .put<ApiResponse<ProjectFilterItem>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_FILTER_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteFilter(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.PROJECTS_FILTER_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setFilterStatus(id: string, isActive: boolean): Observable<ApiResponse<ProjectFilterItem>> {
    return this.http
      .patch<ApiResponse<ProjectFilterItem>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_FILTER_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createProject(data: FeaturedProjectFormData): Observable<ApiResponse<FeaturedProject>> {
    return this.http
      .post<ApiResponse<FeaturedProject>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_ITEMS}`,
        withSectionType(this.normalizeProjectPayload(data))
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateProject(id: string, data: FeaturedProjectFormData): Observable<ApiResponse<FeaturedProject>> {
    return this.http
      .put<ApiResponse<FeaturedProject>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_ITEM_BY_ID(id)}`,
        withSectionType(this.normalizeProjectPayload(data))
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteProject(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.PROJECTS_ITEM_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setProjectStatus(id: string, isActive: boolean): Observable<ApiResponse<FeaturedProject>> {
    return this.http
      .patch<ApiResponse<FeaturedProject>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_ITEM_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setProjectFeatured(id: string, isFeatured: boolean): Observable<ApiResponse<FeaturedProject>> {
    return this.http
      .patch<ApiResponse<FeaturedProject>>(
        `${this.baseUrl}${API_ENDPOINTS.PROJECTS_ITEM_FEATURED(id)}`,
        withSectionType({ isFeatured })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  private normalizeProjectPayload(data: FeaturedProjectFormData): FeaturedProjectFormData {
    return {
      ...data,
      demoUrl: data.demoUrl?.trim() ?? '',
      githubUrl: data.githubUrl?.trim() ?? '',
    };
  }

  private toError(error: HttpErrorResponse): { message: string; code?: string } {
    const body = error.error as { message?: string; error?: string } | null;
    return {
      message: body?.message || error.message || 'Request failed',
      code: body?.error || `HTTP_${error.status}`,
    };
  }
}

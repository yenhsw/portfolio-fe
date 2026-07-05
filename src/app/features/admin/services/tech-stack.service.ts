// ============================================================
// TECH STACK SERVICE
// Skills Admin + Public API
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
  TechStackCategory,
  TechStackCategoryFormData,
  TechStackSectionConfig,
  TechStackSkill,
  TechStackSkillFormData,
  TechStackStatistic,
  TechStackStatisticFormData,
} from '../models/tech-stack.model';

export interface SkillsPublicCategory extends Omit<TechStackCategory, 'isActive'> {
  isActive?: boolean;
  skills?: Array<Omit<TechStackSkill, 'isActive' | 'categoryId'> & { isActive?: boolean }>;
}

export interface SkillsPublicAggregate {
  type: number;
  section: TechStackSectionConfig;
  statistics: Array<Omit<TechStackStatistic, 'isActive'> & { isActive?: boolean }>;
  categories: SkillsPublicCategory[];
}

@Injectable({ providedIn: 'root' })
export class TechStackService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly typeQuery = sectionTypeQuery();

  getPublic(): Observable<ApiResponse<SkillsPublicAggregate>> {
    return this.http
      .get<ApiResponse<SkillsPublicAggregate>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_PUBLIC}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSection(): Observable<ApiResponse<TechStackSectionConfig>> {
    return this.http
      .get<ApiResponse<TechStackSectionConfig>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_SECTION}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getStatistics(): Observable<ApiResponse<TechStackStatistic[]>> {
    return this.http
      .get<ApiResponse<TechStackStatistic[]>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_STATISTICS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getCategories(): Observable<ApiResponse<TechStackCategory[]>> {
    return this.http
      .get<ApiResponse<TechStackCategory[]>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_CATEGORIES}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSkills(): Observable<ApiResponse<TechStackSkill[]>> {
    return this.http
      .get<ApiResponse<TechStackSkill[]>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_ITEMS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSection(config: TechStackSectionConfig): Observable<ApiResponse<TechStackSectionConfig>> {
    return this.http
      .put<ApiResponse<TechStackSectionConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_SECTION}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createStatistic(data: TechStackStatisticFormData): Observable<ApiResponse<TechStackStatistic>> {
    return this.http
      .post<ApiResponse<TechStackStatistic>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_STATISTICS}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateStatistic(id: string, data: TechStackStatisticFormData): Observable<ApiResponse<TechStackStatistic>> {
    return this.http
      .put<ApiResponse<TechStackStatistic>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_STATISTIC_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteStatistic(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_STATISTIC_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setStatisticStatus(id: string, isActive: boolean): Observable<ApiResponse<TechStackStatistic>> {
    return this.http
      .patch<ApiResponse<TechStackStatistic>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_STATISTIC_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createCategory(data: TechStackCategoryFormData): Observable<ApiResponse<TechStackCategory>> {
    return this.http
      .post<ApiResponse<TechStackCategory>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_CATEGORIES}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateCategory(id: string, data: TechStackCategoryFormData): Observable<ApiResponse<TechStackCategory>> {
    return this.http
      .put<ApiResponse<TechStackCategory>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_CATEGORY_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteCategory(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_CATEGORY_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setCategoryStatus(id: string, isActive: boolean): Observable<ApiResponse<TechStackCategory>> {
    return this.http
      .patch<ApiResponse<TechStackCategory>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_CATEGORY_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createSkill(data: TechStackSkillFormData): Observable<ApiResponse<TechStackSkill>> {
    return this.http
      .post<ApiResponse<TechStackSkill>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_ITEMS}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSkill(id: string, data: TechStackSkillFormData): Observable<ApiResponse<TechStackSkill>> {
    return this.http
      .put<ApiResponse<TechStackSkill>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_ITEM_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteSkill(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.SKILLS_ITEM_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setSkillStatus(id: string, isActive: boolean): Observable<ApiResponse<TechStackSkill>> {
    return this.http
      .patch<ApiResponse<TechStackSkill>>(
        `${this.baseUrl}${API_ENDPOINTS.SKILLS_ITEM_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  private toError(error: HttpErrorResponse): { message: string; code?: string } {
    const body = error.error as { message?: string; error?: string } | null;
    return {
      message: body?.message || error.message || 'Request failed',
      code: body?.error || `HTTP_${error.status}`,
    };
  }
}

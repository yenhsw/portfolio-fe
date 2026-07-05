// ============================================================
// EXPERIENCE SERVICE
// Career Journey Admin + Public API
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
  CareerJourneySectionConfig,
  WorkExperience,
  WorkExperienceFormData,
} from '../models/career-journey.model';

export interface ExperiencePublicAggregate {
  type: number;
  section: CareerJourneySectionConfig;
  experiences: Array<Omit<WorkExperience, 'isActive'> & { isActive?: boolean }>;
}

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly typeQuery = sectionTypeQuery();

  getPublic(): Observable<ApiResponse<ExperiencePublicAggregate>> {
    return this.http
      .get<ApiResponse<ExperiencePublicAggregate>>(`${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_PUBLIC}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSection(): Observable<ApiResponse<CareerJourneySectionConfig>> {
    return this.http
      .get<ApiResponse<CareerJourneySectionConfig>>(`${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_SECTION}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getExperiences(): Observable<ApiResponse<WorkExperience[]>> {
    return this.http
      .get<ApiResponse<WorkExperience[]>>(`${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_EXPERIENCES}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSection(config: CareerJourneySectionConfig): Observable<ApiResponse<CareerJourneySectionConfig>> {
    return this.http
      .put<ApiResponse<CareerJourneySectionConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_SECTION}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createExperience(data: WorkExperienceFormData): Observable<ApiResponse<WorkExperience>> {
    return this.http
      .post<ApiResponse<WorkExperience>>(
        `${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_EXPERIENCES}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateExperience(id: string, data: WorkExperienceFormData): Observable<ApiResponse<WorkExperience>> {
    return this.http
      .put<ApiResponse<WorkExperience>>(
        `${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_EXPERIENCE_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteExperience(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_EXPERIENCE_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setExperienceStatus(id: string, isActive: boolean): Observable<ApiResponse<WorkExperience>> {
    return this.http
      .patch<ApiResponse<WorkExperience>>(
        `${this.baseUrl}${API_ENDPOINTS.EXPERIENCE_EXPERIENCE_STATUS(id)}`,
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

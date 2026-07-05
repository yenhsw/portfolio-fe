// ============================================================
// EDUCATIONAL SERVICE
// Educational Admin + Public API
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
  EducationalCertificate,
  EducationalCertificateFormData,
  EducationalHighlight,
  EducationalHighlightFormData,
  EducationalSectionConfig,
  EducationRecord,
  EducationRecordFormData,
  FutureGoal,
  FutureGoalFormData,
} from '../models/educational.model';

export interface EducationalPublicAggregate {
  type: number;
  section: EducationalSectionConfig;
  highlights: EducationalHighlight[];
  timeline: EducationRecord[];
  certificates: EducationalCertificate[];
  futureGoals: FutureGoal[];
}

@Injectable({ providedIn: 'root' })
export class EducationalService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly typeQuery = sectionTypeQuery();

  getPublic(): Observable<ApiResponse<EducationalPublicAggregate>> {
    return this.http
      .get<ApiResponse<EducationalPublicAggregate>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_PUBLIC}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSection(): Observable<ApiResponse<EducationalSectionConfig>> {
    return this.http
      .get<ApiResponse<EducationalSectionConfig>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_SECTION}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getHighlights(): Observable<ApiResponse<EducationalHighlight[]>> {
    return this.http
      .get<ApiResponse<EducationalHighlight[]>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_HIGHLIGHTS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getTimeline(): Observable<ApiResponse<EducationRecord[]>> {
    return this.http
      .get<ApiResponse<EducationRecord[]>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_TIMELINE}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getCertificates(): Observable<ApiResponse<EducationalCertificate[]>> {
    return this.http
      .get<ApiResponse<EducationalCertificate[]>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_CERTIFICATES}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getFutureGoals(): Observable<ApiResponse<FutureGoal[]>> {
    return this.http
      .get<ApiResponse<FutureGoal[]>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_FUTURE_GOALS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSection(config: EducationalSectionConfig): Observable<ApiResponse<EducationalSectionConfig>> {
    return this.http
      .put<ApiResponse<EducationalSectionConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_SECTION}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createHighlight(data: EducationalHighlightFormData): Observable<ApiResponse<EducationalHighlight>> {
    return this.http
      .post<ApiResponse<EducationalHighlight>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_HIGHLIGHTS}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateHighlight(id: string, data: EducationalHighlightFormData): Observable<ApiResponse<EducationalHighlight>> {
    return this.http
      .put<ApiResponse<EducationalHighlight>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_HIGHLIGHT_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteHighlight(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_HIGHLIGHT_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setHighlightStatus(id: string, isActive: boolean): Observable<ApiResponse<EducationalHighlight>> {
    return this.http
      .patch<ApiResponse<EducationalHighlight>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_HIGHLIGHT_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createTimelineItem(data: EducationRecordFormData): Observable<ApiResponse<EducationRecord>> {
    return this.http
      .post<ApiResponse<EducationRecord>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_TIMELINE}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateTimelineItem(id: string, data: EducationRecordFormData): Observable<ApiResponse<EducationRecord>> {
    return this.http
      .put<ApiResponse<EducationRecord>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_TIMELINE_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteTimelineItem(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_TIMELINE_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setTimelineStatus(id: string, isActive: boolean): Observable<ApiResponse<EducationRecord>> {
    return this.http
      .patch<ApiResponse<EducationRecord>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_TIMELINE_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createCertificate(data: EducationalCertificateFormData): Observable<ApiResponse<EducationalCertificate>> {
    return this.http
      .post<ApiResponse<EducationalCertificate>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_CERTIFICATES}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateCertificate(id: string, data: EducationalCertificateFormData): Observable<ApiResponse<EducationalCertificate>> {
    return this.http
      .put<ApiResponse<EducationalCertificate>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_CERTIFICATE_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteCertificate(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_CERTIFICATE_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setCertificateStatus(id: string, isActive: boolean): Observable<ApiResponse<EducationalCertificate>> {
    return this.http
      .patch<ApiResponse<EducationalCertificate>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_CERTIFICATE_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createFutureGoal(data: FutureGoalFormData): Observable<ApiResponse<FutureGoal>> {
    return this.http
      .post<ApiResponse<FutureGoal>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_FUTURE_GOALS}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateFutureGoal(id: string, data: FutureGoalFormData): Observable<ApiResponse<FutureGoal>> {
    return this.http
      .put<ApiResponse<FutureGoal>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_FUTURE_GOAL_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteFutureGoal(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_FUTURE_GOAL_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setFutureGoalStatus(id: string, isActive: boolean): Observable<ApiResponse<FutureGoal>> {
    return this.http
      .patch<ApiResponse<FutureGoal>>(
        `${this.baseUrl}${API_ENDPOINTS.EDUCATIONAL_FUTURE_GOAL_STATUS(id)}`,
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

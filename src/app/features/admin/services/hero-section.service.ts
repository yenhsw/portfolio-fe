// ============================================================
// HERO SECTION SERVICE
// Hero Admin + Public API
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
  HeroAvatarConfig,
  HeroButtonsConfig,
  HeroSectionConfig,
  HeroSocialFormData,
  HeroSocialLink,
  HeroTypingFormData,
  HeroTypingLine,
} from '../models/hero-section.model';

export interface HeroPublicAggregate {
  type: number;
  section: HeroSectionConfig;
  avatar: HeroAvatarConfig;
  buttons: HeroButtonsConfig;
  typingLines: HeroTypingLine[];
  socialLinks: HeroSocialLink[];
}

@Injectable({ providedIn: 'root' })
export class HeroSectionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly typeQuery = sectionTypeQuery();

  getPublic(): Observable<ApiResponse<HeroPublicAggregate>> {
    return this.http
      .get<ApiResponse<HeroPublicAggregate>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_PUBLIC}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSection(): Observable<ApiResponse<HeroSectionConfig>> {
    return this.http
      .get<ApiResponse<HeroSectionConfig>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_CONFIG}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getAvatar(): Observable<ApiResponse<HeroAvatarConfig>> {
    return this.http
      .get<ApiResponse<HeroAvatarConfig>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_AVATAR}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getButtons(): Observable<ApiResponse<HeroButtonsConfig>> {
    return this.http
      .get<ApiResponse<HeroButtonsConfig>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_BUTTONS}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getTypingLines(): Observable<ApiResponse<HeroTypingLine[]>> {
    return this.http
      .get<ApiResponse<HeroTypingLine[]>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_TYPING}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSocialLinks(): Observable<ApiResponse<HeroSocialLink[]>> {
    return this.http
      .get<ApiResponse<HeroSocialLink[]>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_SOCIAL}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSection(config: HeroSectionConfig): Observable<ApiResponse<HeroSectionConfig>> {
    return this.http
      .put<ApiResponse<HeroSectionConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_CONFIG}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateAvatar(config: HeroAvatarConfig): Observable<ApiResponse<HeroAvatarConfig>> {
    return this.http
      .put<ApiResponse<HeroAvatarConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_AVATAR}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateButtons(config: HeroButtonsConfig): Observable<ApiResponse<HeroButtonsConfig>> {
    return this.http
      .put<ApiResponse<HeroButtonsConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_BUTTONS}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createTypingLine(data: HeroTypingFormData): Observable<ApiResponse<HeroTypingLine>> {
    return this.http
      .post<ApiResponse<HeroTypingLine>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_TYPING}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateTypingLine(id: string, data: HeroTypingFormData): Observable<ApiResponse<HeroTypingLine>> {
    return this.http
      .put<ApiResponse<HeroTypingLine>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_TYPING_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteTypingLine(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_TYPING_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setTypingLineStatus(id: string, isActive: boolean): Observable<ApiResponse<HeroTypingLine>> {
    return this.http
      .patch<ApiResponse<HeroTypingLine>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_TYPING_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createSocialLink(data: HeroSocialFormData): Observable<ApiResponse<HeroSocialLink>> {
    return this.http
      .post<ApiResponse<HeroSocialLink>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_SOCIAL}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSocialLink(id: string, data: HeroSocialFormData): Observable<ApiResponse<HeroSocialLink>> {
    return this.http
      .put<ApiResponse<HeroSocialLink>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_SOCIAL_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteSocialLink(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_SOCIAL_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setSocialLinkStatus(id: string, isActive: boolean): Observable<ApiResponse<HeroSocialLink>> {
    return this.http
      .patch<ApiResponse<HeroSocialLink>>(
        `${this.baseUrl}${API_ENDPOINTS.HERO_SECTION_SOCIAL_STATUS(id)}`,
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

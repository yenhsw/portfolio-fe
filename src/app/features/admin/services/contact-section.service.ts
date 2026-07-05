// ============================================================
// CONTACT SECTION SERVICE
// Contact Admin + Public API + Form Submit
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
  ContactCtaConfig,
  ContactFormSettings,
  ContactInfoFormData,
  ContactInfoItem,
  ContactMailReceiveConfig,
  ContactMailSendConfig,
  ContactMailSendFormData,
  ContactMapConfig,
  ContactSectionConfig,
  ContactSocialFormData,
  ContactSocialItem,
  ContactSubmitRequest,
  ContactSubmitResponse,
} from '../models/contact-section.model';

export interface ContactPublicAggregate {
  type: number;
  section: ContactSectionConfig;
  contactInfo: Array<Omit<ContactInfoItem, 'isActive'> & { isActive?: boolean }>;
  socialLinks: Array<Omit<ContactSocialItem, 'isActive'> & { isActive?: boolean }>;
  map: ContactMapConfig;
  cta: ContactCtaConfig;
  form: ContactFormSettings;
}

@Injectable({ providedIn: 'root' })
export class ContactSectionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly typeQuery = sectionTypeQuery();

  getPublic(): Observable<ApiResponse<ContactPublicAggregate>> {
    return this.http
      .get<ApiResponse<ContactPublicAggregate>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_PUBLIC}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSection(): Observable<ApiResponse<ContactSectionConfig>> {
    return this.http
      .get<ApiResponse<ContactSectionConfig>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_SECTION}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getContactInfo(): Observable<ApiResponse<ContactInfoItem[]>> {
    return this.http
      .get<ApiResponse<ContactInfoItem[]>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_INFO}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getSocialLinks(): Observable<ApiResponse<ContactSocialItem[]>> {
    return this.http
      .get<ApiResponse<ContactSocialItem[]>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_SOCIAL}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getMap(): Observable<ApiResponse<ContactMapConfig>> {
    return this.http
      .get<ApiResponse<ContactMapConfig>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_MAP}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getCta(): Observable<ApiResponse<ContactCtaConfig>> {
    return this.http
      .get<ApiResponse<ContactCtaConfig>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_CTA}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getFormSettings(): Observable<ApiResponse<ContactFormSettings>> {
    return this.http
      .get<ApiResponse<ContactFormSettings>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_FORM}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getMailSendConfig(): Observable<ApiResponse<ContactMailSendConfig>> {
    return this.http
      .get<ApiResponse<ContactMailSendConfig>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_MAIL_SEND}`)
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  getMailReceiveConfig(): Observable<ApiResponse<ContactMailReceiveConfig>> {
    return this.http
      .get<ApiResponse<ContactMailReceiveConfig>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_MAIL_RECEIVE}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSection(config: ContactSectionConfig): Observable<ApiResponse<ContactSectionConfig>> {
    return this.http
      .put<ApiResponse<ContactSectionConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_SECTION}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createContactInfo(data: ContactInfoFormData): Observable<ApiResponse<ContactInfoItem>> {
    return this.http
      .post<ApiResponse<ContactInfoItem>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_INFO}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateContactInfo(id: string, data: ContactInfoFormData): Observable<ApiResponse<ContactInfoItem>> {
    return this.http
      .put<ApiResponse<ContactInfoItem>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_INFO_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteContactInfo(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_INFO_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setContactInfoStatus(id: string, isActive: boolean): Observable<ApiResponse<ContactInfoItem>> {
    return this.http
      .patch<ApiResponse<ContactInfoItem>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_INFO_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  createSocialLink(data: ContactSocialFormData): Observable<ApiResponse<ContactSocialItem>> {
    return this.http
      .post<ApiResponse<ContactSocialItem>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_SOCIAL}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateSocialLink(id: string, data: ContactSocialFormData): Observable<ApiResponse<ContactSocialItem>> {
    return this.http
      .put<ApiResponse<ContactSocialItem>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_SOCIAL_BY_ID(id)}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  deleteSocialLink(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT_SOCIAL_BY_ID(id)}`, {
        params: this.typeQuery,
      })
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  setSocialLinkStatus(id: string, isActive: boolean): Observable<ApiResponse<ContactSocialItem>> {
    return this.http
      .patch<ApiResponse<ContactSocialItem>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_SOCIAL_STATUS(id)}`,
        withSectionType({ isActive })
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateMap(config: ContactMapConfig): Observable<ApiResponse<ContactMapConfig>> {
    return this.http
      .put<ApiResponse<ContactMapConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_MAP}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateCta(config: ContactCtaConfig): Observable<ApiResponse<ContactCtaConfig>> {
    return this.http
      .put<ApiResponse<ContactCtaConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_CTA}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateFormSettings(config: ContactFormSettings): Observable<ApiResponse<ContactFormSettings>> {
    return this.http
      .put<ApiResponse<ContactFormSettings>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_FORM}`,
        withSectionType(config)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateMailSendConfig(
    data: Omit<ContactMailSendFormData, 'smtpPassword'> & { smtpPassword?: string }
  ): Observable<ApiResponse<ContactMailSendConfig>> {
    return this.http
      .put<ApiResponse<ContactMailSendConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_MAIL_SEND}`,
        data
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  updateMailReceiveConfig(data: ContactMailReceiveConfig): Observable<ApiResponse<ContactMailReceiveConfig>> {
    return this.http
      .put<ApiResponse<ContactMailReceiveConfig>>(
        `${this.baseUrl}${API_ENDPOINTS.CONTACT_MAIL_RECEIVE}`,
        withSectionType(data)
      )
      .pipe(catchError(error => throwError(() => this.toError(error))));
  }

  submitContact(data: ContactSubmitRequest): Observable<ApiResponse<ContactSubmitResponse>> {
    return this.http
      .post<ApiResponse<ContactSubmitResponse>>(`${this.baseUrl}${API_ENDPOINTS.CONTACT}`, data)
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

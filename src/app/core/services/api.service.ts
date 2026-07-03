// ============================================================
// API SERVICE
// Centralized HTTP service for API calls
// ============================================================

import { Injectable, inject, signal } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiError, ApiQueryParams } from '../models/api-response.interface';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();
  readonly loading = signal(false);

  // ============================================================
  // REQUEST METHODS
  // ============================================================

  get<T>(endpoint: string, options?: { params?: Record<string, string | number | boolean> }): Observable<T> {
    return this.request<T>('GET', endpoint, options);
  }

  post<T>(endpoint: string, body: unknown, options?: { params?: Record<string, string | number | boolean> }): Observable<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  put<T>(endpoint: string, body: unknown, options?: { params?: Record<string, string | number | boolean> }): Observable<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  patch<T>(endpoint: string, body: unknown, options?: { params?: Record<string, string | number | boolean> }): Observable<T> {
    return this.request<T>('PATCH', endpoint, { ...options, body });
  }

  delete<T>(endpoint: string, options?: { params?: Record<string, string | number | boolean> }): Observable<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  // ============================================================
  // PRIVATE REQUEST HANDLER
  // ============================================================

  private request<T>(
    method: string,
    endpoint: string,
    options?: { body?: unknown; params?: Record<string, string | number | boolean> }
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    let params = new HttpParams();
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }

    this._loading.next(true);
    this.loading.set(true);

    const requestOptions: {
      body?: unknown;
      params?: HttpParams;
      headers?: HttpHeaders;
    } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };

    if (options?.body) {
      requestOptions.body = options.body;
    }

    if (params.keys().length > 0) {
      requestOptions.params = params;
    }

    return this.http.request<T>(method, url, requestOptions).pipe(
      timeout(API_CONFIG.TIMEOUT),
      retry({ count: API_CONFIG.RETRY_ATTEMPTS, delay: API_CONFIG.RETRY_DELAY }),
      map((response) => {
        this._loading.next(false);
        this.loading.set(false);
        return response as T;
      }),
      catchError((error: HttpErrorResponse) => {
        this._loading.next(false);
        this.loading.set(false);
        return throwError(() => this.handleError(error));
      })
    );
  }

  // ============================================================
  // ERROR HANDLING
  // ============================================================

  private handleError(error: HttpErrorResponse): ApiError {
    let message = 'An unknown error occurred';
    let code = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
      code = 'NETWORK_ERROR';
    } else {
      message = error.error?.message || error.message;
      code = error.error?.code || this.getErrorCode(error.status);
    }

    return {
      success: false,
      error: {
        code,
        message,
        details: error.error?.details,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 422:
        return 'VALIDATION_ERROR';
      case 500:
        return 'INTERNAL_ERROR';
      case 502:
        return 'BAD_GATEWAY';
      case 503:
        return 'SERVICE_UNAVAILABLE';
      case 504:
        return 'TIMEOUT_ERROR';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  buildQueryParams(params: ApiQueryParams): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}

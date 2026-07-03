// ============================================================
// AUTH SERVICE
// Authentication API Service
// ============================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { User } from '../store/auth.store';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(request: LoginRequest): Observable<ApiResponse<LoginResponseData>> {
    return this.http
      .post<ApiResponse<LoginResponseData>>(`${this.baseUrl}${API_ENDPOINTS.AUTH_LOGIN}`, {
        email: request.email,
        password: request.password,
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toError(error))));
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http
      .post<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.AUTH_LOGOUT}`, {})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toError(error))));
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<Pick<LoginResponseData, 'accessToken' | 'expiresIn'>>> {
    return this.http
      .post<ApiResponse<Pick<LoginResponseData, 'accessToken' | 'expiresIn'>>>(
        `${this.baseUrl}${API_ENDPOINTS.AUTH_REFRESH}`,
        { refreshToken }
      )
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toError(error))));
  }

  me(): Observable<ApiResponse<User>> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}${API_ENDPOINTS.AUTH_ME}`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toError(error))));
  }

  private toError(error: HttpErrorResponse): { message: string; code?: string } {
    const body = error.error as { message?: string; error?: string } | null;
    return {
      message: body?.message || error.message || 'Request failed',
      code: body?.error || `HTTP_${error.status}`,
    };
  }
}

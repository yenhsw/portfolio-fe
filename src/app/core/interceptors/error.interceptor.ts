// ============================================================
// ERROR INTERCEPTOR
// Global error handling for HTTP responses
// ============================================================

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_CONFIG, HTTP_STATUS } from '../constants/api.constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case HTTP_STATUS.UNAUTHORIZED:
            errorMessage = error.error?.message || 'Session expired. Please login again.';
            if (!error.url?.includes('/api/auth/login')) {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              localStorage.removeItem('admin_refresh_token');
              localStorage.removeItem('auth_token');
            }
            break;
          case HTTP_STATUS.FORBIDDEN:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case HTTP_STATUS.NOT_FOUND:
            errorMessage = 'The requested resource was not found.';
            break;
          case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            errorMessage = 'Server error. Please try again later.';
            break;
          case HTTP_STATUS.SERVICE_UNAVAILABLE:
            errorMessage = 'Service is temporarily unavailable.';
            break;
          case HTTP_STATUS.BAD_REQUEST:
            errorMessage = error.error?.message || 'Invalid request.';
            break;
          default:
            errorMessage = error.error?.message || error.message;
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
      });

      return throwError(() => ({
        success: false,
        error: {
          code: error.error?.code || `HTTP_${error.status}`,
          message: errorMessage,
          details: error.error?.details,
        },
        timestamp: new Date().toISOString(),
      }));
    })
  );
};

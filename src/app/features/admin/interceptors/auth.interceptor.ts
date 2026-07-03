// ============================================================
// HTTP INTERCEPTOR
// Add Authorization Header to API Requests
// ============================================================

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';

function isPublicAuthRoute(url: string): boolean {
  return url.includes('/api/auth/login') || url.includes('/api/auth/refresh');
}

function shouldSkipUnauthorizedRedirect(url: string): boolean {
  return isPublicAuthRoute(url) || url.includes('/api/auth/logout');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  const token = authStore.getToken();
  const skipAuthHeader = isPublicAuthRoute(req.url);

  let authReq = req;
  if (token && !skipAuthHeader) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !shouldSkipUnauthorizedRedirect(req.url)) {
        authStore.logout();
      }
      return throwError(() => error);
    })
  );
};

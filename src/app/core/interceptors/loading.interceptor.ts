// ============================================================
// LOADING INTERCEPTOR
// Shows/hides global loading indicator
// ============================================================

import { HttpInterceptorFn } from '@angular/common/http';

let pendingRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  pendingRequests++;
  
  document.body.classList.add('loading-active');

  return next(req).pipe(
    /* finalize(() => {
      pendingRequests--;
      if (pendingRequests === 0) {
        document.body.classList.remove('loading-active');
      }
    }) */
  );
};

export const resetLoadingCount = (): void => {
  pendingRequests = 0;
  document.body.classList.remove('loading-active');
};

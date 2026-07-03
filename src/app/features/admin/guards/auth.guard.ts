// ============================================================
// AUTH GUARD
// Route Protection for Admin Pages
// ============================================================

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};

/**
 * Guest Guard - Redirects authenticated users away from login page
 */
export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin/dashboard']);
  return false;
};

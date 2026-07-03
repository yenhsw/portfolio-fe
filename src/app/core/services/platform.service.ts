// ============================================================
// PLATFORM SERVICE
// SSR-safe platform detection utilities
// ============================================================

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  // ============================================================
  // PLATFORM CHECKS
  // ============================================================

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isServer(): boolean {
    return !isPlatformBrowser(this.platformId);
  }

  get isMobile(): boolean {
    if (!this.isBrowser) return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  get isTablet(): boolean {
    if (!this.isBrowser) return false;
    return /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
  }

  get isDesktop(): boolean {
    if (!this.isBrowser) return true;
    return !this.isMobile && !this.isTablet;
  }

  get isTouch(): boolean {
    if (!this.isBrowser) return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  get isOnline(): boolean {
    if (!this.isBrowser) return true;
    return navigator.onLine;
  }

  get isSafari(): boolean {
    if (!this.isBrowser) return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  get isFirefox(): boolean {
    if (!this.isBrowser) return false;
    return /firefox/i.test(navigator.userAgent);
  }

  get isChrome(): boolean {
    if (!this.isBrowser) return false;
    return /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);
  }

  get isEdge(): boolean {
    if (!this.isBrowser) return false;
    return /edge/i.test(navigator.userAgent);
  }

  // ============================================================
  // SSR-SAFE WINDOW ACCESS
  // ============================================================

  get window(): Window | null {
    if (!this.isBrowser) return null;
    return window;
  }

  get document(): Document | null {
    if (!this.isBrowser) return null;
    return document;
  }

  get localStorage(): Storage | null {
    if (!this.isBrowser) return null;
    return localStorage;
  }

  get sessionStorage(): Storage | null {
    if (!this.isBrowser) return null;
    return sessionStorage;
  }

  get navigator(): Navigator | null {
    if (!this.isBrowser) return null;
    return navigator;
  }

  get location(): Location | null {
    if (!this.isBrowser) return null;
    return location;
  }

  // ============================================================
  // SSR-SAFE METHODS
  // ============================================================

  windowResize(callback: () => void): () => void {
    if (!this.isBrowser) return () => {};
    
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }

  scroll(callback: () => void): () => void {
    if (!this.isBrowser) return () => {};
    
    window.addEventListener('scroll', callback);
    return () => window.removeEventListener('scroll', callback);
  }

  online(callback: (isOnline: boolean) => void): () => void {
    if (!this.isBrowser) return () => {};
    
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

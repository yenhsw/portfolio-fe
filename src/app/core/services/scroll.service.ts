// ============================================================
// SCROLL SERVICE
// Smooth scrolling and scroll spy utilities
// ============================================================

import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NAVIGATION } from '../constants/ui.constants';

export interface ActiveSection {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);

  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _scrollY = signal<number>(0);
  private readonly _scrollX = signal<number>(0);
  private readonly _direction = signal<'up' | 'down' | 'none'>('none');
  private readonly _activeSection = signal<ActiveSection | null>(null);
  private readonly _scrollProgress = signal<number>(0);
  private readonly _isScrolling = signal<boolean>(false);

  // ============================================================
  // PUBLIC READONLY
  // ============================================================

  readonly scrollY = this._scrollY.asReadonly();
  readonly scrollX = this._scrollX.asReadonly();
  readonly direction = this._direction.asReadonly();
  readonly activeSection = this._activeSection.asReadonly();
  readonly scrollProgress = this._scrollProgress.asReadonly();
  readonly isScrolling = this._isScrolling.asReadonly();

  // ============================================================
  // PRIVATE PROPERTIES
  // ============================================================

  private lastScrollY = 0;
  private scrollingTimeout: ReturnType<typeof setTimeout> | null = null;

  // ============================================================
  // INITIALIZATION
  // ============================================================

  init(): void {
    if (!this.isBrowser) return;

    this.setupScrollListener();
    this.updateActiveSection();
  }

  destroy(): void {
    if (!this.isBrowser) return;

    window.removeEventListener('scroll', this.handleScroll, true);

    if (this.scrollingTimeout) {
      clearTimeout(this.scrollingTimeout);
    }
  }

  // ============================================================
  // SCROLL TO SECTION
  // ============================================================

  scrollToSection(sectionId: string, offset = NAVIGATION.SCROLL_OFFSET): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    if (!element) return;

    // Use smooth scrolling with proper offset
    const startPosition = window.pageYOffset;
    const endPosition = element.offsetTop - offset;
    const distance = endPosition - startPosition;
    const duration = Math.min(Math.abs(distance) * 0.5, 800); // Speed: 0.5ms per pixel, max 800ms
    let startTime: number | null = null;

    // Easing function for smooth animation
    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const animateScroll = (currentTime: number): void => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentPosition = startPosition + (distance * easedProgress);
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Ensure we end up at the exact position
        window.scrollTo({
          top: endPosition,
          behavior: 'auto'
        });
      }
    };

    requestAnimationFrame(animateScroll);
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  scrollToBottom(): void {
    if (!this.isBrowser) return;

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private handleScroll = (): void => {
    if (!this.isBrowser) return;

    const currentScrollY = window.pageYOffset;
    const currentScrollX = window.pageXOffset;

    // Update scroll position
    this._scrollY.set(currentScrollY);
    this._scrollX.set(currentScrollX);

    // Calculate direction
    if (currentScrollY > this.lastScrollY) {
      this._direction.set('down');
    } else if (currentScrollY < this.lastScrollY) {
      this._direction.set('up');
    } else {
      this._direction.set('none');
    }
    this.lastScrollY = currentScrollY;

    // Calculate scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
    this._scrollProgress.set(Math.min(100, Math.max(0, progress)));

    // Update active section (scroll spy)
    this.updateActiveSection();

    // Set scrolling state
    this._isScrolling.set(true);
    if (this.scrollingTimeout) {
      clearTimeout(this.scrollingTimeout);
    }
    this.scrollingTimeout = setTimeout(() => {
      this._isScrolling.set(false);
    }, 150);
  };

  private setupScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll, true);
  }

  private updateActiveSection(): void {
    if (!this.isBrowser) return;

    const sections = NAVIGATION.SECTIONS;
    const scrollPosition = this._scrollY() + NAVIGATION.SCROLL_OFFSET;

    // Get all section elements with their positions
    const sectionElements: { id: string; label: string; top: number; bottom: number }[] = [];

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + window.pageYOffset;
        const sectionBottom = sectionTop + rect.height;
        sectionElements.push({
          id: section.id,
          label: section.label,
          top: sectionTop,
          bottom: sectionBottom
        });
      }
    }

    // Sort by position (top to bottom)
    sectionElements.sort((a, b) => a.top - b.top);

    // Find the section whose top is closest to but not exceeding the scroll position
    // This ensures we highlight the correct section when scrolling up or down
    let activeSection: { id: string; label: string } | null = null;

    for (const section of sectionElements) {
      if (scrollPosition >= section.top - 50) {
        // Keep updating activeSection - the last one that passes will be active
        activeSection = { id: section.id, label: section.label };
      } else {
        // Since sections are sorted, once we hit one that doesn't pass,
        // all subsequent sections won't pass either
        break;
      }
    }

    // If at very top, default to first section
    if (!activeSection && sectionElements.length > 0) {
      activeSection = { id: sectionElements[0].id, label: sectionElements[0].label };
    }

    if (activeSection) {
      this._activeSection.set(activeSection);
    }
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  isInViewport(element: HTMLElement, partial = true): boolean {
    if (!this.isBrowser) return false;

    const { top, left, bottom, right } = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (partial) {
      const vtop = top < windowHeight;
      const vbottom = bottom > 0;
      const htop = left < windowWidth;
      const hbottom = right > 0;
      return (vtop && vbottom) && (htop && hbottom);
    }

    return top >= 0 && left >= 0 && bottom <= windowHeight && right <= windowWidth;
  }

  isAboveViewport(element: HTMLElement): boolean {
    if (!this.isBrowser) return false;
    return element.getBoundingClientRect().bottom < 0;
  }

  isBelowViewport(element: HTMLElement): boolean {
    if (!this.isBrowser) return false;
    return element.getBoundingClientRect().top > window.innerHeight;
  }
}

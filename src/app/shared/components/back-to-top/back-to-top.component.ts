// ============================================================
// BACK TO TOP COMPONENT
// Floating button to scroll to top
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollService, PlatformService } from '../../../core/services';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <button
        class="back-to-top"
        (click)="scrollToTop()"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    }
  `,
  styleUrl: './back-to-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService);
  private readonly platformService = inject(PlatformService);

  isVisible = signal(false);

  private scrollHandler = (): void => {
    if (!this.platformService.isBrowser) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.isVisible.set(scrollY > 500);
  };

  ngOnInit(): void {
    if (this.platformService.isBrowser) {
      window.addEventListener('scroll', this.scrollHandler, true);
    }
  }

  ngOnDestroy(): void {
    if (this.platformService.isBrowser) {
      window.removeEventListener('scroll', this.scrollHandler, true);
    }
  }

  scrollToTop(): void {
    this.scrollService.scrollToTop();
  }
}

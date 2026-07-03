// ============================================================
// SCROLL PROGRESS COMPONENT
// Progress bar at the top of the page
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
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scroll-progress-container">
      <div
        class="scroll-progress-bar"
        [style.width.%]="progress()"
      ></div>
    </div>
  `,
  styleUrl: './scroll-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService);
  private readonly platformService = inject(PlatformService);

  progress = signal(0);

  ngOnInit(): void {
    if (this.platformService.isBrowser) {
      this.setupScrollListener();
    }
  }

  ngOnDestroy(): void {
    // Cleanup handled by scroll service
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll, true);
  }

  private handleScroll = (): void => {
    if (!this.platformService.isBrowser) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      this.progress.set(progress);
    }
  };
}

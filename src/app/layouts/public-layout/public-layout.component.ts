// ============================================================
// PUBLIC LAYOUT COMPONENT
// Main layout with background effects
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollService, PlatformService } from '../../core/services';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="public-layout">
      <!-- Multi-layer Background -->
      <div class="tech-background">
        <div class="bg-gradient"></div>
        <div class="bg-grid"></div>
        <div class="bg-circuit"></div>
        <div class="bg-glow">
          <div class="glow-orb orb-1"></div>
          <div class="glow-orb orb-2"></div>
        </div>
        <div class="bg-noise"></div>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './public-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService);
  private readonly platformService = inject(PlatformService);

  ngOnInit(): void {
    if (this.platformService.isBrowser) {
      this.scrollService.init();
    }
  }

  ngOnDestroy(): void {
    if (this.platformService.isBrowser) {
      this.scrollService.destroy();
    }
  }
}

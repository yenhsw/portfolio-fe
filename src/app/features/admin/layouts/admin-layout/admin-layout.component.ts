// ============================================================
// ADMIN LAYOUT COMPONENT
// Main Layout with Sidebar, Topbar, and Content Area
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { LocaleService } from '../../../../core/services/locale.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="admin-layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <!-- Sidebar -->
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        (toggleCollapse)="toggleSidebar()"
      ></app-sidebar>

      <!-- Main Content -->
      <div class="main-wrapper">
        <!-- Topbar -->
        <app-topbar
          [sidebarCollapsed]="sidebarCollapsed()"
          (toggleSidebar)="toggleSidebar()"
        ></app-topbar>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <footer class="admin-footer">
          <p>© {{ currentYear }} YHS.DEV Admin Panel</p>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  readonly currentYear = new Date().getFullYear();
  readonly sidebarCollapsed = signal(false);

  private readonly locale = inject(LocaleService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.locale.locale();
      this.cdr.markForCheck();
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}

// ============================================================
// PROJECTS COMPONENT
// Featured Projects Showcase — wired to FeaturedProjectsStore
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FeaturedProjectsStore } from '../../../admin/store/featured-projects.store';
import { FeaturedProjectStatus } from '../../../admin/models/featured-projects.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly store = inject(FeaturedProjectsStore);

  isVisible = signal(false);
  activeFilter = signal('all');
  expandedId = signal<string | null>(null);
  hoveredId = signal<string | null>(null);

  readonly section = this.store.section;
  readonly filters = this.store.activeFilters;
  readonly hasAnyContent = this.store.hasAnyContent;

  readonly filteredProjects = computed(() =>
    this.store.filterProjects(this.activeFilter()),
  );

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.store.load();
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible()) {
            this.isVisible.set(true);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 },
    );

    setTimeout(() => {
      const section = document.querySelector('.projects-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  setFilter(filterKey: string): void {
    this.activeFilter.set(filterKey);
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  onCardHover(id: string): void {
    this.hoveredId.set(id);
  }

  onCardLeave(): void {
    this.hoveredId.set(null);
  }

  getStatusLabel(status: FeaturedProjectStatus): string {
    const labels: Record<FeaturedProjectStatus, string> = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      private: 'Private',
      'open-source': 'Open Source',
    };
    return labels[status];
  }
}

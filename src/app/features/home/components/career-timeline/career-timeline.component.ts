// ============================================================
// CAREER TIMELINE COMPONENT
// Section EDUCATIONAL — data from EducationalStore
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
  effect,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EducationalStore } from '../../../admin/store/educational.store';

@Component({
  selector: 'app-career-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career-timeline.component.html',
  styleUrl: './career-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerTimelineComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly eduStore = inject(EducationalStore);

  isVisible = signal(false);
  scrollProgress = signal(0);
  revealedItems = signal<Set<string>>(new Set());
  displayValues = signal<number[]>([]);
  hoveredItem = signal<string | null>(null);
  hoveredCert = signal<string | null>(null);

  readonly section = computed(() => this.eduStore.section());
  readonly highlights = computed(() => this.eduStore.activeHighlights());
  readonly timelineItems = computed(() => this.eduStore.activeTimeline());
  readonly certificates = computed(() => this.eduStore.activeCertificates());
  readonly futureGoals = computed(() => this.eduStore.activeFutureGoals());

  readonly hasHighlights = computed(() => this.highlights().length > 0);
  readonly hasTimeline = computed(() => this.timelineItems().length > 0);
  readonly hasCertificates = computed(() => this.certificates().length > 0);
  readonly hasFutureGoals = computed(() => this.futureGoals().length > 0);
  readonly hasAnyContent = computed(
    () => this.hasHighlights() || this.hasTimeline() || this.hasCertificates() || this.hasFutureGoals()
  );

  private observer: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private animationFrames: ReturnType<typeof setTimeout>[] = [];
  private animationStarted = false;

  constructor() {
    effect(() => {
      const items = this.highlights();
      if (items.length > 0 && this.displayValues().length !== items.length) {
        this.displayValues.set(items.map(() => 0));
      }
    });
  }

  ngOnInit(): void {
    this.eduStore.load();
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
      this.setupScrollListener();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    this.animationFrames.forEach(id => clearTimeout(id));
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isVisible()) {
          this.isVisible.set(true);
          this.startAchievementAnimation();
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      const section = document.querySelector('.career-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  private setupScrollListener(): void {
    this.scrollHandler = () => {
      const section = document.querySelector('.career-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.clientHeight;
      const viewportHeight = window.innerHeight;
      const items = this.timelineItems();

      const visibleProgress = Math.min(
        100,
        Math.max(0, ((viewportHeight - rect.top) / (sectionHeight + viewportHeight)) * 100)
      );

      this.scrollProgress.set(visibleProgress);

      if (items.length === 0) return;

      items.forEach((item, index) => {
        const threshold = ((index + 1) / items.length) * 100;
        if (visibleProgress > threshold * 0.7) {
          this.revealedItems.update(set => {
            const newSet = new Set(set);
            newSet.add(item.id);
            return newSet;
          });
        }
      });
    };

    window.addEventListener('scroll', this.scrollHandler, true);
  }

  private startAchievementAnimation(): void {
    if (this.animationStarted) return;
    this.animationStarted = true;

    const items = this.highlights();
    if (items.length === 0) return;

    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;
      const values = items.map(item => Math.round(item.valueNumber * progress));
      this.displayValues.set(values);

      if (currentStep < steps) {
        const timeoutId = setTimeout(animate, stepDuration);
        this.animationFrames.push(timeoutId);
      } else {
        this.displayValues.set(items.map(item => item.valueNumber));
      }
    };

    const timeoutId = setTimeout(animate, 300);
    this.animationFrames.push(timeoutId);
  }

  onCardHover(id: string): void {
    this.hoveredItem.set(id);
  }

  onCardLeave(): void {
    this.hoveredItem.set(null);
  }

  onCertHover(id: string): void {
    this.hoveredCert.set(id);
  }

  onCertLeave(): void {
    this.hoveredCert.set(null);
  }
}

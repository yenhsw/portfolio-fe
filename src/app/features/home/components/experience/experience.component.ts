// ============================================================
// EXPERIENCE COMPONENT
// Career Journey Timeline — wired to CareerJourneyStore
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
import { CareerJourneyStore } from '../../../admin/store/career-journey.store';
import { WorkExperience } from '../../../admin/models/career-journey.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly store = inject(CareerJourneyStore);

  isVisible = signal(false);
  scrollProgress = signal(0);
  expandedId = signal<string | null>(null);
  hoveredId = signal<string | null>(null);
  private achievementValues = signal<Record<string, number>>({});

  readonly section = this.store.section;
  readonly experiences = this.store.activeExperiences;
  readonly hasAnyContent = this.store.hasAnyContent;

  readonly hasSectionHeader = computed(() => {
    const s = this.section();
    return !!(s.sectionTag?.trim() || s.titleAccent?.trim() || s.titleText?.trim() || s.subtitle?.trim());
  });

  private observer: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private animationFrames: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    this.store.load();
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
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible()) {
            this.isVisible.set(true);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.2 },
    );

    setTimeout(() => {
      const section = document.querySelector('.experience-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  private setupScrollListener(): void {
    this.scrollHandler = () => {
      const section = document.querySelector('.experience-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.clientHeight;
      const viewportHeight = window.innerHeight;
      const visibleProgress = Math.min(
        100,
        Math.max(0, ((viewportHeight - rect.top) / (sectionHeight + viewportHeight)) * 100),
      );
      this.scrollProgress.set(visibleProgress);
    };

    window.addEventListener('scroll', this.scrollHandler, true);
  }

  toggleExpand(id: string): void {
    if (this.expandedId() === id) {
      this.expandedId.set(null);
    } else {
      this.expandedId.set(id);
      this.animateAchievements(id);
    }
  }

  onCardHover(id: string): void {
    this.hoveredId.set(id);
  }

  onCardLeave(): void {
    this.hoveredId.set(null);
  }

  getDisplayValue(expId: string, label: string): number {
    return this.achievementValues()[`${expId}-${label}`] || 0;
  }

  private animateAchievements(expId: string): void {
    const experience = this.experiences().find(e => e.id === expId);
    if (!experience) return;

    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;
      const newValues: Record<string, number> = {};

      experience.achievements.forEach(achievement => {
        const key = `${expId}-${achievement.label}`;
        newValues[key] = Math.round(achievement.value * progress);
      });

      this.achievementValues.set({ ...this.achievementValues(), ...newValues });

      if (currentStep < steps) {
        const timeoutId = setTimeout(animate, stepDuration);
        this.animationFrames.push(timeoutId);
      }
    };

    const timeoutId = setTimeout(animate, 100);
    this.animationFrames.push(timeoutId);
  }
}

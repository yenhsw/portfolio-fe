// ============================================================
// SKILLS COMPONENT
// Tech Stack Dashboard — wired to TechStackStore
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TechStackStore } from '../../../admin/store/tech-stack.store';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly store = inject(TechStackStore);

  isVisible = signal(false);
  displayValues = signal<number[]>([]);
  hoveredSkill = signal<string | null>(null);

  readonly section = this.store.section;
  readonly statistics = this.store.activeStatistics;
  readonly skillCategories = this.store.skillCategories;
  readonly hasAnyContent = this.store.hasAnyContent;

  private observer: IntersectionObserver | null = null;
  private animationFrame: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.store.load();
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.animationFrame) {
      clearTimeout(this.animationFrame);
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isVisible()) {
            this.isVisible.set(true);
            this.startCountAnimation();
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.2 },
    );

    setTimeout(() => {
      const section = document.querySelector('.skills-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  private startCountAnimation(): void {
    const stats = this.statistics();
    if (stats.length === 0) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;
      const values = stats.map(stat => Math.round(stat.valueNumber * progress));
      this.displayValues.set(values);

      if (currentStep < steps) {
        this.animationFrame = setTimeout(animate, stepDuration);
      } else {
        this.displayValues.set(stats.map(stat => stat.valueNumber));
      }
    };

    setTimeout(animate, 300);
  }

  onSkillHover(skillName: string): void {
    this.hoveredSkill.set(skillName);
  }

  onSkillLeave(): void {
    this.hoveredSkill.set(null);
  }
}

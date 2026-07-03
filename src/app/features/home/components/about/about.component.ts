// ============================================================
// ABOUT COMPONENT
// CV-style about section
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

interface Education {
  school: string;
  degree: string;
  year: string;
  details?: string;
}

interface Course {
  name: string;
  provider: string;
  year: string;
  icon: string;
}

interface Statistic {
  value: number;
  suffix: string;
  label: string;
}

interface Language {
  name: string;
  level: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  // Signals
  isVisible = signal(false);
  displayValues = signal<number[]>([0, 0, 0, 0]);

  // Data
  readonly statistics: Statistic[] = [
    { value: 10, suffix: '+', label: 'Projects' },
    { value: 3, suffix: '+', label: 'Years Experience' },
    { value: 100, suffix: '+', label: 'API Endpoints' },
    { value: 5, suffix: '+', label: 'Technologies' },
  ];

  readonly education: Education[] = [
    {
      school: 'Hung Yen University of Technology and Education',
      degree: 'Bachelor of Computer Science',
      year: '2021 - 2025',
      details: 'GPA: 3.5/4.0 - Relevant coursework: Data Structures, Algorithms, Database Systems',
    },
  ];

  readonly courses: Course[] = [
    {
      name: 'Angular - The Complete Guide',
      provider: 'Udemy',
      year: '2023',
      icon: '💠',
    },
    {
      name: 'React - Complete Guide',
      provider: 'Udemy',
      year: '2023',
      icon: '⚛️',
    },
    {
      name: 'Spring Boot Fundamentals',
      provider: 'Udemy',
      year: '2023',
      icon: '🍃',
    },
  ];

  readonly hardSkills = [
    'Java, TypeScript, Python',
    'Angular, React, Spring Boot',
    'PostgreSQL, MongoDB, Redis',
    'Git, Docker, Linux',
    'RESTful API, Microservices',
    'Agile/Scrum methodology',
  ];

  readonly softSkills = [
    'Problem Solving',
    'Team Collaboration',
    'Communication',
    'Time Management',
    'Adaptability',
    'Self-learning',
  ];

  readonly languages: Language[] = [
    { name: 'Vietnamese', level: 'Native' },
    { name: 'English', level: 'IELTS 7.0' },
  ];

  private observer: IntersectionObserver | null = null;
  private animationFrame: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animationFrame) {
      clearTimeout(this.animationFrame);
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isVisible()) {
          this.isVisible.set(true);
          this.startCountAnimation();
        }
      });
    }, options);

    setTimeout(() => {
      const section = document.querySelector('.about-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  private startCountAnimation(): void {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;

      const values = this.statistics.map((stat) => {
        return Math.round(stat.value * progress);
      });

      this.displayValues.set(values);

      if (currentStep < steps) {
        this.animationFrame = setTimeout(animate, stepDuration);
      } else {
        this.displayValues.set(this.statistics.map((stat) => stat.value));
      }
    };

    setTimeout(animate, 500);
  }
}

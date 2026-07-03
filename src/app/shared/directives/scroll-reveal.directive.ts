// ============================================================
// SCROLL REVEAL DIRECTIVE
// Reveal elements on scroll
// ============================================================

import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ANIMATION } from '../../core/constants';

export type ScrollRevealAnimation = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'zoom';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  @Input() appScrollReveal = 'fade-up';
  @Input() revealDelay = 0;
  @Input() revealDuration = 600;
  @Input() revealThreshold = 0.2;
  @Input() revealOnce = true;

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.setupInitialStyles();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private setupInitialStyles(): void {
    const element = this.el.nativeElement as HTMLElement;

    element.style.opacity = '0';
    element.style.transition = `opacity ${this.revealDuration}ms ease-out, transform ${this.revealDuration}ms ease-out`;
    element.style.transitionDelay = `${this.revealDelay}ms`;

    switch (this.appScrollReveal) {
      case 'fade-up':
        element.style.transform = 'translateY(30px)';
        break;
      case 'fade-down':
        element.style.transform = 'translateY(-30px)';
        break;
      case 'fade-left':
        element.style.transform = 'translateX(30px)';
        break;
      case 'fade-right':
        element.style.transform = 'translateX(-30px)';
        break;
      case 'scale':
        element.style.transform = 'scale(0.9)';
        break;
      case 'zoom':
        element.style.transform = 'scale(0.8)';
        break;
    }
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: this.revealThreshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.reveal();
          if (this.revealOnce) {
            this.disconnectObserver();
          }
        } else if (!this.revealOnce) {
          this.hide();
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private reveal(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.opacity = '1';
    element.style.transform = 'translate(0) scale(1)';
  }

  private hide(): void {
    this.setupInitialStyles();
  }

  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

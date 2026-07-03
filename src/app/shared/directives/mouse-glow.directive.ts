// ============================================================
// MOUSE GLOW DIRECTIVE
// Follow mouse with glow effect
// ============================================================

import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appMouseGlow]',
  standalone: true,
})
export class MouseGlowDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  @Input() glowRadius = 150;
  @Input() glowColor = 'rgba(0, 245, 255, 0.15)';
  @Input() glowEnabled = true;

  private glowEl: HTMLElement | null = null;
  private animationFrame: number | null = null;

  ngOnInit(): void {
    if (!this.isBrowser || !this.glowEnabled) return;

    this.ngZone.runOutsideAngular(() => {
      this.createGlowElement();
      this.setupEventListeners();
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.removeGlowElement();
    this.cleanup();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private createGlowElement(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    this.glowEl = document.createElement('div');
    this.glowEl.className = 'mouse-glow-element';
    this.glowEl.style.cssText = `
      position: absolute;
      pointer-events: none;
      border-radius: 50%;
      background: radial-gradient(circle, ${this.glowColor} 0%, transparent 70%);
      width: ${this.glowRadius * 2}px;
      height: ${this.glowRadius * 2}px;
      transform: translate(-50%, -50%);
      opacity: 0;
      z-index: 1;
      transition: opacity 0.3s ease;
      will-change: left, top;
    `;

    element.appendChild(this.glowEl);
  }

  private removeGlowElement(): void {
    if (this.glowEl && this.glowEl.parentNode) {
      this.glowEl.parentNode.removeChild(this.glowEl);
    }
  }

  private setupEventListeners(): void {
    const element = this.el.nativeElement as HTMLElement;

    element.addEventListener('mouseenter', this.handleMouseEnter);
    element.addEventListener('mouseleave', this.handleMouseLeave);
    element.addEventListener('mousemove', this.handleMouseMove, true);
  }

  private handleMouseEnter = (): void => {
    if (this.glowEl) {
      this.glowEl.style.opacity = '1';
    }
  };

  private handleMouseLeave = (): void => {
    if (this.glowEl) {
      this.glowEl.style.opacity = '0';
    }
  };

  private handleMouseMove = (event: MouseEvent): void => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      if (!this.glowEl) return;

      const rect = this.el.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.glowEl.style.left = `${x}px`;
      this.glowEl.style.top = `${y}px`;
    });
  };

  private cleanup(): void {
    const element = this.el.nativeElement as HTMLElement;

    element.removeEventListener('mouseenter', this.handleMouseEnter);
    element.removeEventListener('mouseleave', this.handleMouseLeave);
    element.removeEventListener('mousemove', this.handleMouseMove);

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

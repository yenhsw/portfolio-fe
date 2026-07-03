// ============================================================
// CLICK OUTSIDE DIRECTIVE
// Detect clicks outside an element
// ============================================================

import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  @Output() appClickOutside = new EventEmitter<MouseEvent>();

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      document.addEventListener('click', this.handleClick);
    }, 0);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    document.removeEventListener('click', this.handleClick);
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const element = this.el.nativeElement as HTMLElement;

    if (!element.contains(target)) {
      this.appClickOutside.emit(event);
    }
  };
}

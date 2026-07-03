// ============================================================
// DEBOUNCE DIRECTIVE
// Debounce event emissions
// ============================================================

import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appDebounceClick]',
  standalone: true,
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  @Input() debounceTime = 500;
  @Output() appDebounceClick = new EventEmitter<MouseEvent>();

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const element = this.el.nativeElement as HTMLElement;
    element.addEventListener('click', this.handleClick);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    const element = this.el.nativeElement as HTMLElement;
    element.removeEventListener('click', this.handleClick);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private handleClick = (event: MouseEvent): void => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.appDebounceClick.emit(event);
    }, this.debounceTime);
  };
}

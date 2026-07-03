// ============================================================
// NAVBAR COMPONENT
// Fixed navbar with scroll spy and sliding indicator animation
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../../core/services';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'career', label: 'Career' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()" [class.mobile-open]="mobileMenuOpen()">
      <div class="navbar-container">
        <!-- Logo -->
        <a class="navbar-logo" (click)="scrollToSection('home', 0)">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">YHS.DEV</span>
          <span class="logo-bracket">/&gt;</span>
        </a>

        <!-- Desktop Menu -->
        <ul class="navbar-menu" #menuRef>
          @for (item of navItems; track item.id; let i = $index) {
            <li class="nav-item">
              <a
                class="nav-link"
                [class.active]="visualActiveIndex() === i"
                (click)="scrollToSection(item.id, i)"
              >
                {{ item.label }}
              </a>
            </li>
          }
          <div
            class="nav-indicator"
            [style.left.px]="indicatorLeft()"
            [style.width.px]="indicatorWidth()"
          ></div>
        </ul>

        
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen()">
        <ul class="mobile-menu-list">
          @for (item of navItems; track item.id; let i = $index) {
            <li class="mobile-nav-item">
              <a
                class="mobile-nav-link"
                [class.active]="visualActiveIndex() === i"
                (click)="scrollToSection(item.id, i); closeMobileMenu()"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('menuRef') menuRef!: ElementRef<HTMLElement>;

  readonly navItems = NAV_ITEMS;
  private readonly scrollService = inject(ScrollService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  activeIndex = signal(0);
  visualActiveIndex = signal(0);
  indicatorLeft = signal(0);
  indicatorWidth = signal(0);

  private animationId: number | null = null;
  private positions: { left: number; width: number }[] = [];
  private menuRect: DOMRect | null = null;
  private isScrollingToSection = false;

  ngOnInit(): void {
    // Public home uses dynamic content from admin — no locale switch here
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      this.calculatePositions();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      this.updateActiveFromScroll(scrollY);
      this.cdr.markForCheck();
    }, 100);

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private onResize = (): void => {
    if (!isPlatformBrowser(this.platformId)) return;
    this.calculatePositions();
    this.updateIndicatorImmediate(this.activeIndex());
  };

  private calculatePositions(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const menu = this.menuRef?.nativeElement;
    if (!menu) return;

    this.menuRect = menu.getBoundingClientRect();
    const links = menu.querySelectorAll('.nav-link');

    this.positions = [];
    for (let i = 0; i < links.length; i++) {
      const link = links[i] as HTMLElement;
      const rect = link.getBoundingClientRect();
      this.positions.push({
        left: rect.left - this.menuRect!.left,
        width: rect.width,
      });
    }

    if (this.positions.length > 0) {
      const idx = this.activeIndex();
      this.indicatorLeft.set(this.positions[idx]?.left || 0);
      this.indicatorWidth.set(this.positions[idx]?.width || 0);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled.set(scrollY > 50);

    if (this.isScrollingToSection) return;

    this.updateActiveFromScroll(scrollY);
    this.cdr.markForCheck();
  }

  private updateActiveFromScroll(scrollY: number): void {
    let newActiveIndex = 0;
    let bestScore = Infinity;

    NAV_ITEMS.forEach((item, index) => {
      const element = document.getElementById(item.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const offset = scrollY - sectionTop;
        if (offset >= -200 && offset < bestScore) {
          bestScore = offset;
          newActiveIndex = index;
        }
      }
    });

    if (newActiveIndex !== this.activeIndex()) {
      this.activeIndex.set(newActiveIndex);
      this.visualActiveIndex.set(newActiveIndex);
      this.updateIndicatorImmediate(newActiveIndex);
    }
  }

  scrollToSection(sectionId: string, targetIndex: number): void {
    const fromIndex = this.visualActiveIndex();
    this.isScrollingToSection = true;
    this.activeIndex.set(targetIndex);
    this.scrollService.scrollToSection(sectionId);

    if (targetIndex !== fromIndex) {
      this.animateTo(fromIndex, targetIndex);
    } else {
      this.updateIndicatorImmediate(targetIndex);
    }

    setTimeout(() => {
      this.isScrollingToSection = false;
      this.cdr.markForCheck();
    }, 500);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  private updateIndicatorImmediate(index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.positions.length === 0) {
      this.calculatePositions();
    }
    if (this.positions[index]) {
      this.indicatorLeft.set(this.positions[index].left);
      this.indicatorWidth.set(this.positions[index].width);
    }
  }

  private animateTo(fromIndex: number, toIndex: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.positions.length === 0) {
      this.calculatePositions();
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const startLeft = this.positions[fromIndex]?.left || 0;
    const startWidth = this.positions[fromIndex]?.width || 0;
    const endLeft = this.positions[toIndex]?.left || 0;
    const endWidth = this.positions[toIndex]?.width || 0;

    const duration = 300;
    const startTime = performance.now();

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const totalProgress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - totalProgress, 3);

      this.indicatorLeft.set(startLeft + (endLeft - startLeft) * eased);
      this.indicatorWidth.set(startWidth + (endWidth - startWidth) * eased);

      if (totalProgress >= 0.5 && this.visualActiveIndex() !== toIndex) {
        this.visualActiveIndex.set(toIndex);
        this.cdr.markForCheck();
      }

      if (totalProgress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.indicatorLeft.set(endLeft);
        this.indicatorWidth.set(endWidth);
        this.animationId = null;
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }
}

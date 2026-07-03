// ============================================================
// FOOTER COMPONENT
// Footer — wired to FooterSectionStore
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FooterSectionStore } from '../../../admin/store/footer-section.store';

interface SocialLinkView {
  name: string;
  icon: SafeHtml;
  url: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  readonly store = inject(FooterSectionStore);

  readonly currentYear = new Date().getFullYear();
  readonly showButton = signal(false);

  readonly brand = this.store.brand;
  readonly columnTitles = this.store.columnTitles;
  readonly divider = this.store.divider;
  readonly tech = this.store.tech;
  readonly bottom = this.store.bottom;

  readonly quickLinks = this.store.activeQuickLinks;
  readonly services = this.store.activeServices;
  readonly contactItems = this.store.activeContactItems;
  readonly techStack = this.store.activeTechBadges;

  readonly socialLinks = computed((): SocialLinkView[] =>
    this.store.activeSocialLinks().map(item => ({
      name: item.name,
      url: item.url,
      icon: this.sanitizer.bypassSecurityTrustHtml(item.iconSvg),
    })),
  );

  readonly copyrightText = computed(() =>
    this.store.bottom().copyrightTemplate.replace('{year}', String(this.currentYear)),
  );

  private scrollHandler = (): void => this.handleScroll();

  ngOnInit(): void {
    this.store.load();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      this.handleScroll();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  private handleScroll(): void {
    const threshold = this.store.bottom().backToTopThreshold || 500;
    this.showButton.set(window.scrollY > threshold);
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

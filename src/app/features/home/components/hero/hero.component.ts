// ============================================================
// HERO COMPONENT
// Full-screen hero with typing effect and tech orbit
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
  computed,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TechButtonComponent } from '../../../../shared/components';
import { HeroSectionStore } from '../../../admin/store/hero-section.store';
import { ScrollService } from '../../../../core/services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TechButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollService);
  readonly store = inject(HeroSectionStore);

  /** Query tất cả <rect.snake-path> của các social-badge. */
  @ViewChildren('snakePath', { read: ElementRef })
  private snakePaths!: QueryList<ElementRef<SVGRectElement>>;

  /** Query tất cả <a.social-badge> để áp class is-active. */
  @ViewChildren('socialBadge', { read: ElementRef })
  private socialBadges!: QueryList<ElementRef<HTMLAnchorElement>>;

  readonly section = computed(() => this.store.section());
  readonly avatar = computed(() => this.store.avatar());
  readonly buttons = computed(() => this.store.buttons());
  readonly socialLinks = computed(() => this.store.activeSocialLinks());

  currentText = signal('');
  imageError = signal(false);
  private typingIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * ONE BY ONE animation params.
   * Mỗi badge có slot = 1.2s. Trong slot: vẽ 0.6s (0→174) rồi reset 0.6s.
   * Tổng cycle = total * slot = 5 * 1.2 = 6s. Lặp vô hạn.
   * Implement bằng requestAnimationFrame + set stroke-dasharray trực tiếp
   * (không dùng SMIL để tránh vấn đề keyTimes không strictly increasing).
   */
  readonly drawSlot = 2.0;       // s — thời gian 1 slot (vẽ + reset)
  readonly drawTime = 1.2;       // s — thời gian vẽ (0 → 174)
  private rafId: number | null = null;
  private readonly startTime = performance.now();

  ngOnInit(): void {
    this.store.load();
    if (isPlatformBrowser(this.platformId)) {
      this.startTypingEffect();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Chạy animation ngoài Angular zone để không trigger change detection liên tục
    this.zone.runOutsideAngular(() => this.animateLoop());
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  scrollToContact(): void {
    const target = this.buttons().contactScrollTarget?.trim() || 'contact';
    this.scrollService.scrollToSection(target);
  }

  downloadCv(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = this.buttons().cvUrl?.trim();
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Vòng lặp animation: tại mỗi frame, tính t = elapsed % totalCycle.
   * Với mỗi badge i: xác định slotStart = i*drawSlot, slotEnd = (i+1)*drawSlot.
   *   - Nếu t nằm trong [slotStart, slotStart + drawTime]: dasharray = ((t - slotStart)/drawTime * 174) + ' 0'
   *   - Ngược lại: dasharray = "0 174" (ẩn).
   * Tại 1 thời điểm, chỉ 1 badge có t trong [slotStart, slotStart + drawTime].
   */
  private animateLoop = (): void => {
    const badgeCount = this.socialLinks().length;
    if (badgeCount === 0 || !this.snakePaths?.length) {
      this.rafId = requestAnimationFrame(this.animateLoop);
      return;
    }

    const elapsed = (performance.now() - this.startTime) / 1000;
    const totalCycle = this.drawSlot * badgeCount;
    const tInCycle = elapsed % totalCycle;

    this.snakePaths.forEach((ref, i) => {
      const el = ref.nativeElement;
      const slotStart = i * this.drawSlot;
      const tInSlot = tInCycle - slotStart;
      const isDrawing = tInSlot >= 0 && tInSlot < this.drawTime;

      let dashArray: string;
      if (isDrawing) {
        const progress = tInSlot / this.drawTime;
        const raw = progress * 174;
        const drawn = raw > 172 ? 0 : raw;
        dashArray = drawn < 6 ? '0 174' : `${drawn.toFixed(2)} 174`;
      } else {
        dashArray = '0 174';
      }
      el.setAttribute('stroke-dasharray', dashArray);
    });

    this.socialBadges.forEach((ref, i) => {
      const slotStart = i * this.drawSlot;
      const tInSlot = tInCycle - slotStart;
      const isActive = tInSlot >= 0 && tInSlot < this.drawTime;
      const el = ref.nativeElement;
      el.classList.toggle('is-active', isActive);
    });

    this.rafId = requestAnimationFrame(this.animateLoop);
  };

  private getTypingTexts(): string[] {
    return this.store.activeTypingLines().map(t => t.text);
  }

  private startTypingEffect(): void {
    const texts = this.getTypingTexts();
    if (texts.length === 0) {
      this.currentText.set('');
      return;
    }

    if (this.typingIndex >= texts.length) {
      this.typingIndex = 0;
    }

    const currentWord = texts[this.typingIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.currentText.set(currentWord.substring(0, this.charIndex));

    let typingSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      typingSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.typingIndex = (this.typingIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    this.typingTimeout = setTimeout(() => this.startTypingEffect(), typingSpeed);
  }

  onImageError(event: Event): void {
    this.imageError.set(true);
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}

// ============================================================
// CONTACT COMPONENT
// Contact Section — wired to ContactSectionStore
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
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContactSectionStore } from '../../../admin/store/contact-section.store';
import { NotificationService } from '../../../../core/services/notification.service';

interface ContactInfoDisplay {
  label: string;
  value: string;
  link?: string;
  icon: SafeHtml;
}

interface SocialLinkDisplay {
  name: string;
  url: string;
  color: string;
  icon: SafeHtml;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly notify = inject(NotificationService);
  readonly store = inject(ContactSectionStore);

  isVisible = signal(false);
  isSubmitting = signal(false);
  hoveredCard = signal<number | null>(null);
  hoveredSocial = signal<string | null>(null);

  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  readonly section = this.store.section;
  readonly map = this.store.map;
  readonly cta = this.store.cta;
  readonly formSettings = this.store.form;
  readonly hasAnyContent = this.store.hasAnyContent;

  readonly contactInfo = computed((): ContactInfoDisplay[] =>
    this.store.activeContactInfo().map(item => ({
      label: item.label,
      value: item.value,
      link: item.link || undefined,
      icon: this.sanitizer.bypassSecurityTrustHtml(item.iconSvg),
    })),
  );

  readonly socialLinks = computed((): SocialLinkDisplay[] =>
    this.store.activeSocialLinks().map(item => ({
      name: item.name,
      url: item.url,
      color: item.color,
      icon: this.sanitizer.bypassSecurityTrustHtml(item.iconSvg),
    })),
  );

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.store.load();
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
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
      { root: null, rootMargin: '0px', threshold: 0.1 },
    );

    setTimeout(() => {
      const section = document.querySelector('.contact-section');
      if (section && this.observer) {
        this.observer.observe(section);
      }
    }, 100);
  }

  onCardHover(index: number): void {
    this.hoveredCard.set(index);
  }

  onCardLeave(): void {
    this.hoveredCard.set(null);
  }

  onSocialHover(name: string): void {
    this.hoveredSocial.set(name);
  }

  onSocialLeave(): void {
    this.hoveredSocial.set(null);
  }

  onSubmit(): void {
    if (!this.formSettings().enabled) {
      this.notify.warning('Form liên hệ đang tắt.');
      return;
    }

    if (!this.formData.name || !this.formData.email || !this.formData.subject || !this.formData.message) {
      this.notify.warning('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const maxLen = this.formSettings().messageMaxLength;
    if (this.formData.message.length > maxLen) {
      this.notify.warning(`Tin nhắn tối đa ${maxLen} ký tự.`);
      return;
    }

    this.isSubmitting.set(true);

    this.store
      .submitContact({
        fullName: this.formData.name.trim(),
        email: this.formData.email.trim(),
        phone: this.formData.phone.trim() || undefined,
        subject: this.formData.subject.trim(),
        message: this.formData.message.trim(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.formData = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
          };
          this.notify.success(this.formSettings().successMessage);
        },
        error: (err: { message?: string }) => {
          this.isSubmitting.set(false);
          this.notify.error(err.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
        },
      });
  }
}

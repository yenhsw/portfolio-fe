// ============================================================
// CONTACT SECTION STORE
// State quản lý section CONTACT — API backend
// ============================================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  ContactSectionConfig,
  ContactMapConfig,
  ContactCtaConfig,
  ContactFormSettings,
  ContactInfoItem,
  ContactInfoFormData,
  ContactSocialItem,
  ContactSocialFormData,
  ContactMailSendConfig,
  ContactMailSendFormData,
  ContactMailReceiveConfig,
  ContactSubmitRequest,
  CONTACT_SECTION_TYPE_CODE,
  DEFAULT_CONTACT_MAIL_SEND,
  DEFAULT_CONTACT_MAIL_RECEIVE,
} from '../models/contact-section.model';
import { ContactPublicAggregate, ContactSectionService } from '../services/contact-section.service';
import { PlatformService } from '../../../core/services/platform.service';

function ensureContactSection(config: ContactSectionConfig): ContactSectionConfig {
  return { ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactMap(config: Partial<ContactMapConfig>): ContactMapConfig {
  return { ...emptyContactMap(), ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactCta(config: Partial<ContactCtaConfig>): ContactCtaConfig {
  return { ...emptyContactCta(), ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactForm(config: Partial<ContactFormSettings>): ContactFormSettings {
  return { ...emptyContactForm(), ...config, type: CONTACT_SECTION_TYPE_CODE };
}

function ensureContactInfo(item: Partial<ContactInfoItem> & Pick<ContactInfoItem, 'id'>): ContactInfoItem {
  return {
    ...item,
    type: CONTACT_SECTION_TYPE_CODE,
    label: item.label ?? '',
    value: item.value ?? '',
    link: item.link ?? '',
    iconSvg: item.iconSvg ?? '',
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
}

function ensureContactSocial(item: Partial<ContactSocialItem> & Pick<ContactSocialItem, 'id'>): ContactSocialItem {
  return {
    ...item,
    type: CONTACT_SECTION_TYPE_CODE,
    name: item.name ?? '',
    url: item.url ?? '',
    color: item.color ?? '#ffffff',
    iconSvg: item.iconSvg ?? '',
    sortOrder: item.sortOrder ?? 1,
    isActive: item.isActive ?? true,
  };
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSortOrder<T extends { sortOrder?: number }>(items: T[]): (T & { sortOrder: number })[] {
  return items.map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index + 1 }));
}

function emptyContactSection(): ContactSectionConfig {
  return {
    type: CONTACT_SECTION_TYPE_CODE,
    sectionTag: '',
    titleAccent: '',
    titleText: '',
    subtitle: '',
    infoTitle: '',
    formTitle: '',
    socialTitle: '',
  };
}

function emptyContactMap(): ContactMapConfig {
  return { type: CONTACT_SECTION_TYPE_CODE, icon: '', text: '', googleMapUrl: '', isActive: false };
}

function emptyContactCta(): ContactCtaConfig {
  return {
    type: CONTACT_SECTION_TYPE_CODE,
    title: '',
    description: '',
    primaryLabel: '',
    primaryLink: '',
    secondaryLabel: '',
    secondaryLink: '',
    isActive: false,
  };
}

function emptyContactForm(): ContactFormSettings {
  return { type: CONTACT_SECTION_TYPE_CODE, enabled: false, messageMaxLength: 500, successMessage: '' };
}

@Injectable({ providedIn: 'root' })
export class ContactSectionStore {
  private readonly contactService = inject(ContactSectionService);
  private readonly platform = inject(PlatformService);

  readonly section = signal<ContactSectionConfig>(emptyContactSection());
  readonly map = signal<ContactMapConfig>(emptyContactMap());
  readonly cta = signal<ContactCtaConfig>(emptyContactCta());
  readonly form = signal<ContactFormSettings>(emptyContactForm());
  readonly contactInfo = signal<ContactInfoItem[]>([]);
  readonly socialLinks = signal<ContactSocialItem[]>([]);
  readonly mailSend = signal<ContactMailSendConfig>({ ...DEFAULT_CONTACT_MAIL_SEND });
  readonly mailReceive = signal<ContactMailReceiveConfig>({ ...DEFAULT_CONTACT_MAIL_RECEIVE });
  readonly sectionType = CONTACT_SECTION_TYPE_CODE;
  readonly loading = signal(false);
  readonly saving = signal(false);

  private publicLoaded = false;
  private adminLoaded = false;

  readonly activeContactInfo = computed(() => sortByOrder(this.contactInfo().filter(i => i.isActive)));
  readonly activeSocialLinks = computed(() => sortByOrder(this.socialLinks().filter(s => s.isActive)));
  readonly sortedContactInfo = computed(() => sortByOrder(this.contactInfo()));
  readonly sortedSocialLinks = computed(() => sortByOrder(this.socialLinks()));

  readonly hasAnyContent = computed(() => {
    const s = this.section();
    const hasSectionText =
      !!s.sectionTag?.trim() ||
      !!s.titleAccent?.trim() ||
      !!s.titleText?.trim() ||
      !!s.subtitle?.trim();
    return (
      hasSectionText ||
      this.activeContactInfo().length > 0 ||
      this.activeSocialLinks().length > 0 ||
      this.form().enabled ||
      (this.map().isActive && !!this.map().text?.trim()) ||
      (this.cta().isActive && !!this.cta().title?.trim())
    );
  });

  load(): void {
    if (this.publicLoaded) return;

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.publicLoaded = true;
      return;
    }

    this.loading.set(true);
    this.contactService.getPublic().subscribe({
      next: response => {
        if (response.success && response.data) {
          this.applyAggregate(response.data);
          this.publicLoaded = true;
        }
        this.loading.set(false);
      },
      error: () => {
        this.applyEmptyState();
        this.loading.set(false);
      },
    });
  }

  loadAdmin(): Observable<void> {
    if (this.adminLoaded) {
      return of(void 0);
    }

    if (!this.platform.isBrowser) {
      this.applyEmptyState();
      this.adminLoaded = true;
      return of(void 0);
    }

    this.loading.set(true);
    return forkJoin({
      section: this.contactService.getSection(),
      contactInfo: this.contactService.getContactInfo(),
      socialLinks: this.contactService.getSocialLinks(),
      map: this.contactService.getMap(),
      cta: this.contactService.getCta(),
      form: this.contactService.getFormSettings(),
      mailSend: this.contactService.getMailSendConfig(),
      mailReceive: this.contactService.getMailReceiveConfig(),
    }).pipe(
      tap(({ section, contactInfo, socialLinks, map, cta, form, mailSend, mailReceive }) => {
        if (section.success && section.data) {
          this.section.set(ensureContactSection(section.data));
        }
        if (contactInfo.success && contactInfo.data) {
          this.contactInfo.set(normalizeSortOrder(contactInfo.data).map(item => ensureContactInfo(item)));
        }
        if (socialLinks.success && socialLinks.data) {
          this.socialLinks.set(normalizeSortOrder(socialLinks.data).map(item => ensureContactSocial(item)));
        }
        if (map.success && map.data) {
          this.map.set(ensureContactMap(map.data));
        }
        if (cta.success && cta.data) {
          this.cta.set(ensureContactCta(cta.data));
        }
        if (form.success && form.data) {
          this.form.set(ensureContactForm(form.data));
        }
        if (mailSend.success && mailSend.data) {
          this.mailSend.set(mailSend.data);
        }
        if (mailReceive.success && mailReceive.data) {
          this.mailReceive.set({ ...mailReceive.data, type: CONTACT_SECTION_TYPE_CODE });
        }
        this.adminLoaded = true;
      }),
      map(() => void 0),
      catchError(err => {
        this.applyEmptyState();
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  saveSection(config: ContactSectionConfig): Observable<void> {
    this.saving.set(true);
    return this.contactService.updateSection(ensureContactSection(config)).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.section.set(ensureContactSection(response.data));
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  saveSettingsPanel(mapConfig: ContactMapConfig, cta: ContactCtaConfig, form: ContactFormSettings): Observable<void> {
    this.saving.set(true);
    return forkJoin({
      mapConfig: this.contactService.updateMap(ensureContactMap(mapConfig)),
      cta: this.contactService.updateCta(ensureContactCta(cta)),
      form: this.contactService.updateFormSettings(ensureContactForm(form)),
    }).pipe(
      tap(({ mapConfig: mapRes, cta: ctaRes, form: formRes }) => {
        if (mapRes.success && mapRes.data) this.map.set(ensureContactMap(mapRes.data));
        if (ctaRes.success && ctaRes.data) this.cta.set(ensureContactCta(ctaRes.data));
        if (formRes.success && formRes.data) this.form.set(ensureContactForm(formRes.data));
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  saveMailSend(data: ContactMailSendFormData): Observable<void> {
    this.saving.set(true);
    const { smtpPassword, ...rest } = data;
    const payload =
      smtpPassword?.trim() !== ''
        ? ({ ...rest, smtpPassword } satisfies ContactMailSendFormData)
        : (rest as Omit<ContactMailSendFormData, 'smtpPassword'>);
    return this.contactService.updateMailSendConfig(payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.mailSend.set(response.data);
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  saveMailReceive(data: ContactMailReceiveConfig): Observable<void> {
    this.saving.set(true);
    return this.contactService
      .updateMailReceiveConfig({ ...data, type: CONTACT_SECTION_TYPE_CODE })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.mailReceive.set({ ...response.data, type: CONTACT_SECTION_TYPE_CODE });
          }
        }),
        map(() => void 0),
        finalize(() => this.saving.set(false))
      );
  }

  submitContact(data: ContactSubmitRequest): Observable<void> {
    this.saving.set(true);
    return this.contactService.submitContact(data).pipe(
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  addContactInfo(data: ContactInfoFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.contactService.createContactInfo(data),
      id => this.contactService.setContactInfoStatus(id, false),
      isActive,
      item => this.upsertContactInfo(item)
    );
  }

  updateContactInfo(id: string, data: ContactInfoFormData, isActive: boolean): Observable<void> {
    const current = this.contactInfo().find(i => i.id === id);
    return this.updateCollectionItem(
      this.contactService.updateContactInfo(id, data),
      () => this.contactService.setContactInfoStatus(id, isActive),
      item => this.upsertContactInfo(item),
      current?.isActive,
      isActive
    );
  }

  deleteContactInfo(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.contactService.deleteContactInfo(id),
      () => this.contactInfo.update(items => items.filter(i => i.id !== id))
    );
  }

  setContactInfoStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.contactService.setContactInfoStatus(id, isActive),
      item => this.upsertContactInfo(item)
    );
  }

  addSocialLink(data: ContactSocialFormData, isActive = true): Observable<void> {
    return this.createCollectionItem(
      this.contactService.createSocialLink(data),
      id => this.contactService.setSocialLinkStatus(id, false),
      isActive,
      item => this.upsertSocialLink(item)
    );
  }

  updateSocialLink(id: string, data: ContactSocialFormData, isActive: boolean): Observable<void> {
    const current = this.socialLinks().find(s => s.id === id);
    return this.updateCollectionItem(
      this.contactService.updateSocialLink(id, data),
      () => this.contactService.setSocialLinkStatus(id, isActive),
      item => this.upsertSocialLink(item),
      current?.isActive,
      isActive
    );
  }

  deleteSocialLink(id: string): Observable<void> {
    return this.deleteCollectionItem(
      this.contactService.deleteSocialLink(id),
      () => this.socialLinks.update(items => items.filter(s => s.id !== id))
    );
  }

  setSocialLinkStatus(id: string, isActive: boolean): Observable<void> {
    return this.patchCollectionStatus(
      this.contactService.setSocialLinkStatus(id, isActive),
      item => this.upsertSocialLink(item)
    );
  }

  private createCollectionItem<T extends { id: string }>(
    create$: Observable<{ success: boolean; data?: T; message?: string }>,
    deactivate: (id: string) => Observable<{ success: boolean; data?: T; message?: string }>,
    isActive: boolean,
    upsert: (item: T) => void
  ): Observable<void> {
    this.saving.set(true);
    return create$.pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Create failed' }));
        }
        if (!isActive) {
          return deactivate(response.data.id);
        }
        return of(response);
      }),
      tap(response => {
        if (response.success && response.data) {
          upsert(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private updateCollectionItem<T extends { id: string; isActive: boolean }>(
    update$: Observable<{ success: boolean; data?: T; message?: string }>,
    patchStatus: () => Observable<{ success: boolean; data?: T; message?: string }>,
    upsert: (item: T) => void,
    currentIsActive?: boolean,
    nextIsActive?: boolean
  ): Observable<void> {
    this.saving.set(true);
    return update$.pipe(
      switchMap(response => {
        if (!response.success || !response.data) {
          return throwError(() => ({ message: response.message || 'Update failed' }));
        }
        const statusChanged =
          currentIsActive === undefined || nextIsActive === undefined || currentIsActive !== nextIsActive;
        if (!statusChanged) {
          return of(response);
        }
        return patchStatus();
      }),
      tap(response => {
        if (response.success && response.data) {
          upsert(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private deleteCollectionItem(
    delete$: Observable<{ success: boolean; message?: string }>,
    removeLocal: () => void
  ): Observable<void> {
    this.saving.set(true);
    return delete$.pipe(
      tap(() => {
        removeLocal();
        this.publicLoaded = false;
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private patchCollectionStatus<T extends { id: string }>(
    patch$: Observable<{ success: boolean; data?: T; message?: string }>,
    upsert: (item: T) => void
  ): Observable<void> {
    this.saving.set(true);
    return patch$.pipe(
      tap(response => {
        if (response.success && response.data) {
          upsert(response.data);
          this.publicLoaded = false;
        }
      }),
      map(() => void 0),
      finalize(() => this.saving.set(false))
    );
  }

  private upsertContactInfo(item: ContactInfoItem): void {
    this.contactInfo.update(items => this.upsertSorted(items, ensureContactInfo(item)));
  }

  private upsertSocialLink(item: ContactSocialItem): void {
    this.socialLinks.update(items => this.upsertSorted(items, ensureContactSocial(item)));
  }

  private upsertSorted<T extends { id: string; sortOrder: number }>(items: T[], item: T): T[] {
    const next = items.some(i => i.id === item.id)
      ? items.map(i => (i.id === item.id ? item : i))
      : [...items, item];
    return sortByOrder(next);
  }

  private applyAggregate(data: ContactPublicAggregate): void {
    if (data.section) this.section.set(ensureContactSection(data.section));
    if (data.contactInfo) {
      this.contactInfo.set(normalizeSortOrder(data.contactInfo).map(item => ensureContactInfo(item)));
    }
    if (data.socialLinks) {
      this.socialLinks.set(normalizeSortOrder(data.socialLinks).map(item => ensureContactSocial(item)));
    }
    if (data.map) this.map.set(ensureContactMap(data.map));
    if (data.cta) this.cta.set(ensureContactCta(data.cta));
    if (data.form) this.form.set(ensureContactForm(data.form));
  }

  private applyEmptyState(): void {
    this.section.set(emptyContactSection());
    this.map.set(emptyContactMap());
    this.cta.set(emptyContactCta());
    this.form.set(emptyContactForm());
    this.contactInfo.set([]);
    this.socialLinks.set([]);
    this.mailSend.set({ ...DEFAULT_CONTACT_MAIL_SEND });
    this.mailReceive.set({ ...DEFAULT_CONTACT_MAIL_RECEIVE });
  }
}

// ============================================================
// FOOTER SECTION ADMIN COMPONENT
// ============================================================

import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterSectionStore } from '../../store/footer-section.store';
import {
  FOOTER_SECTION_TAB_KEYS,
  FooterSectionTab,
  FooterBrandConfig,
  FooterColumnTitles,
  FooterDividerConfig,
  FooterTechConfig,
  FooterBottomConfig,
  FooterLinkFormData,
  FooterServiceFormData,
  FooterContactFormData,
  FooterSocialFormData,
  FooterTechBadgeFormData,
  FOOTER_SECTION_TYPE_CODE,
  FOOTER_SECTION_TYPE_LABEL,
} from '../../models/footer-section.model';
import {
  AdminPageComponent,
  AdminButtonComponent,
  AdminDialogComponent,
  AdminConfirmDialogComponent,
} from '../../../../shared/components';
import { NotificationService } from '../../../../core/services/notification.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { ConfirmConfig, DialogConfig } from '../../../../shared/models/crud.models';

type DialogMode = 'add' | 'edit' | null;
type EntityType = 'quick-links' | 'services' | 'contact' | 'social' | 'tech-stack';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageComponent,
    AdminButtonComponent,
    AdminDialogComponent,
    AdminConfirmDialogComponent,
    TranslatePipe,
  ],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent implements OnInit {
  readonly store = inject(FooterSectionStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = FOOTER_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = FOOTER_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('footer', FOOTER_SECTION_TAB_KEYS);
  });

  readonly activeTab = signal<FooterSectionTab>('brand');
  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly dialogEntity = signal<EntityType>('quick-links');
  readonly editingId = signal<string | null>(null);
  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);

  private pendingDelete: { entity: EntityType; id: string } | null = null;
  formIsActive = true;

  brandForm: FooterBrandConfig = { ...this.store.brand() };
  columnTitlesForm: FooterColumnTitles = { ...this.store.columnTitles() };
  dividerForm: FooterDividerConfig = { ...this.store.divider() };
  techForm: FooterTechConfig = { ...this.store.tech() };
  bottomForm: FooterBottomConfig = { ...this.store.bottom() };

  linkForm: FooterLinkFormData = this.emptyLinkForm();
  serviceForm: FooterServiceFormData = this.emptyServiceForm();
  contactForm: FooterContactFormData = this.emptyContactForm();
  socialForm: FooterSocialFormData = this.emptySocialForm();
  techBadgeForm: FooterTechBadgeFormData = this.emptyTechBadgeForm();

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>';

  ngOnInit(): void {
    this.store.load();
    this.resetBrandForms();
    setTimeout(() => this.isReady.set(true), 100);
  }

  setTab(tab: FooterSectionTab): void {
    this.activeTab.set(tab);
    if (tab === 'brand') this.resetBrandForms();
  }

  saveBrandPanel(): void {
    this.store.saveBrandPanel(
      this.brandForm,
      this.columnTitlesForm,
      this.dividerForm,
      this.techForm,
      this.bottomForm,
    );
    this.notify.success('Footer brand & layout saved.');
  }

  openAdd(entity: EntityType): void {
    this.dialogEntity.set(entity);
    this.editingId.set(null);
    this.formIsActive = true;
    this.resetEntityForm(entity);
    this.dialogMode.set('add');
  }

  openEdit(entity: EntityType, id: string): void {
    this.dialogEntity.set(entity);
    this.editingId.set(id);
    this.formIsActive = true;

    if (entity === 'quick-links') {
      const item = this.store.quickLinks().find(i => i.id === id);
      if (!item) return;
      this.linkForm = {
        type: FOOTER_SECTION_TYPE_CODE,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
      };
      this.formIsActive = item.isActive;
    } else if (entity === 'services') {
      const item = this.store.services().find(i => i.id === id);
      if (!item) return;
      this.serviceForm = {
        type: FOOTER_SECTION_TYPE_CODE,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
      };
      this.formIsActive = item.isActive;
    } else if (entity === 'contact') {
      const item = this.store.contactItems().find(i => i.id === id);
      if (!item) return;
      this.contactForm = {
        type: FOOTER_SECTION_TYPE_CODE,
        icon: item.icon,
        text: item.text,
        link: item.link,
        sortOrder: item.sortOrder,
      };
      this.formIsActive = item.isActive;
    } else if (entity === 'social') {
      const item = this.store.socialLinks().find(i => i.id === id);
      if (!item) return;
      this.socialForm = {
        type: FOOTER_SECTION_TYPE_CODE,
        name: item.name,
        url: item.url,
        iconSvg: item.iconSvg,
        sortOrder: item.sortOrder,
      };
      this.formIsActive = item.isActive;
    } else {
      const item = this.store.techBadges().find(i => i.id === id);
      if (!item) return;
      this.techBadgeForm = {
        type: FOOTER_SECTION_TYPE_CODE,
        label: item.label,
        sortOrder: item.sortOrder,
      };
      this.formIsActive = item.isActive;
    }

    this.dialogMode.set('edit');
  }

  closeDialog(): void {
    this.dialogMode.set(null);
    this.editingId.set(null);
  }

  saveDialog(): void {
    const entity = this.dialogEntity();
    const mode = this.dialogMode();
    const id = this.editingId();

    if (entity === 'quick-links') {
      if (!this.linkForm.label.trim()) {
        this.notify.warning('Please enter link label.');
        return;
      }
      if (mode === 'add') {
        this.store.addQuickLink(this.linkForm);
        if (!this.formIsActive) {
          const added = this.store.quickLinks().at(-1);
          if (added) this.store.setQuickLinkStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateQuickLink(id, this.linkForm, this.formIsActive);
      }
    } else if (entity === 'services') {
      if (!this.serviceForm.label.trim()) {
        this.notify.warning('Please enter service name.');
        return;
      }
      if (mode === 'add') {
        this.store.addService(this.serviceForm);
        if (!this.formIsActive) {
          const added = this.store.services().at(-1);
          if (added) this.store.setServiceStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateService(id, this.serviceForm, this.formIsActive);
      }
    } else if (entity === 'contact') {
      if (!this.contactForm.text.trim()) {
        this.notify.warning('Please enter contact text.');
        return;
      }
      if (mode === 'add') {
        this.store.addContactItem(this.contactForm);
        if (!this.formIsActive) {
          const added = this.store.contactItems().at(-1);
          if (added) this.store.setContactItemStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateContactItem(id, this.contactForm, this.formIsActive);
      }
    } else if (entity === 'social') {
      if (!this.socialForm.name.trim() || !this.socialForm.url.trim()) {
        this.notify.warning('Please enter name and URL.');
        return;
      }
      if (mode === 'add') {
        this.store.addSocialLink(this.socialForm);
        if (!this.formIsActive) {
          const added = this.store.socialLinks().at(-1);
          if (added) this.store.setSocialLinkStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateSocialLink(id, this.socialForm, this.formIsActive);
      }
    } else {
      if (!this.techBadgeForm.label.trim()) {
        this.notify.warning('Please enter tech name.');
        return;
      }
      if (mode === 'add') {
        this.store.addTechBadge(this.techBadgeForm);
        if (!this.formIsActive) {
          const added = this.store.techBadges().at(-1);
          if (added) this.store.setTechBadgeStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateTechBadge(id, this.techBadgeForm, this.formIsActive);
      }
    }

    this.notify.success(mode === 'add' ? 'Added successfully.' : 'Updated successfully.');
    this.closeDialog();
  }

  deleteItem(entity: EntityType, id: string): void {
    this.pendingDelete = { entity, id };
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: 'Delete this item?',
      detail: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmType: 'danger',
    });
    this.confirmOpen.set(true);
  }

  onConfirmDelete(): void {
    if (this.pendingDelete) {
      const { entity, id } = this.pendingDelete;
      if (entity === 'quick-links') this.store.deleteQuickLink(id);
      else if (entity === 'services') this.store.deleteService(id);
      else if (entity === 'contact') this.store.deleteContactItem(id);
      else if (entity === 'social') this.store.deleteSocialLink(id);
      else this.store.deleteTechBadge(id);
      this.notify.success('Deleted successfully.');
    }
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDelete = null;
  }

  setStatus(entity: EntityType, id: string, isActive: boolean): void {
    if (entity === 'quick-links') this.store.setQuickLinkStatus(id, isActive);
    else if (entity === 'services') this.store.setServiceStatus(id, isActive);
    else if (entity === 'contact') this.store.setContactItemStatus(id, isActive);
    else if (entity === 'social') this.store.setSocialLinkStatus(id, isActive);
    else this.store.setTechBadgeStatus(id, isActive);
    this.notify.info(isActive ? 'Now visible on site.' : 'Now hidden from site.');
  }

  formDialogConfig(): DialogConfig {
    const entity = this.dialogEntity();
    const titles: Record<EntityType, string> = {
      'quick-links': 'Quick link',
      services: 'Service',
      contact: 'Contact item',
      social: 'Social link',
      'tech-stack': 'Tech badge',
    };
    const action = this.dialogMode() === 'add' ? 'Add' : 'Edit';
    return {
      title: `${action} ${titles[entity]}`,
      size: entity === 'social' ? 'lg' : 'md',
      closable: true,
      maskClosable: true,
      footer: true,
    };
  }

  private resetBrandForms(): void {
    this.brandForm = { ...this.store.brand() };
    this.columnTitlesForm = { ...this.store.columnTitles() };
    this.dividerForm = { ...this.store.divider() };
    this.techForm = { ...this.store.tech() };
    this.bottomForm = { ...this.store.bottom() };
  }

  private resetEntityForm(entity: EntityType): void {
    if (entity === 'quick-links') this.linkForm = this.emptyLinkForm();
    else if (entity === 'services') this.serviceForm = this.emptyServiceForm();
    else if (entity === 'contact') this.contactForm = this.emptyContactForm();
    else if (entity === 'social') this.socialForm = this.emptySocialForm();
    else this.techBadgeForm = this.emptyTechBadgeForm();
  }

  private emptyLinkForm(): FooterLinkFormData {
    return { type: FOOTER_SECTION_TYPE_CODE, label: '', href: '#', sortOrder: this.store.nextQuickLinkOrder() };
  }

  private emptyServiceForm(): FooterServiceFormData {
    return { type: FOOTER_SECTION_TYPE_CODE, label: '', href: '#', sortOrder: this.store.nextServiceOrder() };
  }

  private emptyContactForm(): FooterContactFormData {
    return { type: FOOTER_SECTION_TYPE_CODE, icon: '📧', text: '', link: '', sortOrder: this.store.nextContactOrder() };
  }

  private emptySocialForm(): FooterSocialFormData {
    return { type: FOOTER_SECTION_TYPE_CODE, name: '', url: '', iconSvg: '', sortOrder: this.store.nextSocialOrder() };
  }

  private emptyTechBadgeForm(): FooterTechBadgeFormData {
    return { type: FOOTER_SECTION_TYPE_CODE, label: '', sortOrder: this.store.nextTechBadgeOrder() };
  }
}

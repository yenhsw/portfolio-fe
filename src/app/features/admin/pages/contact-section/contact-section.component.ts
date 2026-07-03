// ============================================================
// CONTACT SECTION ADMIN COMPONENT
// ============================================================

import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactSectionStore } from '../../store/contact-section.store';
import {
  CONTACT_SECTION_TAB_KEYS,
  ContactSectionTab,
  ContactSectionConfig,
  ContactMapConfig,
  ContactCtaConfig,
  ContactFormSettings,
  ContactInfoFormData,
  ContactSocialFormData,
  CONTACT_SECTION_TYPE_CODE,
  CONTACT_SECTION_TYPE_LABEL,
} from '../../models/contact-section.model';
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
type EntityType = 'contact-info' | 'social';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPageComponent, AdminButtonComponent, AdminDialogComponent, AdminConfirmDialogComponent, TranslatePipe],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent implements OnInit {
  readonly store = inject(ContactSectionStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = CONTACT_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = CONTACT_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('contact', CONTACT_SECTION_TAB_KEYS);
  });
  readonly activeTab = signal<ContactSectionTab>('contact-info');
  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly dialogEntity = signal<EntityType>('contact-info');
  readonly editingId = signal<string | null>(null);
  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);

  private pendingDelete: { entity: EntityType; id: string } | null = null;
  formIsActive = true;

  sectionForm: ContactSectionConfig = { ...this.store.section() };
  mapForm: ContactMapConfig = { ...this.store.map() };
  ctaForm: ContactCtaConfig = { ...this.store.cta() };
  formSettings: ContactFormSettings = { ...this.store.form() };
  infoForm: ContactInfoFormData = this.emptyInfoForm();
  socialForm: ContactSocialFormData = this.emptySocialForm();

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

  ngOnInit(): void {
    this.store.load();
    this.resetPanelForms();
    setTimeout(() => this.isReady.set(true), 100);
  }

  setTab(tab: ContactSectionTab): void {
    this.activeTab.set(tab);
    if (tab === 'section') this.sectionForm = { ...this.store.section() };
    if (tab === 'settings') this.resetPanelForms();
  }

  saveSection(): void {
    this.store.saveSection(this.sectionForm);
    this.notify.success('CONTACT section config saved.');
  }

  saveSettings(): void {
    this.store.saveSettingsPanel(this.mapForm, this.ctaForm, this.formSettings);
    this.notify.success('Map, CTA, and Form config saved.');
  }

  openAdd(entity: EntityType): void {
    this.dialogEntity.set(entity);
    this.editingId.set(null);
    this.formIsActive = true;
    this.resetForm(entity);
    this.dialogMode.set('add');
  }

  openEdit(entity: EntityType, id: string): void {
    this.dialogEntity.set(entity);
    this.editingId.set(id);
    this.loadForm(entity, id);
    this.dialogMode.set('edit');
  }

  closeDialog(): void {
    this.dialogMode.set(null);
    this.editingId.set(null);
  }

  saveDialog(): void {
    const entity = this.dialogEntity();
    const id = this.editingId();
    const mode = this.dialogMode();

    if (entity === 'contact-info') {
      if (!this.infoForm.label.trim() || !this.infoForm.value.trim()) {
        this.notify.warning('Please enter label and value.');
        return;
      }
      if (this.infoForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      if (mode === 'add') {
        this.store.addContactInfo(this.infoForm);
        if (!this.formIsActive) {
          const added = this.store.contactInfo().at(-1);
          if (added) this.store.setContactInfoStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateContactInfo(id, this.infoForm);
        this.store.setContactInfoStatus(id, this.formIsActive);
      }
    } else {
      if (!this.socialForm.name.trim() || !this.socialForm.url.trim()) {
        this.notify.warning('Please enter name and URL.');
        return;
      }
      if (this.socialForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      if (mode === 'add') {
        this.store.addSocialLink(this.socialForm);
        if (!this.formIsActive) {
          const added = this.store.socialLinks().at(-1);
          if (added) this.store.setSocialLinkStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateSocialLink(id, this.socialForm);
        this.store.setSocialLinkStatus(id, this.formIsActive);
      }
    }

    this.notify.success(mode === 'add' ? 'Added successfully.' : 'Updated successfully.');
    this.closeDialog();
  }

  deleteItem(entity: EntityType, id: string): void {
    this.pendingDelete = { entity, id };
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: entity === 'contact-info' ? 'Delete this contact info?' : 'Delete this social link?',
      detail: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmType: 'danger',
    });
    this.confirmOpen.set(true);
  }

  onConfirmDelete(): void {
    if (!this.pendingDelete) return;
    const { entity, id } = this.pendingDelete;
    if (entity === 'contact-info') this.store.deleteContactInfo(id);
    else this.store.deleteSocialLink(id);
    this.notify.success('Deleted successfully.');
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDelete = null;
  }

  setStatus(entity: EntityType, id: string, isActive: boolean): void {
    if (entity === 'contact-info') this.store.setContactInfoStatus(id, isActive);
    else this.store.setSocialLinkStatus(id, isActive);
    this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.');
  }

  dialogTitle(): string {
    const entity = this.dialogEntity();
    const mode = this.dialogMode();
    return `${mode === 'add' ? 'Add' : 'Edit'} ${entity === 'contact-info' ? 'contact info' : 'social link'}`;
  }

  formDialogConfig(): DialogConfig {
    return {
      title: this.dialogTitle(),
      size: 'lg',
      closable: true,
      maskClosable: true,
      footer: true,
    };
  }

  private resetPanelForms(): void {
    this.mapForm = { ...this.store.map() };
    this.ctaForm = { ...this.store.cta() };
    this.formSettings = { ...this.store.form() };
  }

  private emptyInfoForm(): ContactInfoFormData {
    return {
      type: CONTACT_SECTION_TYPE_CODE,
      label: '',
      value: '',
      link: '',
      iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
      sortOrder: this.nextInfoOrder(),
    };
  }

  private emptySocialForm(): ContactSocialFormData {
    return {
      type: CONTACT_SECTION_TYPE_CODE,
      name: '',
      url: '',
      color: '#ffffff',
      iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
      sortOrder: this.nextSocialOrder(),
    };
  }

  private nextInfoOrder(): number {
    const items = this.store.contactInfo();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextSocialOrder(): number {
    const items = this.store.socialLinks();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private resetForm(entity: EntityType): void {
    if (entity === 'contact-info') this.infoForm = this.emptyInfoForm();
    else this.socialForm = this.emptySocialForm();
  }

  private loadForm(entity: EntityType, id: string): void {
    if (entity === 'contact-info') {
      const item = this.store.contactInfo().find(i => i.id === id);
      if (item) {
        this.infoForm = {
          type: CONTACT_SECTION_TYPE_CODE,
          label: item.label,
          value: item.value,
          link: item.link,
          iconSvg: item.iconSvg,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    } else {
      const item = this.store.socialLinks().find(s => s.id === id);
      if (item) {
        this.socialForm = {
          type: CONTACT_SECTION_TYPE_CODE,
          name: item.name,
          url: item.url,
          color: item.color,
          iconSvg: item.iconSvg,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    }
  }
}

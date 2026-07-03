// ============================================================
// HERO SECTION ADMIN COMPONENT
// ============================================================

import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroSectionStore } from '../../store/hero-section.store';
import {
  HERO_SECTION_TAB_KEYS,
  HERO_BUTTON_VARIANTS,
  HERO_BUTTON_BORDER_BEAMS,
  HERO_SECTION_TYPE_CODE,
  HERO_SECTION_TYPE_LABEL,
  HeroSectionTab,
  HeroSectionConfig,
  HeroAvatarConfig,
  HeroButtonsConfig,
  HeroSocialFormData,
  HeroTypingFormData,
} from '../../models/hero-section.model';
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
type EntityType = 'typing' | 'social';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPageComponent, AdminButtonComponent, AdminDialogComponent, AdminConfirmDialogComponent, TranslatePipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements OnInit {
  readonly store = inject(HeroSectionStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = HERO_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = HERO_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('hero', HERO_SECTION_TAB_KEYS);
  });
  readonly buttonVariants = HERO_BUTTON_VARIANTS;
  readonly borderBeams = HERO_BUTTON_BORDER_BEAMS;
  readonly activeTab = signal<HeroSectionTab>('section');
  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly dialogEntity = signal<EntityType>('typing');
  readonly editingId = signal<string | null>(null);
  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);

  private pendingDelete: { entity: EntityType; id: string } | null = null;
  formIsActive = true;

  sectionForm: HeroSectionConfig = { ...this.store.section() };
  avatarForm: HeroAvatarConfig = { ...this.store.avatar() };
  buttonsForm: HeroButtonsConfig = { ...this.store.buttons() };
  typingForm: HeroTypingFormData = this.emptyTypingForm();
  socialForm: HeroSocialFormData = this.emptySocialForm();

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

  ngOnInit(): void {
    this.store.loadAdmin();
    this.resetPanelForms();
    setTimeout(() => this.isReady.set(true), 100);
  }

  setTab(tab: HeroSectionTab): void {
    this.activeTab.set(tab);
    if (tab === 'section') this.resetSectionForms();
    if (tab === 'actions') this.buttonsForm = { ...this.store.buttons() };
  }

  saveSection(): void {
    this.store.saveSection(this.sectionForm, this.avatarForm).subscribe({
      next: () => this.notify.success('HERO section config saved.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to save section config.'),
    });
  }

  saveActions(): void {
    this.store.saveButtons(this.buttonsForm).subscribe({
      next: () => this.notify.success('Action buttons config saved.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to save action buttons.'),
    });
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

    if (entity === 'typing') {
      if (!this.typingForm.text.trim()) {
        this.notify.warning('Please enter typing content.');
        return;
      }
      if (this.typingForm.sortOrder < 1) {
        this.notify.warning('Display order must be >= 1.');
        return;
      }
      const request$ =
        mode === 'add'
          ? this.store.addTypingLine(this.typingForm, this.formIsActive)
          : id
            ? this.store.updateTypingLine(id, this.typingForm, this.formIsActive)
            : null;
      if (!request$) return;
      request$.subscribe({
        next: () => {
          this.notify.success(mode === 'add' ? 'Added successfully.' : 'Updated successfully.');
          this.closeDialog();
        },
        error: (err: { message?: string }) => this.notify.error(err.message || 'Request failed.'),
      });
      return;
    }

    if (!this.socialForm.name.trim() || !this.socialForm.url.trim()) {
      this.notify.warning('Please enter name and URL.');
      return;
    }
    if (this.socialForm.sortOrder < 1) {
      this.notify.warning('Display order must be >= 1.');
      return;
    }
    const request$ =
      mode === 'add'
        ? this.store.addSocialLink(this.socialForm, this.formIsActive)
        : id
          ? this.store.updateSocialLink(id, this.socialForm, this.formIsActive)
          : null;
    if (!request$) return;
    request$.subscribe({
      next: () => {
        this.notify.success(mode === 'add' ? 'Added successfully.' : 'Updated successfully.');
        this.closeDialog();
      },
      error: (err: { message?: string }) => this.notify.error(err.message || 'Request failed.'),
    });
  }

  deleteItem(entity: EntityType, id: string): void {
    this.pendingDelete = { entity, id };
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: entity === 'typing' ? 'Delete this typing line?' : 'Delete this social badge?',
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
    const request$ =
      entity === 'typing' ? this.store.deleteTypingLine(id) : this.store.deleteSocialLink(id);
    request$.subscribe({
      next: () => {
        this.notify.success('Deleted successfully.');
        this.closeConfirm();
      },
      error: (err: { message?: string }) => this.notify.error(err.message || 'Delete failed.'),
    });
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDelete = null;
  }

  setStatus(entity: EntityType, id: string, isActive: boolean): void {
    const request$ =
      entity === 'typing'
        ? this.store.setTypingLineStatus(id, isActive)
        : this.store.setSocialLinkStatus(id, isActive);
    request$.subscribe({
      next: () => this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to update status.'),
    });
  }

  dialogTitle(): string {
    const entity = this.dialogEntity();
    const mode = this.dialogMode();
    return `${mode === 'add' ? 'Add' : 'Edit'} ${entity === 'typing' ? 'typing line' : 'social badge'}`;
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
    this.resetSectionForms();
    this.buttonsForm = { ...this.store.buttons() };
  }

  private resetSectionForms(): void {
    this.sectionForm = { ...this.store.section() };
    this.avatarForm = { ...this.store.avatar() };
  }

  private emptyTypingForm(): HeroTypingFormData {
    return {
      type: HERO_SECTION_TYPE_CODE,
      text: '',
      sortOrder: this.nextTypingOrder(),
    };
  }

  private emptySocialForm(): HeroSocialFormData {
    return {
      type: HERO_SECTION_TYPE_CODE,
      name: '',
      icon: '',
      url: '',
      sortOrder: this.nextSocialOrder(),
    };
  }

  private nextTypingOrder(): number {
    const items = this.store.typingLines();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextSocialOrder(): number {
    const items = this.store.socialLinks();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private resetForm(entity: EntityType): void {
    if (entity === 'typing') this.typingForm = this.emptyTypingForm();
    else this.socialForm = this.emptySocialForm();
  }

  private loadForm(entity: EntityType, id: string): void {
    if (entity === 'typing') {
      const item = this.store.typingLines().find(t => t.id === id);
      if (item) {
        this.typingForm = { type: HERO_SECTION_TYPE_CODE, text: item.text, sortOrder: item.sortOrder };
        this.formIsActive = item.isActive;
      }
    } else {
      const item = this.store.socialLinks().find(s => s.id === id);
      if (item) {
        this.socialForm = {
          type: HERO_SECTION_TYPE_CODE,
          name: item.name,
          icon: item.icon,
          url: item.url,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    }
  }
}

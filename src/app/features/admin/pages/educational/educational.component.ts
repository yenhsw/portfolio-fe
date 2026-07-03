// ============================================================
// EDUCATIONAL ADMIN COMPONENT
// Manage EDUCATIONAL section — 5 sub-categories
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EducationalStore } from '../../store/educational.store';
import {
  EDUCATIONAL_TAB_KEYS,
  EDUCATIONAL_SECTION_TYPE_CODE,
  EDUCATIONAL_SECTION_TYPE_LABEL,
  EducationalTab,
  EducationalSectionConfig,
  EducationalHighlight,
  EducationalHighlightFormData,
  EducationRecord,
  EducationRecordFormData,
  EducationalCertificate,
  EducationalCertificateFormData,
  FutureGoal,
  FutureGoalFormData,
} from '../../models/educational.model';
import { AdminPageComponent, AdminButtonComponent, AdminDialogComponent, AdminConfirmDialogComponent } from '../../../../shared/components';
import { NotificationService } from '../../../../core/services/notification.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { ConfirmConfig, DialogConfig } from '../../../../shared/models/crud.models';

type DialogMode = 'add' | 'edit' | null;
type EntityType = 'highlights' | 'timeline' | 'certificates' | 'future-goals';

@Component({
  selector: 'app-educational',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPageComponent, AdminButtonComponent, AdminDialogComponent, AdminConfirmDialogComponent, TranslatePipe],
  templateUrl: './educational.component.html',
  styleUrl: './educational.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationalComponent implements OnInit {
  readonly store = inject(EducationalStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = EDUCATIONAL_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = EDUCATIONAL_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('educational', EDUCATIONAL_TAB_KEYS);
  });
  readonly activeTab = signal<EducationalTab>('highlights');
  readonly isReady = signal(false);

  readonly dialogMode = signal<DialogMode>(null);
  readonly dialogEntity = signal<EntityType>('highlights');
  readonly editingId = signal<string | null>(null);

  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);
  private pendingDelete: { entity: EntityType; id: string } | null = null;

  sectionForm: EducationalSectionConfig = { ...this.store.section() };

  highlightForm: EducationalHighlightFormData = this.emptyHighlightForm();
  timelineForm: EducationRecordFormData = this.emptyTimelineForm();
  certificateForm: EducationalCertificateFormData = this.emptyCertificateForm();
  futureGoalForm: FutureGoalFormData = this.emptyFutureGoalForm();

  newTech = '';

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/></svg>';

  ngOnInit(): void {
    this.store.load();
    this.sectionForm = { ...this.store.section() };
    setTimeout(() => this.isReady.set(true), 100);
  }

  setTab(tab: EducationalTab): void {
    this.activeTab.set(tab);
    if (tab === 'section') {
      this.sectionForm = { ...this.store.section() };
    }
  }

  saveSection(): void {
    this.store.saveSection(this.sectionForm);
    this.notify.success('EDUCATIONAL section config saved.');
  }

  // --- Dialog helpers ---
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
    this.newTech = '';
  }

  saveDialog(): void {
    const entity = this.dialogEntity();
    const id = this.editingId();
    const mode = this.dialogMode();

    if (entity === 'highlights') {
      if (!this.highlightForm.label.trim()) {
        this.notify.warning('Please enter item name.');
        return;
      }
      if (this.highlightForm.sortOrder < 1) {
        this.notify.warning('Display order must be >= 1.');
        return;
      }
      if (mode === 'add') {
        this.store.addHighlight(this.highlightForm);
        if (!this.formIsActive) {
          const added = this.store.highlights().at(-1);
          if (added) this.store.setHighlightStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateHighlight(id, this.highlightForm);
        this.store.setHighlightStatus(id, this.formIsActive);
      }
    } else if (entity === 'timeline') {
      if (!this.timelineForm.institutionName.trim()) {
        this.notify.warning('Please enter school / center name.');
        return;
      }
      if (this.timelineForm.sortOrder < 1) {
        this.notify.warning('Display order must be >= 1.');
        return;
      }
      if (mode === 'add') {
        this.store.addTimelineItem(this.timelineForm);
        if (!this.formIsActive) {
          const added = this.store.timeline().at(-1);
          if (added) this.store.setTimelineStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateTimelineItem(id, this.timelineForm);
        this.store.setTimelineStatus(id, this.formIsActive);
      }
    } else if (entity === 'certificates') {
      if (!this.certificateForm.name.trim()) {
        this.notify.warning('Please enter certificate name.');
        return;
      }
      if (this.certificateForm.sortOrder < 1) {
        this.notify.warning('Display order must be >= 1.');
        return;
      }
      if (mode === 'add') {
        this.store.addCertificate(this.certificateForm);
        if (!this.formIsActive) {
          const added = this.store.certificates().at(-1);
          if (added) this.store.setCertificateStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateCertificate(id, this.certificateForm);
        this.store.setCertificateStatus(id, this.formIsActive);
      }
    } else if (entity === 'future-goals') {
      if (!this.futureGoalForm.title.trim()) {
        this.notify.warning('Please enter goal name.');
        return;
      }
      if (this.futureGoalForm.sortOrder < 1) {
        this.notify.warning('Display order must be >= 1.');
        return;
      }
      if (mode === 'add') {
        this.store.addFutureGoal(this.futureGoalForm);
        if (!this.formIsActive) {
          const added = this.store.futureGoals().at(-1);
          if (added) this.store.setFutureGoalStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateFutureGoal(id, this.futureGoalForm);
        this.store.setFutureGoalStatus(id, this.formIsActive);
      }
    }

    this.notify.success(mode === 'add' ? 'Added successfully.' : 'Updated successfully.');
    this.closeDialog();
  }

  deleteItem(entity: EntityType, id: string): void {
    const labels: Record<EntityType, string> = {
      highlights: 'highlight',
      timeline: 'education entry',
      certificates: 'certificate',
      'future-goals': 'future goal',
    };
    this.pendingDelete = { entity, id };
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: `Delete this ${labels[entity]}?`,
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
    switch (entity) {
      case 'highlights': this.store.deleteHighlight(id); break;
      case 'timeline': this.store.deleteTimelineItem(id); break;
      case 'certificates': this.store.deleteCertificate(id); break;
      case 'future-goals': this.store.deleteFutureGoal(id); break;
    }
    this.notify.success('Deleted successfully.');
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDelete = null;
  }

  toggleStatus(entity: EntityType, id: string): void {
    switch (entity) {
      case 'highlights': this.store.toggleHighlightStatus(id); break;
      case 'timeline': this.store.toggleTimelineStatus(id); break;
      case 'certificates': this.store.toggleCertificateStatus(id); break;
      case 'future-goals': this.store.toggleFutureGoalStatus(id); break;
    }
  }

  setStatus(entity: EntityType, id: string, isActive: boolean): void {
    switch (entity) {
      case 'highlights': this.store.setHighlightStatus(id, isActive); break;
      case 'timeline': this.store.setTimelineStatus(id, isActive); break;
      case 'certificates': this.store.setCertificateStatus(id, isActive); break;
      case 'future-goals': this.store.setFutureGoalStatus(id, isActive); break;
    }
    this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.');
  }

  formIsActive = true;

  // --- Technologies dynamic table ---
  addTechnology(): void {
    const tech = this.newTech.trim();
    if (!tech || this.timelineForm.technologies.includes(tech)) return;
    this.timelineForm.technologies = [...this.timelineForm.technologies, tech];
    this.newTech = '';
  }

  removeTechnology(index: number): void {
    this.timelineForm.technologies = this.timelineForm.technologies.filter((_, i) => i !== index);
  }

  displayValue(item: EducationalHighlight): string {
    return `${item.valueNumber}${item.valueSuffix}`;
  }

  dialogTitle(): string {
    const entity = this.dialogEntity();
    const mode = this.dialogMode();
    const names: Record<EntityType, string> = {
      highlights: 'Highlights',
      timeline: 'Education timeline',
      certificates: 'Certificates',
      'future-goals': 'Future goals',
    };
    return `${mode === 'add' ? 'Add' : 'Edit'} ${names[entity]}`;
  }

  formDialogConfig(): DialogConfig {
    return {
      title: this.dialogTitle(),
      size: this.dialogEntity() === 'timeline' ? 'lg' : 'md',
      closable: true,
      maskClosable: true,
      footer: true,
    };
  }

  private emptyHighlightForm(): EducationalHighlightFormData {
    return { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: '📊', valueNumber: 0, valueSuffix: '+', label: '', sortOrder: this.nextHighlightOrder() };
  }

  private emptyTimelineForm(): EducationRecordFormData {
    return { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: '🎓', institutionName: '', courseName: '', year: new Date().getFullYear().toString(), description: '', technologies: [], sortOrder: this.nextTimelineOrder() };
  }

  private emptyCertificateForm(): EducationalCertificateFormData {
    return { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: '🏆', name: '', provider: '', year: new Date().getFullYear().toString(), badge: '', sortOrder: this.nextCertificateOrder() };
  }

  private emptyFutureGoalForm(): FutureGoalFormData {
    return { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: '🎯', title: '', description: '', sortOrder: this.nextFutureGoalOrder() };
  }

  private nextHighlightOrder(): number {
    const items = this.store.highlights();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextTimelineOrder(): number {
    const items = this.store.timeline();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextCertificateOrder(): number {
    const items = this.store.certificates();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextFutureGoalOrder(): number {
    const items = this.store.futureGoals();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private resetForm(entity: EntityType): void {
    switch (entity) {
      case 'highlights': this.highlightForm = this.emptyHighlightForm(); break;
      case 'timeline': this.timelineForm = this.emptyTimelineForm(); break;
      case 'certificates': this.certificateForm = this.emptyCertificateForm(); break;
      case 'future-goals': this.futureGoalForm = this.emptyFutureGoalForm(); break;
    }
  }

  private loadForm(entity: EntityType, id: string): void {
    if (entity === 'highlights') {
      const item = this.store.highlights().find(h => h.id === id);
      if (item) {
        this.highlightForm = { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: item.icon, valueNumber: item.valueNumber, valueSuffix: item.valueSuffix, label: item.label, sortOrder: item.sortOrder };
        this.formIsActive = item.isActive;
      }
    } else if (entity === 'timeline') {
      const item = this.store.timeline().find(t => t.id === id);
      if (item) {
        this.timelineForm = { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: item.icon, institutionName: item.institutionName, courseName: item.courseName, year: item.year, description: item.description, technologies: [...item.technologies], sortOrder: item.sortOrder };
        this.formIsActive = item.isActive;
      }
    } else if (entity === 'certificates') {
      const item = this.store.certificates().find(c => c.id === id);
      if (item) {
        this.certificateForm = { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: item.icon, name: item.name, provider: item.provider, year: item.year, badge: item.badge, sortOrder: item.sortOrder };
        this.formIsActive = item.isActive;
      }
    } else if (entity === 'future-goals') {
      const item = this.store.futureGoals().find(g => g.id === id);
      if (item) {
        this.futureGoalForm = { type: EDUCATIONAL_SECTION_TYPE_CODE, icon: item.icon, title: item.title, description: item.description, sortOrder: item.sortOrder };
        this.formIsActive = item.isActive;
      }
    }
  }
}

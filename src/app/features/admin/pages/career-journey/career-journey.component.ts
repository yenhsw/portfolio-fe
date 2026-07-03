// ============================================================
// CAREER JOURNEY ADMIN COMPONENT
// Manage CAREER JOURNEY section — config + work experience
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
import { CareerJourneyStore } from '../../store/career-journey.store';
import {
  CAREER_JOURNEY_TAB_KEYS,
  CareerJourneyTab,
  CareerJourneySectionConfig,
  WorkExperienceFormData,
  EXPERIENCE_SECTION_TYPE_CODE,
  EXPERIENCE_SECTION_TYPE_LABEL,
} from '../../models/career-journey.model';
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

@Component({
  selector: 'app-career-journey',
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
  templateUrl: './career-journey.component.html',
  styleUrl: './career-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerJourneyComponent implements OnInit {
  readonly store = inject(CareerJourneyStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = EXPERIENCE_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = EXPERIENCE_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('careerJourney', CAREER_JOURNEY_TAB_KEYS);
  });
  readonly activeTab = signal<CareerJourneyTab>('experiences');
  readonly isReady = signal(false);

  readonly dialogMode = signal<DialogMode>(null);
  readonly editingId = signal<string | null>(null);

  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);
  private pendingDeleteId: string | null = null;

  sectionForm: CareerJourneySectionConfig = { ...this.store.section() };
  experienceForm: WorkExperienceFormData = this.emptyExperienceForm();
  formIsActive = true;

  newTechName = '';
  newRespText = '';
  newProjectName = '';
  newProjectIcon = '📁';
  newAchValue = 0;
  newAchSuffix = '+';
  newAchLabel = '';

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>';

  ngOnInit(): void {
    this.store.load();
    this.sectionForm = { ...this.store.section() };
    setTimeout(() => this.isReady.set(true), 100);
  }

  setTab(tab: CareerJourneyTab): void {
    this.activeTab.set(tab);
    if (tab === 'section') {
      this.sectionForm = { ...this.store.section() };
    }
  }

  saveSection(): void {
    this.store.saveSection(this.sectionForm);
    this.notify.success('CAREER JOURNEY section config saved.');
  }

  openAdd(): void {
    this.editingId.set(null);
    this.formIsActive = true;
    this.experienceForm = this.emptyExperienceForm();
    this.resetNestedInputs();
    this.dialogMode.set('add');
  }

  openEdit(id: string): void {
    const item = this.store.experiences().find(e => e.id === id);
    if (!item) return;
    this.editingId.set(id);
    this.formIsActive = item.isActive;
    this.experienceForm = {
      type: EXPERIENCE_SECTION_TYPE_CODE,
      position: item.position,
      positionIcon: item.positionIcon,
      company: item.company,
      period: item.period,
      location: item.location,
      description: item.description,
      technologies: item.technologies.map(t => ({ ...t })),
      responsibilities: item.responsibilities.map(r => ({ ...r })),
      projects: item.projects.map(p => ({ ...p })),
      achievements: item.achievements.map(a => ({ ...a })),
      sortOrder: item.sortOrder,
    };
    this.resetNestedInputs();
    this.dialogMode.set('edit');
  }

  closeDialog(): void {
    this.dialogMode.set(null);
    this.editingId.set(null);
    this.resetNestedInputs();
  }

  saveDialog(): void {
    if (!this.experienceForm.position.trim()) {
      this.notify.warning('Please enter job title.');
      return;
    }
    if (!this.experienceForm.company.trim()) {
      this.notify.warning('Please enter company name.');
      return;
    }
    if (this.experienceForm.sortOrder < 1) {
      this.notify.warning('Display order must be >= 1.');
      return;
    }

    const id = this.editingId();
    const mode = this.dialogMode();

    if (mode === 'add') {
      this.store.addExperience(this.experienceForm);
      if (!this.formIsActive) {
        const added = this.store.experiences().at(-1);
        if (added) this.store.setExperienceStatus(added.id, false);
      }
    } else if (id) {
      this.store.updateExperience(id, this.experienceForm);
      this.store.setExperienceStatus(id, this.formIsActive);
    }

    this.notify.success(mode === 'add' ? 'Experience added.' : 'Experience updated.');
    this.closeDialog();
  }

  deleteItem(id: string): void {
    this.pendingDeleteId = id;
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: 'Delete this work experience?',
      detail: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmType: 'danger',
    });
    this.confirmOpen.set(true);
  }

  onConfirmDelete(): void {
    if (this.pendingDeleteId) {
      this.store.deleteExperience(this.pendingDeleteId);
      this.notify.success('Deleted successfully.');
    }
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDeleteId = null;
  }

  setStatus(id: string, isActive: boolean): void {
    this.store.setExperienceStatus(id, isActive);
    this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.');
  }

  dialogTitle(): string {
    return `${this.dialogMode() === 'add' ? 'Add' : 'Edit'} work experience`;
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

  // --- Nested list helpers ---
  addTechnology(): void {
    const name = this.newTechName.trim();
    if (!name) return;
    this.experienceForm.technologies = [...this.experienceForm.technologies, { name, icon: name.slice(0, 2) }];
    this.newTechName = '';
  }

  removeTechnology(index: number): void {
    this.experienceForm.technologies = this.experienceForm.technologies.filter((_, i) => i !== index);
  }

  addResponsibility(): void {
    const text = this.newRespText.trim();
    if (!text) return;
    this.experienceForm.responsibilities = [...this.experienceForm.responsibilities, { text, icon: '✓' }];
    this.newRespText = '';
  }

  removeResponsibility(index: number): void {
    this.experienceForm.responsibilities = this.experienceForm.responsibilities.filter((_, i) => i !== index);
  }

  addProject(): void {
    const name = this.newProjectName.trim();
    if (!name) return;
    this.experienceForm.projects = [
      ...this.experienceForm.projects,
      { name, icon: this.newProjectIcon.trim() || '📁' },
    ];
    this.newProjectName = '';
    this.newProjectIcon = '📁';
  }

  removeProject(index: number): void {
    this.experienceForm.projects = this.experienceForm.projects.filter((_, i) => i !== index);
  }

  addAchievement(): void {
    const label = this.newAchLabel.trim();
    if (!label) return;
    this.experienceForm.achievements = [
      ...this.experienceForm.achievements,
      {
        value: this.newAchValue,
        suffix: this.newAchSuffix.trim() || '+',
        label,
        icon: '🏆',
      },
    ];
    this.newAchValue = 0;
    this.newAchSuffix = '+';
    this.newAchLabel = '';
  }

  removeAchievement(index: number): void {
    this.experienceForm.achievements = this.experienceForm.achievements.filter((_, i) => i !== index);
  }

  private emptyExperienceForm(): WorkExperienceFormData {
    return {
      type: EXPERIENCE_SECTION_TYPE_CODE,
      position: '',
      positionIcon: '💼',
      company: '',
      period: new Date().getFullYear().toString(),
      location: '',
      description: '',
      technologies: [],
      responsibilities: [],
      projects: [],
      achievements: [],
      sortOrder: this.nextExperienceOrder(),
    };
  }

  private nextExperienceOrder(): number {
    const items = this.store.experiences();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private resetNestedInputs(): void {
    this.newTechName = '';
    this.newRespText = '';
    this.newProjectName = '';
    this.newProjectIcon = '📁';
    this.newAchValue = 0;
    this.newAchSuffix = '+';
    this.newAchLabel = '';
  }
}

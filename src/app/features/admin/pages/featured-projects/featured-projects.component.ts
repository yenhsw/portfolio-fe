// ============================================================
// FEATURED PROJECTS ADMIN COMPONENT
// ============================================================

import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeaturedProjectsStore } from '../../store/featured-projects.store';
import {
  FEATURED_PROJECTS_TAB_KEYS,
  FEATURED_PROJECT_STATUSES,
  TECH_CATEGORIES,
  FeaturedProjectsTab,
  FeaturedProjectsSectionConfig,
  ProjectFilterFormData,
  FeaturedProjectFormData,
  FeaturedProjectStatus,
  TechCategory,
  ProjectTechnology,
  ProjectStatistic,
  PROJECTS_SECTION_TYPE_CODE,
  PROJECTS_SECTION_TYPE_LABEL,
} from '../../models/featured-projects.model';
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
type EntityType = 'filters' | 'projects';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPageComponent, AdminButtonComponent, AdminDialogComponent, AdminConfirmDialogComponent, TranslatePipe],
  templateUrl: './featured-projects.component.html',
  styleUrl: './featured-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProjectsComponent implements OnInit {
  readonly store = inject(FeaturedProjectsStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = PROJECTS_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = PROJECTS_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('featuredProjects', FEATURED_PROJECTS_TAB_KEYS);
  });
  readonly statuses = computed(() => {
    this.locale.locale();
    const statusKeys: Record<FeaturedProjectStatus, string> = {
      completed: 'admin.pages.featuredProjects.statusCompleted',
      'in-progress': 'admin.pages.featuredProjects.statusInProgress',
      private: 'admin.pages.featuredProjects.statusPrivate',
      'open-source': 'admin.pages.featuredProjects.statusOpenSource',
    };
    return FEATURED_PROJECT_STATUSES.map(s => ({
      ...s,
      label: this.locale.t(statusKeys[s.value]),
    }));
  });
  readonly techCategories = TECH_CATEGORIES;

  readonly activeTab = signal<FeaturedProjectsTab>('projects');
  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly dialogEntity = signal<EntityType>('projects');
  readonly editingId = signal<string | null>(null);
  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);

  private pendingDelete: { entity: EntityType; id: string } | null = null;
  formIsActive = true;

  sectionForm: FeaturedProjectsSectionConfig = { ...this.store.section() };
  filterForm: ProjectFilterFormData = this.emptyFilterForm();
  projectForm: FeaturedProjectFormData = this.emptyProjectForm();

  newTechName = '';
  newTechCategory: TechCategory = 'frontend';
  newStatLabel = '';
  newStatValue = '';
  newStatIcon = '📦';
  newRespText = '';
  newFeatureText = '';
  newAchievementText = '';

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

  ngOnInit(): void {
    this.store.loadAdmin().subscribe({
      next: () => {
        this.sectionForm = { ...this.store.section() };
        this.isReady.set(true);
      },
      error: () => {
        this.sectionForm = { ...this.store.section() };
        this.isReady.set(true);
      },
    });
  }

  setTab(tab: FeaturedProjectsTab): void {
    this.activeTab.set(tab);
    if (tab === 'section') this.sectionForm = { ...this.store.section() };
  }

  saveSection(): void {
    this.store.saveSection(this.sectionForm).subscribe({
      next: () => this.notify.success('FEATURED PROJECTS section config saved.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to save section config.'),
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

    let request$: ReturnType<FeaturedProjectsStore['addFilter']> | null = null;

    if (entity === 'filters') {
      if (!this.filterForm.key.trim()) { this.notify.warning('Please enter filter key.'); return; }
      if (!this.filterForm.label.trim()) { this.notify.warning('Please enter display name.'); return; }
      if (this.filterForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      request$ =
        mode === 'add'
          ? this.store.addFilter(this.filterForm, this.formIsActive)
          : id
            ? this.store.updateFilter(id, this.filterForm, this.formIsActive)
            : null;
    } else if (entity === 'projects') {
      if (!this.projectForm.name.trim()) { this.notify.warning('Please enter project name.'); return; }
      if (!this.projectForm.description.trim()) { this.notify.warning('Please enter short description.'); return; }
      if (this.projectForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      request$ =
        mode === 'add'
          ? this.store.addProject(this.projectForm, this.formIsActive)
          : id
            ? this.store.updateProject(id, this.projectForm, this.formIsActive)
            : null;
    }

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
    if (entity === 'filters') {
      const filter = this.store.filters().find(f => f.id === id);
      if (filter?.key === 'all') {
        this.notify.warning('Cannot delete the "All" filter.');
        return;
      }
    }
    this.pendingDelete = { entity, id };
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: entity === 'filters' ? 'Delete this filter?' : 'Delete this project?',
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
      entity === 'filters' ? this.store.deleteFilter(id) : this.store.deleteProject(id);

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

  setFilterStatus(id: string, isActive: boolean): void {
    this.store.setFilterStatus(id, isActive).subscribe({
      next: () => this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to update status.'),
    });
  }

  setProjectStatus(id: string, isActive: boolean): void {
    this.store.setProjectStatus(id, isActive).subscribe({
      next: () => this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to update status.'),
    });
  }

  toggleFeatured(id: string, isFeatured: boolean): void {
    this.store.setProjectFeatured(id, isFeatured).subscribe({
      next: () => this.notify.info(isFeatured ? 'Marked as Featured.' : 'Unmarked as Featured.'),
      error: (err: { message?: string }) => this.notify.error(err.message || 'Failed to update featured.'),
    });
  }

  getStatusLabel(status: FeaturedProjectStatus): string {
    return this.statuses().find(s => s.value === status)?.label ?? status;
  }

  addTechnology(): void {
    const name = this.newTechName.trim();
    if (!name) return;
    this.projectForm.technologies = [...this.projectForm.technologies, { name, category: this.newTechCategory }];
    this.newTechName = '';
  }

  removeTechnology(index: number): void {
    this.projectForm.technologies = this.projectForm.technologies.filter((_, i) => i !== index);
  }

  addStatistic(): void {
    if (!this.newStatLabel.trim() || !this.newStatValue.trim()) {
      this.notify.warning('Enter label and value for statistic.');
      return;
    }
    this.projectForm.statistics = [
      ...this.projectForm.statistics,
      { label: this.newStatLabel.trim(), value: this.newStatValue.trim(), icon: this.newStatIcon || '📦' },
    ];
    this.newStatLabel = '';
    this.newStatValue = '';
    this.newStatIcon = '📦';
  }

  removeStatistic(index: number): void {
    this.projectForm.statistics = this.projectForm.statistics.filter((_, i) => i !== index);
  }

  addResponsibility(): void {
    const text = this.newRespText.trim();
    if (!text) return;
    this.projectForm.responsibilities = [...this.projectForm.responsibilities, text];
    this.newRespText = '';
  }

  removeResponsibility(index: number): void {
    this.projectForm.responsibilities = this.projectForm.responsibilities.filter((_, i) => i !== index);
  }

  addFeature(): void {
    const text = this.newFeatureText.trim();
    if (!text) return;
    this.projectForm.features = [...this.projectForm.features, text];
    this.newFeatureText = '';
  }

  removeFeature(index: number): void {
    this.projectForm.features = this.projectForm.features.filter((_, i) => i !== index);
  }

  addAchievement(): void {
    const text = this.newAchievementText.trim();
    if (!text) return;
    this.projectForm.achievements = [...this.projectForm.achievements, text];
    this.newAchievementText = '';
  }

  removeAchievement(index: number): void {
    this.projectForm.achievements = this.projectForm.achievements.filter((_, i) => i !== index);
  }

  dialogTitle(): string {
    const entity = this.dialogEntity();
    const mode = this.dialogMode();
    return `${mode === 'add' ? 'Add' : 'Edit'} ${entity === 'filters' ? 'filter' : 'project'}`;
  }

  formDialogConfig(): DialogConfig {
    return {
      title: this.dialogTitle(),
      size: this.dialogEntity() === 'projects' ? 'xl' : 'md',
      closable: true,
      maskClosable: true,
      footer: true,
    };
  }

  private emptyFilterForm(): ProjectFilterFormData {
    return { type: PROJECTS_SECTION_TYPE_CODE, key: '', label: '', sortOrder: this.nextFilterOrder() };
  }

  private emptyProjectForm(): FeaturedProjectFormData {
    return {
      type: PROJECTS_SECTION_TYPE_CODE,
      name: '',
      role: '',
      description: '',
      longDescription: '',
      technologies: [],
      status: 'completed',
      isFeatured: false,
      image: '',
      demoUrl: '',
      githubUrl: '',
      statistics: [],
      startDate: '',
      endDate: '',
      responsibilities: [],
      features: [],
      achievements: [],
      teamSize: 1,
      duration: '',
      sortOrder: this.nextProjectOrder(),
    };
  }

  private nextFilterOrder(): number {
    const items = this.store.filters();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextProjectOrder(): number {
    const items = this.store.projects();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private resetForm(entity: EntityType): void {
    this.newTechName = '';
    this.newRespText = '';
    this.newFeatureText = '';
    this.newAchievementText = '';
    if (entity === 'filters') this.filterForm = this.emptyFilterForm();
    else this.projectForm = this.emptyProjectForm();
  }

  private loadForm(entity: EntityType, id: string): void {
    if (entity === 'filters') {
      const item = this.store.filters().find(f => f.id === id);
      if (item) {
        this.filterForm = {
          type: PROJECTS_SECTION_TYPE_CODE,
          key: item.key,
          label: item.label,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    } else {
      const item = this.store.projects().find(p => p.id === id);
      if (item) {
        this.projectForm = {
          type: PROJECTS_SECTION_TYPE_CODE,
          name: item.name,
          role: item.role,
          description: item.description,
          longDescription: item.longDescription,
          technologies: [...item.technologies],
          status: item.status,
          isFeatured: item.isFeatured,
          image: item.image,
          demoUrl: item.demoUrl ?? '',
          githubUrl: item.githubUrl ?? '',
          statistics: [...item.statistics],
          startDate: item.startDate,
          endDate: item.endDate,
          responsibilities: [...item.responsibilities],
          features: [...item.features],
          achievements: [...item.achievements],
          teamSize: item.teamSize,
          duration: item.duration,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    }
  }
}

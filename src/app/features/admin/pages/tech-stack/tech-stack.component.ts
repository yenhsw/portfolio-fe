// ============================================================
// TECH STACK ADMIN COMPONENT
// ============================================================

import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechStackStore } from '../../store/tech-stack.store';
import {
  TECH_STACK_TAB_KEYS,
  TechStackTab,
  TechStackSectionConfig,
  TechStackStatisticFormData,
  TechStackCategoryFormData,
  TechStackSkillFormData,
  SKILLS_SECTION_TYPE_CODE,
  SKILLS_SECTION_TYPE_LABEL,
} from '../../models/tech-stack.model';
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
type EntityType = 'statistics' | 'categories' | 'skills';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPageComponent, AdminButtonComponent, AdminDialogComponent, AdminConfirmDialogComponent, TranslatePipe],
  templateUrl: './tech-stack.component.html',
  styleUrl: './tech-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStackComponent implements OnInit {
  readonly store = inject(TechStackStore);
  private readonly notify = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly sectionType = SKILLS_SECTION_TYPE_CODE;
  readonly sectionTypeLabel = SKILLS_SECTION_TYPE_LABEL;

  readonly tabList = computed(() => {
    this.locale.locale();
    return this.locale.pageTabs('techStack', TECH_STACK_TAB_KEYS);
  });
  readonly activeTab = signal<TechStackTab>('statistics');
  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly dialogEntity = signal<EntityType>('statistics');
  readonly editingId = signal<string | null>(null);
  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);

  private pendingDelete: { entity: EntityType; id: string } | null = null;
  formIsActive = true;

  sectionForm: TechStackSectionConfig = { ...this.store.section() };
  statForm: TechStackStatisticFormData = this.emptyStatForm();
  categoryForm: TechStackCategoryFormData = this.emptyCategoryForm();
  skillForm: TechStackSkillFormData = this.emptySkillForm();

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

  ngOnInit(): void {
    this.store.load();
    this.sectionForm = { ...this.store.section() };
    setTimeout(() => this.isReady.set(true), 100);
  }

  setTab(tab: TechStackTab): void {
    this.activeTab.set(tab);
    if (tab === 'section') this.sectionForm = { ...this.store.section() };
  }

  saveSection(): void {
    this.store.saveSection(this.sectionForm);
    this.notify.success('TECH STACK section config saved.');
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

    if (entity === 'statistics') {
      if (!this.statForm.label.trim()) { this.notify.warning('Please enter item name.'); return; }
      if (this.statForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      if (mode === 'add') {
        this.store.addStatistic(this.statForm);
        if (!this.formIsActive) {
          const added = this.store.statistics().at(-1);
          if (added) this.store.setStatisticStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateStatistic(id, this.statForm);
        this.store.setStatisticStatus(id, this.formIsActive);
      }
    } else if (entity === 'categories') {
      if (!this.categoryForm.name.trim()) { this.notify.warning('Please enter category name.'); return; }
      if (this.categoryForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      if (mode === 'add') {
        this.store.addCategory(this.categoryForm);
        if (!this.formIsActive) {
          const added = this.store.categories().at(-1);
          if (added) this.store.setCategoryStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateCategory(id, this.categoryForm);
        this.store.setCategoryStatus(id, this.formIsActive);
      }
    } else if (entity === 'skills') {
      if (!this.skillForm.name.trim()) { this.notify.warning('Please enter skill name.'); return; }
      if (!this.skillForm.categoryId) { this.notify.warning('Please select a category.'); return; }
      if (this.skillForm.sortOrder < 1) { this.notify.warning('Display order must be >= 1.'); return; }
      if (mode === 'add') {
        this.store.addSkill(this.skillForm);
        if (!this.formIsActive) {
          const added = this.store.skills().at(-1);
          if (added) this.store.setSkillStatus(added.id, false);
        }
      } else if (id) {
        this.store.updateSkill(id, this.skillForm);
        this.store.setSkillStatus(id, this.formIsActive);
      }
    }

    this.notify.success(mode === 'add' ? 'Added successfully.' : 'Updated successfully.');
    this.closeDialog();
  }

  deleteItem(entity: EntityType, id: string): void {
    const labels: Record<EntityType, string> = {
      statistics: 'statistic',
      categories: 'category',
      skills: 'skill',
    };
    this.pendingDelete = { entity, id };
    this.confirmConfig.set({
      title: 'Confirm delete',
      message: `Delete this ${labels[entity]}?`,
      detail: entity === 'categories' ? 'Skills in this category will also be deleted.' : 'This action cannot be undone.',
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
      case 'statistics': this.store.deleteStatistic(id); break;
      case 'categories': this.store.deleteCategory(id); break;
      case 'skills': this.store.deleteSkill(id); break;
    }
    this.notify.success('Deleted successfully.');
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDelete = null;
  }

  setStatus(entity: EntityType, id: string, isActive: boolean): void {
    switch (entity) {
      case 'statistics': this.store.setStatisticStatus(id, isActive); break;
      case 'categories': this.store.setCategoryStatus(id, isActive); break;
      case 'skills': this.store.setSkillStatus(id, isActive); break;
    }
    this.notify.info(isActive ? 'Now visible on Home.' : 'Now hidden from Home.');
  }

  displayStatValue(item: { valueNumber: number; valueSuffix: string }): string {
    return `${item.valueNumber}${item.valueSuffix}`;
  }

  dialogTitle(): string {
    const entity = this.dialogEntity();
    const mode = this.dialogMode();
    const names: Record<EntityType, string> = {
      statistics: 'Statistic',
      categories: 'Category',
      skills: 'Skills',
    };
    return `${mode === 'add' ? 'Add' : 'Edit'} ${names[entity]}`;
  }

  formDialogConfig(): DialogConfig {
    return {
      title: this.dialogTitle(),
      size: this.dialogEntity() === 'skills' ? 'lg' : 'md',
      closable: true,
      maskClosable: true,
      footer: true,
    };
  }

  private emptyStatForm(): TechStackStatisticFormData {
    return { type: SKILLS_SECTION_TYPE_CODE, valueNumber: 0, valueSuffix: '+', label: '', sortOrder: this.nextStatOrder() };
  }

  private emptyCategoryForm(): TechStackCategoryFormData {
    return { type: SKILLS_SECTION_TYPE_CODE, name: '', icon: '🎨', color: '#00f5ff', sortOrder: this.nextCategoryOrder() };
  }

  private emptySkillForm(): TechStackSkillFormData {
    const cats = this.store.categories();
    return {
      type: SKILLS_SECTION_TYPE_CODE,
      categoryId: cats[0]?.id ?? '',
      name: '',
      logo: '',
      level: 80,
      sortOrder: 1,
    };
  }

  private nextStatOrder(): number {
    const items = this.store.statistics();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private nextCategoryOrder(): number {
    const items = this.store.categories();
    return items.length === 0 ? 1 : Math.max(...items.map(i => i.sortOrder)) + 1;
  }

  private resetForm(entity: EntityType): void {
    switch (entity) {
      case 'statistics': this.statForm = this.emptyStatForm(); break;
      case 'categories': this.categoryForm = this.emptyCategoryForm(); break;
      case 'skills': this.skillForm = this.emptySkillForm(); break;
    }
  }

  private loadForm(entity: EntityType, id: string): void {
    if (entity === 'statistics') {
      const item = this.store.statistics().find(s => s.id === id);
      if (item) {
        this.statForm = {
          type: SKILLS_SECTION_TYPE_CODE,
          valueNumber: item.valueNumber,
          valueSuffix: item.valueSuffix,
          label: item.label,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    } else if (entity === 'categories') {
      const item = this.store.categories().find(c => c.id === id);
      if (item) {
        this.categoryForm = {
          type: SKILLS_SECTION_TYPE_CODE,
          name: item.name,
          icon: item.icon,
          color: item.color,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    } else if (entity === 'skills') {
      const item = this.store.skills().find(s => s.id === id);
      if (item) {
        this.skillForm = {
          type: SKILLS_SECTION_TYPE_CODE,
          categoryId: item.categoryId,
          name: item.name,
          logo: item.logo,
          level: item.level,
          sortOrder: item.sortOrder,
        };
        this.formIsActive = item.isActive;
      }
    }
  }
}

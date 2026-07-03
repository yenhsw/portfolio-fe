// ============================================================
// SKILLS COMPONENT
// Skills Management with Live Preview
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillStore } from '../../store/skill.store';
import { Skill, SkillFormData, SKILL_CATEGORIES, SKILL_COLORS } from '../../models/skill.model';
import { AdminPageComponent, AdminButtonComponent, AdminTableComponent } from '../../../../shared/components';
import { TableColumn, TableAction, SortState } from '../../../../shared/models/crud.models';
import { IconPickerComponent } from '../../components/icon-picker/icon-picker.component';
import { NotificationService } from '../../../../core/services/notification.service';

type DialogMode = 'add' | 'edit' | 'view' | null;

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageComponent,
    AdminButtonComponent,
    AdminTableComponent,
    IconPickerComponent,
  ],
  template: `
    <app-admin-page
      title="Skills Management"
      subtitle="Manage your technical skills and expertise"
      [icon]="pageIcon"
    >
      <!-- Toolbar -->
      <div class="toolbar" [class.visible]="isReady()">
        <div class="toolbar-left">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              class="search-input"
              placeholder="Search skills..."
              [value]="store.searchQuery()"
              (input)="onSearch($event)"
            />
          </div>

          <select
            class="filter-select"
            [value]="store.filterCategory()"
            (change)="onCategoryFilter($event)"
          >
            <option value="">All Categories</option>
            @for (cat of store.categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>

          <select
            class="filter-select"
            [value]="store.filterStatus()"
            (change)="onStatusFilter($event)"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="toolbar-right">
          @if (store.hasSelectedItems()) {
            <div class="bulk-actions">
              <span class="selected-count">{{ store.selectedCount() }} selected</span>
              <button class="bulk-btn" (click)="bulkToggle(true)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Show
              </button>
              <button class="bulk-btn" (click)="bulkToggle(false)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                Hide
              </button>
              <button class="bulk-btn danger" (click)="bulkDelete()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            </div>
          }

          <app-admin-button variant="secondary" (click)="exportSkills()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </app-admin-button>

          <app-admin-button variant="secondary" (click)="importSkills()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
          </app-admin-button>

          <app-admin-button variant="primary" (click)="openAddDialog()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Skill
          </app-admin-button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="skills-layout" [class.visible]="isReady()">
        <!-- Table Section -->
        <div class="skills-table-section">
          <app-admin-table
            [columns]="tableColumns"
            [data]="skillsForTable()"
            [loading]="store.loading()"
            [selectable]="true"
            [selectedIds]="store.selectedIds()"
            [showPagination]="true"
            (rowSelect)="onRowSelect($event)"
            (actionClick)="onAction($event)"
            (sortChange)="onSort($event)"
          />
        </div>

        <!-- Preview Section -->
        <div class="skills-preview-section">
          <div class="preview-header">
            <h3 class="preview-title">Live Preview</h3>
            <span class="preview-badge">Updates in real-time</span>
          </div>

          <div class="preview-card">
            @for (category of activeCategories(); track category.id) {
              @if (getSkillsByCategory(category.id).length > 0) {
                <div class="preview-category">
                  <h4 class="category-name" [style.color]="category.color">
                    <span class="category-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 6h16M4 12h16M4 18h16"/>
                      </svg>
                    </span>
                    {{ category.name }}
                  </h4>

                  <div class="skills-grid">
                    @for (skill of getSkillsByCategory(category.id); track skill.id) {
                      <div class="skill-item" [style.--skill-color]="skill.color">
                        <div class="skill-icon">
                          <span class="devicon" [class]="'devicon-' + skill.icon + '-original'"></span>
                        </div>
                        <div class="skill-info">
                          <span class="skill-name">{{ skill.displayName }}</span>
                          <div class="skill-bar">
                            <div class="skill-progress" [style.width.%]="skill.level"></div>
                          </div>
                        </div>
                        <span class="skill-level">{{ skill.level }}%</span>
                      </div>
                    }
                  </div>
                </div>
              }
            }

            @if (activeCategories().length === 0) {
              <div class="preview-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>No skills to display</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Add/Edit Dialog -->
      @if (dialogMode()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h3 class="dialog-title">
                @switch (dialogMode()) {
                  @case ('add') { Add New Skill }
                  @case ('edit') { Edit Skill }
                  @case ('view') { Skill Details }
                }
              </h3>
              <button class="dialog-close" (click)="closeDialog()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="dialog-body">
              @if (dialogMode() === 'view' && selectedSkill()) {
                <!-- View Mode -->
                <div class="view-mode">
                  <div class="view-header">
                    <div class="view-icon" [style.background]="selectedSkill()!.color">
                      <span class="devicon" [class]="'devicon-' + selectedSkill()!.icon + '-original'"></span>
                    </div>
                    <div class="view-title">
                      <h4>{{ selectedSkill()!.displayName }}</h4>
                      <span class="view-category">{{ getCategoryName(selectedSkill()!.categoryId) }}</span>
                    </div>
                    <span class="view-status" [class.active]="selectedSkill()!.isActive">
                      {{ selectedSkill()!.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>

                  <div class="view-level">
                    <div class="level-header">
                      <span>Level</span>
                      <span>{{ selectedSkill()!.level }}%</span>
                    </div>
                    <div class="level-bar">
                      <div class="level-progress" [style.width.%]="selectedSkill()!.level"></div>
                    </div>
                  </div>

                  @if (selectedSkill()!.description) {
                    <div class="view-description">
                      <label>Description</label>
                      <p>{{ selectedSkill()!.description }}</p>
                    </div>
                  }
                </div>
              } @else {
                <!-- Add/Edit Mode -->
                <div class="form-grid">
                  <div class="form-field">
                    <label class="field-label">Name <span class="required">*</span></label>
                    <input
                      type="text"
                      class="field-input"
                      [(ngModel)]="formData.name"
                      placeholder="e.g., Angular, Java"
                    />
                  </div>

                  <div class="form-field">
                    <label class="field-label">Display Name</label>
                    <input
                      type="text"
                      class="field-input"
                      [(ngModel)]="formData.displayName"
                      placeholder="How to display"
                    />
                  </div>

                  <div class="form-field">
                    <label class="field-label">Category <span class="required">*</span></label>
                    <select class="field-input" [(ngModel)]="formData.categoryId">
                      @for (cat of store.categories(); track cat.id) {
                        <option [value]="cat.id">{{ cat.name }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-field">
                    <label class="field-label">Color</label>
                    <div class="color-picker">
                      @for (color of colors; track color) {
                        <button
                          class="color-option"
                          [class.selected]="formData.color === color"
                          [style.background]="color"
                          (click)="selectColor(color)"
                        ></button>
                      }
                    </div>
                  </div>
                </div>

                <div class="form-field">
                  <label class="field-label">Level: {{ formData.level }}%</label>
                  <input
                    type="range"
                    class="level-slider"
                    [(ngModel)]="formData.level"
                    min="0"
                    max="100"
                    step="5"
                  />
                  <div class="level-marks">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div class="form-field">
                  <label class="field-label">Icon</label>
                  <div class="icon-preview" (click)="toggleIconPicker()">
                    @if (formData.icon) {
                      <span class="devicon" [class]="'devicon-' + formData.icon + '-original'"></span>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    }
                    <span>Select Icon</span>
                  </div>
                </div>

                @if (showIconPicker()) {
                  <div class="icon-picker-wrapper">
                    <app-icon-picker
                      [selectedIcon]="formData.icon"
                      (iconChange)="onIconSelect($event)"
                    />
                  </div>
                }

                <div class="form-field">
                  <label class="field-label">Description</label>
                  <textarea
                    class="field-textarea"
                    [(ngModel)]="formData.description"
                    placeholder="Brief description of this skill"
                    rows="3"
                  ></textarea>
                </div>
              }
            </div>

            <div class="dialog-footer">
              @if (dialogMode() === 'view') {
                <app-admin-button variant="secondary" (click)="closeDialog()">Close</app-admin-button>
                <app-admin-button variant="primary" (click)="openEditDialog()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </app-admin-button>
              } @else {
                <app-admin-button variant="secondary" (click)="closeDialog()">Cancel</app-admin-button>
                @if (dialogMode() === 'edit') {
                  <app-admin-button variant="danger" (click)="deleteCurrentSkill()">Delete</app-admin-button>
                }
                <app-admin-button variant="primary" (click)="saveSkill()" [loading]="store.saving()">
                  {{ dialogMode() === 'add' ? 'Add Skill' : 'Save Changes' }}
                </app-admin-button>
              }
            </div>
          </div>
        </div>
      }
    </app-admin-page>
  `,
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  readonly store = inject(SkillStore);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notify = inject(NotificationService);

  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly selectedSkill = signal<Skill | null>(null);
  readonly showIconPicker = signal(false);

  readonly pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  readonly colors = SKILL_COLORS;

  formData: SkillFormData = {
    name: '',
    displayName: '',
    icon: '',
    iconType: 'class',
    categoryId: 'frontend',
    level: 50,
    color: '#6366F1',
    description: '',
  };

  readonly skillsForTable = computed(() => {
    return this.store.filteredSkills() as unknown as Record<string, unknown>[];
  });

  readonly tableColumns: TableColumn[] = [
    {
      key: 'icon',
      label: '',
      width: '60px',
      sortable: false,
      format: (_value: unknown, row: unknown) => {
        const r = row as Skill;
        return `<span style="font-size: 24px; color: ${r.color};"><span class="devicon-${r.icon}-original"></span></span>`;
      },
    },
    {
      key: 'displayName',
      label: 'Skill',
      sortable: true,
      format: (value: unknown) => `<span style="color: var(--text-primary); font-weight: 500;">${value}</span>`,
    },
    {
      key: 'categoryId',
      label: 'Category',
      sortable: true,
      format: (value: unknown) => `<span style="color: var(--text-secondary);">${this.getCategoryName(value as string)}</span>`,
    },
    {
      key: 'level',
      label: 'Level',
      width: '150px',
      sortable: true,
      format: (value: unknown) => {
        const v = value as number;
        return `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
              <div style="width: ${v}%; height: 100%; background: var(--primary); border-radius: 3px;"></div>
            </div>
            <span style="color: var(--text-muted); font-size: 12px;">${v}%</span>
          </div>
        `;
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '100px',
      sortable: false,
      format: (value: unknown) => {
        const v = value as boolean;
        return `<span style="color: ${v ? 'var(--success)' : 'var(--text-muted)'};">${v ? 'Active' : 'Inactive'}</span>`;
      },
    },
  ];

  readonly tableActions: TableAction[] = [
    { id: 'view', label: 'View', icon: 'eye', variant: 'ghost' },
    { id: 'edit', label: 'Edit', icon: 'edit', variant: 'ghost' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy', variant: 'ghost' },
    { id: 'toggle', label: 'Toggle Status', icon: 'toggle', variant: 'ghost' },
    { id: 'delete', label: 'Delete', icon: 'trash', variant: 'ghost', danger: true },
  ];

  readonly activeCategories = computed(() =>
    this.store.categories().filter(c => c.isActive)
  );

  ngOnInit(): void {
    this.store.loadSkills();
    setTimeout(() => this.isReady.set(true), 100);
  }

  getCategoryName(categoryId: string): string {
    const category = this.store.categories().find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  getSkillsByCategory(categoryId: string): Skill[] {
    return this.store.skillsByCategory()[categoryId] || [];
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearchQuery(value);
  }

  onCategoryFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setFilterCategory(value);
  }

  onStatusFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'active' | 'inactive';
    this.store.setFilterStatus(value);
  }

  onRowSelect(id: string): void {
    this.store.toggleSelection(id);
  }

  onAction(event: { action: TableAction; row: Record<string, unknown> }): void {
    const skill = event.row as unknown as Skill;
    this.selectedSkill.set(skill);

    switch (event.action.id) {
      case 'view':
        this.dialogMode.set('view');
        break;
      case 'edit':
        this.openEditDialog();
        break;
      case 'duplicate':
        this.duplicateSkill(skill.id);
        break;
      case 'toggle':
        this.store.toggleSkillStatus(skill.id);
        break;
      case 'delete':
        this.deleteSkill(skill.id);
        break;
    }
  }

  onSort(sort: SortState): void {
    // Sort logic handled by store
  }

  openAddDialog(): void {
    this.selectedSkill.set(null);
    this.formData = {
      name: '',
      displayName: '',
      icon: '',
      iconType: 'class',
      categoryId: this.store.categories()[0]?.id || 'frontend',
      level: 50,
      color: '#6366F1',
      description: '',
    };
    this.showIconPicker.set(false);
    this.dialogMode.set('add');
  }

  openEditDialog(): void {
    const skill = this.selectedSkill();
    if (!skill) return;

    this.formData = {
      name: skill.name,
      displayName: skill.displayName,
      icon: skill.icon,
      iconType: skill.iconType,
      categoryId: skill.categoryId,
      level: skill.level,
      color: skill.color,
      description: skill.description || '',
    };
    this.showIconPicker.set(false);
    this.dialogMode.set('edit');
  }

  closeDialog(): void {
    this.dialogMode.set(null);
    this.selectedSkill.set(null);
    this.showIconPicker.set(false);
  }

  selectColor(color: string): void {
    this.formData.color = color;
  }

  toggleIconPicker(): void {
    this.showIconPicker.update(v => !v);
  }

  onIconSelect(data: { icon: string; iconType: 'svg' | 'class' }): void {
    this.formData.icon = data.icon;
    this.formData.iconType = data.iconType;
    this.showIconPicker.set(false);
  }

  saveSkill(): void {
    if (!this.formData.name.trim()) {
      this.notify.warning('Please enter skill name.');
      return;
    }

    // Auto-fill displayName if empty
    if (!this.formData.displayName.trim()) {
      this.formData.displayName = this.formData.name;
    }

    if (this.dialogMode() === 'add') {
      this.store.addSkill(this.formData);
    } else if (this.dialogMode() === 'edit') {
      const skill = this.selectedSkill();
      if (skill) {
        this.store.updateSkill(skill.id, this.formData);
      }
    }

    this.notify.success(this.dialogMode() === 'add' ? 'Skill added.' : 'Skill updated.');
    this.closeDialog();
  }

  deleteCurrentSkill(): void {
    const skill = this.selectedSkill();
    if (skill) {
      this.deleteSkill(skill.id);
      this.closeDialog();
    }
  }

  deleteSkill(id: string): void {
    if (confirm('Are you sure you want to delete this skill?')) {
      this.store.deleteSkill(id);
      this.notify.success('Skill deleted.');
    }
  }

  duplicateSkill(id: string): void {
    this.store.duplicateSkill(id);
  }

  bulkToggle(status: boolean): void {
    const ids = Array.from(this.store.selectedIds());
    this.store.bulkToggleStatus(ids, status);
  }

  bulkDelete(): void {
    const count = this.store.selectedCount();
    if (confirm(`Are you sure you want to delete ${count} skills?`)) {
      const ids = Array.from(this.store.selectedIds());
      this.store.deleteSkills(ids);
    }
  }

  exportSkills(): void {
    const json = this.store.exportSkills();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skills-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importSkills(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && isPlatformBrowser(this.platformId)) {
        const text = await file.text();
        if (this.store.importSkills(text)) {
          this.notify.success('Skills imported successfully.');
        } else {
          this.notify.error('Invalid JSON file.');
        }
      }
    };
    input.click();
  }
}

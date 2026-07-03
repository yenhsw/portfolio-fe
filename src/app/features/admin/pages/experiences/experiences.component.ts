// ============================================================
// EXPERIENCE COMPONENT
// Experience Management with Live Preview
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
import { ExperienceStore } from '../../store/experience.store';
import { Experience, ExperienceFormData, Project, Achievement, EMPLOYMENT_TYPES, TECHNOLOGIES, RESPONSIBILITIES } from '../../models/experience.model';
import { AdminPageComponent, AdminButtonComponent, AdminTableComponent } from '../../../../shared/components';
import { TableColumn, TableAction, SortState } from '../../../../shared/models/crud.models';
import { NotificationService } from '../../../../core/services/notification.service';

type DialogMode = 'add' | 'edit' | 'view' | null;
type TabView = 'timeline' | 'table';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageComponent,
    AdminButtonComponent,
    AdminTableComponent,
  ],
  template: `
    <app-admin-page
      title="Experience Management"
      subtitle="Manage your career journey and work history"
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
              placeholder="Search by company, position, tech..."
              [value]="store.searchQuery()"
              (input)="onSearch($event)"
            />
          </div>

          <select
            class="filter-select"
            [value]="store.filterStatus()"
            (change)="onStatusFilter($event)"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            class="filter-select"
            [value]="store.filterEmploymentType()"
            (change)="onEmploymentTypeFilter($event)"
          >
            <option value="">All Types</option>
            @for (type of employmentTypes; track type.value) {
              <option [value]="type.value">{{ type.label }}</option>
            }
          </select>

          <select
            class="filter-select"
            [value]="store.filterCurrent() ?? ''"
            (change)="onCurrentFilter($event)"
          >
            <option value="">All</option>
            <option value="current">Current</option>
            <option value="past">Past</option>
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
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
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

          <div class="view-toggle">
            <button
              class="toggle-btn"
              [class.active]="viewMode() === 'timeline'"
              (click)="viewMode.set('timeline')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="22"/>
                <circle cx="12" cy="8" r="3"/>
                <circle cx="12" cy="16" r="3"/>
              </svg>
            </button>
            <button
              class="toggle-btn"
              [class.active]="viewMode() === 'table'"
              (click)="viewMode.set('table')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
          </div>

          <app-admin-button variant="secondary" (click)="exportExperiences()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </app-admin-button>

          <app-admin-button variant="secondary" (click)="importExperiences()">
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
            Add Experience
          </app-admin-button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="experiences-layout" [class.visible]="isReady()">
        <!-- Main Content -->
        <div class="experiences-main-section">
          @if (viewMode() === 'timeline') {
            <!-- Timeline View -->
            <div class="timeline-view">
              <div class="timeline-line"></div>
              @for (exp of store.timelineExperiences(); track exp.id; let i = $index) {
                <div class="timeline-item" [class.current]="exp.isCurrent">
                  <div class="timeline-marker">
                    <div class="marker-dot" [style.background]="getCompanyColor(exp)"></div>
                  </div>
                  <div class="timeline-card" (click)="openViewDialog(exp)">
                    <div class="card-header">
                      <img
                        [src]="exp.companyLogo"
                        [alt]="exp.companyName"
                        class="company-logo"
                      />
                      <div class="card-info">
                        <h4 class="position">{{ exp.position }}</h4>
                        <p class="company">{{ exp.companyName }}</p>
                        <p class="duration">
                          {{ formatDate(exp.startDate) }} - {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}
                          <span class="emp-type">{{ getEmploymentLabel(exp.employmentType) }}</span>
                        </p>
                      </div>
                      @if (exp.isCurrent) {
                        <span class="current-badge">Current</span>
                      }
                    </div>

                    <div class="card-tech">
                      @for (tech of exp.technologies.slice(0, 6); track tech) {
                        <span class="tech-badge">{{ tech }}</span>
                      }
                      @if (exp.technologies.length > 6) {
                        <span class="tech-more">+{{ exp.technologies.length - 6 }}</span>
                      }
                    </div>

                    <div class="card-achievements">
                      @for (ach of exp.achievements.slice(0, 3); track ach.id) {
                        <div class="achievement">
                          <span class="ach-value">{{ ach.value }}</span>
                          <span class="ach-label">{{ ach.label }}</span>
                        </div>
                      }
                    </div>

                    <div class="card-actions">
                      <button class="action-btn" (click)="openViewDialog(exp); $event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button class="action-btn" (click)="selectAndEdit(exp); $event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="action-btn danger" (click)="deleteExperience(exp.id); $event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- Table View -->
            <app-admin-table
              [columns]="tableColumns"
              [data]="experiencesForTable()"
              [loading]="store.loading()"
              [selectable]="true"
              [selectedIds]="store.selectedIds()"
              [showPagination]="true"
              (rowSelect)="onRowSelect($event)"
              (actionClick)="onAction($event)"
              (sortChange)="onSort($event)"
            />
          }
        </div>

        <!-- Preview Section -->
        <div class="experiences-preview-section">
          <div class="preview-header">
            <h3 class="preview-title">Live Preview</h3>
            <span class="preview-badge">Updates in real-time</span>
          </div>

          <div class="preview-card">
            <div class="preview-timeline">
              @for (exp of store.timelineExperiences(); track exp.id) {
                <div class="preview-item" [class.current]="exp.isCurrent">
                  <div class="preview-marker">
                    <div class="preview-dot" [style.background]="getCompanyColor(exp)"></div>
                  </div>
                  <div class="preview-content">
                    <div class="preview-header-row">
                      <img [src]="exp.companyLogo" [alt]="exp.companyName" class="preview-logo" />
                      <div class="preview-info">
                        <h4 class="preview-position">{{ exp.position }}</h4>
                        <p class="preview-company">{{ exp.companyName }}</p>
                        <p class="preview-date">
                          {{ formatDate(exp.startDate) }} - {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}
                        </p>
                      </div>
                    </div>
                    @if (exp.summary) {
                      <p class="preview-summary">{{ exp.summary }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Dialog -->
      @if (dialogMode()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog dialog-lg" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h3 class="dialog-title">
                @switch (dialogMode()) {
                  @case ('add') { Add New Experience }
                  @case ('edit') { Edit Experience }
                  @case ('view') { Experience Details }
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
              @if (dialogMode() === 'view' && selectedExperience()) {
                <!-- View Mode -->
                <div class="view-mode">
                  <div class="view-header">
                    <img [src]="selectedExperience()!.companyLogo" [alt]="selectedExperience()!.companyName" class="view-logo" />
                    <div class="view-title">
                      <h4>{{ selectedExperience()!.position }}</h4>
                      <p>{{ selectedExperience()!.companyName }}</p>
                      <p class="view-meta">
                        {{ formatDate(selectedExperience()!.startDate) }} - {{ selectedExperience()!.isCurrent ? 'Present' : formatDate(selectedExperience()!.endDate) }}
                        <span class="badge">{{ getEmploymentLabel(selectedExperience()!.employmentType) }}</span>
                      </p>
                    </div>
                    <span class="view-status" [class.active]="selectedExperience()!.isActive">
                      {{ selectedExperience()!.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>

                  @if (selectedExperience()!.summary) {
                    <div class="view-section">
                      <h5>Summary</h5>
                      <p>{{ selectedExperience()!.summary }}</p>
                    </div>
                  }

                  @if (selectedExperience()!.technologies.length > 0) {
                    <div class="view-section">
                      <h5>Technologies</h5>
                      <div class="view-tech">
                        @for (tech of selectedExperience()!.technologies; track tech) {
                          <span class="tech-badge">{{ tech }}</span>
                        }
                      </div>
                    </div>
                  }

                  @if (selectedExperience()!.achievements.length > 0) {
                    <div class="view-section">
                      <h5>Achievements</h5>
                      <div class="view-achievements">
                        @for (ach of selectedExperience()!.achievements; track ach.id) {
                          <div class="achievement-item">
                            <span class="ach-value">{{ ach.value }}</span>
                            <span class="ach-label">{{ ach.label }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  @if (selectedExperience()!.projects.length > 0) {
                    <div class="view-section">
                      <h5>Projects</h5>
                      <div class="view-projects">
                        @for (proj of selectedExperience()!.projects; track proj.id) {
                          <div class="project-item">
                            <h6>{{ proj.name }}</h6>
                            <p class="proj-role">{{ proj.role }}</p>
                            <p class="proj-desc">{{ proj.description }}</p>
                            <div class="proj-tech">
                              @for (tech of proj.technologies; track tech) {
                                <span class="tech-badge-sm">{{ tech }}</span>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <!-- Add/Edit Mode -->
                <div class="form-sections">
                  <!-- Basic Info -->
                  <section class="form-section">
                    <h4 class="section-title">Basic Information</h4>

                    <div class="form-grid">
                      <div class="form-field">
                        <label class="field-label">Company Name <span class="required">*</span></label>
                        <input
                          type="text"
                          class="field-input"
                          [(ngModel)]="formData.companyName"
                          placeholder="e.g., Google, Microsoft"
                        />
                      </div>

                      <div class="form-field">
                        <label class="field-label">Company Logo URL</label>
                        <input
                          type="url"
                          class="field-input"
                          [(ngModel)]="formData.companyLogo"
                          placeholder="https://..."
                        />
                      </div>

                      <div class="form-field">
                        <label class="field-label">Position <span class="required">*</span></label>
                        <input
                          type="text"
                          class="field-input"
                          [(ngModel)]="formData.position"
                          placeholder="e.g., Senior Developer"
                        />
                      </div>

                      <div class="form-field">
                        <label class="field-label">Employment Type</label>
                        <select class="field-input" [(ngModel)]="formData.employmentType">
                          @for (type of employmentTypes; track type.value) {
                            <option [value]="type.value">{{ type.label }}</option>
                          }
                        </select>
                      </div>

                      <div class="form-field">
                        <label class="field-label">Location</label>
                        <input
                          type="text"
                          class="field-input"
                          [(ngModel)]="formData.location"
                          placeholder="City, Country"
                        />
                      </div>

                      <div class="form-field">
                        <label class="field-label">
                          <input
                            type="checkbox"
                            [(ngModel)]="formData.isCurrent"
                            (ngModelChange)="onCurrentChange()"
                          />
                          Currently Working Here
                        </label>
                      </div>
                    </div>

                    <div class="form-grid">
                      <div class="form-field">
                        <label class="field-label">Start Date <span class="required">*</span></label>
                        <input
                          type="month"
                          class="field-input"
                          [(ngModel)]="formData.startDate"
                        />
                      </div>

                      <div class="form-field">
                        <label class="field-label">End Date</label>
                        <input
                          type="month"
                          class="field-input"
                          [(ngModel)]="formData.endDate"
                          [disabled]="formData.isCurrent"
                        />
                      </div>
                    </div>
                  </section>

                  <!-- Summary -->
                  <section class="form-section">
                    <h4 class="section-title">Summary</h4>
                    <div class="form-field">
                      <label class="field-label">Summary</label>
                      <textarea
                        class="field-textarea"
                        [(ngModel)]="formData.summary"
                        placeholder="Brief summary of your role..."
                        rows="2"
                      ></textarea>
                    </div>
                  </section>

                  <!-- Description -->
                  <section class="form-section">
                    <h4 class="section-title">Description</h4>
                    <div class="form-field">
                      <label class="field-label">Description (HTML)</label>
                      <textarea
                        class="field-textarea code"
                        [(ngModel)]="formData.description"
                        placeholder="<p>Your description...</p>"
                        rows="6"
                      ></textarea>
                    </div>
                  </section>

                  <!-- Technologies -->
                  <section class="form-section">
                    <h4 class="section-title">Technologies</h4>
                    <div class="tech-grid">
                      @for (tech of availableTechnologies; track tech) {
                        <label class="tech-checkbox">
                          <input
                            type="checkbox"
                            [checked]="isTechSelected(tech)"
                            (change)="toggleTech(tech)"
                          />
                          <span>{{ tech }}</span>
                        </label>
                      }
                    </div>
                  </section>

                  <!-- Responsibilities -->
                  <section class="form-section">
                    <h4 class="section-title">Responsibilities</h4>
                    <div class="tech-grid">
                      @for (resp of availableResponsibilities; track resp) {
                        <label class="tech-checkbox">
                          <input
                            type="checkbox"
                            [checked]="isRespSelected(resp)"
                            (change)="toggleResp(resp)"
                          />
                          <span>{{ resp }}</span>
                        </label>
                      }
                    </div>
                  </section>

                  <!-- Achievements -->
                  <section class="form-section">
                    <h4 class="section-title">Achievements</h4>
                    <div class="achievements-list">
                      @for (ach of formData.achievements; track ach.id; let i = $index) {
                        <div class="achievement-row">
                          <input
                            type="text"
                            class="field-input"
                            [(ngModel)]="ach.value"
                            placeholder="e.g., 100+"
                          />
                          <input
                            type="text"
                            class="field-input"
                            [(ngModel)]="ach.label"
                            placeholder="e.g., REST APIs"
                          />
                          <button class="btn-icon danger" (click)="removeAchievement(i)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      }
                      <button class="btn-add" (click)="addAchievement()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Achievement
                      </button>
                    </div>
                  </section>

                  <!-- Projects -->
                  <section class="form-section">
                    <h4 class="section-title">Projects</h4>
                    <div class="projects-list">
                      @for (proj of formData.projects; track proj.id; let i = $index) {
                        <div class="project-card">
                          <div class="project-header">
                            <h5>Project {{ i + 1 }}</h5>
                            <button class="btn-icon danger" (click)="removeProject(i)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                          <div class="project-fields">
                            <input
                              type="text"
                              class="field-input"
                              [(ngModel)]="proj.name"
                              placeholder="Project name"
                            />
                            <input
                              type="text"
                              class="field-input"
                              [(ngModel)]="proj.role"
                              placeholder="Your role"
                            />
                            <textarea
                              class="field-textarea"
                              [(ngModel)]="proj.description"
                              placeholder="Description"
                              rows="2"
                            ></textarea>
                            <div class="proj-tech-input">
                              <label class="field-label">Technologies</label>
                              <input
                                type="text"
                                class="field-input"
                                [ngModel]="proj.technologies.join(', ')"
                                (ngModelChange)="updateProjectTechs(i, $event)"
                                placeholder="Angular, Java, PostgreSQL"
                              />
                            </div>
                          </div>
                        </div>
                      }
                      <button class="btn-add" (click)="addProject()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Project
                      </button>
                    </div>
                  </section>
                </div>
              }
            </div>

            <div class="dialog-footer">
              @if (dialogMode() === 'view') {
                <app-admin-button variant="secondary" (click)="closeDialog()">Close</app-admin-button>
                <app-admin-button variant="primary" (click)="openEditFromView()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </app-admin-button>
              } @else {
                <app-admin-button variant="secondary" (click)="closeDialog()">Cancel</app-admin-button>
                @if (dialogMode() === 'edit') {
                  <app-admin-button variant="danger" (click)="deleteCurrentExperience()">Delete</app-admin-button>
                }
                <app-admin-button variant="primary" (click)="saveExperience()" [loading]="store.saving()">
                  {{ dialogMode() === 'add' ? 'Add Experience' : 'Save Changes' }}
                </app-admin-button>
              }
            </div>
          </div>
        </div>
      }
    </app-admin-page>
  `,
  styleUrls: ['./experiences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencesComponent {
  readonly store = inject(ExperienceStore);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notify = inject(NotificationService);

  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly selectedExperience = signal<Experience | null>(null);
  readonly viewMode = signal<TabView>('timeline');

  readonly pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';

  readonly employmentTypes = EMPLOYMENT_TYPES;
  readonly availableTechnologies = TECHNOLOGIES;
  readonly availableResponsibilities = RESPONSIBILITIES;

  private companyColors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B',
    '#10B981', '#14B8A6', '#06B6D4', '#3B82F6', '#0EA5E9',
  ];

  formData: ExperienceFormData = this.getEmptyFormData();

  readonly experiencesForTable = computed(() => {
    return this.store.filteredExperiences() as unknown as Record<string, unknown>[];
  });

  readonly tableColumns: TableColumn[] = [
    {
      key: 'companyLogo',
      label: '',
      width: '60px',
      sortable: false,
      format: (_value: unknown, row: unknown) => {
        const r = row as Experience;
        return `<img src="${r.companyLogo}" alt="${r.companyName}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />`;
      },
    },
    {
      key: 'companyName',
      label: 'Company',
      sortable: true,
      format: (value: unknown, row: unknown) => {
        const r = row as Experience;
        return `<div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-weight: 500; color: var(--text-primary);">${r.position}</span>
          <span style="font-size: 12px; color: var(--text-muted);">${value}</span>
        </div>`;
      },
    },
    {
      key: 'employmentType',
      label: 'Type',
      width: '120px',
      sortable: true,
      format: (value: unknown) => `<span style="font-size: 12px; color: var(--text-secondary);">${this.getEmploymentLabel(value as string)}</span>`,
    },
    {
      key: 'startDate',
      label: 'Duration',
      width: '180px',
      sortable: true,
      format: (value: unknown, row: unknown) => {
        const r = row as Experience;
        return `<span style="font-size: 12px; color: var(--text-muted);">
          ${this.formatDate(r.startDate)} - ${r.isCurrent ? 'Present' : this.formatDate(r.endDate)}
          ${r.isCurrent ? '<span style="color: var(--success); margin-left: 4px;">●</span>' : ''}
        </span>`;
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
    { id: 'toggle', label: 'Toggle', icon: 'toggle', variant: 'ghost' },
    { id: 'delete', label: 'Delete', icon: 'trash', variant: 'ghost', danger: true },
  ];

  ngOnInit(): void {
    this.store.loadExperiences();
    setTimeout(() => this.isReady.set(true), 100);
  }

  getEmptyFormData(): ExperienceFormData {
    return {
      companyName: '',
      companyLogo: '',
      position: '',
      employmentType: 'full-time',
      location: '',
      startDate: '',
      endDate: null,
      isCurrent: false,
      summary: '',
      description: '',
      technologies: [],
      responsibilities: [],
      achievements: [],
      projects: [],
    };
  }

  getEmploymentLabel(type: string): string {
    const found = EMPLOYMENT_TYPES.find(t => t.value === type);
    return found?.label || type;
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getCompanyColor(exp: Experience): string {
    const index = this.store.experiences().findIndex(e => e.id === exp.id);
    return this.companyColors[index % this.companyColors.length];
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearchQuery(value);
  }

  onStatusFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'active' | 'inactive';
    this.store.setFilterStatus(value);
  }

  onEmploymentTypeFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.setFilterEmploymentType(value);
  }

  onCurrentFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'current') {
      this.store.setFilterCurrent(true);
    } else if (value === 'past') {
      this.store.setFilterCurrent(false);
    } else {
      this.store.setFilterCurrent(null);
    }
  }

  onRowSelect(id: string): void {
    this.store.toggleSelection(id);
  }

  onAction(event: { action: TableAction; row: Record<string, unknown> }): void {
    const exp = event.row as unknown as Experience;
    this.selectedExperience.set(exp);

    switch (event.action.id) {
      case 'view':
        this.dialogMode.set('view');
        break;
      case 'edit':
        this.openEditDialog();
        break;
      case 'duplicate':
        this.store.duplicateExperience(exp.id);
        break;
      case 'toggle':
        this.store.toggleExperienceStatus(exp.id);
        break;
      case 'delete':
        this.deleteExperience(exp.id);
        break;
    }
  }

  onSort(sort: SortState): void {
    // Sort handled by store
  }

  openAddDialog(): void {
    this.selectedExperience.set(null);
    this.formData = this.getEmptyFormData();
    this.dialogMode.set('add');
  }

  openViewDialog(exp: Experience): void {
    this.selectedExperience.set(exp);
    this.dialogMode.set('view');
  }

  openEditDialog(): void {
    const exp = this.selectedExperience();
    if (!exp) return;

    this.formData = {
      companyName: exp.companyName,
      companyLogo: exp.companyLogo,
      position: exp.position,
      employmentType: exp.employmentType,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      summary: exp.summary,
      description: exp.description,
      technologies: [...exp.technologies],
      responsibilities: [...exp.responsibilities],
      achievements: exp.achievements.map(a => ({ ...a })),
      projects: exp.projects.map(p => ({ ...p })),
    };
    this.dialogMode.set('edit');
  }

  selectAndEdit(exp: Experience): void {
    this.selectedExperience.set(exp);
    this.openEditDialog();
  }

  openEditFromView(): void {
    this.openEditDialog();
  }

  closeDialog(): void {
    this.dialogMode.set(null);
    this.selectedExperience.set(null);
  }

  onCurrentChange(): void {
    if (this.formData.isCurrent) {
      this.formData.endDate = null;
    }
  }

  isTechSelected(tech: string): boolean {
    return this.formData.technologies.includes(tech);
  }

  toggleTech(tech: string): void {
    if (this.isTechSelected(tech)) {
      this.formData.technologies = this.formData.technologies.filter(t => t !== tech);
    } else {
      this.formData.technologies = [...this.formData.technologies, tech];
    }
  }

  isRespSelected(resp: string): boolean {
    return this.formData.responsibilities.includes(resp);
  }

  toggleResp(resp: string): void {
    if (this.isRespSelected(resp)) {
      this.formData.responsibilities = this.formData.responsibilities.filter(r => r !== resp);
    } else {
      this.formData.responsibilities = [...this.formData.responsibilities, resp];
    }
  }

  addAchievement(): void {
    this.formData.achievements = [
      ...this.formData.achievements,
      { id: `ach_${Date.now()}`, value: '', label: '' },
    ];
  }

  removeAchievement(index: number): void {
    this.formData.achievements = this.formData.achievements.filter((_, i) => i !== index);
  }

  addProject(): void {
    this.formData.projects = [
      ...this.formData.projects,
      { id: `proj_${Date.now()}`, name: '', role: '', description: '', technologies: [] },
    ];
  }

  removeProject(index: number): void {
    this.formData.projects = this.formData.projects.filter((_, i) => i !== index);
  }

  updateProjectTechs(index: number, techs: string): void {
    const techList = techs.split(',').map(t => t.trim()).filter(t => t);
    this.formData.projects[index].technologies = techList;
  }

  saveExperience(): void {
    if (!this.formData.companyName.trim() || !this.formData.position.trim() || !this.formData.startDate) {
      return;
    }

    if (this.dialogMode() === 'add') {
      this.store.addExperience(this.formData);
    } else if (this.dialogMode() === 'edit') {
      const exp = this.selectedExperience();
      if (exp) {
        this.store.updateExperience(exp.id, this.formData);
      }
    }

    this.closeDialog();
  }

  deleteCurrentExperience(): void {
    const exp = this.selectedExperience();
    if (exp) {
      this.deleteExperience(exp.id);
      this.closeDialog();
    }
  }

  deleteExperience(id: string): void {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.store.deleteExperience(id);
    }
  }

  bulkToggle(status: boolean): void {
    const ids = Array.from(this.store.selectedIds());
    this.store.bulkToggleStatus(ids, status);
  }

  bulkDelete(): void {
    const count = this.store.selectedCount();
    if (confirm(`Are you sure you want to delete ${count} experiences?`)) {
      const ids = Array.from(this.store.selectedIds());
      this.store.deleteExperiences(ids);
    }
  }

  exportExperiences(): void {
    const json = this.store.exportExperiences();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiences-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importExperiences(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && isPlatformBrowser(this.platformId)) {
        const text = await file.text();
        if (this.store.importExperiences(text)) {
          this.notify.success('Experiences imported successfully.');
        } else {
          this.notify.error('Invalid JSON file.');
        }
      }
    };
    input.click();
  }
}

// ============================================================
// PROJECTS COMPONENT
// Projects Management with Live Preview
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
import { ProjectStore } from '../../store/project.store';
import { Project, ProjectFormData, PROJECT_STATUSES, PROJECT_CATEGORIES, TECHNOLOGIES } from '../../models/project.model';
import { AdminPageComponent, AdminButtonComponent, AdminTableComponent } from '../../../../shared/components';
import { TableColumn, TableAction, SortState } from '../../../../shared/models/crud.models';
import { NotificationService } from '../../../../core/services/notification.service';

type DialogMode = 'add' | 'edit' | 'view' | null;
type TabView = 'featured' | 'all';
type FormTab = 'basic' | 'media' | 'tech' | 'team' | 'seo';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageComponent,
    AdminButtonComponent,
    AdminTableComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  readonly store = inject(ProjectStore);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notify = inject(NotificationService);

  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly selectedProject = signal<Project | null>(null);
  readonly viewMode = signal<TabView>('featured');
  readonly activeTab = signal<FormTab>('basic');

  readonly pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

  readonly categories = PROJECT_CATEGORIES;
  readonly statuses = PROJECT_STATUSES;
  readonly availableTechnologies = TECHNOLOGIES;

  formData: ProjectFormData = this.getEmptyFormData();

  readonly projectsForTable = computed(() => {
    return this.store.filteredProjects() as unknown as Record<string, unknown>[];
  });

  readonly tableColumns: TableColumn[] = [
    {
      key: 'thumbnail', label: '', width: '80px', sortable: false,
      format: (_: unknown, row: unknown) => `<img src="${(row as Project).thumbnail}" style="width:60px;height:40px;object-fit:cover;border-radius:6px;" />`,
    },
    {
      key: 'name', label: 'Project', sortable: true,
      format: (value: unknown, row: unknown) => `<div><span style="font-weight:500">${value}</span><br><span style="font-size:12px;color:#888">${(row as Project).role}</span></div>`,
    },
    {
      key: 'categoryId', label: 'Category', width: '140px', sortable: true,
      format: (value: unknown) => `<span style="font-size:12px">${this.getCategoryName(value as string)}</span>`,
    },
    {
      key: 'status', label: 'Status', width: '110px', sortable: true,
      format: (value: unknown) => `<span style="font-size:12px;color:${this.getStatusColor(value as string)}">${this.getStatusLabel(value as string)}</span>`,
    },
  ];

  readonly tableActions: TableAction[] = [
    { id: 'view', label: 'View', icon: 'eye', variant: 'ghost' },
    { id: 'edit', label: 'Edit', icon: 'edit', variant: 'ghost' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy', variant: 'ghost' },
    { id: 'publish', label: 'Publish', icon: 'check', variant: 'ghost' },
    { id: 'delete', label: 'Delete', icon: 'trash', variant: 'ghost', danger: true },
  ];

  ngOnInit(): void {
    this.store.loadProjects();
    setTimeout(() => this.isReady.set(true), 100);
  }

  getEmptyFormData(): ProjectFormData {
    return {
      name: '', slug: '', shortDescription: '', fullDescription: '', role: '', client: '',
      categoryId: 'web-app', status: 'draft', isFeatured: false, startDate: '', endDate: '',
      thumbnail: '', banner: '', gallery: [], videoUrl: '', youtubeUrl: '', githubUrl: '',
      demoUrl: '', documentationUrl: '', figmaUrl: '', technologies: [], features: [], team: [],
      seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '' },
    };
  }

  getDialogTitle(): string {
    switch (this.dialogMode()) {
      case 'add': return 'Add New Project';
      case 'edit': return 'Edit Project';
      case 'view': return 'Project Details';
      default: return '';
    }
  }

  getCategoryName(id: string): string {
    return this.categories.find(c => c.id === id)?.name || id;
  }

  getStatusLabel(status: string): string {
    return this.statuses.find(s => s.value === status)?.label || status;
  }

  getStatusColor(status: string): string {
    return this.statuses.find(s => s.value === status)?.color || '#64748B';
  }

  onSearch(e: Event): void { this.store.setSearchQuery((e.target as HTMLInputElement).value); }
  onCategoryFilter(e: Event): void { this.store.setFilterCategory((e.target as HTMLSelectElement).value); }
  onStatusFilter(e: Event): void { this.store.setFilterStatus((e.target as HTMLSelectElement).value); }
  onRowSelect(id: string): void { this.store.toggleSelection(id); }
  onSort(_: SortState): void {}

  onAction(event: { action: TableAction; row: Record<string, unknown> }): void {
    const proj = event.row as unknown as Project;
    this.selectedProject.set(proj);
    switch (event.action.id) {
      case 'view': this.dialogMode.set('view'); break;
      case 'edit': this.openEditDialog(); break;
      case 'duplicate': this.store.duplicateProject(proj.id); break;
      case 'publish': this.store.publishProject(proj.id); break;
      case 'delete': this.deleteProject(proj.id); break;
    }
  }

  openAddDialog(): void {
    this.selectedProject.set(null);
    this.formData = this.getEmptyFormData();
    this.activeTab.set('basic');
    this.dialogMode.set('add');
  }

  openViewDialog(proj: Project): void {
    this.selectedProject.set(proj);
    this.dialogMode.set('view');
  }

  openEditDialog(): void {
    const proj = this.selectedProject();
    if (!proj) return;
    this.formData = {
      name: proj.name, slug: proj.slug, shortDescription: proj.shortDescription, fullDescription: proj.fullDescription,
      role: proj.role, client: proj.client || '', categoryId: proj.categoryId, status: proj.status,
      isFeatured: proj.isFeatured, startDate: proj.startDate, endDate: proj.endDate || '',
      thumbnail: proj.thumbnail, banner: proj.banner, gallery: [...proj.gallery],
      videoUrl: proj.videoUrl || '', youtubeUrl: proj.youtubeUrl || '',
      githubUrl: proj.githubUrl || '', demoUrl: proj.demoUrl || '',
      documentationUrl: proj.documentationUrl || '', figmaUrl: proj.figmaUrl || '',
      technologies: [...proj.technologies],
      features: proj.features.map(f => ({ ...f })),
      team: proj.team.map(m => ({ ...m })),
      seo: { ...proj.seo, keywords: [...proj.seo.keywords] },
    };
    this.activeTab.set('basic');
    this.dialogMode.set('edit');
  }

  selectAndEdit(proj: Project): void {
    this.selectedProject.set(proj);
    this.openEditDialog();
  }

  openEditFromView(): void { this.openEditDialog(); }
  closeDialog(): void { this.dialogMode.set(null); this.selectedProject.set(null); }

  isTechSelected(tech: string): boolean { return this.formData.technologies.includes(tech); }

  toggleTech(tech: string): void {
    this.formData.technologies = this.isTechSelected(tech)
      ? this.formData.technologies.filter(t => t !== tech)
      : [...this.formData.technologies, tech];
  }

  addFeature(): void { this.formData.features = [...this.formData.features, { id: `f_${Date.now()}`, name: '' }]; }
  removeFeature(i: number): void { this.formData.features = this.formData.features.filter((_, idx) => idx !== i); }
  updateKeywords(kw: string): void { this.formData.seo.keywords = kw.split(',').map(k => k.trim()).filter(k => k); }

  saveProject(): void {
    if (!this.formData.name.trim() || !this.formData.role.trim() || !this.formData.shortDescription.trim()) return;
    if (!this.formData.slug) this.formData.slug = this.formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (this.dialogMode() === 'add') {
      const newProj = this.store.createProject(this.formData);
      this.selectedProject.set(newProj);
    } else if (this.dialogMode() === 'edit') {
      const proj = this.selectedProject();
      if (proj) this.store.updateProject(proj.id, this.formData);
    }
    this.closeDialog();
  }

  deleteCurrentProject(): void {
    const proj = this.selectedProject();
    if (proj) { this.deleteProject(proj.id); this.closeDialog(); }
  }

  deleteProject(id: string): void {
    if (confirm('Delete this project?')) this.store.deleteProject(id);
  }

  bulkPublish(): void { this.store.bulkPublish(Array.from(this.store.selectedIds())); }
  bulkUnpublish(): void { this.store.bulkUnpublish(Array.from(this.store.selectedIds())); }
  bulkDelete(): void {
    if (confirm(`Delete ${this.store.selectedCount()} projects?`)) this.store.deleteProjects(Array.from(this.store.selectedIds()));
  }

  exportProjects(): void {
    const blob = new Blob([this.store.exportProjects()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `projects-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  importProjects(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && isPlatformBrowser(this.platformId)) {
        const text = await file.text();
        if (this.store.importProjects(text)) this.notify.success('Projects imported successfully.');
        else this.notify.error('Invalid JSON file.');
      }
    };
    input.click();
  }
}

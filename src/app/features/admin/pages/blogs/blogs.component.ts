// ============================================================
// BLOGS COMPONENT
// Blog Management with Live Preview
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
import { BlogStore } from '../../store/blog.store';
import { Blog, BlogFormData, BLOG_STATUSES, BLOG_CATEGORIES, BLOG_TAGS } from '../../models/blog.model';
import { AdminPageComponent, AdminButtonComponent, AdminTableComponent } from '../../../../shared/components';
import { TableColumn, TableAction, SortState } from '../../../../shared/models/crud.models';
import { NotificationService } from '../../../../core/services/notification.service';

type DialogMode = 'add' | 'edit' | 'view' | null;
type TabView = 'featured' | 'all';
type FormTab = 'basic' | 'content' | 'seo';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageComponent,
    AdminButtonComponent,
    AdminTableComponent,
  ],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogsComponent {
  readonly store = inject(BlogStore);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notify = inject(NotificationService);

  readonly isReady = signal(false);
  readonly dialogMode = signal<DialogMode>(null);
  readonly selectedBlog = signal<Blog | null>(null);
  readonly viewMode = signal<TabView>('featured');
  readonly activeTab = signal<FormTab>('basic');

  readonly pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';

  readonly categories = BLOG_CATEGORIES;
  readonly statuses = BLOG_STATUSES;
  readonly availableTags = BLOG_TAGS;

  formData: BlogFormData = this.getEmptyFormData();

  readonly blogsForTable = computed(() => {
    return this.store.filteredBlogs() as unknown as Record<string, unknown>[];
  });

  readonly tableColumns: TableColumn[] = [
    {
      key: 'thumbnail', label: '', width: '80px', sortable: false,
      format: (_: unknown, row: unknown) => `<img src="${(row as Blog).thumbnail}" style="width:60px;height:40px;object-fit:cover;border-radius:6px;" />`,
    },
    {
      key: 'title', label: 'Title', sortable: true,
      format: (value: unknown, row: unknown) => `<div><span style="font-weight:500">${value}</span><br><span style="font-size:12px;color:#888">${(row as Blog).author}</span></div>`,
    },
    {
      key: 'categoryId', label: 'Category', width: '120px', sortable: true,
      format: (value: unknown) => `<span style="font-size:12px">${this.getCategoryName(value as string)}</span>`,
    },
    {
      key: 'readingTime', label: 'Time', width: '80px', sortable: true,
      format: (value: unknown) => `<span style="font-size:12px;color:#888">${value} min</span>`,
    },
    {
      key: 'status', label: 'Status', width: '100px', sortable: true,
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
    this.store.loadBlogs();
    setTimeout(() => this.isReady.set(true), 100);
  }

  getEmptyFormData(): BlogFormData {
    return {
      title: '', slug: '', summary: '', content: '', author: 'John Doe',
      categoryId: 'angular', tags: [], status: 'draft', isFeatured: false,
      readingTime: 5, thumbnail: '', coverImage: '', publishDate: '',
      seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '' },
    };
  }

  getDialogTitle(): string {
    switch (this.dialogMode()) {
      case 'add': return 'New Post';
      case 'edit': return 'Edit Post';
      case 'view': return 'Post Details';
      default: return '';
    }
  }

  getCategoryName(id: string): string { return this.store.getCategoryName(id); }
  getCategoryColor(id: string): string { return this.store.getCategoryColor(id); }
  getStatusLabel(status: string): string { return this.store.getStatusLabel(status); }
  getStatusColor(status: string): string { return this.store.getStatusColor(status); }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onSearch(e: Event): void { this.store.setSearchQuery((e.target as HTMLInputElement).value); }
  onCategoryFilter(e: Event): void { this.store.setFilterCategory((e.target as HTMLSelectElement).value); }
  onStatusFilter(e: Event): void { this.store.setFilterStatus((e.target as HTMLSelectElement).value); }
  onRowSelect(id: string): void { this.store.toggleSelection(id); }
  onSort(_: SortState): void {}

  onAction(event: { action: TableAction; row: Record<string, unknown> }): void {
    const blog = event.row as unknown as Blog;
    this.selectedBlog.set(blog);
    switch (event.action.id) {
      case 'view': this.dialogMode.set('view'); break;
      case 'edit': this.openEditDialog(); break;
      case 'duplicate': this.store.duplicateBlog(blog.id); break;
      case 'publish': this.store.publishBlog(blog.id); break;
      case 'delete': this.deleteBlog(blog.id); break;
    }
  }

  openAddDialog(): void {
    this.selectedBlog.set(null);
    this.formData = this.getEmptyFormData();
    this.activeTab.set('basic');
    this.dialogMode.set('add');
  }

  openViewDialog(blog: Blog): void {
    this.selectedBlog.set(blog);
    this.dialogMode.set('view');
  }

  openEditDialog(): void {
    const blog = this.selectedBlog();
    if (!blog) return;
    this.formData = {
      title: blog.title, slug: blog.slug, summary: blog.summary, content: blog.content,
      author: blog.author, categoryId: blog.categoryId, tags: [...blog.tags],
      status: blog.status, isFeatured: blog.isFeatured, readingTime: blog.readingTime,
      thumbnail: blog.thumbnail, coverImage: blog.coverImage, publishDate: blog.publishDate,
      seo: { ...blog.seo, keywords: [...blog.seo.keywords] },
    };
    this.activeTab.set('basic');
    this.dialogMode.set('edit');
  }

  openEditDialogByBlog(blog: Blog): void {
    this.selectedBlog.set(blog);
    this.openEditDialog();
  }

  selectAndEdit(blog: Blog): void {
    this.selectedBlog.set(blog);
    this.openEditDialog();
  }

  openEditFromView(): void { this.openEditDialog(); }
  closeDialog(): void { this.dialogMode.set(null); this.selectedBlog.set(null); }

  onTitleChange(): void {
    if (!this.formData.slug || this.formData.slug === this.store.generateSlug(this.formData.title)) {
      this.formData.slug = this.store.generateSlug(this.formData.title);
    }
  }

  updateReadingTime(): void {
    this.formData.readingTime = this.store.calculateReadingTime(this.formData.content);
  }

  addTag(e: Event): void {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const tag = input.value.trim();
    if (tag && !this.formData.tags.includes(tag)) {
      this.formData.tags = [...this.formData.tags, tag];
    }
    input.value = '';
  }

  removeTag(index: number): void {
    this.formData.tags = this.formData.tags.filter((_, i) => i !== index);
  }

  updateKeywords(kw: string): void {
    this.formData.seo.keywords = kw.split(',').map(k => k.trim()).filter(k => k);
  }

  saveBlog(): void {
    if (!this.formData.title.trim() || !this.formData.summary.trim()) return;
    if (!this.formData.slug) this.formData.slug = this.store.generateSlug(this.formData.title);

    if (this.dialogMode() === 'add') {
      const newBlog = this.store.createBlog(this.formData);
      this.selectedBlog.set(newBlog);
    } else if (this.dialogMode() === 'edit') {
      const blog = this.selectedBlog();
      if (blog) this.store.updateBlog(blog.id, this.formData);
    }
    this.closeDialog();
  }

  deleteCurrentBlog(): void {
    const blog = this.selectedBlog();
    if (blog) { this.deleteBlog(blog.id); this.closeDialog(); }
  }

  deleteBlog(id: string): void {
    if (confirm('Delete this post?')) this.store.deleteBlog(id);
  }

  bulkPublish(): void { this.store.bulkPublish(Array.from(this.store.selectedIds())); }
  bulkUnpublish(): void { this.store.bulkUnpublish(Array.from(this.store.selectedIds())); }
  bulkDelete(): void {
    if (confirm(`Delete ${this.store.selectedCount()} posts?`)) this.store.deleteBlogs(Array.from(this.store.selectedIds()));
  }

  exportBlogs(): void {
    const blob = new Blob([this.store.exportBlogs()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `blogs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  importBlogs(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && isPlatformBrowser(this.platformId)) {
        const text = await file.text();
        if (this.store.importBlogs(text)) this.notify.success('Blogs imported successfully.');
        else this.notify.error('Invalid JSON file.');
      }
    };
    input.click();
  }
}

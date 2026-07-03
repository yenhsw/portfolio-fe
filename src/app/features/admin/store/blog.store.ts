// ============================================================
// BLOG STORE
// Blog Management State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { Blog, BlogFormData, BlogCategory, MOCK_BLOGS, BLOG_CATEGORIES } from '../models/blog.model';

export interface BlogState {
  blogs: Blog[];
  categories: BlogCategory[];
  loading: boolean;
  saving: boolean;
  autoSaving: boolean;
  error: string | null;
  selectedBlog: Blog | null;
  searchQuery: string;
  filterCategory: string;
  filterStatus: string;
  filterAuthor: string;
  filterYear: number | null;
  selectedIds: Set<string>;
}

@Injectable({
  providedIn: 'root',
})
export class BlogStore {
  // State
  readonly blogs = signal<Blog[]>([]);
  readonly categories = signal<BlogCategory[]>(BLOG_CATEGORIES);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly autoSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedBlog = signal<Blog | null>(null);
  readonly searchQuery = signal('');
  readonly filterCategory = signal('');
  readonly filterStatus = signal('');
  readonly filterAuthor = signal('');
  readonly filterYear = signal<number | null>(null);
  readonly selectedIds = signal<Set<string>>(new Set());

  // Computed
  readonly filteredBlogs = computed(() => {
    let result = [...this.blogs()];
    const query = this.searchQuery().toLowerCase();
    const category = this.filterCategory();
    const status = this.filterStatus();
    const author = this.filterAuthor();
    const year = this.filterYear();

    // Search filter
    if (query) {
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.summary.toLowerCase().includes(query) ||
        blog.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (category) {
      result = result.filter(blog => blog.categoryId === category);
    }

    // Status filter
    if (status) {
      result = result.filter(blog => blog.status === status);
    }

    // Author filter
    if (author) {
      result = result.filter(blog => blog.author.toLowerCase().includes(author.toLowerCase()));
    }

    // Year filter
    if (year !== null) {
      result = result.filter(blog => {
        const blogYear = new Date(blog.publishDate || blog.createdAt).getFullYear();
        return blogYear === year;
      });
    }

    // Sort by sortOrder
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  });

  readonly featuredBlogs = computed(() => {
    return this.blogs()
      .filter(b => b.isFeatured && b.status === 'published')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  readonly publishedBlogs = computed(() => {
    return this.filteredBlogs()
      .filter(b => b.status === 'published')
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  });

  readonly years = computed(() => {
    const yearsSet = new Set<number>();
    this.blogs().forEach(blog => {
      const date = blog.publishDate || blog.createdAt;
      yearsSet.add(new Date(date).getFullYear());
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  });

  readonly hasSelectedItems = computed(() => this.selectedIds().size > 0);
  readonly selectedCount = computed(() => this.selectedIds().size);

  // Actions
  loadBlogs(): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      this.blogs.set([...MOCK_BLOGS]);
      this.loading.set(false);
    }, 500);
  }

  getBlogById(id: string): Blog | undefined {
    return this.blogs().find(b => b.id === id);
  }

  createBlog(data: BlogFormData): Blog {
    const newBlog: Blog = {
      id: `blog_${Date.now()}`,
      ...data,
      sortOrder: this.blogs().length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.blogs.update(blogs => [...blogs, newBlog]);
    return newBlog;
  }

  updateBlog(id: string, data: Partial<BlogFormData>): boolean {
    const index = this.blogs().findIndex(b => b.id === id);
    if (index === -1) return false;

    this.blogs.update(blogs => {
      const updated = [...blogs];
      updated[index] = {
        ...updated[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });

    return true;
  }

  deleteBlog(id: string): boolean {
    const index = this.blogs().findIndex(b => b.id === id);
    if (index === -1) return false;

    this.blogs.update(blogs => blogs.filter(b => b.id !== id));
    return true;
  }

  deleteBlogs(ids: string[]): void {
    this.blogs.update(blogs => blogs.filter(b => !ids.includes(b.id)));
    this.selectedIds.set(new Set());
  }

  duplicateBlog(id: string): Blog | null {
    const blog = this.getBlogById(id);
    if (!blog) return null;

    const duplicated: Blog = {
      ...blog,
      id: `blog_${Date.now()}`,
      title: `${blog.title} (Copy)`,
      slug: `${blog.slug}-copy`,
      status: 'draft',
      isFeatured: false,
      sortOrder: this.blogs().length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.blogs.update(blogs => [...blogs, duplicated]);
    return duplicated;
  }

  publishBlog(id: string): void {
    this.blogs.update(blogs =>
      blogs.map(b => {
        if (b.id === id) {
          return {
            ...b,
            status: 'published' as const,
            publishDate: b.publishDate || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
  }

  unpublishBlog(id: string): void {
    this.blogs.update(blogs =>
      blogs.map(b =>
        b.id === id ? { ...b, status: 'draft' as const, updatedAt: new Date().toISOString() } : b
      )
    );
  }

  toggleFeatured(id: string): void {
    this.blogs.update(blogs =>
      blogs.map(b =>
        b.id === id ? { ...b, isFeatured: !b.isFeatured } : b
      )
    );
  }

  bulkPublish(ids: string[]): void {
    this.blogs.update(blogs =>
      blogs.map(b => {
        if (ids.includes(b.id)) {
          return {
            ...b,
            status: 'published' as const,
            publishDate: b.publishDate || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
    this.selectedIds.set(new Set());
  }

  bulkUnpublish(ids: string[]): void {
    this.blogs.update(blogs =>
      blogs.map(b =>
        ids.includes(b.id) ? { ...b, status: 'draft' as const, updatedAt: new Date().toISOString() } : b
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkChangeCategory(ids: string[], categoryId: string): void {
    this.blogs.update(blogs =>
      blogs.map(b =>
        ids.includes(b.id) ? { ...b, categoryId, updatedAt: new Date().toISOString() } : b
      )
    );
  }

  reorderBlogs(orderedIds: string[]): void {
    this.blogs.update(blogs => {
      return blogs.map(blog => {
        const newOrder = orderedIds.indexOf(blog.id);
        if (newOrder !== -1) {
          return { ...blog, sortOrder: newOrder + 1 };
        }
        return blog;
      });
    });
  }

  reorderFeaturedBlogs(orderedIds: string[]): void {
    this.blogs.update(blogs => {
      return blogs.map(blog => {
        if (blog.isFeatured) {
          const newOrder = orderedIds.indexOf(blog.id);
          if (newOrder !== -1) {
            return { ...blog, sortOrder: newOrder + 1 };
          }
        }
        return blog;
      });
    });
  }

  // Filters
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilterCategory(category: string): void {
    this.filterCategory.set(category);
  }

  setFilterStatus(status: string): void {
    this.filterStatus.set(status);
  }

  setFilterAuthor(author: string): void {
    this.filterAuthor.set(author);
  }

  setFilterYear(year: number | null): void {
    this.filterYear.set(year);
  }

  // Selection
  toggleSelection(id: string): void {
    this.selectedIds.update(ids => {
      const newSet = new Set(ids);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  selectAll(): void {
    const allIds = this.filteredBlogs().map(b => b.id);
    this.selectedIds.set(new Set(allIds));
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  toggleSelectAll(): void {
    if (this.hasSelectedItems()) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }

  // Category management
  addCategory(name: string, color: string): BlogCategory {
    const newCategory: BlogCategory = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      color,
    };

    this.categories.update(cats => [...cats, newCategory]);
    return newCategory;
  }

  // Utilities
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  getCategoryColor(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.color || '#64748B';
  }

  getStatusLabel(status: string): string {
    const configs: Record<string, { label: string; color: string }> = {
      'draft': { label: 'Draft', color: '#64748B' },
      'published': { label: 'Published', color: '#10B981' },
      'archived': { label: 'Archived', color: '#78716C' },
      'private': { label: 'Private', color: '#6366F1' },
    };
    return configs[status]?.label || status;
  }

  getStatusColor(status: string): string {
    const configs: Record<string, { label: string; color: string }> = {
      'draft': { label: 'Draft', color: '#64748B' },
      'published': { label: 'Published', color: '#10B981' },
      'archived': { label: 'Archived', color: '#78716C' },
      'private': { label: 'Private', color: '#6366F1' },
    };
    return configs[status]?.color || '#64748B';
  }

  // Export/Import
  exportBlogs(): string {
    return JSON.stringify({
      blogs: this.blogs(),
      categories: this.categories(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importBlogs(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.blogs && Array.isArray(data.blogs)) {
        this.blogs.set(data.blogs);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.categories.update(existing => {
          const existingIds = new Set(existing.map(c => c.id));
          const newCategories = data.categories.filter((c: BlogCategory) => !existingIds.has(c.id));
          return [...existing, ...newCategories];
        });
      }
      return true;
    } catch {
      this.error.set('Invalid JSON format');
      return false;
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  reset(): void {
    this.searchQuery.set('');
    this.filterCategory.set('');
    this.filterStatus.set('');
    this.filterAuthor.set('');
    this.filterYear.set(null);
    this.selectedIds.set(new Set());
    this.error.set(null);
  }
}

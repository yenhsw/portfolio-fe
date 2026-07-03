// ============================================================
// BLOG STORE
// Signal-based state management for blog posts
// ============================================================

import { Injectable, computed, signal } from '@angular/core';
import { BlogCategory, BlogFilter, BlogPost } from '../shared/models';

export interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  featuredPosts: BlogPost[];
  filter: BlogFilter;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BlogStore {
  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _posts = signal<BlogPost[]>([]);
  private readonly _selectedPost = signal<BlogPost | null>(null);
  private readonly _featuredPosts = signal<BlogPost[]>([]);
  private readonly _filter = signal<BlogFilter>({});
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _pagination = signal({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // ============================================================
  // COMPUTED
  // ============================================================

  readonly posts = this._posts.asReadonly();
  readonly selectedPost = this._selectedPost.asReadonly();
  readonly featuredPosts = this._featuredPosts.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  readonly postCount = computed(() => this._posts().length);
  readonly hasPosts = computed(() => this._posts().length > 0);
  readonly hasSelectedPost = computed(() => this._selectedPost() !== null);

  readonly postsByCategory = computed(() => {
    const posts = this._posts();
    const grouped = new Map<BlogCategory, BlogPost[]>();

    posts.forEach((post) => {
      const existing = grouped.get(post.category) ?? [];
      grouped.set(post.category, [...existing, post]);
    });

    return grouped;
  });

  readonly filteredPosts = computed(() => {
    const posts = this._posts();
    const filter = this._filter();

    return posts.filter((post) => {
      if (filter.category && post.category !== filter.category) return false;
      if (filter.tag && !post.tags.includes(filter.tag)) return false;
      if (filter.featured !== undefined && post.featured !== filter.featured)
        return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  });

  readonly allTags = computed(() => {
    const posts = this._posts();
    const tagCounts = new Map<string, number>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        const count = tagCounts.get(tag) ?? 0;
        tagCounts.set(tag, count + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  });

  readonly recentPosts = computed(() => {
    return [...this._posts()]
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  });

  readonly popularPosts = computed(() => {
    return [...this._posts()]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  });

  // ============================================================
  // ACTIONS
  // ============================================================

  setPosts(posts: BlogPost[]): void {
    this._posts.set(posts);
  }

  setSelectedPost(post: BlogPost | null): void {
    this._selectedPost.set(post);
  }

  setFeaturedPosts(posts: BlogPost[]): void {
    this._featuredPosts.set(posts);
  }

  setFilter(filter: BlogFilter): void {
    this._filter.set(filter);
  }

  updateFilter(partial: Partial<BlogFilter>): void {
    this._filter.update((current) => ({ ...current, ...partial }));
  }

  clearFilter(): void {
    this._filter.set({});
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  setPagination(pagination: Partial<BlogState['pagination']>): void {
    this._pagination.update((current) => ({ ...current, ...pagination }));
  }

  incrementViews(slug: string): void {
    this._posts.update((posts) =>
      posts.map((post) =>
        post.slug === slug ? { ...post, views: post.views + 1 } : post
      )
    );
  }

  clearPosts(): void {
    this._posts.set([]);
    this._selectedPost.set(null);
    this._pagination.set({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }

  reset(): void {
    this._posts.set([]);
    this._selectedPost.set(null);
    this._featuredPosts.set([]);
    this._filter.set({});
    this._loading.set(false);
    this._error.set(null);
    this._pagination.set({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }

  // ============================================================
  // SELECTORS
  // ============================================================

  selectPostBySlug(slug: string): BlogPost | undefined {
    return this._posts().find((p) => p.slug === slug);
  }

  selectPostsByCategory(category: BlogCategory): BlogPost[] {
    return this._posts().filter((p) => p.category === category);
  }

  selectPostsByTag(tag: string): BlogPost[] {
    return this._posts().filter((p) => p.tags.includes(tag));
  }
}

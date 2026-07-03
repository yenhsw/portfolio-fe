// ============================================================
// BLOG SERVICE
// Blog API Service (Mock Implementation)
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Blog } from '../models/blog.model';
import { MOCK_BLOGS } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private mockBlogs: Blog[] = [...MOCK_BLOGS];

  getBlogs(): Observable<Blog[]> {
    return of(this.mockBlogs).pipe(delay(300));
  }

  getBlogById(id: string): Observable<Blog | null> {
    const blog = this.mockBlogs.find(b => b.id === id);
    return of(blog || null).pipe(delay(200));
  }

  getPublishedBlogs(): Observable<Blog[]> {
    const published = this.mockBlogs.filter(b => b.status === 'published');
    return of(published).pipe(delay(200));
  }

  getFeaturedBlogs(): Observable<Blog[]> {
    const featured = this.mockBlogs.filter(b => b.isFeatured && b.status === 'published');
    return of(featured).pipe(delay(200));
  }

  createBlog(blog: Partial<Blog>): Observable<Blog> {
    const newBlog: Blog = {
      id: `blog_${Date.now()}`,
      title: blog.title || '',
      slug: blog.slug || '',
      summary: blog.summary || '',
      content: blog.content || '',
      author: blog.author || '',
      categoryId: blog.categoryId || 'angular',
      tags: blog.tags || [],
      status: blog.status || 'draft',
      isFeatured: blog.isFeatured || false,
      sortOrder: blog.sortOrder || this.mockBlogs.length + 1,
      readingTime: blog.readingTime || 5,
      thumbnail: blog.thumbnail || '',
      coverImage: blog.coverImage || '',
      publishDate: blog.publishDate || '',
      seo: blog.seo || {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockBlogs.push(newBlog);
    return of(newBlog).pipe(delay(500));
  }

  updateBlog(id: string, blog: Partial<Blog>): Observable<Blog | null> {
    const index = this.mockBlogs.findIndex(b => b.id === id);
    if (index === -1) return of(null).pipe(delay(500));

    const updated = {
      ...this.mockBlogs[index],
      ...blog,
      updatedAt: new Date().toISOString(),
    };
    this.mockBlogs[index] = updated;
    return of(updated).pipe(delay(500));
  }

  deleteBlog(id: string): Observable<boolean> {
    const index = this.mockBlogs.findIndex(b => b.id === id);
    if (index === -1) return of(false).pipe(delay(500));

    this.mockBlogs.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  deleteBlogs(ids: string[]): Observable<boolean> {
    this.mockBlogs = this.mockBlogs.filter(b => !ids.includes(b.id));
    return of(true).pipe(delay(500));
  }

  uploadImage(file: File): Observable<string> {
    const url = URL.createObjectURL(file);
    return of(url).pipe(delay(1500));
  }
}

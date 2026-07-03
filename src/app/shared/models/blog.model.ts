// ============================================================
// BLOG MODEL
// Blog post data model
// ============================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  coverImage: string;
  author: string;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  featured: boolean;
  views: number;
  readingTime: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogCategory =
  | 'tutorial'
  | 'news'
  | 'opinion'
  | 'case-study'
  | 'career'
  | 'technology';

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
}

export interface BlogFilter {
  category?: BlogCategory;
  tag?: string;
  featured?: boolean;
  search?: string;
}

export interface BlogListResponse {
  items: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

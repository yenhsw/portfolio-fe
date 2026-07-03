// ============================================================
// PROJECT MODEL
// Project data model
// ============================================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  images: string[];
  category: ProjectCategory;
  technologies: string[];
  features: string[];
  liveUrl: string;
  sourceUrl: string;
  githubUrl: string;
  demoUrl: string;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  client: string;
  duration: string;
  role: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectCategory =
  | 'web-application'
  | 'mobile-app'
  | 'desktop-app'
  | 'api'
  | 'library'
  | 'other';

export type ProjectStatus = 'development' | 'completed' | 'maintenance' | 'archived';

export interface ProjectFilter {
  category?: ProjectCategory;
  status?: ProjectStatus;
  featured?: boolean;
  search?: string;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// BLOG MODELS
// Blog Management Data Types
// ============================================================

export type BlogStatus = 'draft' | 'published' | 'archived' | 'private';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  categoryId: string;
  tags: string[];
  status: BlogStatus;
  isFeatured: boolean;
  sortOrder: number;
  readingTime: number;
  thumbnail: string;
  coverImage: string;
  publishDate: string;
  seo: BlogSEO;
  createdAt: string;
  updatedAt: string;
}

export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  categoryId: string;
  tags: string[];
  status: BlogStatus;
  isFeatured: boolean;
  readingTime: number;
  thumbnail: string;
  coverImage: string;
  publishDate: string;
  seo: BlogSEO;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'angular', name: 'Angular', slug: 'angular', color: '#DD0031' },
  { id: 'spring-boot', name: 'Spring Boot', slug: 'spring-boot', color: '#6DB33F' },
  { id: 'java', name: 'Java', slug: 'java', color: '#007396' },
  { id: 'database', name: 'Database', slug: 'database', color: '#336791' },
  { id: 'docker', name: 'Docker', slug: 'docker', color: '#2496ED' },
  { id: 'linux', name: 'Linux', slug: 'linux', color: '#FCC624' },
  { id: 'career', name: 'Career', slug: 'career', color: '#8B5CF6' },
  { id: 'system-design', name: 'System Design', slug: 'system-design', color: '#EC4899' },
  { id: 'devops', name: 'DevOps', slug: 'devops', color: '#F59E0B' },
  { id: 'cloud', name: 'Cloud', slug: 'cloud', color: '#06B6D4' },
];

export const BLOG_TAGS = [
  'Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript',
  'Java', 'Spring Boot', 'Python', 'Node.js',
  'PostgreSQL', 'MongoDB', 'Redis', 'Oracle',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'CI/CD', 'Microservices', 'REST API',
  'Testing', 'Performance', 'Security', 'Architecture',
  'Career', 'Interview', 'Tips', 'Tutorial',
];

export const BLOG_STATUSES: { value: BlogStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: '#64748B' },
  { value: 'published', label: 'Published', color: '#10B981' },
  { value: 'archived', label: 'Archived', color: '#78716C' },
  { value: 'private', label: 'Private', color: '#6366F1' },
];

export const MOCK_BLOGS: Blog[] = [
  {
    id: '1',
    title: 'Building Scalable Applications with Angular and NestJS',
    slug: 'building-scalable-applications-angular-nestjs',
    summary: 'Learn how to build enterprise-grade applications using Angular frontend and NestJS backend with microservices architecture.',
    content: `<h2>Introduction</h2>
<p>In this article, we'll explore how to build scalable applications using Angular for the frontend and NestJS for the backend.</p>

<h2>Why Angular + NestJS?</h2>
<p>Both Angular and NestJS are built with TypeScript, making it easy to share types and models between frontend and backend.</p>

<h3>Key Benefits</h3>
<ul>
<li>Type safety across the stack</li>
<li>Consistent coding patterns</li>
<li>Easy dependency injection</li>
<li>Modular architecture</li>
</ul>

<h2>Architecture Overview</h2>
<p>We'll implement a clean architecture with proper separation of concerns...</p>

<h2>Conclusion</h2>
<p>By following these patterns, you can build maintainable and scalable applications.</p>`,
    author: 'John Doe',
    categoryId: 'angular',
    tags: ['Angular', 'TypeScript', 'Microservices', 'Architecture'],
    status: 'published',
    isFeatured: true,
    sortOrder: 1,
    readingTime: 8,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=400&fit=crop',
    publishDate: '2024-06-15',
    seo: {
      metaTitle: 'Building Scalable Apps with Angular & NestJS',
      metaDescription: 'Learn to build enterprise applications with Angular frontend and NestJS backend using microservices architecture.',
      keywords: ['angular', 'nestjs', 'microservices', 'enterprise'],
      ogImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
    },
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Mastering Spring Boot: From Zero to Hero',
    slug: 'mastering-spring-boot-zero-to-hero',
    summary: 'A comprehensive guide to Spring Boot development, covering everything from basics to advanced topics.',
    content: `<h2>Getting Started with Spring Boot</h2>
<p>Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications.</p>

<h2>Core Concepts</h2>
<h3>Dependency Injection</h3>
<p>Spring's IoC container manages the lifecycle of beans...</p>

<h3>Data Access</h3>
<p>Learn how to work with JPA, MongoDB, and Redis...</p>

<h2>Building REST APIs</h2>
<p>Create robust RESTful services with proper error handling...</p>`,
    author: 'Jane Smith',
    categoryId: 'spring-boot',
    tags: ['Java', 'Spring Boot', 'REST API', 'Tutorial'],
    status: 'published',
    isFeatured: true,
    sortOrder: 2,
    readingTime: 12,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
    publishDate: '2024-06-10',
    seo: {
      metaTitle: 'Mastering Spring Boot - Complete Guide',
      metaDescription: 'Learn Spring Boot from basics to advanced topics with practical examples.',
      keywords: ['spring boot', 'java', 'backend', 'tutorial'],
    },
    createdAt: '2024-06-05T09:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
  },
  {
    id: '3',
    title: 'Docker Best Practices for Production',
    slug: 'docker-best-practices-production',
    summary: 'Essential Docker practices to optimize your containerized applications for production environments.',
    content: `<h2>Why Docker Best Practices Matter</h2>
<p>Following container best practices ensures security, performance, and maintainability.</p>

<h2>Key Practices</h2>
<ul>
<li>Use minimal base images</li>
<li>Multi-stage builds</li>
<li>Non-root users</li>
<li>Proper health checks</li>
</ul>`,
    author: 'John Doe',
    categoryId: 'docker',
    tags: ['Docker', 'DevOps', 'Production', 'Tips'],
    status: 'published',
    isFeatured: false,
    sortOrder: 3,
    readingTime: 6,
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=400&fit=crop',
    publishDate: '2024-06-05',
    seo: {
      metaTitle: 'Docker Best Practices for Production',
      metaDescription: 'Learn essential Docker practices for production-ready containerized applications.',
      keywords: ['docker', 'devops', 'production'],
    },
    createdAt: '2024-06-01T08:00:00Z',
    updatedAt: '2024-06-05T10:00:00Z',
  },
  {
    id: '4',
    title: 'My Journey to Senior Developer',
    slug: 'journey-to-senior-developer',
    summary: 'Personal reflections on career growth, technical skills, and soft skills needed to become a senior developer.',
    content: `<h2>The Beginning</h2>
<p>Starting as a junior developer, I focused on learning the fundamentals...</p>

<h2>Growing Skills</h2>
<p>Technical skills are important, but soft skills matter too...</p>

<h2>Lessons Learned</h2>
<p>Key takeaways from my journey to becoming a senior developer.</p>`,
    author: 'Jane Smith',
    categoryId: 'career',
    tags: ['Career', 'Interview', 'Tips'],
    status: 'draft',
    isFeatured: false,
    sortOrder: 4,
    readingTime: 5,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
    publishDate: '',
    seo: {
      metaTitle: 'Journey to Senior Developer',
      metaDescription: 'Personal reflections on career growth and becoming a senior developer.',
      keywords: ['career', 'senior developer', 'growth'],
    },
    createdAt: '2024-05-20T12:00:00Z',
    updatedAt: '2024-05-20T12:00:00Z',
  },
];

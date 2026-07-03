// ============================================================
// PROJECT MODELS
// Project Management Data Types
// ============================================================

export type ProjectStatus = 'draft' | 'published' | 'private' | 'archived' | 'completed' | 'in-progress';

export interface ProjectFeature {
  id: string;
  name: string;
  icon?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  role: string;
  client?: string;
  categoryId: string;
  status: ProjectStatus;
  sortOrder: number;
  isFeatured: boolean;
  startDate: string;
  endDate?: string;
  thumbnail: string;
  banner: string;
  gallery: string[];
  videoUrl?: string;
  youtubeUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  figmaUrl?: string;
  technologies: string[];
  features: ProjectFeature[];
  team: TeamMember[];
  seo: ProjectSEO;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface ProjectFormData {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  role: string;
  client: string;
  categoryId: string;
  status: ProjectStatus;
  isFeatured: boolean;
  startDate: string;
  endDate: string;
  thumbnail: string;
  banner: string;
  gallery: string[];
  videoUrl: string;
  youtubeUrl: string;
  githubUrl: string;
  demoUrl: string;
  documentationUrl: string;
  figmaUrl: string;
  technologies: string[];
  features: ProjectFeature[];
  team: TeamMember[];
  seo: ProjectSEO;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: '#64748B' },
  { value: 'published', label: 'Published', color: '#10B981' },
  { value: 'private', label: 'Private', color: '#6366F1' },
  { value: 'archived', label: 'Archived', color: '#78716C' },
  { value: 'completed', label: 'Completed', color: '#06B6D4' },
  { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'web-app', name: 'Web Application', slug: 'web-app', icon: 'globe' },
  { id: 'mobile-app', name: 'Mobile App', slug: 'mobile-app', icon: 'smartphone' },
  { id: 'api', name: 'API / Backend', slug: 'api', icon: 'server' },
  { id: 'ecommerce', name: 'E-commerce', slug: 'ecommerce', icon: 'shopping-cart' },
  { id: 'dashboard', name: 'Dashboard', slug: 'dashboard', icon: 'bar-chart' },
  { id: 'cms', name: 'CMS', slug: 'cms', icon: 'file-text' },
  { id: 'saas', name: 'SaaS', slug: 'saas', icon: 'cloud' },
  { id: 'iot', name: 'IoT', slug: 'iot', icon: 'cpu' },
];

export const TECHNOLOGIES = [
  'Angular', 'React', 'Vue.js', 'Next.js', 'Nuxt',
  'TypeScript', 'JavaScript', 'Node.js', 'Express',
  'Java', 'Spring Boot', 'Python', 'Django', 'Go',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Oracle', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD',
  'GraphQL', 'REST API', 'Microservices', 'RabbitMQ', 'Kafka',
];

export const PROJECT_FEATURES = [
  'Authentication', 'Authorization', 'Dashboard', 'Reports', 'Analytics',
  'Notifications', 'Email', 'SMS', 'Push Notifications',
  'Payment Gateway', 'Invoice', 'Billing', 'Subscription',
  'File Upload', 'File Download', 'Export Excel', 'Import Excel',
  'Search', 'Filter', 'Sort', 'Pagination',
  'Real-time', 'WebSocket', 'Chat', 'Video Call',
  'SEO', 'Social Login', 'Multi-language', 'Dark Mode',
  'Responsive', 'PWA', 'Offline', 'Caching',
  'Logging', 'Monitoring', 'Error Tracking', 'Testing',
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Hospital Information System',
    slug: 'hospital-information-system',
    shortDescription: 'Enterprise healthcare management system with patient records, appointments, and billing.',
    fullDescription: `<p>A comprehensive Hospital Information System (HIS) designed to streamline healthcare operations.</p>
<ul>
<li>Patient registration and medical records management</li>
<li>Appointment scheduling with SMS reminders</li>
<li>Billing and insurance claims processing</li>
<li>Pharmacy inventory management</li>
<li>Doctor and staff scheduling</li>
<li>Real-time dashboard and analytics</li>
</ul>`,
    role: 'Tech Lead',
    client: 'City Hospital Group',
    categoryId: 'web-app',
    status: 'completed',
    sortOrder: 1,
    isFeatured: true,
    startDate: '2023-01',
    endDate: '2023-12',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    ],
    videoUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=example',
    githubUrl: 'https://github.com/example/his',
    demoUrl: 'https://demo.hospital-system.com',
    documentationUrl: 'https://docs.hospital-system.com',
    figmaUrl: '',
    technologies: ['Angular', 'Spring Boot', 'Java', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    features: [
      { id: 'f1', name: 'Patient Records', icon: 'user' },
      { id: 'f2', name: 'Appointments', icon: 'calendar' },
      { id: 'f3', name: 'Billing', icon: 'credit-card' },
      { id: 'f4', name: 'Reports', icon: 'file-text' },
      { id: 'f5', name: 'Notifications', icon: 'bell' },
      { id: 'f6', name: 'Dashboard', icon: 'bar-chart' },
    ],
    team: [
      { id: 't1', name: 'John Doe', role: 'Tech Lead', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff' },
      { id: 't2', name: 'Jane Smith', role: 'Frontend Lead', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff' },
      { id: 't3', name: 'Bob Wilson', role: 'Backend Lead', avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson&background=F59E0B&color=fff' },
    ],
    seo: {
      metaTitle: 'Hospital Information System - Healthcare Management Solution',
      metaDescription: 'Enterprise hospital management system with patient records, appointments, billing and analytics.',
      keywords: ['hospital', 'healthcare', 'patient management', 'medical records'],
      ogImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop',
    },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-12-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    slug: 'ecommerce-platform',
    shortDescription: 'Multi-vendor marketplace with payment integration, inventory management, and analytics.',
    fullDescription: `<p>A scalable e-commerce platform supporting multiple vendors and payment methods.</p>
<ul>
<li>Multi-vendor marketplace support</li>
<li>Product catalog with advanced filtering</li>
<li>Shopping cart and wishlist</li>
<li>Multiple payment gateway integration</li>
<li>Order management and tracking</li>
<li>Inventory management</li>
<li>Customer reviews and ratings</li>
</ul>`,
    role: 'Senior Developer',
    client: 'RetailTech Inc',
    categoryId: 'ecommerce',
    status: 'published',
    sortOrder: 2,
    isFeatured: true,
    startDate: '2022-06',
    endDate: '2023-06',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    ],
    videoUrl: '',
    youtubeUrl: '',
    githubUrl: 'https://github.com/example/ecommerce',
    demoUrl: 'https://demo.ecommerce-platform.com',
    documentationUrl: '',
    figmaUrl: 'https://figma.com/example/ecommerce',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'],
    features: [
      { id: 'f1', name: 'Product Catalog', icon: 'package' },
      { id: 'f2', name: 'Shopping Cart', icon: 'shopping-cart' },
      { id: 'f3', name: 'Payment Gateway', icon: 'credit-card' },
      { id: 'f4', name: 'Order Tracking', icon: 'truck' },
      { id: 'f5', name: 'Reviews', icon: 'star' },
    ],
    team: [
      { id: 't1', name: 'John Doe', role: 'Senior Developer', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff' },
      { id: 't2', name: 'Alice Brown', role: 'Frontend Dev', avatar: 'https://ui-avatars.com/api/?name=Alice+Brown&background=EC4899&color=fff' },
    ],
    seo: {
      metaTitle: 'E-commerce Platform - Multi-vendor Marketplace Solution',
      metaDescription: 'Scalable e-commerce platform with multi-vendor support, payment integration, and analytics.',
      keywords: ['ecommerce', 'marketplace', 'online store', 'shopping'],
    },
    createdAt: '2022-06-10T09:00:00Z',
    updatedAt: '2023-06-15T12:00:00Z',
  },
  {
    id: '3',
    name: 'Real-time Analytics Dashboard',
    slug: 'analytics-dashboard',
    shortDescription: 'Business intelligence dashboard with real-time data visualization and custom reports.',
    fullDescription: `<p>A powerful analytics dashboard for tracking business metrics in real-time.</p>
<ul>
<li>Real-time data streaming</li>
<li>Customizable widgets</li>
<li>Drag-and-drop report builder</li>
<li>Export to PDF, Excel</li>
<li>Role-based access control</li>
<li>Automated alerts</li>
</ul>`,
    role: 'Full Stack Developer',
    categoryId: 'dashboard',
    status: 'in-progress',
    sortOrder: 3,
    isFeatured: false,
    startDate: '2024-01',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    ],
    videoUrl: '',
    youtubeUrl: '',
    githubUrl: 'https://github.com/example/analytics',
    demoUrl: 'https://demo.analytics-dash.com',
    documentationUrl: '',
    figmaUrl: '',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Kafka', 'Redis', 'Docker', 'GCP'],
    features: [
      { id: 'f1', name: 'Real-time Data', icon: 'activity' },
      { id: 'f2', name: 'Charts', icon: 'pie-chart' },
      { id: 'f3', name: 'Reports', icon: 'file-text' },
      { id: 'f4', name: 'Alerts', icon: 'bell' },
    ],
    team: [
      { id: 't1', name: 'John Doe', role: 'Full Stack Dev', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff' },
    ],
    seo: {
      metaTitle: 'Analytics Dashboard - Real-time Business Intelligence',
      metaDescription: 'Powerful analytics dashboard with real-time data visualization and custom reports.',
      keywords: ['analytics', 'dashboard', 'bi', 'data visualization'],
    },
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-06-25T16:45:00Z',
  },
  {
    id: '4',
    name: 'Inventory Management System',
    slug: 'inventory-management',
    shortDescription: 'Warehouse inventory tracking with barcode scanning and automated reordering.',
    fullDescription: `<p>Comprehensive inventory management solution for warehouses and retail stores.</p>`,
    role: 'Backend Developer',
    client: 'LogiTech Solutions',
    categoryId: 'web-app',
    status: 'draft',
    sortOrder: 4,
    isFeatured: false,
    startDate: '2024-03',
    thumbnail: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop',
    banner: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=400&fit=crop',
    gallery: [],
    technologies: ['Vue.js', 'Spring Boot', 'MySQL', 'Redis', 'Docker'],
    features: [
      { id: 'f1', name: 'Barcode Scanning', icon: 'scan' },
      { id: 'f2', name: 'Stock Alerts', icon: 'alert' },
      { id: 'f3', name: 'Reports', icon: 'file-text' },
    ],
    team: [],
    seo: {
      metaTitle: 'Inventory Management System',
      metaDescription: 'Warehouse inventory tracking with barcode scanning and automated reordering.',
      keywords: ['inventory', 'warehouse', 'stock management'],
    },
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
];

// ============================================================
// FEATURED PROJECTS MODELS
// Section FEATURED PROJECTS trên Home (#projects) — API type = 1 (endpoint /api/admin/projects)
// ============================================================

import { PROJECTS_SECTION_TYPE, PROJECTS_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

export const PROJECTS_SECTION_TYPE_CODE = PROJECTS_SECTION_TYPE;
export { PROJECTS_SECTION_TYPE_LABEL };

export type FeaturedProjectStatus = 'completed' | 'in-progress' | 'private' | 'open-source';
export type TechCategory = 'frontend' | 'backend' | 'database' | 'devops';

export interface FeaturedProjectsSectionConfig {
  type: typeof PROJECTS_SECTION_TYPE;
  sectionTag: string;
  titleAccent: string;
  titleText: string;
  subtitle: string;
}

export interface ProjectFilterItem {
  id: string;
  type: typeof PROJECTS_SECTION_TYPE;
  key: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProjectFilterFormData {
  type: typeof PROJECTS_SECTION_TYPE;
  key: string;
  label: string;
  sortOrder: number;
}

export interface ProjectTechnology {
  name: string;
  category: TechCategory;
}

export interface ProjectStatistic {
  label: string;
  value: string;
  icon: string;
}

export interface FeaturedProject {
  id: string;
  type: typeof PROJECTS_SECTION_TYPE;
  name: string;
  role: string;
  description: string;
  longDescription: string;
  technologies: ProjectTechnology[];
  status: FeaturedProjectStatus;
  isFeatured: boolean;
  isActive: boolean;
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  statistics: ProjectStatistic[];
  startDate: string;
  endDate: string;
  responsibilities: string[];
  features: string[];
  achievements: string[];
  teamSize: number;
  duration: string;
  sortOrder: number;
}

export interface FeaturedProjectFormData {
  type: typeof PROJECTS_SECTION_TYPE;
  name: string;
  role: string;
  description: string;
  longDescription: string;
  technologies: ProjectTechnology[];
  status: FeaturedProjectStatus;
  isFeatured: boolean;
  image: string;
  demoUrl: string;
  githubUrl: string;
  statistics: ProjectStatistic[];
  startDate: string;
  endDate: string;
  responsibilities: string[];
  features: string[];
  achievements: string[];
  teamSize: number;
  duration: string;
  sortOrder: number;
}

export type FeaturedProjectsTab = 'section' | 'filters' | 'projects';

export const FEATURED_PROJECTS_TAB_KEYS: FeaturedProjectsTab[] = ['section', 'filters', 'projects'];

export const FEATURED_PROJECTS_TABS: { key: FeaturedProjectsTab; label: string; description: string }[] = [
  { key: 'section', label: 'Section Config', description: 'Tag, FEATURED PROJECTS heading' },
  { key: 'filters', label: 'Filters', description: 'All, Angular, Spring Boot...' },
  { key: 'projects', label: 'Projects', description: 'Project cards on Home' },
];

export const FEATURED_PROJECT_STATUSES: { value: FeaturedProjectStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'private', label: 'Private' },
  { value: 'open-source', label: 'Open Source' },
];

export const TECH_CATEGORIES: { value: TechCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
];

export const DEFAULT_FEATURED_PROJECTS_SECTION: FeaturedProjectsSectionConfig = {
  type: PROJECTS_SECTION_TYPE,
  sectionTag: 'My Work',
  titleAccent: 'FEATURED',
  titleText: 'PROJECTS',
  subtitle: 'Some projects I have worked on - Showcasing my skills and experience in building scalable applications.',
};

export const MOCK_PROJECT_FILTERS: ProjectFilterItem[] = [
  { id: 'all', type: PROJECTS_SECTION_TYPE, key: 'all', label: 'All', sortOrder: 1, isActive: true },
  { id: 'angular', type: PROJECTS_SECTION_TYPE, key: 'angular', label: 'Angular', sortOrder: 2, isActive: true },
  { id: 'spring', type: PROJECTS_SECTION_TYPE, key: 'spring', label: 'Spring Boot', sortOrder: 3, isActive: true },
  { id: 'java', type: PROJECTS_SECTION_TYPE, key: 'java', label: 'Java', sortOrder: 4, isActive: true },
  { id: 'postgresql', type: PROJECTS_SECTION_TYPE, key: 'postgresql', label: 'PostgreSQL', sortOrder: 5, isActive: true },
  { id: 'dotnet', type: PROJECTS_SECTION_TYPE, key: 'dotnet', label: '.NET', sortOrder: 6, isActive: true },
];

const MOCK_FEATURED_PROJECTS_BASE: Omit<FeaturedProject, 'type'>[] = [
  {
    id: '1',
    name: 'Hospital Information System',
    role: 'Software Engineer',
    description: 'Comprehensive hospital management platform with patient records, appointment scheduling, and medical inventory.',
    longDescription: 'A full-stack hospital management system designed to streamline healthcare operations.',
    technologies: [
      { name: 'Angular', category: 'frontend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Docker', category: 'devops' },
      { name: 'Redis', category: 'backend' },
      { name: 'RabbitMQ', category: 'backend' },
    ],
    status: 'completed',
    isFeatured: true,
    isActive: true,
    image: '/assets/projects/hospital.jpg',
    demoUrl: 'https://hospital-demo.com',
    githubUrl: 'https://github.com/yenhs/hospital-system',
    statistics: [
      { label: 'Modules', value: '15+', icon: '📦' },
      { label: 'REST APIs', value: '50+', icon: '🔗' },
      { label: 'Tables', value: '30+', icon: '🗄️' },
      { label: 'Team', value: '5', icon: '👥' },
    ],
    startDate: 'Jan 2025',
    endDate: 'Present',
    responsibilities: [
      'Design and implement RESTful APIs',
      'Build responsive Angular components',
      'Optimize database queries and performance',
      'Implement real-time notifications',
      'Code review and mentoring',
    ],
    features: [
      'Patient management with history tracking',
      'Appointment scheduling with conflict detection',
      'Medical inventory with low-stock alerts',
      'Revenue and financial reports',
      'Role-based access control',
    ],
    achievements: ['Reduced processing time by 40%', '99.9% uptime'],
    teamSize: 5,
    duration: '6+ months',
    sortOrder: 1,
  },
  {
    id: '2',
    name: 'E-Commerce Platform',
    role: 'Backend Developer',
    description: 'Scalable microservices-based e-commerce platform with order management and payment integration.',
    longDescription: 'Enterprise-grade e-commerce solution with microservices architecture.',
    technologies: [
      { name: 'Java', category: 'backend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Docker', category: 'devops' },
      { name: 'MongoDB', category: 'database' },
      { name: 'Kubernetes', category: 'devops' },
    ],
    status: 'completed',
    isFeatured: true,
    isActive: true,
    image: '/assets/projects/ecommerce.jpg',
    githubUrl: 'https://github.com/yenhs/ecommerce',
    statistics: [
      { label: 'Services', value: '8', icon: '⚙️' },
      { label: 'REST APIs', value: '100+', icon: '🔗' },
      { label: 'DBs', value: '3', icon: '🗄️' },
      { label: 'Team', value: '8', icon: '👥' },
    ],
    startDate: 'Mar 2024',
    endDate: 'Dec 2024',
    responsibilities: [
      'Design microservices architecture',
      'Implement API Gateway',
      'Build event-driven messaging system',
      'Optimize database performance',
      'CI/CD pipeline setup',
    ],
    features: [
      'Product catalog with search',
      'Shopping cart and wishlist',
      'Order processing workflow',
      'Payment gateway integration',
      'Inventory management',
    ],
    achievements: ['Handles 1000+ concurrent users', '99.95% uptime'],
    teamSize: 8,
    duration: '10 months',
    sortOrder: 2,
  },
  {
    id: '3',
    name: 'Admin Dashboard',
    role: 'Frontend Developer',
    description: 'Modern admin dashboard with real-time analytics, reporting, and user management.',
    longDescription: 'Feature-rich admin dashboard for business intelligence.',
    technologies: [
      { name: 'Angular', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'SCSS', category: 'frontend' },
      { name: 'RxJS', category: 'frontend' },
      { name: 'Chart.js', category: 'frontend' },
    ],
    status: 'completed',
    isFeatured: false,
    isActive: true,
    image: '/assets/projects/dashboard.jpg',
    demoUrl: 'https://dashboard-demo.com',
    statistics: [
      { label: 'Pages', value: '20+', icon: '📄' },
      { label: 'Charts', value: '15+', icon: '📊' },
      { label: 'Reports', value: '10+', icon: '📈' },
      { label: 'Team', value: '3', icon: '👥' },
    ],
    startDate: 'Jun 2023',
    endDate: 'Feb 2024',
    responsibilities: [
      'Build reusable component library',
      'Implement reactive data streams',
      'Create interactive charts and visualizations',
      'Responsive design implementation',
      'Performance optimization',
    ],
    features: [
      'Real-time data visualization',
      'User management module',
      'Sales analytics dashboard',
      'Custom report builder',
      'Notification system',
    ],
    achievements: ['Reduced load time by 50%', 'Mobile-first approach'],
    teamSize: 3,
    duration: '8 months',
    sortOrder: 3,
  },
  {
    id: '4',
    name: 'Customer Care Portal',
    role: 'Full Stack Developer',
    description: 'Customer service portal with ticket management, live chat, and knowledge base.',
    longDescription: 'Comprehensive customer support solution.',
    technologies: [
      { name: 'Angular', category: 'frontend' },
      { name: '.NET Core', category: 'backend' },
      { name: 'SQL Server', category: 'database' },
      { name: 'Azure', category: 'devops' },
      { name: 'SignalR', category: 'backend' },
    ],
    status: 'in-progress',
    isFeatured: false,
    isActive: true,
    image: '/assets/projects/care.jpg',
    statistics: [
      { label: 'Tickets', value: 'Daily', icon: '🎫' },
      { label: 'Users', value: '1000+', icon: '👤' },
      { label: 'Team', value: '4', icon: '👥' },
      { label: 'Duration', value: '4mo', icon: '⏱️' },
    ],
    startDate: 'Oct 2025',
    endDate: 'Present',
    responsibilities: [
      'Full stack development',
      'Real-time chat implementation',
      'Ticket workflow design',
      'Knowledge base system',
      'Integration with CRM',
    ],
    features: [
      'Multi-channel ticket management',
      'Live chat with typing indicators',
      'AI-powered chatbot',
      'Knowledge base with search',
      'Customer satisfaction surveys',
    ],
    achievements: ['60% faster response time'],
    teamSize: 4,
    duration: '4 months',
    sortOrder: 4,
  },
  {
    id: '5',
    name: 'Inventory Management',
    role: 'Backend Developer',
    description: 'Warehouse inventory system with barcode scanning and stock tracking.',
    longDescription: 'Enterprise inventory management solution.',
    technologies: [
      { name: 'Java', category: 'backend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Redis', category: 'backend' },
      { name: 'Docker', category: 'devops' },
    ],
    status: 'completed',
    isFeatured: false,
    isActive: true,
    image: '/assets/projects/inventory.jpg',
    statistics: [
      { label: 'Items', value: '100K+', icon: '📦' },
      { label: 'APIs', value: '30+', icon: '🔗' },
      { label: 'Locations', value: '5', icon: '📍' },
      { label: 'Team', value: '3', icon: '👥' },
    ],
    startDate: 'Jan 2024',
    endDate: 'May 2024',
    responsibilities: [
      'API development',
      'Barcode integration',
      'Stock level automation',
      'Report generation',
      'System optimization',
    ],
    features: [
      'Barcode/QR code scanning',
      'Real-time stock updates',
      'Low stock alerts',
      'Multi-warehouse support',
      'Purchase order management',
    ],
    achievements: ['Reduced stock discrepancies by 95%'],
    teamSize: 3,
    duration: '5 months',
    sortOrder: 5,
  },
  {
    id: '6',
    name: 'Personal Finance App',
    role: 'Software Engineer',
    description: 'Mobile-first personal finance tracking application with budgeting and investment tracking.',
    longDescription: 'Personal finance management solution.',
    technologies: [
      { name: 'Angular', category: 'frontend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Docker', category: 'devops' },
    ],
    status: 'open-source',
    isFeatured: false,
    isActive: true,
    image: '/assets/projects/finance.jpg',
    githubUrl: 'https://github.com/yenhs/finance-app',
    demoUrl: 'https://finance-demo.com',
    statistics: [
      { label: 'Downloads', value: '500+', icon: '📥' },
      { label: 'Stars', value: '50+', icon: '⭐' },
      { label: 'Features', value: '20+', icon: '✨' },
      { label: 'Team', value: '1', icon: '👤' },
    ],
    startDate: 'Aug 2024',
    endDate: 'Present',
    responsibilities: [
      'Solo development',
      'Feature planning',
      'User feedback implementation',
      'Documentation',
      'Community support',
    ],
    features: [
      'Expense tracking with categories',
      'Budget planning and alerts',
      'Investment portfolio view',
      'Bill reminders',
      'Financial reports',
    ],
    achievements: ['500+ active users', 'Open source contribution'],
    teamSize: 1,
    duration: 'Ongoing',
    sortOrder: 6,
  },
];

export const MOCK_FEATURED_PROJECTS: FeaturedProject[] = MOCK_FEATURED_PROJECTS_BASE.map(project => ({
  ...project,
  type: PROJECTS_SECTION_TYPE,
}));

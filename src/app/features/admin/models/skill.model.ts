// ============================================================
// SKILL MODELS
// Skill Management Data Types
// ============================================================

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Skill {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  iconType: 'svg' | 'class';
  categoryId: string;
  level: number;
  color: string;
  sortOrder: number;
  isActive: boolean;
  description?: string;
}

export interface SkillFormData {
  name: string;
  displayName: string;
  icon: string;
  iconType: 'svg' | 'class';
  categoryId: string;
  level: number;
  color: string;
  description: string;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  { id: 'frontend', name: 'Frontend', slug: 'frontend', icon: 'code', color: '#61DAFB', sortOrder: 1, isActive: true },
  { id: 'backend', name: 'Backend', slug: 'backend', icon: 'server', color: '#68A063', sortOrder: 2, isActive: true },
  { id: 'database', name: 'Database', slug: 'database', icon: 'database', color: '#336791', sortOrder: 3, isActive: true },
  { id: 'devops', name: 'DevOps', slug: 'devops', icon: 'cloud', color: '#2496ED', sortOrder: 4, isActive: true },
  { id: 'cloud', name: 'Cloud', slug: 'cloud', icon: 'cloud-upload', color: '#FF9900', sortOrder: 5, isActive: true },
  { id: 'tools', name: 'Tools', slug: 'tools', icon: 'tool', color: '#FF6B6B', sortOrder: 6, isActive: true },
  { id: 'soft-skills', name: 'Soft Skills', slug: 'soft-skills', icon: 'users', color: '#A855F7', sortOrder: 7, isActive: true },
];

export const AVAILABLE_ICONS: { name: string; icon: string; category: string }[] = [
  // Frontend
  { name: 'Angular', icon: 'angular', category: 'Frontend' },
  { name: 'React', icon: 'react', category: 'Frontend' },
  { name: 'Vue.js', icon: 'vuejs', category: 'Frontend' },
  { name: 'TypeScript', icon: 'typescript', category: 'Frontend' },
  { name: 'JavaScript', icon: 'javascript', category: 'Frontend' },
  { name: 'HTML', icon: 'html5', category: 'Frontend' },
  { name: 'CSS', icon: 'css3', category: 'Frontend' },
  { name: 'SASS', icon: 'sass', category: 'Frontend' },
  { name: 'Tailwind', icon: 'tailwindcss', category: 'Frontend' },
  { name: 'Next.js', icon: 'nextjs', category: 'Frontend' },
  { name: 'Nuxt', icon: 'nuxt', category: 'Frontend' },

  // Backend
  { name: 'Java', icon: 'java', category: 'Backend' },
  { name: 'Spring Boot', icon: 'spring', category: 'Backend' },
  { name: 'Node.js', icon: 'nodejs', category: 'Backend' },
  { name: 'Python', icon: 'python', category: 'Backend' },
  { name: 'Go', icon: 'go', category: 'Backend' },
  { name: 'C#', icon: 'csharp', category: 'Backend' },
  { name: 'PHP', icon: 'php', category: 'Backend' },
  { name: 'Ruby', icon: 'ruby', category: 'Backend' },
  { name: 'GraphQL', icon: 'graphql', category: 'Backend' },
  { name: 'REST API', icon: 'api', category: 'Backend' },

  // Database
  { name: 'PostgreSQL', icon: 'postgresql', category: 'Database' },
  { name: 'MySQL', icon: 'mysql', category: 'Database' },
  { name: 'MongoDB', icon: 'mongodb', category: 'Database' },
  { name: 'Oracle', icon: 'oracle', category: 'Database' },
  { name: 'Redis', icon: 'redis', category: 'Database' },
  { name: 'SQL Server', icon: 'mssql', category: 'Database' },
  { name: 'Firebase', icon: 'firebase', category: 'Database' },

  // DevOps
  { name: 'Docker', icon: 'docker', category: 'DevOps' },
  { name: 'Kubernetes', icon: 'kubernetes', category: 'DevOps' },
  { name: 'Jenkins', icon: 'jenkins', category: 'DevOps' },
  { name: 'GitLab', icon: 'gitlab', category: 'DevOps' },
  { name: 'GitHub Actions', icon: 'github-actions', category: 'DevOps' },
  { name: 'Terraform', icon: 'terraform', category: 'DevOps' },
  { name: 'Ansible', icon: 'ansible', category: 'DevOps' },

  // Cloud
  { name: 'AWS', icon: 'aws', category: 'Cloud' },
  { name: 'Azure', icon: 'azure', category: 'Cloud' },
  { name: 'GCP', icon: 'google-cloud', category: 'Cloud' },
  { name: 'Vercel', icon: 'vercel', category: 'Cloud' },
  { name: 'Netlify', icon: 'netlify', category: 'Cloud' },

  // Tools
  { name: 'Git', icon: 'git', category: 'Tools' },
  { name: 'Linux', icon: 'linux', category: 'Tools' },
  { name: 'npm', icon: 'npm', category: 'Tools' },
  { name: 'Yarn', icon: 'yarn', category: 'Tools' },
  { name: 'Webpack', icon: 'webpack', category: 'Tools' },
  { name: 'Vite', icon: 'vite', category: 'Tools' },
  { name: 'Jira', icon: 'jira', category: 'Tools' },
  { name: 'Figma', icon: 'figma', category: 'Tools' },

  // Messaging
  { name: 'RabbitMQ', icon: 'rabbitmq', category: 'Tools' },
  { name: 'Kafka', icon: 'kafka', category: 'Tools' },
];

export const SKILL_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#6B7280', '#78716C', '#0F172A',
];

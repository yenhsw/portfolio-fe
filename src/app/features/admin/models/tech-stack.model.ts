// ============================================================
// TECH STACK MODELS
// Section TECH STACK trên Home (#skills) — API type = 1 (endpoint /api/admin/skills)
// ============================================================

import { SKILLS_SECTION_TYPE, SKILLS_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

/** Type code cố định cho màn Skills — gửi kèm mọi API request/response */
export const SKILLS_SECTION_TYPE_CODE = SKILLS_SECTION_TYPE;
export { SKILLS_SECTION_TYPE_LABEL };

export interface TechStackSectionConfig {
  type: typeof SKILLS_SECTION_TYPE;
  sectionTag: string;
  titleAccent: string;
  titleText: string;
  subtitle: string;
}

export interface TechStackStatistic {
  id: string;
  type: typeof SKILLS_SECTION_TYPE;
  valueNumber: number;
  valueSuffix: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TechStackStatisticFormData {
  type: typeof SKILLS_SECTION_TYPE;
  valueNumber: number;
  valueSuffix: string;
  label: string;
  sortOrder: number;
}

export interface TechStackCategory {
  id: string;
  type: typeof SKILLS_SECTION_TYPE;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TechStackCategoryFormData {
  type: typeof SKILLS_SECTION_TYPE;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface TechStackSkill {
  id: string;
  type: typeof SKILLS_SECTION_TYPE;
  categoryId: string;
  name: string;
  logo: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
}

export interface TechStackSkillFormData {
  type: typeof SKILLS_SECTION_TYPE;
  categoryId: string;
  name: string;
  logo: string;
  level: number;
  sortOrder: number;
}

/** Shape dùng trên public Home */
export interface PublicSkillCategory {
  name: string;
  icon: string;
  color: string;
  skills: { name: string; level: number; icon: string; logo?: string }[];
}

export type TechStackTab = 'section' | 'statistics' | 'categories' | 'skills';

export const TECH_STACK_TAB_KEYS: TechStackTab[] = ['section', 'statistics', 'categories', 'skills'];

export const TECH_STACK_TABS: { key: TechStackTab; label: string; description: string }[] = [
  { key: 'section', label: 'Section Config', description: 'Tag, TECH STACK heading' },
  { key: 'statistics', label: 'Statistics', description: '4 count-up metrics at section top' },
  { key: 'categories', label: 'Categories', description: 'Frontend, Backend, Database...' },
  { key: 'skills', label: 'Skills', description: 'Skill + logo within each category' },
];

export const DEFAULT_TECH_STACK_SECTION: TechStackSectionConfig = {
  type: SKILLS_SECTION_TYPE,
  sectionTag: 'What I Know',
  titleAccent: 'TECH',
  titleText: 'STACK',
  subtitle: 'Technologies I Work With - Building modern, scalable applications with cutting-edge tools.',
};

export const MOCK_TECH_STACK_STATISTICS: TechStackStatistic[] = [
  { id: '1', type: SKILLS_SECTION_TYPE, valueNumber: 15, valueSuffix: '+', label: 'Technologies', sortOrder: 1, isActive: true },
  { id: '2', type: SKILLS_SECTION_TYPE, valueNumber: 100, valueSuffix: '+', label: 'REST APIs', sortOrder: 2, isActive: true },
  { id: '3', type: SKILLS_SECTION_TYPE, valueNumber: 10, valueSuffix: '+', label: 'Projects', sortOrder: 3, isActive: true },
  { id: '4', type: SKILLS_SECTION_TYPE, valueNumber: 3, valueSuffix: '+', label: 'Years Experience', sortOrder: 4, isActive: true },
];

export const MOCK_TECH_STACK_CATEGORIES: TechStackCategory[] = [
  { id: 'frontend', type: SKILLS_SECTION_TYPE, name: 'Frontend', icon: '🎨', color: '#00f5ff', sortOrder: 1, isActive: true },
  { id: 'backend', type: SKILLS_SECTION_TYPE, name: 'Backend', icon: '⚙️', color: '#8b5cf6', sortOrder: 2, isActive: true },
  { id: 'database', type: SKILLS_SECTION_TYPE, name: 'Database', icon: '🗄️', color: '#f59e0b', sortOrder: 3, isActive: true },
  { id: 'tools', type: SKILLS_SECTION_TYPE, name: 'Tools', icon: '🔧', color: '#10b981', sortOrder: 4, isActive: true },
];

const MOCK_SKILLS_BASE: Omit<TechStackSkill, 'type'>[] = [
  { id: '1', categoryId: 'frontend', name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg', level: 90, sortOrder: 1, isActive: true },
  { id: '2', categoryId: 'frontend', name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', level: 88, sortOrder: 2, isActive: true },
  { id: '3', categoryId: 'frontend', name: 'HTML/CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', level: 92, sortOrder: 3, isActive: true },
  { id: '4', categoryId: 'frontend', name: 'SCSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', level: 85, sortOrder: 4, isActive: true },
  { id: '5', categoryId: 'frontend', name: 'RxJS', logo: 'https://rxjs.tech/assets/images/logos/RxJS_Logo_Colored.svg', level: 80, sortOrder: 5, isActive: true },
  { id: '6', categoryId: 'frontend', name: 'Angular Signals', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg', level: 75, sortOrder: 6, isActive: true },
  { id: '7', categoryId: 'backend', name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', level: 88, sortOrder: 1, isActive: true },
  { id: '8', categoryId: 'backend', name: 'Spring Boot', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', level: 85, sortOrder: 2, isActive: true },
  { id: '9', categoryId: 'backend', name: 'REST API', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg', level: 92, sortOrder: 3, isActive: true },
  { id: '10', categoryId: 'backend', name: 'JWT', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg', level: 82, sortOrder: 4, isActive: true },
  { id: '11', categoryId: 'backend', name: 'Hibernate', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', level: 78, sortOrder: 5, isActive: true },
  { id: '12', categoryId: 'backend', name: 'Microservices', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', level: 75, sortOrder: 6, isActive: true },
  { id: '13', categoryId: 'database', name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', level: 85, sortOrder: 1, isActive: true },
  { id: '14', categoryId: 'database', name: 'Oracle', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg', level: 72, sortOrder: 2, isActive: true },
  { id: '15', categoryId: 'database', name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', level: 80, sortOrder: 3, isActive: true },
  { id: '16', categoryId: 'database', name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', level: 70, sortOrder: 4, isActive: true },
  { id: '17', categoryId: 'database', name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', level: 68, sortOrder: 5, isActive: true },
  { id: '18', categoryId: 'database', name: 'SQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', level: 88, sortOrder: 6, isActive: true },
  { id: '19', categoryId: 'tools', name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', level: 90, sortOrder: 1, isActive: true },
  { id: '20', categoryId: 'tools', name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', level: 82, sortOrder: 2, isActive: true },
  { id: '21', categoryId: 'tools', name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', level: 78, sortOrder: 3, isActive: true },
  { id: '22', categoryId: 'tools', name: 'VS Code', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', level: 92, sortOrder: 4, isActive: true },
  { id: '23', categoryId: 'tools', name: 'Postman', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', level: 88, sortOrder: 5, isActive: true },
  { id: '24', categoryId: 'tools', name: 'Nginx', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg', level: 70, sortOrder: 6, isActive: true },
];

export const MOCK_TECH_STACK_SKILLS: TechStackSkill[] = MOCK_SKILLS_BASE.map(item => ({
  ...item,
  type: SKILLS_SECTION_TYPE,
}));

// ============================================================
// EDUCATIONAL MODELS
// Section EDUCATIONAL trên Home (#career) — API type = 1 (endpoint /api/admin/educational)
// ============================================================

import { EDUCATIONAL_SECTION_TYPE, EDUCATIONAL_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

/** Type code cố định cho màn Educational — gửi kèm mọi API request/response */
export const EDUCATIONAL_SECTION_TYPE_CODE = EDUCATIONAL_SECTION_TYPE;
export { EDUCATIONAL_SECTION_TYPE_LABEL };

/** Cấu hình tiêu đề section EDUCATIONAL */
export interface EducationalSectionConfig {
  type: typeof EDUCATIONAL_SECTION_TYPE;
  sectionTag: string;
  titleAccent: string;
  titleText: string;
  subtitle: string;
  /** Divider giữa timeline và certificates */
  certificatesDividerText: string;
  certificatesSubTitle: string;
  /** Divider + title mục Future Goals */
  futureGoalsDividerText: string;
  futureGoalsSubTitle: string;
}

/** Tab 1: Highlights (4 card số liệu đầu section) */
export interface EducationalHighlight {
  id: string;
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  valueNumber: number;
  valueSuffix: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface EducationalHighlightFormData {
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  valueNumber: number;
  valueSuffix: string;
  label: string;
  sortOrder: number;
}

/** Tab 2: Education timeline (timeline) */
export interface EducationRecord {
  id: string;
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  institutionName: string;
  courseName: string;
  year: string;
  description: string;
  technologies: string[];
  sortOrder: number;
  isActive: boolean;
}

export interface EducationRecordFormData {
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  institutionName: string;
  courseName: string;
  year: string;
  description: string;
  technologies: string[];
  sortOrder: number;
}

/** Tab 3: Certificates */
export interface EducationalCertificate {
  id: string;
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  name: string;
  provider: string;
  year: string;
  badge: string;
  sortOrder: number;
  isActive: boolean;
}

export interface EducationalCertificateFormData {
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  name: string;
  provider: string;
  year: string;
  badge: string;
  sortOrder: number;
}

/** Tab 4: Future goals */
export interface FutureGoal {
  id: string;
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FutureGoalFormData {
  type: typeof EDUCATIONAL_SECTION_TYPE;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
}

export type EducationalTab =
  | 'section'
  | 'highlights'
  | 'timeline'
  | 'certificates'
  | 'future-goals';

export const EDUCATIONAL_TAB_KEYS: EducationalTab[] = [
  'section',
  'highlights',
  'timeline',
  'certificates',
  'future-goals',
];

export const EDUCATIONAL_TABS: { key: EducationalTab; label: string; description: string }[] = [
  { key: 'section', label: 'Section Config', description: 'Tag, heading, EDUCATIONAL section description' },
  { key: 'highlights', label: 'Highlights', description: '4 stat cards (icon, value, label)' },
  { key: 'timeline', label: 'Education timeline', description: 'School/course timeline + languages' },
  { key: 'certificates', label: 'Certificates', description: 'Professional certificates' },
  { key: 'future-goals', label: 'Future goals', description: 'Career development goals' },
];

export const DEFAULT_EDUCATIONAL_SECTION: EducationalSectionConfig = {
  type: EDUCATIONAL_SECTION_TYPE,
  sectionTag: 'My Path',
  titleAccent: 'EDUCATIONAL',
  titleText: 'BACKGROUND',
  subtitle: 'Learning, Working and Growing - From education to professional achievements.',
  certificatesDividerText: 'Certifications & Achievements',
  certificatesSubTitle: 'Professional Certificates',
  futureGoalsDividerText: 'Future Goals',
  futureGoalsSubTitle: 'Future Goals',
};

export const MOCK_EDUCATIONAL_HIGHLIGHTS: EducationalHighlight[] = [
  { id: '1', type: EDUCATIONAL_SECTION_TYPE, icon: '🔗', valueNumber: 100, valueSuffix: '+', label: 'REST APIs Built', sortOrder: 1, isActive: true },
  { id: '2', type: EDUCATIONAL_SECTION_TYPE, icon: '📦', valueNumber: 10, valueSuffix: '+', label: 'Projects Completed', sortOrder: 2, isActive: true },
  { id: '3', type: EDUCATIONAL_SECTION_TYPE, icon: '📝', valueNumber: 500, valueSuffix: '+', label: 'Commits', sortOrder: 3, isActive: true },
  { id: '4', type: EDUCATIONAL_SECTION_TYPE, icon: '⏰', valueNumber: 3, valueSuffix: '+', label: 'Years Experience', sortOrder: 4, isActive: true },
];

export const MOCK_EDUCATION_RECORDS: EducationRecord[] = [
  {
    id: '1',
    type: EDUCATIONAL_SECTION_TYPE,
    icon: '🎓',
    institutionName: 'Started Computer Science',
    courseName: 'University Education',
    year: '2021',
    description: 'Began studying Information Technology at university. Learned programming fundamentals, data structures, and algorithms.',
    technologies: ['C', 'C++', 'Java', 'SQL'],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    type: EDUCATIONAL_SECTION_TYPE,
    icon: '⚙️',
    institutionName: 'Backend Development',
    courseName: 'Java & Spring Boot',
    year: '2022',
    description: 'Deep dived into backend development with Java and Spring Boot. Learned REST API design, database management, and microservices.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Hibernate'],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    type: EDUCATIONAL_SECTION_TYPE,
    icon: '💼',
    institutionName: 'Software Developer Intern',
    courseName: 'Professional Experience',
    year: '2023',
    description: 'Started internship at a tech company. Worked on real projects, learned Agile methodology, and improved coding skills.',
    technologies: ['Java', 'Spring', 'MySQL', 'Git'],
    sortOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    type: EDUCATIONAL_SECTION_TYPE,
    icon: '🚀',
    institutionName: 'Full Stack Development',
    courseName: 'Frontend & Backend',
    year: '2024',
    description: 'Expanded skills to frontend development with Angular. Built complete full-stack applications from scratch.',
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Spring Boot'],
    sortOrder: 4,
    isActive: true,
  },
  {
    id: '5',
    type: EDUCATIONAL_SECTION_TYPE,
    icon: '💻',
    institutionName: 'Software Engineer',
    courseName: 'DTMED Company',
    year: '2025',
    description: 'Joined DTMED as Software Engineer. Working on hospital information systems, building scalable solutions.',
    technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker', 'Redis'],
    sortOrder: 5,
    isActive: true,
  },
];

export const MOCK_EDUCATIONAL_CERTIFICATES: EducationalCertificate[] = [
  { id: '1', type: EDUCATIONAL_SECTION_TYPE, icon: '🏆', name: 'Oracle Database', provider: 'Oracle Corporation', year: '2024', badge: 'Associate', sortOrder: 1, isActive: true },
  { id: '2', type: EDUCATIONAL_SECTION_TYPE, icon: '🐳', name: 'Docker Fundamentals', provider: 'Docker Inc.', year: '2024', badge: 'Certified', sortOrder: 2, isActive: true },
  { id: '3', type: EDUCATIONAL_SECTION_TYPE, icon: '☁️', name: 'AWS Cloud', provider: 'Amazon Web Services', year: '2025', badge: 'Practitioner', sortOrder: 3, isActive: true },
  { id: '4', type: EDUCATIONAL_SECTION_TYPE, icon: '☕', name: 'Java Programming', provider: 'Oracle', year: '2023', badge: 'OCP', sortOrder: 4, isActive: true },
  { id: '5', type: EDUCATIONAL_SECTION_TYPE, icon: '🅰️', name: 'Angular Development', provider: 'Google', year: '2024', badge: 'Expert', sortOrder: 5, isActive: true },
  { id: '6', type: EDUCATIONAL_SECTION_TYPE, icon: '📜', name: 'TOEFL Certificate', provider: 'ETS', year: '2023', badge: 'Score 750', sortOrder: 6, isActive: true },
];

export const MOCK_FUTURE_GOALS: FutureGoal[] = [
  { id: '1', type: EDUCATIONAL_SECTION_TYPE, icon: '☁️', title: 'Cloud Architecture', description: 'AWS, Azure, GCP expertise', sortOrder: 1, isActive: true },
  { id: '2', type: EDUCATIONAL_SECTION_TYPE, icon: '☸️', title: 'Kubernetes', description: 'Container orchestration mastery', sortOrder: 2, isActive: true },
  { id: '3', type: EDUCATIONAL_SECTION_TYPE, icon: '🤖', title: 'AI/ML Integration', description: 'Machine learning applications', sortOrder: 3, isActive: true },
  { id: '4', type: EDUCATIONAL_SECTION_TYPE, icon: '🏗️', title: 'System Design', description: 'Scalable system architecture', sortOrder: 4, isActive: true },
  { id: '5', type: EDUCATIONAL_SECTION_TYPE, icon: '👑', title: 'Tech Leadership', description: 'Team lead and mentoring', sortOrder: 5, isActive: true },
];

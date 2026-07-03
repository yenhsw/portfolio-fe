// ============================================================
// CAREER JOURNEY MODELS
// Section CAREER JOURNEY trên Home (#experience) — API type = 1 (endpoint /api/admin/experience)
// ============================================================

import { EXPERIENCE_SECTION_TYPE, EXPERIENCE_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

/** Type code cố định cho màn Experience — gửi kèm mọi API request/response */
export const EXPERIENCE_SECTION_TYPE_CODE = EXPERIENCE_SECTION_TYPE;
export { EXPERIENCE_SECTION_TYPE_LABEL };

/** Cấu hình tiêu đề section CAREER JOURNEY */
export interface CareerJourneySectionConfig {
  type: typeof EXPERIENCE_SECTION_TYPE;
  sectionTag: string;
  titleAccent: string;
  titleText: string;
  subtitle: string;
}

export interface WorkTechnology {
  name: string;
  icon: string;
}

export interface WorkResponsibility {
  text: string;
  icon: string;
}

export interface WorkProject {
  name: string;
  icon: string;
}

export interface WorkAchievement {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

/** Một mốc kinh nghiệm làm việc */
export interface WorkExperience {
  id: string;
  type: typeof EXPERIENCE_SECTION_TYPE;
  position: string;
  positionIcon: string;
  company: string;
  period: string;
  location: string;
  description: string;
  technologies: WorkTechnology[];
  responsibilities: WorkResponsibility[];
  projects: WorkProject[];
  achievements: WorkAchievement[];
  sortOrder: number;
  isActive: boolean;
}

export interface WorkExperienceFormData {
  type: typeof EXPERIENCE_SECTION_TYPE;
  position: string;
  positionIcon: string;
  company: string;
  period: string;
  location: string;
  description: string;
  technologies: WorkTechnology[];
  responsibilities: WorkResponsibility[];
  projects: WorkProject[];
  achievements: WorkAchievement[];
  sortOrder: number;
}

export type CareerJourneyTab = 'section' | 'experiences';

export const CAREER_JOURNEY_TAB_KEYS: CareerJourneyTab[] = ['section', 'experiences'];

export const CAREER_JOURNEY_TABS: { key: CareerJourneyTab; label: string; description: string }[] = [
  { key: 'section', label: 'Section Config', description: 'Tag, heading, CAREER JOURNEY section description' },
  { key: 'experiences', label: 'Work experience', description: 'Company timeline, role, projects, achievements' },
];

export const DEFAULT_CAREER_JOURNEY_SECTION: CareerJourneySectionConfig = {
  type: EXPERIENCE_SECTION_TYPE,
  sectionTag: 'My Story',
  titleAccent: 'CAREER',
  titleText: 'JOURNEY',
  subtitle: 'My Professional Experience - Building impactful solutions and growing as a Software Engineer.',
};

export const MOCK_WORK_EXPERIENCES: WorkExperience[] = [
  {
    id: '1',
    type: EXPERIENCE_SECTION_TYPE,
    position: 'Software Engineer',
    positionIcon: '💻',
    company: 'DTMED',
    period: '2025 - Present',
    location: 'Ho Chi Minh City',
    description: 'Phát triển và bảo trì hệ thống thông tin bệnh viện, xây dựng RESTful APIs và giao diện người dùng hiện đại.',
    technologies: [
      { name: 'Angular', icon: 'A' },
      { name: 'Spring Boot', icon: 'SB' },
      { name: 'Java', icon: 'J' },
      { name: 'PostgreSQL', icon: 'PG' },
      { name: 'Docker', icon: 'Dk' },
    ],
    responsibilities: [
      { text: 'Phát triển RESTful API với Spring Boot', icon: 'API' },
      { text: 'Xây dựng giao diện Angular cho hệ thống', icon: 'UI' },
      { text: 'Thiết kế và tối ưu database PostgreSQL', icon: 'DB' },
      { text: 'Triển khai ứng dụng với Docker', icon: 'DevOps' },
      { text: 'Performance optimization và bug fixing', icon: 'Perf' },
    ],
    projects: [
      { name: 'Hospital Information System', icon: '🏥' },
      { name: 'Medical Dashboard', icon: '📊' },
      { name: 'Revenue Report', icon: '💰' },
      { name: 'Inventory Management', icon: '📦' },
    ],
    achievements: [
      { value: 50, suffix: '+', label: 'REST APIs', icon: '🔗' },
      { value: 30, suffix: '+', label: 'Database Tables', icon: '🗄️' },
      { value: 10, suffix: '+', label: 'Modules', icon: '📦' },
    ],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    type: EXPERIENCE_SECTION_TYPE,
    position: 'Backend Developer',
    positionIcon: '⚙️',
    company: 'Tech Solutions',
    period: '2024 - 2025',
    location: 'Ho Chi Minh City',
    description: 'Phát triển backend cho các ứng dụng doanh nghiệp, xây dựng microservices và API gateway.',
    technologies: [
      { name: 'Java', icon: 'J' },
      { name: 'Spring Boot', icon: 'SB' },
      { name: 'Oracle', icon: 'Or' },
      { name: 'RabbitMQ', icon: 'MQ' },
      { name: 'Redis', icon: 'Rd' },
    ],
    responsibilities: [
      { text: 'Phát triển microservices architecture', icon: 'MS' },
      { text: 'Xây dựng API Gateway', icon: 'Gateway' },
      { text: 'Implement message queue với RabbitMQ', icon: 'MQ' },
      { text: 'Caching với Redis', icon: 'Cache' },
      { text: 'Code review và mentoring junior', icon: 'Mentor' },
    ],
    projects: [
      { name: 'E-Commerce Platform', icon: '🛒' },
      { name: 'Customer Care System', icon: '📞' },
      { name: 'Order Management', icon: '📋' },
    ],
    achievements: [
      { value: 20, suffix: '+', label: 'Microservices', icon: '🔧' },
      { value: 100, suffix: '+', label: 'API Endpoints', icon: '🔗' },
    ],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    type: EXPERIENCE_SECTION_TYPE,
    position: 'Frontend Developer',
    positionIcon: '🎨',
    company: 'Digital Agency',
    period: '2023 - 2024',
    location: 'Ho Chi Minh City',
    description: 'Phát triển giao diện người dùng cho các website và ứng dụng web, tập trung vào UX và performance.',
    technologies: [
      { name: 'Angular', icon: 'A' },
      { name: 'TypeScript', icon: 'TS' },
      { name: 'SCSS', icon: 'SC' },
      { name: 'RxJS', icon: 'Rx' },
    ],
    responsibilities: [
      { text: 'Phát triển SPA với Angular', icon: 'Angular' },
      { text: 'Implement reactive programming với RxJS', icon: 'RxJS' },
      { text: 'Responsive design và cross-browser testing', icon: 'Responsive' },
      { text: 'Performance optimization', icon: 'Perf' },
    ],
    projects: [
      { name: 'Corporate Website', icon: '🌐' },
      { name: 'Admin Dashboard', icon: '📊' },
      { name: 'Landing Pages', icon: '📄' },
    ],
    achievements: [
      { value: 15, suffix: '+', label: 'Websites', icon: '🌐' },
      { value: 5, suffix: '+', label: 'Dashboards', icon: '📊' },
    ],
    sortOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    type: EXPERIENCE_SECTION_TYPE,
    position: 'Software Developer Intern',
    positionIcon: '🌱',
    company: 'Startup XYZ',
    period: '2022 - 2023',
    location: 'Ho Chi Minh City',
    description: 'Học hỏi và đóng góp vào các dự án thực tế, làm quen với quy trình phát triển phần mềm.',
    technologies: [
      { name: 'Java', icon: 'J' },
      { name: 'Spring', icon: 'Sp' },
      { name: 'MySQL', icon: 'My' },
      { name: 'Git', icon: 'G' },
    ],
    responsibilities: [
      { text: 'Học hỏi về SDLC và Agile', icon: 'Agile' },
      { text: 'Assist trong phát triển tính năng', icon: 'Dev' },
      { text: 'Viết unit tests', icon: 'Test' },
      { text: 'Documentation', icon: 'Doc' },
    ],
    projects: [{ name: 'Task Management App', icon: '✅' }],
    achievements: [
      { value: 3, suffix: '+', label: 'Months', icon: '📅' },
      { value: 5, suffix: '+', label: 'Features', icon: '✨' },
    ],
    sortOrder: 4,
    isActive: true,
  },
];

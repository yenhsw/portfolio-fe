// ============================================================
// EXPERIENCE MODELS
// Experience Management Data Types
// ============================================================

export type EmploymentType = 'full-time' | 'part-time' | 'intern' | 'freelancer' | 'contract' | 'remote' | 'hybrid';

export interface Achievement {
  id: string;
  value: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  id: string;
  companyName: string;
  companyLogo: string;
  position: string;
  employmentType: EmploymentType;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  summary: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  achievements: Achievement[];
  projects: Project[];
  sortOrder: number;
  isActive: boolean;
}

export interface ExperienceFormData {
  companyName: string;
  companyLogo: string;
  position: string;
  employmentType: EmploymentType;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  summary: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  achievements: Achievement[];
  projects: Project[];
}

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'intern', label: 'Intern' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const TECHNOLOGIES = [
  'Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript',
  'Java', 'Spring Boot', 'Node.js', 'Python', 'Go',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Oracle', 'Redis',
  'Docker', 'Kubernetes', 'Git', 'Linux', 'AWS',
  'Azure', 'GCP', 'RabbitMQ', 'Kafka', 'GraphQL',
  'REST API', 'Microservices', 'CI/CD', 'Jenkins', 'GitLab',
];

export const RESPONSIBILITIES = [
  'REST API Development', 'Database Design', 'Performance Optimization',
  'UI Development', 'Authentication & Authorization', 'Report Development',
  'Code Review', 'Unit Testing', 'Documentation', 'Agile/Scrum',
  'Team Leadership', 'Mentoring', 'Requirements Analysis', 'System Design',
  'DevOps', 'Cloud Deployment', 'Security', 'Data Migration',
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: '1',
    companyName: 'Tech Innovation Corp',
    companyLogo: 'https://ui-avatars.com/api/?name=TIC&background=6366F1&color=fff&size=128',
    position: 'Senior Full Stack Developer',
    employmentType: 'full-time',
    location: 'Ho Chi Minh City, Vietnam',
    startDate: '2022-01',
    endDate: null,
    isCurrent: true,
    summary: 'Leading development team and architecting scalable web applications.',
    description: '<p>Led development of enterprise applications using Angular and Spring Boot.</p><ul><li>Architected microservices architecture</li><li>Led team of 5 developers</li><li>Improved system performance by 40%</li></ul>',
    technologies: ['Angular', 'Spring Boot', 'TypeScript', 'Java', 'PostgreSQL', 'Docker', 'Redis'],
    responsibilities: ['REST API Development', 'Database Design', 'Performance Optimization', 'Team Leadership'],
    achievements: [
      { id: 'a1', value: '15+', label: 'Projects Delivered' },
      { id: 'a2', value: '40%', label: 'Performance Improvement' },
      { id: 'a3', value: '99.9%', label: 'Uptime Achieved' },
    ],
    projects: [
      {
        id: 'p1',
        name: 'Hospital Information System',
        role: 'Tech Lead',
        description: 'Full-stack development of hospital management system with patient records, appointments, and billing modules.',
        technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker'],
      },
      {
        id: 'p2',
        name: 'Revenue Dashboard',
        role: 'Senior Developer',
        description: 'Real-time analytics dashboard for tracking revenue metrics and business performance.',
        technologies: ['React', 'Node.js', 'Redis', 'PostgreSQL'],
      },
    ],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    companyName: 'Digital Solutions Ltd',
    companyLogo: 'https://ui-avatars.com/api/?name=DSL&background=10B981&color=fff&size=128',
    position: 'Full Stack Developer',
    employmentType: 'full-time',
    location: 'Ho Chi Minh City, Vietnam',
    startDate: '2020-03',
    endDate: '2021-12',
    isCurrent: false,
    summary: 'Developed and maintained e-commerce and enterprise applications.',
    description: '<p>Built scalable web applications for clients across various industries.</p><ul><li>Developed e-commerce platforms</li><li>Implemented payment integrations</li><li>Created RESTful APIs</li></ul>',
    technologies: ['Angular', 'Node.js', 'TypeScript', 'MongoDB', 'MySQL', 'Docker'],
    responsibilities: ['REST API Development', 'UI Development', 'Code Review', 'Unit Testing'],
    achievements: [
      { id: 'a4', value: '20+', label: 'E-commerce Sites' },
      { id: 'a5', value: '50+', label: 'REST APIs' },
    ],
    projects: [
      {
        id: 'p3',
        name: 'E-commerce Platform',
        role: 'Full Stack Developer',
        description: 'Multi-vendor e-commerce platform with payment integration and inventory management.',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Redis'],
      },
    ],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    companyName: 'StartupHub Inc',
    companyLogo: 'https://ui-avatars.com/api/?name=SHI&background=F59E0B&color=fff&size=128',
    position: 'Junior Web Developer',
    employmentType: 'full-time',
    location: 'Da Nang, Vietnam',
    startDate: '2019-06',
    endDate: '2020-02',
    isCurrent: false,
    summary: 'Started career as web developer building responsive web applications.',
    description: '<p>Learned and grew as a web developer working on various client projects.</p><ul><li>Built responsive websites</li><li>Worked with WordPress and custom solutions</li><li>Collaborated with design team</li></ul>',
    technologies: ['JavaScript', 'PHP', 'MySQL', 'jQuery', 'HTML', 'CSS'],
    responsibilities: ['UI Development', 'Documentation'],
    achievements: [
      { id: 'a6', value: '10+', label: 'Websites Built' },
    ],
    projects: [
      {
        id: 'p4',
        name: 'Corporate Website',
        role: 'Junior Developer',
        description: 'Responsive corporate website with content management system.',
        technologies: ['PHP', 'MySQL', 'jQuery'],
      },
    ],
    sortOrder: 3,
    isActive: true,
  },
];

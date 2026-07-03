// ============================================================
// EXPERIENCE MODEL
// Work experience and education data model
// ============================================================

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyUrl: string;
  location: string;
  type: ExperienceType;
  description: string;
  highlights: string[];
  technologies: string[];
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExperienceType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  institutionLogo: string;
  institutionUrl: string;
  location: string;
  description: string;
  grade: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education' | 'certification' | 'achievement';
  title: string;
  subtitle: string;
  organization: string;
  organizationLogo?: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  order: number;
}

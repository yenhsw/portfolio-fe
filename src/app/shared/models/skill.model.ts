// ============================================================
// SKILL MODEL
// Skill and expertise data model
// ============================================================

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
  proficiency: number;
  order: number;
  featured: boolean;
  certifications: string[];
  projects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'soft-skills';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkillGroup {
  category: SkillCategory;
  label: string;
  icon: string;
  skills: Skill[];
}

export interface SkillFilter {
  category?: SkillCategory;
  level?: SkillLevel;
  featured?: boolean;
}

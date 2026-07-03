// ============================================================
// ENUMS
// Application enumerations
// ============================================================

// ============================================================
// PROJECT ENUMS
// ============================================================

export enum ProjectCategoryEnum {
  WEB_APPLICATION = 'web-application',
  MOBILE_APP = 'mobile-app',
  DESKTOP_APP = 'desktop-app',
  API = 'api',
  LIBRARY = 'library',
  OTHER = 'other',
}

export enum ProjectStatusEnum {
  DEVELOPMENT = 'development',
  COMPLETED = 'completed',
  MAINTENANCE = 'maintenance',
  ARCHIVED = 'archived',
}

// ============================================================
// SKILL ENUMS
// ============================================================

export enum SkillCategoryEnum {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  TOOLS = 'tools',
  SOFT_SKILLS = 'soft-skills',
}

export enum SkillLevelEnum {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

// ============================================================
// EXPERIENCE ENUMS
// ============================================================

export enum ExperienceTypeEnum {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum TimelineItemTypeEnum {
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  CERTIFICATION = 'certification',
  ACHIEVEMENT = 'achievement',
}

// ============================================================
// BLOG ENUMS
// ============================================================

export enum BlogCategoryEnum {
  TUTORIAL = 'tutorial',
  NEWS = 'news',
  OPINION = 'opinion',
  CASE_STUDY = 'case-study',
  CAREER = 'career',
  TECHNOLOGY = 'technology',
}

export enum BlogStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

// ============================================================
// MESSAGE ENUMS
// ============================================================

export enum MessageStatusEnum {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived',
}

// ============================================================
// CERTIFICATE ENUMS
// ============================================================

export enum VerificationStatusEnum {
  VERIFIED = 'verified',
  PENDING = 'pending',
  UNVERIFIED = 'unverified',
}

export enum AchievementTypeEnum {
  AWARD = 'award',
  RECOGNITION = 'recognition',
  MILESTONE = 'milestone',
  CONTRIBUTION = 'contribution',
}

// ============================================================
// UI ENUMS
// ============================================================

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  LINK = 'link',
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

export enum InputSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum BadgeVariant {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export enum CardVariant {
  DEFAULT = 'default',
  GLASS = 'glass',
  GLOW = 'glow',
  BORDERED = 'bordered',
}

export enum LoadingVariant {
  SPINNER = 'spinner',
  PULSE = 'pulse',
  SKELETON = 'skeleton',
  BAR = 'bar',
}

// ============================================================
// THEME ENUMS
// ============================================================

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

// ============================================================
// STATUS ENUMS
// ============================================================

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// ============================================================
// API CONSTANTS
// API configuration and endpoint constants
// ============================================================

// ============================================================
// API ENDPOINTS
// ============================================================

export const API_ENDPOINTS = {
  // Profile
  PROFILE: '/api/profile',
  PROFILE_STATS: '/api/profile/stats',

  // Projects
  PROJECTS: '/api/projects',
  PROJECT_BY_ID: (id: string) => `/api/projects/${id}`,
  PROJECT_BY_SLUG: (slug: string) => `/api/projects/slug/${slug}`,
  FEATURED_PROJECTS: '/api/projects/featured',

  // Skills
  SKILLS: '/api/skills',
  SKILL_BY_ID: (id: string) => `/api/skills/${id}`,
  SKILL_CATEGORIES: '/api/skills/categories',

  // Experience
  EXPERIENCES: '/api/experiences',
  EXPERIENCE_BY_ID: (id: string) => `/api/experiences/${id}`,
  EDUCATIONS: '/api/educations',
  EDUCATION_BY_ID: (id: string) => `/api/educations/${id}`,

  // Certificates
  CERTIFICATES: '/api/certificates',  
  CERTIFICATE_BY_ID: (id: string) => `/api/certificates/${id}`,

  // Hero (Home #home) — `/api/admin/hero/*?type=1`, public `/api/public/hero?type=1`
  HERO_ADMIN: '/api/admin/hero',
  HERO_SECTION_PUBLIC: '/api/public/hero',
  HERO_SECTION_CONFIG: '/api/admin/hero/section',
  HERO_SECTION_TYPING: '/api/admin/hero/typing',
  HERO_SECTION_TYPING_BY_ID: (id: string) => `/api/admin/hero/typing/${id}`,
  HERO_SECTION_SOCIAL: '/api/admin/hero/social',
  HERO_SECTION_SOCIAL_BY_ID: (id: string) => `/api/admin/hero/social/${id}`,
  HERO_SECTION_AVATAR: '/api/admin/hero/avatar',
  HERO_SECTION_BUTTONS: '/api/admin/hero/buttons',
  HERO_SECTION_TYPING_STATUS: (id: string) => `/api/admin/hero/typing/${id}/status`,
  HERO_SECTION_SOCIAL_STATUS: (id: string) => `/api/admin/hero/social/${id}/status`,

  // Experience / Career Journey (Home #experience) — `/api/admin/experience/*?type=1`
  EXPERIENCE_ADMIN: '/api/admin/experience',
  EXPERIENCE_PUBLIC: '/api/public/experience',
  EXPERIENCE_SECTION: '/api/admin/experience/section',
  EXPERIENCE_EXPERIENCES: '/api/admin/experience/experiences',
  EXPERIENCE_EXPERIENCE_BY_ID: (id: string) => `/api/admin/experience/experiences/${id}`,

  /** @deprecated Dùng EXPERIENCE_* */
  CAREER_JOURNEY_SECTION: '/api/admin/experience/section',
  CAREER_JOURNEY_PUBLIC: '/api/public/experience',
  CAREER_JOURNEY_EXPERIENCES: '/api/admin/experience/experiences',
  CAREER_JOURNEY_EXPERIENCE_BY_ID: (id: string) => `/api/admin/experience/experiences/${id}`,

  // Educational (Home #career) — `/api/admin/educational/*?type=1`, public `/api/public/educational?type=1`
  EDUCATIONAL_ADMIN: '/api/admin/educational',
  EDUCATIONAL_PUBLIC: '/api/public/educational',
  EDUCATIONAL_SECTION: '/api/admin/educational/section',
  EDUCATIONAL_HIGHLIGHTS: '/api/admin/educational/highlights',
  EDUCATIONAL_HIGHLIGHT_BY_ID: (id: string) => `/api/admin/educational/highlights/${id}`,
  EDUCATIONAL_TIMELINE: '/api/admin/educational/timeline',
  EDUCATIONAL_TIMELINE_BY_ID: (id: string) => `/api/admin/educational/timeline/${id}`,
  EDUCATIONAL_CERTIFICATES: '/api/admin/educational/certificates',
  EDUCATIONAL_CERTIFICATE_BY_ID: (id: string) => `/api/admin/educational/certificates/${id}`,
  EDUCATIONAL_FUTURE_GOALS: '/api/admin/educational/future-goals',
  EDUCATIONAL_FUTURE_GOAL_BY_ID: (id: string) => `/api/admin/educational/future-goals/${id}`,

  // Skills / Tech Stack (Home #skills) — `/api/admin/skills/*?type=1`
  SKILLS_ADMIN: '/api/admin/skills',
  SKILLS_PUBLIC: '/api/public/skills',
  SKILLS_SECTION: '/api/admin/skills/section',
  SKILLS_STATISTICS: '/api/admin/skills/statistics',
  SKILLS_STATISTIC_BY_ID: (id: string) => `/api/admin/skills/statistics/${id}`,
  SKILLS_CATEGORIES: '/api/admin/skills/categories',
  SKILLS_CATEGORY_BY_ID: (id: string) => `/api/admin/skills/categories/${id}`,
  SKILLS_ITEMS: '/api/admin/skills/skills',
  SKILLS_ITEM_BY_ID: (id: string) => `/api/admin/skills/skills/${id}`,

  /** @deprecated Dùng SKILLS_* */
  TECH_STACK_SECTION: '/api/admin/skills/section',
  TECH_STACK_PUBLIC: '/api/public/skills',
  TECH_STACK_STATISTICS: '/api/admin/skills/statistics',
  TECH_STACK_STATISTIC_BY_ID: (id: string) => `/api/admin/skills/statistics/${id}`,
  TECH_STACK_CATEGORIES: '/api/admin/skills/categories',
  TECH_STACK_CATEGORY_BY_ID: (id: string) => `/api/admin/skills/categories/${id}`,
  TECH_STACK_SKILLS: '/api/admin/skills/skills',
  TECH_STACK_SKILL_BY_ID: (id: string) => `/api/admin/skills/skills/${id}`,

  // Projects / Featured Projects (Home #projects) — `/api/admin/projects/*?type=1`
  PROJECTS_ADMIN: '/api/admin/projects',
  PROJECTS_PUBLIC: '/api/public/projects',
  PROJECTS_SECTION: '/api/admin/projects/section',
  PROJECTS_FILTERS: '/api/admin/projects/filters',
  PROJECTS_FILTER_BY_ID: (id: string) => `/api/admin/projects/filters/${id}`,
  PROJECTS_ITEMS: '/api/admin/projects/projects',
  PROJECTS_ITEM_BY_ID: (id: string) => `/api/admin/projects/projects/${id}`,

  /** @deprecated Dùng PROJECTS_* */
  FEATURED_PROJECTS_SECTION: '/api/admin/projects/section',
  FEATURED_PROJECTS_PUBLIC: '/api/public/projects',
  FEATURED_PROJECTS_FILTERS: '/api/admin/projects/filters',
  FEATURED_PROJECTS_FILTER_BY_ID: (id: string) => `/api/admin/projects/filters/${id}`,
  FEATURED_PROJECTS_ITEMS: '/api/admin/projects/projects',
  FEATURED_PROJECTS_ITEM_BY_ID: (id: string) => `/api/admin/projects/projects/${id}`,

  // Contact (Home #contact) — `/api/admin/contact/*?type=1`
  CONTACT_ADMIN: '/api/admin/contact',
  CONTACT_PUBLIC: '/api/public/contact',
  CONTACT_SECTION: '/api/admin/contact/section',
  CONTACT_INFO: '/api/admin/contact/info',
  CONTACT_INFO_BY_ID: (id: string) => `/api/admin/contact/info/${id}`,
  CONTACT_SOCIAL: '/api/admin/contact/social',
  CONTACT_SOCIAL_BY_ID: (id: string) => `/api/admin/contact/social/${id}`,
  CONTACT_MAP: '/api/admin/contact/map',
  CONTACT_CTA: '/api/admin/contact/cta',
  CONTACT_FORM: '/api/admin/contact/form',

  /** @deprecated Dùng CONTACT_* */
  CONTACT_SECTION_CONFIG: '/api/admin/contact/section',
  CONTACT_SECTION_PUBLIC: '/api/public/contact',
  CONTACT_SECTION_INFO: '/api/admin/contact/info',
  CONTACT_SECTION_INFO_BY_ID: (id: string) => `/api/admin/contact/info/${id}`,
  CONTACT_SECTION_SOCIAL: '/api/admin/contact/social',
  CONTACT_SECTION_SOCIAL_BY_ID: (id: string) => `/api/admin/contact/social/${id}`,
  CONTACT_SECTION_MAP: '/api/admin/contact/map',
  CONTACT_SECTION_CTA: '/api/admin/contact/cta',
  CONTACT_SECTION_FORM: '/api/admin/contact/form',

  // Footer (Home footer) — `/api/admin/footer/*?type=1`
  FOOTER_ADMIN: '/api/admin/footer',
  FOOTER_PUBLIC: '/api/public/footer',
  FOOTER_BRAND: '/api/admin/footer/brand',
  FOOTER_QUICK_LINKS: '/api/admin/footer/quick-links',
  FOOTER_QUICK_LINK_BY_ID: (id: string) => `/api/admin/footer/quick-links/${id}`,
  FOOTER_SERVICES: '/api/admin/footer/services',
  FOOTER_SERVICE_BY_ID: (id: string) => `/api/admin/footer/services/${id}`,
  FOOTER_CONTACT: '/api/admin/footer/contact',
  FOOTER_CONTACT_BY_ID: (id: string) => `/api/admin/footer/contact/${id}`,
  FOOTER_SOCIAL: '/api/admin/footer/social',
  FOOTER_SOCIAL_BY_ID: (id: string) => `/api/admin/footer/social/${id}`,
  FOOTER_TECH_BADGES: '/api/admin/footer/tech-badges',
  FOOTER_TECH_BADGE_BY_ID: (id: string) => `/api/admin/footer/tech-badges/${id}`,

  /** @deprecated Dùng FOOTER_* */
  FOOTER_SECTION_BRAND: '/api/admin/footer/brand',
  FOOTER_SECTION_PUBLIC: '/api/public/footer',
  FOOTER_SECTION_QUICK_LINKS: '/api/admin/footer/quick-links',
  FOOTER_SECTION_QUICK_LINK_BY_ID: (id: string) => `/api/admin/footer/quick-links/${id}`,
  FOOTER_SECTION_SERVICES: '/api/admin/footer/services',
  FOOTER_SECTION_SERVICE_BY_ID: (id: string) => `/api/admin/footer/services/${id}`,
  FOOTER_SECTION_CONTACT: '/api/admin/footer/contact',
  FOOTER_SECTION_CONTACT_BY_ID: (id: string) => `/api/admin/footer/contact/${id}`,
  FOOTER_SECTION_SOCIAL: '/api/admin/footer/social',
  FOOTER_SECTION_SOCIAL_BY_ID: (id: string) => `/api/admin/footer/social/${id}`,
  FOOTER_SECTION_TECH: '/api/admin/footer/tech-badges',
  FOOTER_SECTION_TECH_BY_ID: (id: string) => `/api/admin/footer/tech-badges/${id}`,

  // Blog
  BLOG_POSTS: '/api/blog',
  BLOG_POST_BY_ID: (id: string) => `/api/blog/${id}`,
  BLOG_POST_BY_SLUG: (slug: string) => `/api/blog/slug/${slug}`,
  FEATURED_BLOG_POSTS: '/api/blog/featured',
  BLOG_CATEGORIES: '/api/blog/categories',
  BLOG_TAGS: '/api/blog/tags',

  // Contact
  CONTACT: '/api/contact',
  MESSAGES: '/api/messages',
  MESSAGE_BY_ID: (id: string) => `/api/messages/${id}`,

  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_ME: '/api/auth/me',

  // Upload
  UPLOAD_IMAGE: '/api/upload/image',
  UPLOAD_FILE: '/api/upload/file',
} as const;

// ============================================================
// API CONFIG
// ============================================================

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// ============================================================
// HTTP STATUS CODES
// ============================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ============================================================
// ERROR CODES
// ============================================================

export const ERROR_CODES = {
  // Auth errors
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const;

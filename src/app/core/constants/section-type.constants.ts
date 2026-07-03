// ============================================================
// SECTION TYPE CONSTANTS
// `type` = phiên bản/schema API (hiện tại luôn 1).
// Phân biệt section bằng path endpoint (/api/admin/hero, /api/admin/educational, …).
// ============================================================

/** Giá trị `type` gửi kèm mọi request section (query + body). */
export const SECTION_API_TYPE = 1 as const;

export type SectionApiType = typeof SECTION_API_TYPE;

export const SECTION_MODULE_LABELS = {
  hero: 'Hero',
  educational: 'Educational',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  contact: 'Contact',
  footer: 'Footer',
} as const;

export const HERO_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.hero;
export const EDUCATIONAL_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.educational;
export const EXPERIENCE_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.experience;
export const SKILLS_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.skills;
export const PROJECTS_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.projects;
export const CONTACT_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.contact;
export const FOOTER_SECTION_TYPE_LABEL = SECTION_MODULE_LABELS.footer;

/** Alias theo module — cùng giá trị 1, path endpoint khác nhau */
export const HERO_SECTION_TYPE = SECTION_API_TYPE;
export const EDUCATIONAL_SECTION_TYPE = SECTION_API_TYPE;
export const EXPERIENCE_SECTION_TYPE = SECTION_API_TYPE;
export const SKILLS_SECTION_TYPE = SECTION_API_TYPE;
export const PROJECTS_SECTION_TYPE = SECTION_API_TYPE;
export const CONTACT_SECTION_TYPE = SECTION_API_TYPE;
export const FOOTER_SECTION_TYPE = SECTION_API_TYPE;

/** @deprecated Dùng SECTION_API_TYPE — giữ alias tương thích */
export const SECTION_TYPES = {
  HERO: SECTION_API_TYPE,
  EDUCATIONAL: SECTION_API_TYPE,
  EXPERIENCE: SECTION_API_TYPE,
  SKILLS: SECTION_API_TYPE,
  PROJECTS: SECTION_API_TYPE,
  CONTACT: SECTION_API_TYPE,
  FOOTER: SECTION_API_TYPE,
} as const;

export type SectionTypeCode = SectionApiType;

/** Query param cho GET requests — vd. `?type=1` */
export function sectionTypeQuery(): { type: string } {
  return { type: String(SECTION_API_TYPE) };
}

/** Body field bắt buộc cho POST/PUT/PATCH */
export function withSectionType<T extends object>(payload: T): T & { type: SectionApiType } {
  return { type: SECTION_API_TYPE, ...payload };
}

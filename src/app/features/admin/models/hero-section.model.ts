// ============================================================
// HERO SECTION MODELS
// Section HERO trên Home (#home) — API type = 1
// ============================================================

import type { TechButtonBorderBeam, TechButtonVariant } from '../../../shared/components/tech-button/tech-button.component';
import { HERO_SECTION_TYPE, HERO_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

/** Type code cố định cho màn Hero — gửi kèm mọi API request/response */
export const HERO_SECTION_TYPE_CODE = HERO_SECTION_TYPE;
export { HERO_SECTION_TYPE_LABEL };

export interface HeroSectionConfig {
  type: typeof HERO_SECTION_TYPE;
  greeting: string;
  nameText: string;
  nameAccent: string;
  description: string;
  typingPrefix: string;
}

export interface HeroAvatarConfig {
  type: typeof HERO_SECTION_TYPE;
  imageUrl: string;
  alt: string;
  fallbackInitials: string;
  isActive: boolean;
}

export interface HeroButtonsConfig {
  type: typeof HERO_SECTION_TYPE;
  contactLabel: string;
  /** Section id không có # — vd. `contact` → scroll tới `#contact` */
  contactScrollTarget: string;
  contactVariant: TechButtonVariant;
  contactBorderBeam: TechButtonBorderBeam;
  contactEnabled: boolean;
  cvLabel: string;
  cvUrl: string;
  cvVariant: TechButtonVariant;
  cvBorderBeam: TechButtonBorderBeam;
  cvEnabled: boolean;
}

export interface HeroSocialLink {
  id: string;
  type: typeof HERO_SECTION_TYPE;
  name: string;
  icon: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HeroSocialFormData {
  type: typeof HERO_SECTION_TYPE;
  name: string;
  icon: string;
  url: string;
  sortOrder: number;
}

export interface HeroTypingLine {
  id: string;
  type: typeof HERO_SECTION_TYPE;
  text: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HeroTypingFormData {
  type: typeof HERO_SECTION_TYPE;
  text: string;
  sortOrder: number;
}

export type HeroSectionTab = 'section' | 'typing' | 'social' | 'actions';

export const HERO_SECTION_TAB_KEYS: HeroSectionTab[] = ['section', 'typing', 'social', 'actions'];

export const HERO_SECTION_TABS: { key: HeroSectionTab; label: string; description: string }[] = [
  { key: 'section', label: 'Section Config', description: 'Greeting, name, description, avatar' },
  { key: 'typing', label: 'Typing effect', description: 'Rotating typed text lines' },
  { key: 'social', label: 'Social badges', description: 'Icon + link snake border animation' },
  { key: 'actions', label: 'Action buttons', description: 'Contact Me scroll + Download CV' },
];

export const DEFAULT_HERO_SECTION: HeroSectionConfig = {
  type: HERO_SECTION_TYPE,
  greeting: 'Xin chào, tôi là',
  nameText: 'HOANG SY ',
  nameAccent: 'YEN',
  description:
    'Chuyên gia phát triển Full Stack với 3+ năm kinh nghiệm. Đam mê xây dựng các ứng dụng web hiện đại, có khả năng mở rộng và dễ bảo trì. Thành thạo Angular, Spring Boot và PostgreSQL.',
  typingPrefix: '| ',
};

export const DEFAULT_HERO_AVATAR: HeroAvatarConfig = {
  type: HERO_SECTION_TYPE,
  imageUrl: '/assets/images/avatar.jpg',
  alt: 'Hoang Sy Yen',
  fallbackInitials: 'YHS',
  isActive: true,
};

export const DEFAULT_HERO_BUTTONS: HeroButtonsConfig = {
  type: HERO_SECTION_TYPE,
  contactLabel: 'Contact Me',
  contactScrollTarget: 'contact',
  contactVariant: 'outline',
  contactBorderBeam: 'cw',
  contactEnabled: true,
  cvLabel: 'Download CV',
  cvUrl: '/assets/cv/hoang-sy-yen-cv.pdf',
  cvVariant: 'glow',
  cvBorderBeam: 'contour',
  cvEnabled: true,
};

export const MOCK_HERO_TYPING_LINES: HeroTypingLine[] = [
  { id: '1', type: HERO_SECTION_TYPE, text: 'Software Engineer', sortOrder: 1, isActive: true },
  { id: '2', type: HERO_SECTION_TYPE, text: 'Full Stack Developer', sortOrder: 2, isActive: true },
  { id: '3', type: HERO_SECTION_TYPE, text: 'Backend Developer', sortOrder: 3, isActive: true },
  { id: '4', type: HERO_SECTION_TYPE, text: 'Problem Solver', sortOrder: 4, isActive: true },
  { id: '5', type: HERO_SECTION_TYPE, text: 'Tech Enthusiast', sortOrder: 5, isActive: true },
];

export const MOCK_HERO_SOCIAL_LINKS: HeroSocialLink[] = [
  {
    id: '1',
    type: HERO_SECTION_TYPE,
    name: 'GitHub',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    url: 'https://github.com',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    type: HERO_SECTION_TYPE,
    name: 'Facebook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
    url: 'https://facebook.com',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    type: HERO_SECTION_TYPE,
    name: 'Instagram',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    url: 'https://instagram.com',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    type: HERO_SECTION_TYPE,
    name: 'LinkedIn',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    url: 'https://linkedin.com',
    sortOrder: 4,
    isActive: true,
  },
];

export const HERO_BUTTON_VARIANTS: TechButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'link', 'glow'];
export const HERO_BUTTON_BORDER_BEAMS: TechButtonBorderBeam[] = ['none', 'cw', 'ccw', 'contour', 'pulse', 'diagonal'];

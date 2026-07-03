// ============================================================
// FOOTER SECTION MODELS
// Footer on Home (bottom of page) — API type = 1 (endpoint /api/admin/footer)
// ============================================================

import { FOOTER_SECTION_TYPE, FOOTER_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

export const FOOTER_SECTION_TYPE_CODE = FOOTER_SECTION_TYPE;
export { FOOTER_SECTION_TYPE_LABEL };

export interface FooterBrandConfig {
  type: typeof FOOTER_SECTION_TYPE;
  logoIcon: string;
  logoText: string;
  logoAccent: string;
  description: string;
}

export interface FooterColumnTitles {
  type: typeof FOOTER_SECTION_TYPE;
  quickLinksTitle: string;
  servicesTitle: string;
  contactTitle: string;
}

export interface FooterDividerConfig {
  type: typeof FOOTER_SECTION_TYPE;
  icon: string;
  isActive: boolean;
}

export interface FooterTechConfig {
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
}

export interface FooterBottomConfig {
  type: typeof FOOTER_SECTION_TYPE;
  /** Use `{year}` placeholder for current year */
  copyrightTemplate: string;
  madeWithText: string;
  showBackToTop: boolean;
  backToTopThreshold: number;
}

export interface FooterLinkItem {
  id: string;
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterLinkFormData {
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
  href: string;
  sortOrder: number;
}

export interface FooterServiceItem {
  id: string;
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterServiceFormData {
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
  href: string;
  sortOrder: number;
}

export interface FooterContactItem {
  id: string;
  type: typeof FOOTER_SECTION_TYPE;
  icon: string;
  text: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterContactFormData {
  type: typeof FOOTER_SECTION_TYPE;
  icon: string;
  text: string;
  link: string;
  sortOrder: number;
}

export interface FooterSocialItem {
  id: string;
  type: typeof FOOTER_SECTION_TYPE;
  name: string;
  url: string;
  iconSvg: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterSocialFormData {
  type: typeof FOOTER_SECTION_TYPE;
  name: string;
  url: string;
  iconSvg: string;
  sortOrder: number;
}

export interface FooterTechBadge {
  id: string;
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterTechBadgeFormData {
  type: typeof FOOTER_SECTION_TYPE;
  label: string;
  sortOrder: number;
}

export type FooterSectionTab =
  | 'brand'
  | 'quick-links'
  | 'services'
  | 'contact'
  | 'social'
  | 'tech-stack';

export const FOOTER_SECTION_TAB_KEYS: FooterSectionTab[] = [
  'brand',
  'quick-links',
  'services',
  'contact',
  'social',
  'tech-stack',
];

const SVG_GITHUB =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
const SVG_LINKEDIN =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
const SVG_FACEBOOK =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
const SVG_EMAIL =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

export const DEFAULT_FOOTER_BRAND: FooterBrandConfig = {
  type: FOOTER_SECTION_TYPE,
  logoIcon: 'Y',
  logoText: 'YHS',
  logoAccent: '.DEV',
  description:
    'Software Engineer specializing in building exceptional digital experiences. Passionate about Angular, Spring Boot, and modern web technologies.',
};

export const DEFAULT_FOOTER_COLUMN_TITLES: FooterColumnTitles = {
  type: FOOTER_SECTION_TYPE,
  quickLinksTitle: 'Quick Links',
  servicesTitle: 'Services',
  contactTitle: 'Contact',
};

export const DEFAULT_FOOTER_DIVIDER: FooterDividerConfig = {
  type: FOOTER_SECTION_TYPE,
  icon: '⚡',
  isActive: true,
};

export const DEFAULT_FOOTER_TECH: FooterTechConfig = {
  type: FOOTER_SECTION_TYPE,
  label: 'Built with:',
};

export const DEFAULT_FOOTER_BOTTOM: FooterBottomConfig = {
  type: FOOTER_SECTION_TYPE,
  copyrightTemplate: '© {year} YHS.DEV. All rights reserved.',
  madeWithText: 'Made with ❤️ and Angular',
  showBackToTop: true,
  backToTopThreshold: 500,
};

export const MOCK_FOOTER_QUICK_LINKS: FooterLinkItem[] = [
  { id: '1', type: FOOTER_SECTION_TYPE, label: 'Home', href: '#home', sortOrder: 1, isActive: true },
  { id: '2', type: FOOTER_SECTION_TYPE, label: 'Career', href: '#career', sortOrder: 2, isActive: true },
  { id: '3', type: FOOTER_SECTION_TYPE, label: 'Skills', href: '#skills', sortOrder: 3, isActive: true },
  { id: '4', type: FOOTER_SECTION_TYPE, label: 'Experience', href: '#experience', sortOrder: 4, isActive: true },
  { id: '5', type: FOOTER_SECTION_TYPE, label: 'Projects', href: '#projects', sortOrder: 5, isActive: true },
  { id: '6', type: FOOTER_SECTION_TYPE, label: 'Contact', href: '#contact', sortOrder: 6, isActive: true },
];

export const MOCK_FOOTER_SERVICES: FooterServiceItem[] = [
  { id: '1', type: FOOTER_SECTION_TYPE, label: 'Web Development', href: '#', sortOrder: 1, isActive: true },
  { id: '2', type: FOOTER_SECTION_TYPE, label: 'API Development', href: '#', sortOrder: 2, isActive: true },
  { id: '3', type: FOOTER_SECTION_TYPE, label: 'Database Design', href: '#', sortOrder: 3, isActive: true },
  { id: '4', type: FOOTER_SECTION_TYPE, label: 'DevOps & CI/CD', href: '#', sortOrder: 4, isActive: true },
  { id: '5', type: FOOTER_SECTION_TYPE, label: 'Technical Consulting', href: '#', sortOrder: 5, isActive: true },
];

export const MOCK_FOOTER_CONTACT: FooterContactItem[] = [
  {
    id: '1',
    type: FOOTER_SECTION_TYPE,
    icon: '📧',
    text: 'yenhs.dev@gmail.com',
    link: 'mailto:yenhs.dev@gmail.com',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    type: FOOTER_SECTION_TYPE,
    icon: '📱',
    text: '+84 123 456 789',
    link: 'tel:+84123456789',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    type: FOOTER_SECTION_TYPE,
    icon: '📍',
    text: 'Hà Nội, Việt Nam',
    link: '',
    sortOrder: 3,
    isActive: true,
  },
];

export const MOCK_FOOTER_SOCIAL: FooterSocialItem[] = [
  { id: '1', type: FOOTER_SECTION_TYPE, name: 'GitHub', url: 'https://github.com/hungnv', iconSvg: SVG_GITHUB, sortOrder: 1, isActive: true },
  { id: '2', type: FOOTER_SECTION_TYPE, name: 'LinkedIn', url: 'https://linkedin.com/in/hungnv', iconSvg: SVG_LINKEDIN, sortOrder: 2, isActive: true },
  { id: '3', type: FOOTER_SECTION_TYPE, name: 'Facebook', url: 'https://facebook.com/hungnv', iconSvg: SVG_FACEBOOK, sortOrder: 3, isActive: true },
  { id: '4', type: FOOTER_SECTION_TYPE, name: 'Email', url: 'mailto:yenhs.dev@gmail.com', iconSvg: SVG_EMAIL, sortOrder: 4, isActive: true },
];

export const MOCK_FOOTER_TECH_BADGES: FooterTechBadge[] = [
  { id: '1', type: FOOTER_SECTION_TYPE, label: 'Angular', sortOrder: 1, isActive: true },
  { id: '2', type: FOOTER_SECTION_TYPE, label: 'Spring Boot', sortOrder: 2, isActive: true },
  { id: '3', type: FOOTER_SECTION_TYPE, label: 'PostgreSQL', sortOrder: 3, isActive: true },
  { id: '4', type: FOOTER_SECTION_TYPE, label: 'Docker', sortOrder: 4, isActive: true },
  { id: '5', type: FOOTER_SECTION_TYPE, label: 'TypeScript', sortOrder: 5, isActive: true },
  { id: '6', type: FOOTER_SECTION_TYPE, label: 'Java', sortOrder: 6, isActive: true },
];

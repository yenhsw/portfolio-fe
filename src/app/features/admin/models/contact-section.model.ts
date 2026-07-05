// ============================================================
// CONTACT SECTION MODELS
// Section CONTACT trên Home (#contact) — API type = 1 (endpoint /api/admin/contact)
// ============================================================

import { CONTACT_SECTION_TYPE, CONTACT_SECTION_TYPE_LABEL } from '../../../core/constants/section-type.constants';

export const CONTACT_SECTION_TYPE_CODE = CONTACT_SECTION_TYPE;
export { CONTACT_SECTION_TYPE_LABEL };

export interface ContactSectionConfig {
  type: typeof CONTACT_SECTION_TYPE;
  sectionTag: string;
  titleAccent: string;
  titleText: string;
  subtitle: string;
  infoTitle: string;
  formTitle: string;
  socialTitle: string;
}

export interface ContactMapConfig {
  type: typeof CONTACT_SECTION_TYPE;
  icon: string;
  text: string;
  googleMapUrl: string;
  isActive: boolean;
}

export interface ContactCtaConfig {
  type: typeof CONTACT_SECTION_TYPE;
  title: string;
  description: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
  isActive: boolean;
}

export interface ContactFormSettings {
  type: typeof CONTACT_SECTION_TYPE;
  enabled: boolean;
  messageMaxLength: number;
  successMessage: string;
}

export interface ContactInfoItem {
  id: string;
  type: typeof CONTACT_SECTION_TYPE;
  label: string;
  value: string;
  link: string;
  iconSvg: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactInfoFormData {
  type: typeof CONTACT_SECTION_TYPE;
  label: string;
  value: string;
  link: string;
  iconSvg: string;
  sortOrder: number;
}

export interface ContactSocialItem {
  id: string;
  type: typeof CONTACT_SECTION_TYPE;
  name: string;
  url: string;
  color: string;
  iconSvg: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactSocialFormData {
  type: typeof CONTACT_SECTION_TYPE;
  name: string;
  url: string;
  color: string;
  iconSvg: string;
  sortOrder: number;
}

/** SMTP gửi mail — GET response (không trả password) */
export interface ContactMailSendConfig {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPasswordConfigured: boolean;
  fromEmail: string;
  subjectPrefix: string;
  defaultEncoding: string;
  smtpAuth: boolean;
  startTlsEnable: boolean;
}

/** SMTP gửi mail — PUT body (`smtpPassword` tùy chọn khi cập nhật) */
export interface ContactMailSendFormData {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  subjectPrefix: string;
  defaultEncoding: string;
  smtpAuth: boolean;
  startTlsEnable: boolean;
}

/** Email nhận thông báo contact — theo type */
export interface ContactMailReceiveConfig {
  type: typeof CONTACT_SECTION_TYPE;
  notificationEmail: string;
}

export interface ContactSubmitRequest {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactSubmitResponse {
  id: string;
  createdAt: string;
}

export type ContactSectionTab = 'section' | 'contact-info' | 'social' | 'settings' | 'mail';

export const CONTACT_SECTION_TAB_KEYS: ContactSectionTab[] = ['section', 'contact-info', 'social', 'settings', 'mail'];

export const CONTACT_SECTION_TABS: { key: ContactSectionTab; label: string; description: string }[] = [
  { key: 'section', label: 'Section Config', description: 'Tag, LET\'S BUILD heading' },
  { key: 'contact-info', label: 'Contact info', description: 'Email, Phone, Location...' },
  { key: 'social', label: 'Social links', description: 'GitHub, LinkedIn, Facebook...' },
  { key: 'settings', label: 'Map, CTA & Form', description: 'Map, bottom CTA, form settings' },
  { key: 'mail', label: 'Email config', description: 'SMTP send + notification receive' },
];

const SVG_EMAIL =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
const SVG_PHONE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const SVG_LOCATION =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
const SVG_GLOBE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
const SVG_GITHUB =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
const SVG_LINKEDIN =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
const SVG_FACEBOOK =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

export const DEFAULT_CONTACT_SECTION: ContactSectionConfig = {
  type: CONTACT_SECTION_TYPE,
  sectionTag: 'Get In Touch',
  titleAccent: "LET'S BUILD",
  titleText: 'SOMETHING AMAZING',
  subtitle:
    "Feel free to contact me anytime. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.",
  infoTitle: 'Contact Information',
  formTitle: 'Send Me a Message',
  socialTitle: 'Connect With Me',
};

export const DEFAULT_CONTACT_MAP: ContactMapConfig = {
  type: CONTACT_SECTION_TYPE,
  icon: '📍',
  text: 'Ho Chi Minh City, Vietnam',
  googleMapUrl: '',
  isActive: true,
};

export const DEFAULT_CONTACT_CTA: ContactCtaConfig = {
  type: CONTACT_SECTION_TYPE,
  title: "Let's Build Something Together",
  description:
    "I'm passionate about creating exceptional digital experiences. Let's collaborate and bring your ideas to life.",
  primaryLabel: 'Hire Me',
  primaryLink: '#contact',
  secondaryLabel: 'Download CV',
  secondaryLink: '#',
  isActive: true,
};

export const DEFAULT_CONTACT_FORM: ContactFormSettings = {
  type: CONTACT_SECTION_TYPE,
  enabled: true,
  messageMaxLength: 500,
  successMessage: 'Your message has been sent successfully!',
};

export const DEFAULT_CONTACT_MAIL_SEND: ContactMailSendConfig = {
  enabled: false,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUsername: '',
  smtpPasswordConfigured: false,
  fromEmail: '',
  subjectPrefix: '[Portfolio Contact]',
  defaultEncoding: 'UTF-8',
  smtpAuth: true,
  startTlsEnable: true,
};

export const DEFAULT_CONTACT_MAIL_RECEIVE: ContactMailReceiveConfig = {
  type: CONTACT_SECTION_TYPE,
  notificationEmail: '',
};

export const MOCK_CONTACT_INFO: ContactInfoItem[] = [
  {
    id: '1',
    type: CONTACT_SECTION_TYPE,
    label: 'Email',
    value: 'yenhs.dev@gmail.com',
    link: 'mailto:yenhs.dev@gmail.com',
    iconSvg: SVG_EMAIL,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    type: CONTACT_SECTION_TYPE,
    label: 'Phone',
    value: '+84 123 456 789',
    link: 'tel:+84123456789',
    iconSvg: SVG_PHONE,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    type: CONTACT_SECTION_TYPE,
    label: 'Location',
    value: 'Ho Chi Minh City, Vietnam',
    link: '',
    iconSvg: SVG_LOCATION,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    type: CONTACT_SECTION_TYPE,
    label: 'Portfolio',
    value: 'yenhs.dev',
    link: 'https://yenhs.dev',
    iconSvg: SVG_GLOBE,
    sortOrder: 4,
    isActive: true,
  },
];

export const MOCK_CONTACT_SOCIAL: ContactSocialItem[] = [
  {
    id: '1',
    type: CONTACT_SECTION_TYPE,
    name: 'GitHub',
    url: 'https://github.com/yenhs',
    color: '#ffffff',
    iconSvg: SVG_GITHUB,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    type: CONTACT_SECTION_TYPE,
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yenhs',
    color: '#0077b5',
    iconSvg: SVG_LINKEDIN,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    type: CONTACT_SECTION_TYPE,
    name: 'Facebook',
    url: 'https://facebook.com/yenhs',
    color: '#1877f2',
    iconSvg: SVG_FACEBOOK,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    type: CONTACT_SECTION_TYPE,
    name: 'Email',
    url: 'mailto:yenhs.dev@gmail.com',
    color: '#ea4335',
    iconSvg: SVG_EMAIL,
    sortOrder: 4,
    isActive: true,
  },
];

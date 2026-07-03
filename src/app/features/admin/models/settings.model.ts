// ============================================================
// SETTINGS MODELS
// Website Configuration Data Types
// ============================================================

export type ThemeMode = 'dark' | 'light' | 'auto';

export interface LogoSettings {
  primary: string;
  dark: string;
  light: string;
  favicon: string;
  appleTouchIcon: string;
}

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
}

export interface HeroSettings {
  background: string;
  gradient: string;
  glow: boolean;
  animation: 'fade' | 'slide' | 'zoom' | 'none';
  showCTA: boolean;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  portfolio: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  googleMapUrl: string;
  businessHours: string;
}

export interface AnalyticsSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  microsoftClarityId: string;
}

export interface AnimationSettings {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
  glowIntensity: 'low' | 'medium' | 'high';
  borderBeamSpeed: 'slow' | 'normal' | 'fast';
  scrollDuration: number;
  typingSpeed: number;
  floatingSpeed: number;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  comingSoon: boolean;
  enableBlog: boolean;
  enableContactForm: boolean;
  enableDownloadCV: boolean;
}

export interface WebsiteSettings {
  // General
  name: string;
  title: string;
  description: string;
  companyName: string;
  copyright: string;
  language: string;
  timezone: string;

  // Logo
  logo: LogoSettings;

  // Appearance
  colors: ColorSettings;
  theme: ThemeMode;
  borderRadius: number;
  glassEffect: boolean;
  shadow: boolean;
  glow: boolean;

  // Hero
  hero: HeroSettings;

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  twitterImage: string;
  robots: string;

  // Social
  social: SocialLinks;

  // Contact
  contact: ContactSettings;

  // Analytics
  analytics: AnalyticsSettings;

  // Animation
  animation: AnimationSettings;

  // System
  system: SystemSettings;

  // Meta
  updatedAt: string;
}

export const DEFAULT_SETTINGS: WebsiteSettings = {
  // General
  name: 'YHS.DEV',
  title: 'Hoang Sy Yen - Full Stack Developer',
  description: 'Personal portfolio — Full Stack Developer specializing in Angular, Spring Boot, and PostgreSQL.',
  companyName: 'Hoang Sy Yen',
  copyright: '© 2026 Hoang Sy Yen. All rights reserved.',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',

  // Logo
  logo: {
    primary: 'https://ui-avatars.com/api/?name=JD&background=a855f7&color=fff&size=128',
    dark: 'https://ui-avatars.com/api/?name=JD&background=a855f7&color=fff&size=128',
    light: 'https://ui-avatars.com/api/?name=JD&background=a855f7&color=fff&size=128',
    favicon: 'https://ui-avatars.com/api/?name=JD&background=a855f7&color=fff&size=32',
    appleTouchIcon: 'https://ui-avatars.com/api/?name=JD&background=a855f7&color=fff&size=180',
  },

  // Appearance
  colors: {
    primary: '#a855f7',
    secondary: '#6366f1',
    accent: '#ec4899',
    background: '#0a0f1a',
    surface: '#0f1629',
    border: '#1e293b',
  },
  theme: 'dark',
  borderRadius: 12,
  glassEffect: true,
  shadow: true,
  glow: true,

  // Hero
  hero: {
    background: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
    glow: true,
    animation: 'fade',
    showCTA: true,
  },

  // SEO
  metaTitle: 'Hoang Sy Yen - Full Stack Developer',
  metaDescription: 'Full Stack Developer portfolio — Angular, Spring Boot, PostgreSQL. Building modern, scalable web applications.',
  keywords: ['portfolio', 'full stack', 'angular', 'spring boot', 'developer', 'vietnam'],
  canonicalUrl: 'https://yhs.dev',
  ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop',
  twitterImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
  robots: 'index, follow',

  // Social
  social: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    facebook: '',
    instagram: '',
    youtube: 'https://youtube.com/@johndoe',
    tiktok: '',
    twitter: 'https://twitter.com/johndoe',
    portfolio: '',
  },

  // Contact
  contact: {
    email: 'contact@johndoe.dev',
    phone: '+1 234 567 890',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    googleMapUrl: 'https://maps.google.com/?q=Silicon+Valley',
    businessHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleTagManagerId: 'GTM-XXXXXXX',
    facebookPixelId: '',
    microsoftClarityId: '',
  },

  // Animation
  animation: {
    enabled: true,
    speed: 'normal',
    glowIntensity: 'medium',
    borderBeamSpeed: 'normal',
    scrollDuration: 500,
    typingSpeed: 50,
    floatingSpeed: 3,
  },

  // System
  system: {
    maintenanceMode: false,
    comingSoon: false,
    enableBlog: true,
    enableContactForm: true,
    enableDownloadCV: true,
  },

  updatedAt: new Date().toISOString(),
};

export const TIMEZONES = [
  'Asia/Ho_Chi_Minh',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Asia/Dubai',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
];

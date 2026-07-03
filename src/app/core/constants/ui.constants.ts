// ============================================================
// UI CONSTANTS
// Theme colors and UI-related constants
// ============================================================

// ============================================================
// COLORS
// ============================================================

export const COLORS = {
  // Background
  BG_PRIMARY: '#000000',
  BG_SECONDARY: '#0a0e17',
  BG_TERTIARY: '#0f1623',
  BG_ELEVATED: '#151c2c',

  // Accent
  ACCENT_PRIMARY: '#00f5ff',
  ACCENT_SECONDARY: '#00d4e4',
  ACCENT_TERTIARY: '#00b8c7',

  // Glow
  GLOW_PRIMARY: 'rgba(0, 245, 255, 0.4)',
  GLOW_SECONDARY: 'rgba(0, 245, 255, 0.25)',
  GLOW_TERTIARY: 'rgba(0, 245, 255, 0.15)',

  // Text
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#a0aec0',
  TEXT_TERTIARY: '#718096',

  // Border
  BORDER_DEFAULT: 'rgba(255, 255, 255, 0.08)',
  BORDER_ACCENT: 'rgba(0, 245, 255, 0.3)',

  // Status
  SUCCESS: '#00ff88',
  WARNING: '#ffb800',
  ERROR: '#ff4757',
  INFO: '#00d4ff',
} as const;

// ============================================================
// BREAKPOINTS
// ============================================================

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// ============================================================
// Z-INDEX
// ============================================================

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const;

// ============================================================
// LAYOUT
// ============================================================

export const LAYOUT = {
  NAVBAR_HEIGHT: 80,
  NAVBAR_HEIGHT_MOBILE: 64,
  SECTION_PADDING_Y: 120,
  SECTION_PADDING_Y_MOBILE: 80,
  CONTAINER_MAX_WIDTH: 1280,
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,
} as const;

// ============================================================
// NAVIGATION
// ============================================================

export const NAVIGATION = {
  SECTIONS: [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'about', label: 'About', icon: 'user' },
    { id: 'skills', label: 'Skills', icon: 'code' },
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'projects', label: 'Projects', icon: 'folder' },
    { id: 'blog', label: 'Blog', icon: 'edit' },
    { id: 'contact', label: 'Contact', icon: 'mail' },
  ] as const,

  SCROLL_OFFSET: 80,
  SCROLL_DURATION: 800,
} as const;

// ============================================================
// FORM VALIDATION
// ============================================================

export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 5000,
} as const;

// ============================================================
// PAGINATION
// ============================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 20, 50, 100],
} as const;

// ============================================================
// TABLE CONSTANTS
// ============================================================

export const TABLE = {
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
  DEFAULT_ROWS_PER_PAGE: 10,
} as const;

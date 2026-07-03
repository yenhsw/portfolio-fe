// ============================================================
// ANIMATION CONSTANTS
// Animation duration and easing constants
// ============================================================

export const ANIMATION = {
  // Duration (ms)
  DURATION: {
    FAST: 150,
    BASE: 300,
    SLOW: 500,
    SLOWER: 700,
    STAGGER: 50,
  },

  // Easing
  EASING: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Delays (ms)
  DELAY: {
    NONE: 0,
    SHORT: 50,
    BASE: 100,
    LONG: 200,
    EXTRA_LONG: 400,
  },

  // Thresholds for intersection observer
  THRESHOLD: {
    ZERO: 0,
    QUARTER: 0.25,
    HALF: 0.5,
    THREE_QUARTERS: 0.75,
    ONE: 1,
  },
} as const;

// ============================================================
// SCROLL ANIMATION
// ============================================================

export const SCROLL_ANIMATION = {
  MOBILE: {
    OFFSET: '0px',
    THRESHOLD: 0.1,
  },
  DESKTOP: {
    OFFSET: '-50px',
    THRESHOLD: 0.2,
  },
  ROOT_MARGIN: '0px 0px -50px 0px',
} as const;

// ============================================================
// TYPING ANIMATION
// ============================================================

export const TYPING_ANIMATION = {
  SPEED: 50, // ms per character
  CURSOR_BLINK_SPEED: 530, // ms
  START_DELAY: 500, // ms before typing starts
} as const;

// ============================================================
// COUNTER ANIMATION
// ============================================================

export const COUNTER_ANIMATION = {
  DURATION: 2000, // ms
  START_DELAY: 0, // ms
  EASING: 'easeOutExpo',
} as const;

// ============================================================
// PARALLAX CONFIG
// ============================================================

export const PARALLAX = {
  SPEED: {
    SLOW: 0.2,
    NORMAL: 0.5,
    FAST: 0.8,
  },
  DIRECTION: {
    UP: 1,
    DOWN: -1,
  },
} as const;

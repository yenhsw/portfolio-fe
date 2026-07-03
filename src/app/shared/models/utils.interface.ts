// ============================================================
// UTILITY INTERFACES
// Common utility types and interfaces
// ============================================================

// ============================================================
// PLATFORM UTILITIES
// ============================================================

export interface PlatformConfig {
  isBrowser: boolean;
  isServer: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isOnline: boolean;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface ScrollPosition {
  x: number;
  y: number;
}

// ============================================================
// EVENT UTILITIES
// ============================================================

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

// ============================================================
// STORAGE UTILITIES
// ============================================================

export interface StorageOptions {
  encrypt?: boolean;
  expiry?: number;
  prefix?: string;
}

export interface StorageItem<T> {
  value: T;
  expiry?: number;
}

// ============================================================
// VALIDATION UTILITIES
// ============================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FieldValidator {
  validate: (value: unknown) => ValidationResult;
}

// ============================================================
// COMMON OPTIONS
// ============================================================

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SortOption {
  field: string;
  label: string;
  direction: 'asc' | 'desc';
}

// ============================================================
// UI UTILITIES
// ============================================================

export interface LoadingState {
  loading: boolean;
  error?: string;
  success?: boolean;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

export interface ToggleState {
  active: boolean;
  disabled: boolean;
}

// ============================================================
// REACTIVE UTILITIES
// ============================================================

export interface SignalState<T> {
  value: T;
  update: (value: T | ((prev: T) => T)) => void;
  set: (value: T) => void;
}

export interface ComputedSignal<T> {
  value: T;
  peek: () => T;
}

export interface EffectSignal {
  dispose: () => void;
}

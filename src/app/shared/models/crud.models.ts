// ============================================================
// BASE MODELS & INTERFACES
// Generic CRUD Framework - Type Definitions
// ============================================================

import { SafeHtml } from '@angular/platform-browser';

// ============================================================
// BASE ENTITY
// ============================================================

export interface BaseEntity {
  id: string | number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================================
// PAGINATION
// ============================================================

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_PAGINATION: PaginationOptions = {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// ============================================================
// TABLE
// ============================================================

export type SortDirection = 'asc' | 'desc' | '';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown, row: T) => string;
  template?: string;
}

export interface TableAction<T = unknown> {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  danger?: boolean;
  condition?: (row: T) => boolean;
}

export interface SortState {
  column: string;
  direction: SortDirection;
}

// ============================================================
// FILTER
// ============================================================

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between';

export interface FilterOption {
  value: string | number | boolean | null;
  label: string;
}

export interface BaseFilter {
  search?: string;
  status?: string | number | boolean | null;
  category?: string | number | null;
  dateFrom?: Date | string | null;
  dateTo?: Date | string | null;
  [key: string]: unknown;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'checkbox' | 'number';
  placeholder?: string;
  options?: FilterOption[];
  multiple?: boolean;
}

// ============================================================
// FORM
// ============================================================

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'time' | 'file' | 'image' | 'richtext' | 'color' | 'range' | 'tags';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: { value: string | number; label: string }[];
  defaultValue?: unknown;
  validators?: FieldValidator[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  helpText?: string;
}

export interface FieldValidator {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
  message: string;
  value?: unknown;
  validator?: (value: unknown) => boolean;
}

export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T = unknown> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
}

// ============================================================
// STATUS
// ============================================================

export type StatusType = 'active' | 'inactive' | 'draft' | 'published' | 'completed' | 'pending' | 'cancelled' | 'deleted' | 'archived';

export interface StatusConfig {
  type: StatusType;
  label: string;
  color: string;
  bgColor: string;
  icon?: string;
}

export const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  active: { type: 'active', label: 'Active', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  inactive: { type: 'inactive', label: 'Inactive', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.1)' },
  draft: { type: 'draft', label: 'Draft', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
  published: { type: 'published', label: 'Published', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  completed: { type: 'completed', label: 'Completed', color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)' },
  pending: { type: 'pending', label: 'Pending', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' },
  cancelled: { type: 'cancelled', label: 'Cancelled', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  deleted: { type: 'deleted', label: 'Deleted', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
  archived: { type: 'archived', label: 'Archived', color: '#78716c', bgColor: 'rgba(120, 113, 108, 0.1)' },
};

// ============================================================
// DIALOG & DRAWER
// ============================================================

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DrawerPosition = 'left' | 'right';

export interface DialogConfig {
  title?: string;
  size?: DialogSize;
  closable?: boolean;
  maskClosable?: boolean;
  footer?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export interface DrawerConfig {
  title?: string;
  position?: DrawerPosition;
  width?: string;
  closable?: boolean;
  maskClosable?: boolean;
  footer?: boolean;
}

// ============================================================
// CONFIRM
// ============================================================

export interface ConfirmConfig {
  title?: string;
  message: string;
  detail?: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'primary' | 'danger';
  icon?: SafeHtml;
}

// ============================================================
// ACTION
// ============================================================

export interface Action {
  id: string;
  label: string;
  icon?: string;
  type?: 'button' | 'menu';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
  visible?: boolean;
  danger?: boolean;
}

// ============================================================
// API RESPONSE
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  pagination: PaginationState;
  filters?: BaseFilter;
}

// ============================================================
// NOTIFICATION
// ============================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

// ============================================================
// UPLOAD
// ============================================================

export interface UploadFile {
  id?: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadConfig {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  uploadUrl?: string;
  headers?: Record<string, string>;
}

// ============================================================
// UTILITIES
// ============================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

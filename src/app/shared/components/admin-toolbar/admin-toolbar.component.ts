// ============================================================
// ADMIN TOOLBAR COMPONENT
// Search, Filter, and Actions Toolbar
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterField } from '../../models/crud.models';

@Component({
  selector: 'app-admin-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-toolbar">
      <!-- Search -->
      @if (showSearch) {
        <div class="search-wrapper" [class.focused]="searchFocused">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            class="search-input"
            [placeholder]="searchPlaceholder"
            [(ngModel)]="searchValue"
            (ngModelChange)="onSearchChange($event)"
            (focus)="searchFocused = true"
            (blur)="searchFocused = false"
          />
          @if (searchValue) {
            <button class="search-clear" (click)="clearSearch()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          }
        </div>
      }

      <!-- Filters -->
      @if (filters.length > 0) {
        <div class="filters-wrapper">
          @for (filter of filters; track filter.key) {
            @switch (filter.type) {
              @case ('select') {
                <select
                  class="filter-select"
                  [ngModel]="filterValues[filter.key]"
                  (ngModelChange)="onFilterChange(filter.key, $event)"
                >
                  <option value="">{{ filter.label }}</option>
                  @for (option of filter.options; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              }
              @case ('text') {
                <input
                  type="text"
                  class="filter-input"
                  [placeholder]="filter.placeholder || filter.label"
                  [ngModel]="filterValues[filter.key]"
                  (ngModelChange)="onFilterChange(filter.key, $event)"
                />
              }
              @case ('checkbox') {
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    [ngModel]="filterValues[filter.key]"
                    (ngModelChange)="onFilterChange(filter.key, $event)"
                  />
                  <span class="checkbox-label">{{ filter.label }}</span>
                </label>
              }
            }
          }

          @if (hasActiveFilters()) {
            <button class="clear-filters-btn" (click)="clearAllFilters()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          }
        </div>
      }

      <!-- Actions -->
      <div class="toolbar-actions">
        <ng-content select="[slot=actions]"></ng-content>

        @if (showRefresh) {
          <button class="toolbar-btn" (click)="onRefresh()" [disabled]="loading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.spinning]="loading">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styleUrl: './admin-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminToolbarComponent {
  @Input() showSearch = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() filters: FilterField[] = [];
  @Input() loading = false;
  @Input() showRefresh = true;

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<Record<string, unknown>>();
  @Output() refresh = new EventEmitter<void>();

  searchValue = '';
  searchFocused = false;
  filterValues: Record<string, unknown> = {};

  readonly hasActiveFilters = computed(() => {
    return Object.values(this.filterValues).some(v => v !== '' && v !== null && v !== undefined);
  });

  onSearchChange(value: string): void {
    this.search.emit(value);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.search.emit('');
  }

  onFilterChange(key: string, value: unknown): void {
    this.filterValues[key] = value;
    this.filterChange.emit({ ...this.filterValues });
  }

  clearAllFilters(): void {
    this.filterValues = {};
    this.filterChange.emit({});
  }

  onRefresh(): void {
    this.refresh.emit();
  }
}

// ============================================================
// ADMIN DATA TABLE COMPONENT
// Generic Data Table with Sort, Pagination, Actions
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableColumn, TableAction, SortState, PaginationState } from '../../models/crud.models';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-table-wrapper">
      <!-- Table Container -->
      <div class="table-container" [class.loading]="loading">
        <table class="admin-table">
          <!-- Header -->
          <thead>
            <tr>
              @if (selectable) {
                <th class="checkbox-col">
                  <input
                    type="checkbox"
                    class="table-checkbox"
                    [checked]="isAllSelected()"
                    [indeterminate]="isIndeterminate()"
                    (change)="toggleSelectAll()"
                  />
                </th>
              }
              @for (col of columns; track col.key) {
                <th
                  [style.width]="col.width"
                  [style.text-align]="col.align || 'left'"
                  [class.sortable]="col.sortable"
                  [class.sorted]="sort.column === col.key"
                  (click)="col.sortable && onSort(getKey(col))"
                >
                  <div class="th-content">
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <span class="sort-icon">
                        @if (sort.column === col.key) {
                          @if (sort.direction === 'asc') {
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="18 15 12 9 6 15"/>
                            </svg>
                          } @else {
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          }
                        } @else {
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="7 10 12 5 17 10"/>
                            <polyline points="7 14 12 19 17 14"/>
                          </svg>
                        }
                      </span>
                    }
                  </div>
                </th>
              }
              @if (actions.length > 0) {
                <th class="actions-col">Actions</th>
              }
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            @if (loading) {
              @for (i of [1,2,3,4,5]; track i) {
                <tr class="skeleton-row">
                  @for (col of columns; track col.key) {
                    <td>
                      <div class="skeleton skeleton-text"></div>
                    </td>
                  }
                  @if (actions.length > 0) {
                    <td>
                      <div class="skeleton skeleton-btn"></div>
                    </td>
                  }
                </tr>
              }
            } @else if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="empty-cell">
                  <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                    </svg>
                    <p class="empty-text">{{ emptyText }}</p>
                    <ng-content select="[slot=empty-actions]"></ng-content>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of data; track trackByFn ? trackByFn($index, row) : $index) {
                <tr (mouseenter)="hoveredRow = $index" (mouseleave)="hoveredRow = -1" [class.hovered]="hoveredRow === $index" [class.selected]="isSelected(getRowId(row))">
                  @if (selectable) {
                    <td class="checkbox-col">
                      <input
                        type="checkbox"
                        class="table-checkbox"
                        [checked]="isSelected(getRowId(row))"
                        (change)="onRowSelect(row)"
                      />
                    </td>
                  }
                  @for (col of columns; track col.key) {
                    <td [style.text-align]="col.align || 'left'">
                      @if (col.template && cellTemplate) {
                        <ng-container *ngTemplateOutlet="cellTemplate; context: { $implicit: row, column: col }"></ng-container>
                      } @else {
                        {{ getCellValue(row, col) }}
                      }
                    </td>
                  }
                  @if (actions.length > 0) {
                    <td class="actions-cell">
                      <div class="actions-menu">
                        @for (action of getVisibleActions(row); track action.id) {
                          <button
                            class="action-btn"
                            [class.ghost]="action.variant === 'ghost' || !action.variant"
                            [class.primary]="action.variant === 'primary'"
                            [class.secondary]="action.variant === 'secondary'"
                            [class.danger]="action.variant === 'danger'"
                            (click)="onAction(action, row)"
                          >
                            @if (action.icon) {
                              <span [innerHTML]="action.icon"></span>
                            }
                            {{ action.label }}
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (showPagination && pagination) {
        <div class="table-pagination">
          <div class="pagination-info">
            Showing {{ paginationStart() }} to {{ paginationEnd() }} of {{ pagination.total }} entries
          </div>
          <div class="pagination-controls">
            <select class="page-size-select" [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange($event)">
              @for (size of pageSizeOptions; track size) {
                <option [value]="size">{{ size }} per page</option>
              }
            </select>
            <div class="pagination-buttons">
              <button class="page-btn" [disabled]="pagination.page <= 1" (click)="goToPage(pagination.page - 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              @for (page of visiblePages(); track $index) {
                @if (page === '...') {
                  <span class="page-ellipsis">...</span>
                } @else {
                  <button
                    class="page-btn"
                    [class.active]="pagination.page === page"
                    (click)="goToPage(+page)"
                  >
                    {{ page }}
                  </button>
                }
              }
              <button class="page-btn" [disabled]="pagination.page >= pagination.totalPages" (click)="goToPage(pagination.page + 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './admin-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTableComponent<T = Record<string, unknown>> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() pagination: PaginationState | null = null;
  @Input() showPagination = true;
  @Input() emptyText = 'No data available';
  @Input() pageSizeOptions = [10, 25, 50, 100];
  @Input() trackByFn?: (index: number, item: T) => unknown;
  @Input() selectable = false;
  @Input() selectedIds: Set<string> = new Set();

  @Output() sortChange = new EventEmitter<SortState>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() actionClick = new EventEmitter<{ action: TableAction; row: T }>();
  @Output() rowSelect = new EventEmitter<string>();

  @ContentChild('cell') cellTemplate?: TemplateRef<{ $implicit: T; column: TableColumn }>;

  sort: SortState = { column: '', direction: '' };
  hoveredRow = -1;
  pageSize = 10;

  readonly paginationStart = computed(() => {
    if (!this.pagination) return 0;
    return (this.pagination.page - 1) * this.pagination.pageSize + 1;
  });

  readonly paginationEnd = computed(() => {
    if (!this.pagination) return 0;
    return Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.total);
  });

  readonly visiblePages = computed(() => {
    if (!this.pagination) return [];
    const { page, totalPages } = this.pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(page + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  });

  onSort(column: string): void {
    if (this.sort.column === column) {
      this.sort.direction = this.sort.direction === 'asc' ? 'desc' : this.sort.direction === 'desc' ? '' : 'asc';
    } else {
      this.sort = { column, direction: 'asc' };
    }
    this.sortChange.emit(this.sort);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }

  goToPage(page: number): void {
    if (page >= 1 && (!this.pagination || page <= this.pagination.totalPages)) {
      this.pageChange.emit(page);
    }
  }

  onAction(action: TableAction, row: T): void {
    this.actionClick.emit({ action, row });
  }

  getCellValue(row: T, col: TableColumn): string {
    const value = (row as Record<string, unknown>)[col.key];
    if (col.format) {
      return col.format(value, row);
    }
    return String(value ?? '');
  }

  getVisibleActions(row: T): TableAction[] {
    return this.actions.filter(action => !action.condition || action.condition(row));
  }

  getKey(col: TableColumn): string {
    return String(col.key);
  }

  getRowId(row: T): string {
    return (row as Record<string, unknown>)['id'] as string || String(row);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  isAllSelected(): boolean {
    return this.data.length > 0 && this.data.every(row => this.selectedIds.has(this.getRowId(row)));
  }

  isIndeterminate(): boolean {
    const selectedCount = this.data.filter(row => this.selectedIds.has(this.getRowId(row))).length;
    return selectedCount > 0 && selectedCount < this.data.length;
  }

  onRowSelect(row: T): void {
    this.rowSelect.emit(this.getRowId(row));
  }

  toggleSelectAll(): void {
    // This will be handled by parent component via rowSelect event
    // For now, we emit all row IDs
    if (this.isAllSelected()) {
      this.data.forEach(row => this.rowSelect.emit(this.getRowId(row)));
    } else {
      this.data.forEach(row => {
        if (!this.selectedIds.has(this.getRowId(row))) {
          this.rowSelect.emit(this.getRowId(row));
        }
      });
    }
  }
}

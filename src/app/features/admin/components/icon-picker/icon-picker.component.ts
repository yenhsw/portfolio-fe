// ============================================================
// ICON PICKER COMPONENT
// Icon Selection Component for Skills
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AVAILABLE_ICONS, SKILL_COLORS } from '../../models/skill.model';

interface IconItem {
  name: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="icon-picker">
      <div class="picker-header">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Search icons..."
            [value]="searchQuery()"
            (input)="onSearch($event)"
          />
        </div>
        <div class="icon-type-toggle">
          <button
            class="toggle-btn"
            [class.active]="iconType() === 'preset'"
            (click)="setIconType('preset')"
          >
            Preset
          </button>
          <button
            class="toggle-btn"
            [class.active]="iconType() === 'custom'"
            (click)="setIconType('custom')"
          >
            Custom
          </button>
        </div>
      </div>

      @if (iconType() === 'preset') {
        <div class="category-tabs">
          <button
            class="category-tab"
            [class.active]="selectedCategory() === ''"
            (click)="setCategory('')"
          >
            All
          </button>
          @for (cat of categories(); track cat) {
            <button
              class="category-tab"
              [class.active]="selectedCategory() === cat"
              (click)="setCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>

        <div class="icon-grid">
          @for (icon of filteredIcons(); track icon.icon) {
            <button
              class="icon-item"
              [class.selected]="selectedIcon() === icon.icon"
              (click)="selectIcon(icon.icon)"
            >
              <span class="devicon" [class]="'devicon-' + icon.icon + '-original'"></span>
              <span class="icon-name">{{ icon.name }}</span>
            </button>
          } @empty {
            <div class="no-results">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              <span>No icons found</span>
            </div>
          }
        </div>
      } @else {
        <div class="custom-icon-input">
          <label class="input-label">Custom Icon Class</label>
          <input
            type="text"
            class="field-input"
            placeholder="e.g., devicon-angular-original"
            [value]="customIcon()"
            (input)="onCustomIconInput($event)"
          />
          <p class="input-hint">Enter a CSS class name for your custom icon</p>
        </div>
      }

      <div class="picker-footer">
        <div class="selected-preview">
          @if (selectedIcon()) {
            <span class="devicon" [class]="'devicon-' + selectedIcon() + '-original'"></span>
          } @else if (customIcon()) {
            <span class="custom-icon-display">{{ customIcon() }}</span>
          } @else {
            <span class="no-icon">No icon selected</span>
          }
        </div>
        <div class="picker-actions">
          <button class="btn-clear" (click)="clearSelection()">Clear</button>
          <button class="btn-apply" (click)="applySelection()">Apply</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './icon-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPickerComponent {
  readonly selectedIcon = input<string>('');
  readonly iconChange = output<{ icon: string; iconType: 'svg' | 'class' }>();

  readonly searchQuery = signal('');
  readonly iconType = signal<'preset' | 'custom'>('preset');
  readonly selectedCategory = signal('');
  readonly customIcon = signal('');

  readonly categories = computed(() => {
    const cats = new Set(AVAILABLE_ICONS.map(i => i.category));
    return ['', ...Array.from(cats).sort()];
  });

  readonly filteredIcons = computed(() => {
    let icons = [...AVAILABLE_ICONS];
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();

    if (query) {
      icons = icons.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.icon.toLowerCase().includes(query)
      );
    }

    if (category) {
      icons = icons.filter(i => i.category === category);
    }

    return icons;
  });

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  setIconType(type: 'preset' | 'custom'): void {
    this.iconType.set(type);
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  selectIcon(icon: string): void {
    // This just updates the preview, actual selection happens on Apply
  }

  onCustomIconInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.customIcon.set(value);
  }

  clearSelection(): void {
    this.searchQuery.set('');
    this.customIcon.set('');
  }

  applySelection(): void {
    if (this.iconType() === 'custom' && this.customIcon()) {
      this.iconChange.emit({
        icon: this.customIcon(),
        iconType: 'class',
      });
    } else if (this.selectedIcon()) {
      this.iconChange.emit({
        icon: this.selectedIcon(),
        iconType: 'class',
      });
    }
  }
}

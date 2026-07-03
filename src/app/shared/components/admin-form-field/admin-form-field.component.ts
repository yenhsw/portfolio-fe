// ============================================================
// ADMIN FORM FIELD COMPONENT
// Reusable Form Input Component
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { FormField } from '../../models/crud.models';

@Component({
  selector: 'app-admin-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminFormFieldComponent),
      multi: true,
    },
  ],
  template: `
    <div class="form-field" [class.error]="error" [class.disabled]="disabled">
      @if (field.label) {
        <label class="field-label">
          {{ field.label }}
          @if (field.required) {
            <span class="required">*</span>
          }
        </label>
      }

      <div class="field-wrapper">
        @switch (field.type) {
          @case ('text') {
            <input
              type="text"
              class="field-input"
              [placeholder]="field.placeholder || ''"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            />
          }
          @case ('email') {
            <input
              type="email"
              class="field-input"
              [placeholder]="field.placeholder || ''"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            />
          }
          @case ('password') {
            <input
              type="password"
              class="field-input"
              [placeholder]="field.placeholder || ''"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            />
          }
          @case ('number') {
            <input
              type="number"
              class="field-input"
              [placeholder]="field.placeholder || ''"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            />
          }
          @case ('textarea') {
            <textarea
              class="field-textarea"
              [placeholder]="field.placeholder || ''"
              [rows]="field.rows || 4"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            ></textarea>
          }
          @case ('select') {
            <select
              class="field-select"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            >
              <option value="" disabled>{{ field.placeholder || 'Select...' }}</option>
              @for (opt of field.options; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          }
          @case ('checkbox') {
            <label class="field-checkbox">
              <input
                type="checkbox"
                [(ngModel)]="value"
                [disabled]="disabled"
                (ngModelChange)="onValueChange($event)"
              />
              <span class="checkbox-mark"></span>
            </label>
          }
          @case ('switch') {
            <label class="field-switch">
              <input
                type="checkbox"
                [(ngModel)]="value"
                [disabled]="disabled"
                (ngModelChange)="onValueChange($event)"
              />
              <span class="switch-track">
                <span class="switch-thumb"></span>
              </span>
            </label>
          }
          @case ('tags') {
            <div class="field-tags">
              <input
                type="text"
                class="field-input"
                placeholder="Type and press Enter..."
                (keydown.enter)="addTag($event)"
              />
              @for (tag of tags; track tag) {
                <span class="tag-item">
                  {{ tag }}
                  <button type="button" class="tag-remove" (click)="removeTag(tag)">×</button>
                </span>
              }
            </div>
          }
          @default {
            <input
              type="text"
              class="field-input"
              [placeholder]="field.placeholder || ''"
              [(ngModel)]="value"
              [disabled]="disabled"
              (ngModelChange)="onValueChange($event)"
            />
          }
        }
      </div>

      @if (error) {
        <span class="field-error">{{ error }}</span>
      }
      @if (field.helpText && !error) {
        <span class="field-help">{{ field.helpText }}</span>
      }
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;

      &.disabled { opacity: 0.5; pointer-events: none; }
    }

    .field-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);

      .required { color: var(--error); margin-left: 2px; }
    }

    .field-wrapper { position: relative; }

    .field-input, .field-select, .field-textarea {
      width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      color: var(--text-primary);
      background: rgba(5, 10, 20, 0.8);
      border: 1px solid var(--border);
      border-radius: 8px;
      outline: none;
      transition: all 0.2s;

      &::placeholder { color: var(--text-muted); }
      &:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1); }
    }

    .field-textarea { resize: vertical; min-height: 100px; }

    .field-select { cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      padding-right: 36px;
    }

    .field-checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
      input { display: none; }
      .checkbox-mark {
        width: 18px;
        height: 18px;
        border: 2px solid var(--border);
        border-radius: 4px;
        transition: all 0.2s;
      }
      input:checked + .checkbox-mark {
        background: var(--primary);
        border-color: var(--primary);
        &::after {
          content: '✓';
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        }
      }
    }

    .field-switch {
      display: flex;
      cursor: pointer;
      input { display: none; }
      .switch-track {
        width: 44px;
        height: 24px;
        background: var(--border);
        border-radius: 12px;
        position: relative;
        transition: all 0.2s;
        .switch-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.2s;
        }
      }
      input:checked + .switch-track {
        background: var(--primary);
        .switch-thumb { left: 22px; }
      }
    }

    .field-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px;
      background: rgba(5, 10, 20, 0.8);
      border: 1px solid var(--border);
      border-radius: 8px;
      .field-input { padding: 4px; border: none; background: transparent; }
    }

    .tag-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      font-size: 12px;
      background: rgba(168, 85, 247, 0.1);
      color: var(--primary);
      border-radius: 4px;
      .tag-remove {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
        &:hover { color: var(--error); }
      }
    }

    .field-error { font-size: 12px; color: var(--error); }
    .field-help { font-size: 12px; color: var(--text-muted); }

    .error .field-input, .error .field-select, .error .field-textarea {
      border-color: var(--error);
      &:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFormFieldComponent implements ControlValueAccessor {
  @Input() field!: FormField;
  @Input() error = '';

  value: unknown = '';
  disabled = false;
  tags: string[] = [];

  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: unknown): void {
    this.value = value;
    this.onChange(value);
  }

  addTag(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.value = [...this.tags];
      this.onChange(this.value);
    }
    input.value = '';
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.value = [...this.tags];
    this.onChange(this.value);
  }
}

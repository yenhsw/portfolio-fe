// ============================================================
// TECH INPUT COMPONENT - ENHANCED
// Cyber input with glow effects
// ============================================================

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-tech-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TechInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [class.focused]="isFocused()" [class.error]="error" [class.disabled]="disabled">
      @if (label) {
        <label [for]="inputId" class="input-label">
          {{ label }}
          @if (required) { <span class="required">*</span> }
        </label>
      }
      
      <div class="input-container" [class]="'input-container--' + size">
        @if (prefixIcon) {
          <span class="input-prefix">
            <ng-content select="[prefix]"></ng-content>
          </span>
        }
        
        <input
          [id]="inputId"
          [type]="currentType()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [autocomplete]="autocomplete"
          class="input-field"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />
        
        @if (showPasswordToggle && type === 'password') {
          <button type="button" class="input-suffix password-toggle" (click)="togglePassword()">
            @if (showPassword()) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            }
          </button>
        }
        
        @if (suffixIcon) {
          <span class="input-suffix">
            <ng-content select="[suffix]"></ng-content>
          </span>
        }
        
        @if (showGlow) {
          <div class="glow-effect"></div>
        }
      </div>
      
      @if (error) {
        <span class="input-error">{{ error }}</span>
      } @else if (hint) {
        <span class="input-hint">{{ hint }}</span>
      }
    </div>
  `,
  styleUrl: './tech-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() error = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() autocomplete = 'off';
  @Input() prefixIcon = false;
  @Input() suffixIcon = false;
  @Input() showPasswordToggle = false;
  @Input() showGlow = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();

  value = '';
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  isFocused = signal(false);
  showPassword = signal(false);

  get currentType(): ReturnType<typeof signal<string>> {
    return signal(this.type === 'password' && this.showPassword() ? 'text' : this.type) as ReturnType<typeof signal<string>>;
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.blurred.emit();
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

// ============================================================
// TECH TEXTAREA COMPONENT
// Multi-line text input
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

@Component({
  selector: 'app-tech-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TechTextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="textarea-wrapper" [class.focused]="isFocused()" [class.error]="error" [class.disabled]="disabled">
      @if (label) {
        <label [for]="textareaId" class="textarea-label">
          {{ label }}
          @if (required) { <span class="required">*</span> }
        </label>
      }
      
      <div class="textarea-container">
        <textarea
          [id]="textareaId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [rows]="rows"
          [value]="value"
          class="textarea-field"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        ></textarea>
        
        @if (showGlow) {
          <div class="glow-effect"></div>
        }
      </div>
      
      @if (showCount) {
        <div class="textarea-footer">
          @if (error) {
            <span class="textarea-error">{{ error }}</span>
          } @else if (hint) {
            <span class="textarea-hint">{{ hint }}</span>
          }
          <span class="char-count" [class.exceeded]="maxLength && value.length > maxLength">
            {{ value.length }}{{ maxLength ? '/' + maxLength : '' }}
          </span>
        </div>
      } @else {
        @if (error) {
          <span class="textarea-error">{{ error }}</span>
        } @else if (hint) {
          <span class="textarea-hint">{{ hint }}</span>
        }
      }
    </div>
  `,
  styleUrl: './tech-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechTextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() error = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() showGlow = true;
  @Input() showCount = true;
  @Input() maxLength = 0;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();

  value = '';
  textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;
  isFocused = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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

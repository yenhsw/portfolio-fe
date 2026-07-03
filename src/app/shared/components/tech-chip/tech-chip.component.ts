// ============================================================
// TECH CHIP COMPONENT
// Skill/technology chip
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-chip',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="'tech-chip ' + (removable ? 'tech-chip--removable' : '')">
    <ng-content></ng-content>
    @if (removable) {
      <button type="button" class="chip-remove" (click)="onRemove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    }
  </span>`,
  styleUrl: './tech-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechChipComponent {
  @Input() removable = false;

  onRemove(): void {}
}

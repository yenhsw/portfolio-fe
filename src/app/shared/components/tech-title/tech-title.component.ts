// ============================================================
// TECH TITLE COMPONENT
// Gradient title with glow effects
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (level === 'h1') {
      <h1 [class]="'tech-title tech-title--' + size + ' tech-title--' + variant">
        <ng-content></ng-content>
      </h1>
    } @else if (level === 'h2') {
      <h2 [class]="'tech-title tech-title--' + size + ' tech-title--' + variant">
        <ng-content></ng-content>
      </h2>
    } @else if (level === 'h3') {
      <h3 [class]="'tech-title tech-title--' + size + ' tech-title--' + variant">
        <ng-content></ng-content>
      </h3>
    } @else if (level === 'h4') {
      <h4 [class]="'tech-title tech-title--' + size + ' tech-title--' + variant">
        <ng-content></ng-content>
      </h4>
    } @else if (level === 'h5') {
      <h5 [class]="'tech-title tech-title--' + size + ' tech-title--' + variant">
        <ng-content></ng-content>
      </h5>
    } @else {
      <h6 [class]="'tech-title tech-title--' + size + ' tech-title--' + variant">
        <ng-content></ng-content>
      </h6>
    }
  `,
  styleUrl: './tech-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechTitleComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'lg';
  @Input() variant: 'default' | 'gradient' | 'glow' = 'default';
  @Input() level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2';
}

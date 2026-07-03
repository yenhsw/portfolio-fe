// ============================================================
// SKELETON COMPONENT
// Loading placeholder with shimmer
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (variant === 'text') {
      <span [class]="'skeleton skeleton--text skeleton--' + size" [style.width]="width"></span>
    } @else if (variant === 'circle') {
      <span [class]="'skeleton skeleton--circle skeleton--' + size" [style.width]="width" [style.height]="width"></span>
    } @else if (variant === 'rect') {
      <span [class]="'skeleton skeleton--rect skeleton--' + size" [style.width]="width" [style.height]="height"></span>
    } @else {
      <div [class]="'skeleton skeleton--block skeleton--' + size" [style.width]="width" [style.height]="height"></div>
    }
  `,
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  @Input() variant: 'text' | 'circle' | 'rect' | 'block' = 'block';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() width = '100%';
  @Input() height = '20px';
}

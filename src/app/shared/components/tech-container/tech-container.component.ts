// ============================================================
// TECH CONTAINER COMPONENT
// Responsive container with max-width
// ============================================================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

@Component({
  selector: 'app-tech-container',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="'tech-container tech-container--' + size"><ng-content></ng-content></div>`,
  styles: [`
    .tech-container {
      width: 100%;
      margin-inline: auto;
      padding-inline: var(--space-4);

      @media (min-width: 768px) {
        padding-inline: var(--space-6);
      }

      @media (min-width: 1024px) {
        padding-inline: var(--space-8);
      }

      &--xs { max-width: var(--container-xs); }
      &--sm { max-width: var(--container-sm); }
      &--md { max-width: var(--container-md); }
      &--lg { max-width: var(--container-lg); }
      &--xl { max-width: var(--container-xl); }
      &--2xl { max-width: var(--container-2xl); }
      &--3xl { max-width: var(--container-3xl); }
      &--full { max-width: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechContainerComponent {
  @Input() size: ContainerSize = 'xl';
}

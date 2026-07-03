// ============================================================
// TECH SECTION COMPONENT
// Section wrapper with padding and animations
// ============================================================

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export type SectionSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SectionVariant = 'default' | 'alternate' | 'gradient';

@Component({
  selector: 'app-tech-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      [id]="id"
      class="tech-section tech-section--{{ size }} tech-section--{{ variant }}"
    >
      <div class="section-container">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styleUrl: './tech-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechSectionComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  @Input() id = '';
  @Input() size: SectionSize = 'lg';
  @Input() variant: SectionVariant = 'default';

  ngOnInit(): void {
    // SSR-safe initialization if needed
  }
}

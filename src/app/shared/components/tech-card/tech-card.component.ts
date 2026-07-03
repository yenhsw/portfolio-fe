// ============================================================
// TECH CARD - ENHANCED
// Glass card with glow and hover effects
// ============================================================

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TechCardVariant = 'default' | 'glass' | 'glow' | 'bordered' | 'gradient';
export type TechCardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type TechCardTilt = 'none' | 'light' | 'full';

@Component({
  selector: 'app-tech-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses" (mousemove)="onMouseMove($event)" (mouseleave)="onMouseLeave()">
      @if (header) {
        <div class="card-header">
          <ng-content select="[card-header]"></ng-content>
        </div>
      }
      
      <div class="card-body" [class]="'padding-' + padding">
        <ng-content></ng-content>
      </div>
      
      @if (footer) {
        <div class="card-footer">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
      
      @if (glow) {
        <div class="card-glow"></div>
      }
    </div>
  `,
  styleUrl: './tech-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechCardComponent {
  @Input() variant: TechCardVariant = 'default';
  @Input() padding: TechCardPadding = 'md';
  @Input() header = false;
  @Input() footer = false;
  @Input() hoverable = true;
  @Input() clickable = false;
  @Input() fullHeight = false;
  @Input() glow = true;
  @Input() tilt: TechCardTilt = 'light';

  @Output() cardClick = new EventEmitter<MouseEvent>();

  @HostBinding('class')
  get cardClasses(): string {
    const classes = ['tech-card', `tech-card--${this.variant}`];

    if (this.hoverable) classes.push('tech-card--hoverable');
    if (this.clickable) classes.push('tech-card--clickable');
    if (this.fullHeight) classes.push('tech-card--full-height');
    if (this.glow) classes.push('tech-card--has-glow');
    if (this.tilt !== 'none') classes.push('tech-card--tilt');

    return classes.join(' ');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.clickable) {
      this.cardClick.emit(event);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.tilt === 'none') return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.tilt === 'full') {
      const rotateX = ((y / rect.height) - 0.5) * 10;
      const rotateY = ((x / rect.width) - 0.5) * -10;
      target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else if (this.tilt === 'light') {
      const rotateX = ((y / rect.height) - 0.5) * 4;
      const rotateY = ((x / rect.width) - 0.5) * -4;
      target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  onMouseLeave(): void {
    const target = event?.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = '';
    }
  }
}

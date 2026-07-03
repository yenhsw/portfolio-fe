// ============================================================
// ADMIN STATUS BADGE COMPONENT
// Status Indicator Badges
// ============================================================

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusType, STATUS_CONFIG } from '../../models/crud.models';

@Component({
  selector: 'app-admin-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="status-badge"
      [style.--badge-color]="config.color"
      [style.--badge-bg]="config.bgColor"
    >
      <span class="badge-dot"></span>
      <span class="badge-text">{{ config.label }}</span>
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      color: var(--badge-color);
      background: var(--badge-bg);
      border-radius: 9999px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      background: var(--badge-color);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--badge-color);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminStatusBadgeComponent {
  @Input() status: StatusType = 'active';

  get config() {
    return STATUS_CONFIG[this.status] || STATUS_CONFIG.active;
  }
}

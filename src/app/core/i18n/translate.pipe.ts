// ============================================================
// TRANSLATE PIPE — {{ 'admin.common.save' | t }}
// ============================================================

import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from '../services/locale.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly locale = inject(LocaleService);

  transform(key: string): string {
    return this.locale.t(key);
  }
}

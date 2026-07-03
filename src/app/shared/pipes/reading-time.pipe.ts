// ============================================================
// READING TIME PIPE
// Calculate reading time for content
// ============================================================

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readingTime',
  standalone: true,
})
export class ReadingTimePipe implements PipeTransform {
  private readonly WORDS_PER_MINUTE = 200;

  transform(value: string | null | undefined, wordsPerMinute = 200): string {
    if (!value) return '0 min read';

    const words = value.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return minutes === 1 ? '1 min read' : `${minutes} min read`;
  }
}

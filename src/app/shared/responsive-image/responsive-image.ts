import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ResponsiveImageMetadata } from '../../core/content/images.content';

@Component({
  selector: 'app-responsive-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './responsive-image.html',
  styleUrl: './responsive-image.scss',
})
export class ResponsiveImage {
  readonly image = input.required<ResponsiveImageMetadata>();
  readonly sizes = input('100vw');
  readonly priority = input(false);
  protected readonly avif = computed(() => this.srcset('avif'));
  protected readonly webp = computed(() => this.srcset('webp'));
  protected readonly jpeg = computed(() => this.srcset('jpg'));
  protected readonly fallback = computed(
    () => `${this.image().base}-${this.image().widths.at(-1)}.jpg`,
  );

  private srcset(extension: string): string {
    return this.image()
      .widths.map((width) => `${this.image().base}-${width}.${extension} ${width}w`)
      .join(', ');
  }
}

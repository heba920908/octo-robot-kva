import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { ContentFacade } from '../../core/content/content-facade';
import { SectionNavigation } from '../../core/navigation/section-navigation';

@Component({
  selector: 'app-skip-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<a class="skip-link" href="#main" data-skip-main>{{ label }}</a>',
  styleUrl: './skip-link.scss',
})
export class SkipLink {
  private readonly navigation = inject(SectionNavigation);
  protected readonly label = inject(ContentFacade).format('skipLink');

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => destroyRef.onDestroy(this.navigation.listen(host)));
  }
}

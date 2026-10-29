import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentFacade } from '../../core/content/content-facade';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy {
  protected readonly notice = inject(ContentFacade).privacy;
}

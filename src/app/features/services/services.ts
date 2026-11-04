import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentFacade } from '../../core/content/content-facade';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveImage],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  private readonly content = inject(ContentFacade);

  protected readonly title = this.content.format('servicesTitle');
  protected readonly quoteLabel = this.content.format('serviceQuote');
  protected readonly services = this.content.services;
  protected readonly imageSizes = '(min-width: 1440px) 25vw, (min-width: 768px) 50vw, 100vw';
}

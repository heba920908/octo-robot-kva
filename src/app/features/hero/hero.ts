import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentFacade } from '../../core/content/content-facade';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly content = inject(ContentFacade);

  protected readonly hero = this.content.hero;
  protected readonly backgroundImage = this.content.images['cover-blueprint-tools'];
  protected readonly logo = this.hero.logo;
  protected readonly logoSrcset = `${this.logo.src} 1x, ${this.logo.src2x} 2x`;
  protected readonly logoAlt = '';
  protected readonly showServices = this.content.visibleSections.includes('servicios');
}

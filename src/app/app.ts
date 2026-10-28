import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ContentFacade } from './core/content/content-facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly site = inject(ContentFacade).site;

  constructor() {
    inject(Title).setTitle(this.site.pageTitle);
    inject(Meta).updateTag({ name: 'description', content: this.site.description });
  }
}

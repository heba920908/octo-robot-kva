import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ContentFacade } from './core/content/content-facade';
import { Contact } from './features/contact/contact';
import { Footer } from './features/footer/footer';
import { Header } from './features/header/header';
import { SkipLink } from './features/header/skip-link';
import { Hero } from './features/hero/hero';
import { Privacy } from './features/privacy/privacy';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Contact, Footer, Header, Hero, Privacy, SkipLink],
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

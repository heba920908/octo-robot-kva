import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { App } from './app';
import { ContentFacade } from './core/content/content-facade';
import { hero } from './core/content/hero.content';
import { siteContent } from './core/content/site.content';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('renders the Hero headline as the only h1, inside #inicio', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const headings = root.querySelectorAll('h1');

    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.trim()).toBe(hero.headline);
    expect(headings[0].closest('section#inicio')).not.toBeNull();
    expect(root.querySelector('main > p')).toBeNull();
  });

  it('renders the brand name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(siteContent.brandName);
  });

  it('places the skip link first, then the sticky header, before main#main (1.8-AC-01, AC-05)', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main') as HTMLElement;
    const focusable = root.querySelector('a[href], button, [tabindex="0"]') as HTMLElement;

    expect(root.firstElementChild?.tagName).toBe('APP-SKIP-LINK');
    expect(focusable.getAttribute('href')).toBe('#main');
    expect(root.children[1].tagName).toBe('APP-HEADER');
    expect(root.querySelector('app-header a[href="#inicio"]')).not.toBeNull();
    expect(root.querySelector('app-header a[href="#contacto"]')).not.toBeNull();
    expect(root.querySelector('a[href="#servicios"]')).toBeNull();
    expect(main.id).toBe('main');
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(root.querySelector('.site-header')).toBeNull();
  });

  it('sets the document title and description from site content', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(TestBed.inject(Title).getTitle()).toBe(siteContent.pageTitle);
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe(
      siteContent.description,
    );
  });

  it('reads rendered copy and metadata through the injected facade', async () => {
    const site = {
      ...siteContent,
      pageTitle: 'Título de prueba',
      description: 'Descripción de prueba',
    };
    const heroContent = { ...hero, headline: 'Encabezado de prueba' };
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () => Object.assign(new ContentFacade(), { site, hero: heroContent }),
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent?.trim()).toBe(
      heroContent.headline,
    );
    expect(TestBed.inject(Title).getTitle()).toBe(site.pageTitle);
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe(site.description);
  });

  it('places the Hero first, the contact section before the privacy notice in main and the footer after main (1.5-AC-03, AC-04, 1.6-AC-02, 1.7)', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main') as HTMLElement;
    const contact = main.querySelector('app-contact') as HTMLElement;
    const privacy = main.querySelector('app-privacy') as HTMLElement;

    expect(main.firstElementChild?.tagName).toBe('APP-HERO');
    expect(main.querySelector('app-hero section#inicio')).not.toBeNull();
    expect(root.querySelector('a[href="#servicios"]')).toBeNull();
    expect(contact).not.toBeNull();
    expect(contact.querySelector('section#contacto')).not.toBeNull();
    expect(contact.nextElementSibling).toBe(privacy);
    expect(main.lastElementChild?.tagName).toBe('APP-PRIVACY');
    expect(main.querySelector('section#aviso')).not.toBeNull();
    expect(main.nextElementSibling?.tagName).toBe('APP-FOOTER');
    expect(root.querySelector('footer a[href="#aviso"]')).not.toBeNull();
    expect(root.querySelectorAll('h1')).toHaveLength(1);
  });
});

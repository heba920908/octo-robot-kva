import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { App } from './app';
import { ContentFacade } from './core/content/content-facade';
import { siteContent } from './core/content/site.content';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('renders the site heading as the only h1', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const headings = (fixture.nativeElement as HTMLElement).querySelectorAll('h1');

    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.trim()).toBe(siteContent.heading);
  });

  it('renders the brand name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(siteContent.brandName);
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
      heading: 'Encabezado de prueba',
      pageTitle: 'Título de prueba',
      description: 'Descripción de prueba',
    };
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () => Object.assign(new ContentFacade(), { site }),
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent?.trim()).toBe(
      site.heading,
    );
    expect(TestBed.inject(Title).getTitle()).toBe(site.pageTitle);
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe(site.description);
  });

  it('places the privacy notice last in main and the footer after main (1.5-AC-03, AC-04)', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main') as HTMLElement;

    expect(main.lastElementChild?.tagName).toBe('APP-PRIVACY');
    expect(main.querySelector('section#aviso')).not.toBeNull();
    expect(main.nextElementSibling?.tagName).toBe('APP-FOOTER');
    expect(root.querySelector('footer a[href="#aviso"]')).not.toBeNull();
    expect(root.querySelectorAll('h1')).toHaveLength(1);
  });
});

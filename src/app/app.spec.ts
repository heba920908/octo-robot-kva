import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { App } from './app';
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
});

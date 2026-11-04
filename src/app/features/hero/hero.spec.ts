import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { ContentFacade } from '../../core/content/content-facade';
import { hero } from '../../core/content/hero.content';
import { images } from '../../core/content/images.content';
import { Hero } from './hero';

function render(visibleSections?: readonly string[]) {
  if (visibleSections) {
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () => Object.assign(new ContentFacade(), { visibleSections }),
    });
  }
  const fixture = TestBed.createComponent(Hero);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('Hero section (#inicio) (1.7)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Hero] }).compileComponents();
  });

  it('prerenders overline, the only h1, lead, primary CTA and proof point (AC1)', () => {
    const { element } = render(['hero', 'contacto']);
    const section = element.querySelector('section#inicio') as HTMLElement;
    const headings = section.querySelectorAll('h1');
    const primary = section.querySelector('a[href="#contacto"]') as HTMLAnchorElement;

    expect(section.getAttribute('aria-labelledby')).toBe('inicio-title');
    expect(section.getAttribute('data-kva-surface')).toBe('dark');
    expect(headings).toHaveLength(1);
    expect(headings[0].id).toBe('inicio-title');
    expect(headings[0].textContent?.trim()).toBe(hero.headline);
    expect(headings[0].textContent?.trim().length).toBeLessThanOrEqual(60);
    expect(section.querySelector('.hero-overline')?.textContent?.trim()).toBe(
      'Explorando soluciones',
    );
    expect(section.querySelector('.hero-lead')?.textContent?.trim()).toBe(hero.lead);
    expect(hero.lead.length).toBeLessThanOrEqual(120);
    expect(primary.textContent?.trim()).toBe('Cotiza tu proyecto');
    expect(section.querySelector('.hero-proof')?.textContent?.trim()).toBe(
      '3+ años · Cobertura en todo México',
    );
  });

  it('omits the secondary CTA while servicios is not visible (AC5)', () => {
    const { element } = render(['hero', 'contacto']);

    expect(element.querySelector('a[href="#servicios"]')).toBeNull();
    expect(element.querySelectorAll('.hero-actions a')).toHaveLength(1);
  });

  it('renders the secondary CTA after the primary when servicios is visible (AC5)', () => {
    const { element } = render(['hero', 'servicios', 'contacto']);
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('.hero-actions a'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#contacto', '#servicios']);
    expect(links[1].textContent?.trim()).toBe('Ver servicios');
  });

  it('lets the h1 take programmatic focus for the header logo link (1.8-AC-04)', () => {
    const { element } = render();
    const heading = element.querySelector('h1#inicio-title') as HTMLElement;

    expect(heading.getAttribute('tabindex')).toBe('-1');
  });

  it('navigates through the section-navigation behavior with native fallback for modified clicks (1.8)', () => {
    const section = document.createElement('section');
    section.id = 'servicios';
    section.scrollIntoView = vi.fn();
    const target = document.createElement('h2');
    target.id = 'servicios-title';
    target.tabIndex = -1;
    section.appendChild(target);
    document.body.appendChild(section);
    const { element } = render(['hero', 'servicios', 'contacto']);
    const secondary = element.querySelector('a[href="#servicios"]') as HTMLAnchorElement;
    const modified = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    const plain = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });

    secondary.dispatchEvent(modified);
    expect(modified.defaultPrevented).toBe(false);
    expect(section.scrollIntoView).not.toHaveBeenCalled();

    secondary.dispatchEvent(plain);
    expect(plain.defaultPrevented).toBe(true);
    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(target);
    section.remove();
    window.history.replaceState(null, '', '/');
  });

  it('shows the cover photo eager with high priority over an ink ground (AC3)', () => {
    const { element } = render();
    const section = element.querySelector('section#inicio') as HTMLElement;
    const img = section.querySelector('app-responsive-image picture img') as HTMLImageElement;

    expect(img.getAttribute('src')).toBe('media/backgrounds/cover-blueprint-tools-740.jpg');
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(img.getAttribute('alt')).toBe('');
    expect(section.querySelector('.hero-overlay')?.getAttribute('aria-hidden')).toBe('true');
    expect(readFileSync('src/app/features/hero/hero.scss', 'utf8')).toMatch(
      /\.hero\s*\{[^}]*background-color:\s*var\(--kva-color-ink\)/,
    );
  });

  it('is preloaded from index.html with the same AVIF srcset the component renders (AC3)', () => {
    const { element } = render();
    const avif = element.querySelector('source[type="image/avif"]') as HTMLSourceElement;
    const html = readFileSync('src/index.html', 'utf8');
    const preload = html.match(/<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/)?.[0] ?? '';
    const expected = images['cover-blueprint-tools'].widths
      .map((width) => `media/backgrounds/cover-blueprint-tools-${width}.avif ${width}w`)
      .join(', ');

    expect(avif.getAttribute('srcset')).toBe(expected);
    expect(preload).toContain(`imagesrcset="${expected}"`);
    expect(preload).toContain('type="image/avif"');
    expect(preload).toContain('fetchpriority="high"');
    expect(preload).toContain('imagesizes="100vw"');
  });

  it('renders the decorative white logo with the 200 px derivatives (AC4)', () => {
    const { element } = render();
    const logo = element.querySelector('img.hero-logo') as HTMLImageElement;

    expect(logo.getAttribute('src')).toBe('media/logo/kva-logo-white-200.png');
    expect(logo.getAttribute('srcset')).toBe(
      'media/logo/kva-logo-white-200.png 1x, media/logo/kva-logo-white-241.png 2x',
    );
    expect(logo.getAttribute('width')).toBe('381');
    expect(logo.getAttribute('height')).toBe('200');
    expect(logo.getAttribute('alt')).toBe('');
    expect(logo.getAttribute('loading')).toBe('lazy');
  });

  it('feeds layout, frame and hairlines from tokens and shell properties (AC2, AC4)', () => {
    const scss = readFileSync('src/app/features/hero/hero.scss', 'utf8');
    const shell = readFileSync('src/styles.scss', 'utf8');

    expect(scss).toContain('min(100svh, var(--kva-spacing-hero-max))');
    expect(scss).toContain('var(--kva-spacing-logo-hero)');
    expect(scss).toContain('var(--kva-spacing-frame-offset)');
    expect(scss).toContain('var(--kva-spacing-bracket-arm)');
    expect(scss).toContain('var(--kva-component-button-primary-background-color)');
    expect(scss).toContain('var(--kva-component-button-ghost-on-dark-outline-stroke-color)');
    expect(scss).not.toMatch(/@media/);
    for (const property of [
      '--kva-hero-align: flex-start',
      '--kva-hero-align: center',
      '--kva-hero-logo-display: none',
      '--kva-hero-logo-display: block',
      '--kva-hero-ornament-display: none',
      '--kva-hero-ornament-display: block',
      '--kva-hero-actions-direction: column',
      '--kva-hero-actions-direction: row',
    ]) {
      expect(shell).toContain(property);
    }
  });
});

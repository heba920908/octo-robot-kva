import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { ContentFacade } from '../../core/content/content-facade';
import { LayerController } from '../../core/layers/layers';
import { SectionNavigation } from '../../core/navigation/section-navigation';
import { Header } from './header';
import { SkipLink } from './skip-link';

function render(visibleSections?: readonly string[]) {
  if (visibleSections) {
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () => Object.assign(new ContentFacade(), { visibleSections }),
    });
  }
  const fixture = TestBed.createComponent(Header);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

class FakeObserver {
  static instances: FakeObserver[] = [];
  observed: Element[] = [];
  disconnected = false;
  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeObserver.instances.push(this);
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  disconnect() {
    this.disconnected = true;
  }
  fire(target: Element, isIntersecting = true) {
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this as never);
  }
}

describe('Header (1.8-AC-01, AC-02, AC-04)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Header, SkipLink] }).compileComponents();
  });

  it('renders the logo link to #inicio named by aria-label with a decorative image (AC-01)', () => {
    const { element } = render(['hero', 'contacto']);
    const logo = element.querySelector('a.header-logo') as HTMLAnchorElement;
    const img = logo.querySelector('img') as HTMLImageElement;

    expect(logo.getAttribute('href')).toBe('#inicio');
    expect(logo.getAttribute('aria-label')).toBe('kVA Instalaciones');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('src')).toBe('media/logo/kva-logo-white-40.png');
    expect(img.getAttribute('srcset')).toBe(
      'media/logo/kva-logo-white-40.png 1x, media/logo/kva-logo-white-80.png 2x',
    );
    expect(logo.querySelector('.header-wordmark')?.textContent?.trim()).toBe('Instalaciones');
  });

  it('links only to visible sections, and the CTA goes to #contacto in both label forms (AC-01)', () => {
    const { element } = render(['hero', 'contacto']);
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a.header-link'));
    const cta = element.querySelector('a.header-cta') as HTMLAnchorElement;

    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#contacto']);
    expect(links[0].textContent?.trim()).toBe('Contacto');
    expect(element.querySelector('a[href="#servicios"]')).toBeNull();
    expect(cta.getAttribute('href')).toBe('#contacto');
    expect(cta.querySelector('.header-cta-full')?.textContent?.trim()).toBe('Cotiza tu proyecto');
    expect(cta.querySelector('.header-cta-short')?.textContent?.trim()).toBe('Cotiza');
  });

  it('orders links Servicios, Proyectos, Nosotros, Confianza, Contacto (AC-01)', () => {
    const { element } = render([
      'hero',
      'contacto',
      'confianza',
      'servicios',
      'nosotros',
      'proyectos',
    ]);

    expect(
      Array.from(element.querySelectorAll('a.header-link')).map((link) => link.textContent?.trim()),
    ).toEqual(['Servicios', 'Proyectos', 'Nosotros', 'Confianza', 'Contacto']);
  });

  it('renders no CTA when contacto is not visible (AC-01)', () => {
    const { element } = render(['hero']);

    expect(element.querySelector('a.header-cta')).toBeNull();
    expect(element.querySelectorAll('a.header-link')).toHaveLength(0);
  });

  it('has no menu button, inert or dialog (Story 1.9 scope)', () => {
    const { element } = render();

    expect(element.querySelector('button, [inert], dialog')).toBeNull();
  });

  describe('enhancement', () => {
    let original: unknown;

    beforeEach(() => {
      original = (window as unknown as Record<string, unknown>)['IntersectionObserver'];
      FakeObserver.instances.length = 0;
      (window as unknown as Record<string, unknown>)['IntersectionObserver'] = FakeObserver;
      window.scrollTo = vi.fn();
    });

    afterEach(() => {
      (window as unknown as Record<string, unknown>)['IntersectionObserver'] = original;
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      document.documentElement.removeAttribute('data-kva-header');
    });

    function scrollTo(y: number) {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    }

    it('stays solid without enhancement and transparent only after hydration (AC-02)', async () => {
      const fixture = TestBed.createComponent(Header);
      const element = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
      await fixture.whenStable();
      const header = element.querySelector('header') as HTMLElement;

      expect(header.classList.contains('is-enhanced')).toBe(true);
      expect(header.classList.contains('is-condensed')).toBe(false);
    });

    it('condenses when scrollY exceeds 24 and releases at 24, tracking the root offset (AC-02)', async () => {
      const fixture = TestBed.createComponent(Header);
      fixture.detectChanges();
      await fixture.whenStable();
      const header = (fixture.nativeElement as HTMLElement).querySelector('header') as HTMLElement;

      scrollTo(24);
      await fixture.whenStable();
      expect(header.classList.contains('is-condensed')).toBe(false);
      expect(document.documentElement.hasAttribute('data-kva-header')).toBe(false);

      const before = FakeObserver.instances.length;
      scrollTo(25);
      await fixture.whenStable();
      expect(FakeObserver.instances.length).toBe(before + 1);
      expect(FakeObserver.instances[before - 1].disconnected).toBe(true);
      expect(header.classList.contains('is-condensed')).toBe(true);
      expect(document.documentElement.getAttribute('data-kva-header')).toBe('condensed');

      scrollTo(0);
      await fixture.whenStable();
      expect(header.classList.contains('is-condensed')).toBe(false);
      expect(document.documentElement.hasAttribute('data-kva-header')).toBe(false);
    });

    it('marks exactly one link aria-current="location" from scroll-spy and none in the Hero (AC-04)', async () => {
      const section = (id: string) => {
        const element = document.createElement('section');
        element.id = id;
        document.body.appendChild(element);
        const main = document.createElement('main');
        main.appendChild(element);
        document.body.appendChild(main);
        return element;
      };
      const inicio = section('inicio');
      const contacto = section('contacto');
      TestBed.overrideProvider(ContentFacade, {
        useFactory: () =>
          Object.assign(new ContentFacade(), {
            visibleSections: ['hero', 'servicios', 'contacto'],
          }),
      });
      const fixture = TestBed.createComponent(Header);
      fixture.detectChanges();
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;
      const observer = FakeObserver.instances.at(-1) as FakeObserver;
      const current = () =>
        Array.from(element.querySelectorAll('a.header-link[aria-current]')).map((link) =>
          link.getAttribute('href'),
        );

      expect(observer.observed).toEqual(expect.arrayContaining([inicio, contacto]));
      expect(observer.options?.rootMargin).toMatch(/^-\d+px 0px -\d+px 0px$/);

      observer.fire(contacto);
      await fixture.whenStable();
      expect(current()).toEqual(['#contacto']);
      expect(
        element.querySelector('a.header-link[aria-current]')?.getAttribute('aria-current'),
      ).toBe('location');

      observer.fire(inicio);
      await fixture.whenStable();
      expect(current()).toEqual([]);

      for (const node of [inicio.parentElement, contacto.parentElement]) node?.remove();
    });

    it('applies scroll, focus and fragment replacement once from a link activation (AC-04)', async () => {
      const main = document.createElement('main');
      const section = document.createElement('section');
      section.id = 'contacto';
      const heading = document.createElement('h2');
      heading.id = 'contacto-title';
      heading.tabIndex = -1;
      heading.scrollIntoView = vi.fn();
      section.appendChild(heading);
      main.appendChild(section);
      document.body.appendChild(main);
      section.scrollIntoView = vi.fn();
      const replace = vi.spyOn(TestBed.inject(LayerController), 'replaceFragment');
      const fixture = TestBed.createComponent(Header);
      fixture.detectChanges();
      await fixture.whenStable();
      const link = (fixture.nativeElement as HTMLElement).querySelector(
        'a.header-link',
      ) as HTMLAnchorElement;
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });

      link.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(heading);
      expect(replace).toHaveBeenCalledExactlyOnceWith('#contacto');
      expect(TestBed.inject(SectionNavigation).current()).toBe('contacto');
      main.remove();
      window.history.replaceState(null, '', '/');
    });

    it('leaves a modified click native', async () => {
      const fixture = TestBed.createComponent(Header);
      fixture.detectChanges();
      const link = (fixture.nativeElement as HTMLElement).querySelector(
        'a.header-cta',
      ) as HTMLAnchorElement;
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });

      link.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
    });

    it('disconnects the observer and clears the root attribute on destroy', async () => {
      const fixture = TestBed.createComponent(Header);
      fixture.detectChanges();
      await fixture.whenStable();
      scrollTo(100);
      const observer = FakeObserver.instances.at(-1) as FakeObserver;

      fixture.destroy();

      expect(FakeObserver.instances.every((instance) => instance.disconnected)).toBe(true);
      expect(observer.disconnected).toBe(true);
      expect(document.documentElement.hasAttribute('data-kva-header')).toBe(false);
    });
  });

  it('is a zero-height sticky host with token-fed styling and no media queries (AC-02)', () => {
    const scss = readFileSync('src/app/features/header/header.scss', 'utf8');
    const shell = readFileSync('src/styles.scss', 'utf8');

    expect(scss).toMatch(/:host\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*height:\s*0/);
    expect(scss).toContain('var(--kva-component-header-condensed-background-color)');
    expect(scss).toContain('var(--kva-component-divider-on-dark-stroke-color)');
    expect(scss).toContain('var(--kva-component-nav-link-current-stroke-color)');
    expect(scss).not.toMatch(/@media/);
    expect(shell).toContain(
      '--kva-shell-header-offset: var(--kva-component-header-condensed-min-height)',
    );
    for (const property of [
      '--kva-header-wordmark-display: none',
      '--kva-header-wordmark-display: inline',
      '--kva-header-links-display: none',
      '--kva-header-links-display: flex',
      '--kva-header-cta-short-display: inline',
      '--kva-header-cta-full-display: inline',
    ]) {
      expect(shell).toContain(property);
    }
  });
});

describe('SkipLink (1.8-AC-05)', () => {
  it('renders "Saltar al contenido" pointing at #main', () => {
    const fixture = TestBed.createComponent(SkipLink);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('#main');
    expect(link.textContent?.trim()).toBe('Saltar al contenido');
  });

  it('focuses main#main on activation and prevents the native jump', () => {
    const main = document.createElement('main');
    main.id = 'main';
    main.tabIndex = -1;
    document.body.appendChild(main);
    const fixture = TestBed.createComponent(SkipLink);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a') as HTMLAnchorElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    link.dispatchEvent(event);

    expect(document.activeElement).toBe(main);
    expect(event.defaultPrevented).toBe(true);
    main.remove();
  });

  it('is hidden until focused, then fixed at the top-left (UX-DR9)', () => {
    const scss = readFileSync('src/app/features/header/skip-link.scss', 'utf8');

    expect(scss).toMatch(/\.skip-link:not\(:focus\)\s*\{[^}]*clip-path/);
    expect(scss).toMatch(/\.skip-link:focus\s*\{[^}]*position:\s*fixed[^}]*top:[^}]*left:/);
    expect(scss).toContain('var(--kva-component-skip-link-background-color)');
  });
});

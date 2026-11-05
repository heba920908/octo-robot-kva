import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { appConfig } from '../../app.config';
import { serviceCardDisclosure } from '../../behaviors/service-card-disclosure.behavior';
import { ContentFacade, resolveServices } from '../../core/content/content-facade';
import { images } from '../../core/content/images.content';
import {
  services as launchServices,
  type ServiceContent,
} from '../../core/content/services.content';
import { uiStrings } from '../../core/content/ui-strings.content';
import { EffectRunner } from '../../core/effects/effects';
import { Services } from './services';

function render(docs: readonly ServiceContent[] = launchServices) {
  TestBed.overrideProvider(ContentFacade, {
    useFactory: () => Object.assign(new ContentFacade(), { services: resolveServices(docs) }),
  });
  const fixture = TestBed.createComponent(Services);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function extra(id: string, order: number, overrides: Partial<ServiceContent> = {}): ServiceContent {
  return {
    id,
    name: `Servicio ${id}`,
    description: `Descripción ${id}`,
    order,
    subServices: [`Uno ${id}`, `Dos ${id}`],
    ...overrides,
  };
}

describe('Services section (#servicios) (2.1)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Services] }).compileComponents();
  });

  it('prerenders one card per Service in order with name, description, en-dash list and CTA (2.1-AC-02)', () => {
    const { element } = render();
    const section = element.querySelector('section#servicios') as HTMLElement;
    const title = section.querySelector('h2') as HTMLElement;
    const cards = Array.from(section.querySelectorAll<HTMLElement>('article.service-card'));

    expect(section.getAttribute('aria-labelledby')).toBe('servicios-title');
    expect(title.id).toBe('servicios-title');
    expect(title.getAttribute('tabindex')).toBe('-1');
    expect(title.textContent?.trim()).toBe(uiStrings.servicesTitle.text);
    expect(section.querySelectorAll('h1')).toHaveLength(0);
    expect(cards).toHaveLength(4);
    cards.forEach((card, index) => {
      const service = launchServices[index];
      const heading = card.querySelector('h3') as HTMLElement;
      expect(card.dataset['serviceId']).toBe(service.id);
      expect(card.getAttribute('aria-labelledby')).toBe(heading.id);
      expect(heading.textContent?.trim()).toBe(service.name);
      expect(card.querySelector('.service-description')?.textContent?.trim()).toBe(
        service.description,
      );
      const items = Array.from(card.querySelectorAll('ul.service-list > li')).map((item) =>
        item.textContent?.trim(),
      );
      expect(items).toEqual([...service.subServices]);
    });
    expect(
      Array.from(cards[0].querySelectorAll('li'), (item) => item.textContent?.trim()),
    ).toHaveLength(9);
  });

  it('keeps the maintenance Sub-service as one list item (UX-DR28)', () => {
    const { element } = render();
    const items = Array.from(element.querySelectorAll('li'), (item) => item.textContent?.trim());

    expect(
      items.filter((text) => text?.startsWith('Mantenimiento preventivo y correctivo a:')),
    ).toEqual([
      'Mantenimiento preventivo y correctivo a: Plantas de emergencia, UPS, reguladores; Transformadores (media y baja tensión); Sistemas de iluminación',
    ]);
  });

  it('frames each title with a decorative corner bracket (UX-DR13)', () => {
    const { element } = render();

    for (const card of Array.from(element.querySelectorAll('article'))) {
      const frame = card.querySelector('.service-title > .service-frame') as HTMLElement;
      expect(frame.getAttribute('aria-hidden')).toBe('true');
      expect(frame.textContent?.trim()).toBe('');
    }
    expect(
      (element.querySelector('.kva-corner-rule') as HTMLElement).getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('renders no image slot for Services without an image (2.1-AC-03)', () => {
    const { element } = render();

    expect(element.querySelector('.service-image')).toBeNull();
    expect(element.querySelector('app-responsive-image')).toBeNull();
  });

  it('renders a 3:1 darkened ResponsiveImage band with the Service alt when set (2.1-AC-03)', () => {
    const { element } = render([
      extra('con-imagen', 1, { image: { id: 'wiring-technician', alt: 'Cableado ordenado.' } }),
      extra('sin-imagen', 2),
    ]);
    const cards = element.querySelectorAll('article');
    const band = cards[0].querySelector('.service-image') as HTMLElement;
    const img = band.querySelector('app-responsive-image img') as HTMLImageElement;

    expect(band).not.toBeNull();
    expect(cards[0].firstElementChild).toBe(band);
    expect(img.getAttribute('alt')).toBe('Cableado ordenado.');
    expect(img.getAttribute('src')).toContain(images['wiring-technician'].base);
    expect(cards[1].querySelector('.service-image')).toBeNull();
  });

  it('styles the band as a darkened 3:1 crop through tokens (2.1-AC-03)', () => {
    const css = readFileSync('src/app/features/services/services.scss', 'utf8');

    expect(css).toMatch(/\.service-image\s*{[^}]*aspect-ratio:\s*3 \/ 1/);
    expect(css).toContain('--kva-component-service-card-image-background-color');
  });

  it('uses a plain #contacto anchor CTA with the default or the doc label (2.1-AC-05)', () => {
    const { element } = render([
      extra('uno', 1),
      extra('dos', 2, { cta: uiStrings.serviceVisit.text }),
    ]);
    const ctas = Array.from(element.querySelectorAll<HTMLAnchorElement>('article a.service-cta'));

    expect(ctas.map((cta) => cta.getAttribute('href'))).toEqual(['#contacto', '#contacto']);
    expect(ctas.map((cta) => cta.textContent?.trim())).toEqual([
      'Cotiza este servicio',
      'Solicita una visita técnica',
    ]);
    expect(element.querySelector('button')).toBeNull();
  });

  it('pins the CTA to the card bottom and lays out 1/2/4 columns through tokens (2.1-AC-04)', () => {
    const css = readFileSync('src/app/features/services/services.scss', 'utf8');
    const global = readFileSync('src/styles.scss', 'utf8');

    expect(css).toMatch(/\.service-cta\s*{[^}]*margin-top:\s*auto/);
    expect(css).toMatch(/\.service-body\s*{[^}]*flex:\s*1/);
    expect(css).toContain('repeat(var(--kva-services-columns), minmax(0, 1fr))');
    expect(global).toMatch(/:root\s*{[^}]*--kva-services-columns:\s*1;/);
    expect(global).toMatch(
      /@media \(width >= 768px\)\s*{\s*:root\s*{[^}]*--kva-services-columns:\s*2;/,
    );
    expect(global).toMatch(
      /@media \(width >= 1440px\)\s*{\s*:root\s*{\s*--kva-services-columns:\s*4;/,
    );
  });

  it('renders five cards for a fifth Service doc with no component change (2.1-AC-06)', () => {
    const { element } = render([...launchServices, extra('quinto', 5)]);
    const cards = element.querySelectorAll('article.service-card');

    expect(cards).toHaveLength(5);
    expect((cards[4].querySelector('h3') as HTMLElement).textContent?.trim()).toBe(
      'Servicio quinto',
    );
  });

  it('orders by doc order field, not by array position', () => {
    const { element } = render([extra('b', 2), extra('a', 1)]);

    expect(
      Array.from(element.querySelectorAll('article'), (card) => card.dataset['serviceId']),
    ).toEqual(['a', 'b']);
  });
});

const compactQuery = '(max-width: 767.98px)';

class FakeMediaQuery {
  readonly listeners = new Set<() => void>();
  matches: boolean;
  readonly addEventListener = vi.fn((_type: string, listener: () => void) => {
    this.listeners.add(listener);
  });
  readonly removeEventListener = vi.fn((_type: string, listener: () => void) => {
    this.listeners.delete(listener);
  });

  constructor(matches: boolean) {
    this.matches = matches;
  }

  set(matches: boolean) {
    this.matches = matches;
    for (const listener of [...this.listeners]) listener();
  }
}

function flushIcons(http: HttpTestingController) {
  for (const request of http.match((req) => req.url.startsWith('media/icons/'))) {
    const file = request.request.url.replace(/^.*media\/icons\//, 'public/media/icons/');
    request.flush(readFileSync(file, 'utf8'));
  }
}

describe('Services Sub-service disclosure (2.2)', () => {
  const requestedQueries: string[] = [];
  let query: FakeMediaQuery;
  let attached: HTMLElement | null = null;
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');

  async function renderDisclosure(
    options: { compact?: boolean; docs?: readonly ServiceContent[]; withMatchMedia?: boolean } = {},
  ) {
    const { compact = true, docs = launchServices, withMatchMedia = true } = options;
    query = new FakeMediaQuery(compact);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: withMatchMedia
        ? (text: string) => {
            requestedQueries.push(text);
            return query as unknown as MediaQueryList;
          }
        : undefined,
    });
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () => Object.assign(new ContentFacade(), { services: resolveServices(docs) }),
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Services);
    const element = fixture.nativeElement as HTMLElement;
    document.body.appendChild(element);
    attached = element;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    flushIcons(http);
    await fixture.whenStable();
    return { fixture, element, http };
  }

  async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }) {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  const cardOf = (element: HTMLElement, index: number) =>
    element.querySelectorAll<HTMLElement>('article.service-card')[index];
  const itemsOf = (card: HTMLElement) =>
    Array.from(card.querySelectorAll('ul.service-list > li'), (item) => item.textContent?.trim());
  const toggleOf = (card: HTMLElement) =>
    card.querySelector<HTMLButtonElement>('button.service-toggle');

  beforeEach(async () => {
    requestedQueries.length = 0;
    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [...appConfig.providers, provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    attached?.remove();
    attached = null;
    vi.restoreAllMocks();
    if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
    else delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it('shows the first 4 plus a "Ver los {n} servicios" toggle below 768 px with JS (2.2-AC-02)', async () => {
    const { element } = await renderDisclosure();

    expect(requestedQueries).toEqual([compactQuery]);
    [9, 6, 5].forEach((count, index) => {
      const card = cardOf(element, index);
      const toggle = toggleOf(card) as HTMLButtonElement;
      const list = card.querySelector('ul.service-list') as HTMLElement;
      expect(itemsOf(card)).toEqual(launchServices[index].subServices.slice(0, 4));
      expect(toggle.type).toBe('button');
      expect(toggle.textContent?.trim()).toBe(`Ver los ${count} servicios`);
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(list.id).toBeTruthy();
      expect(toggle.getAttribute('aria-controls')).toBe(list.id);
      expect(toggle.id).toBeTruthy();
      expect(toggle.querySelector('mat-icon[svgIcon="chevron-down"]')).not.toBeNull();
      expect(toggle.querySelector('mat-icon')?.getAttribute('aria-hidden')).toBe('true');
    });
    expect(toggleOf(cardOf(element, 3))).toBeNull();
    expect(itemsOf(cardOf(element, 3))).toEqual([...launchServices[3].subServices]);
  });

  it('never shows a toggle for 4 or fewer Sub-services; 5 gets one (2.2-AC-02)', async () => {
    const four = ['a', 'b', 'c', 'd'];
    const five = [...four, 'e'];
    const { element } = await renderDisclosure({
      docs: [
        { ...launchServices[0], id: 'cuatro', order: 1, subServices: four },
        { ...launchServices[0], id: 'cinco', order: 2, subServices: five },
      ],
    });

    expect(toggleOf(cardOf(element, 0))).toBeNull();
    expect(itemsOf(cardOf(element, 0))).toEqual(four);
    expect(toggleOf(cardOf(element, 1))?.textContent?.trim()).toBe('Ver los 5 servicios');
    expect(itemsOf(cardOf(element, 1))).toEqual(four);
  });

  it('expands on activation: full list, "Ver menos", aria-expanded, focus on the toggle (2.2-AC-03)', async () => {
    const { fixture, element } = await renderDisclosure();
    const toggle = toggleOf(cardOf(element, 0)) as HTMLButtonElement;

    toggle.click();
    await settle(fixture);

    const same = toggleOf(cardOf(element, 0)) as HTMLButtonElement;
    expect(same).toBe(toggle);
    expect(itemsOf(cardOf(element, 0))).toEqual([...launchServices[0].subServices]);
    expect(same.textContent?.trim()).toBe('Ver menos');
    expect(same.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(same);

    same.click();
    await settle(fixture);

    expect(itemsOf(cardOf(element, 0))).toEqual(launchServices[0].subServices.slice(0, 4));
    expect(same.textContent?.trim()).toBe('Ver los 9 servicios');
    expect(same.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(same);
  });

  it('applies each non-null model result once, state before effects, and nothing for null (2.2-AC-01)', async () => {
    const { fixture, element } = await renderDisclosure();
    const toggle = toggleOf(cardOf(element, 0)) as HTMLButtonElement;
    const transition = vi.spyOn(serviceCardDisclosure, 'transition');
    const focus = vi.spyOn(TestBed.inject(EffectRunner), 'focus');

    toggle.click();
    await settle(fixture);

    expect(transition).toHaveBeenCalledTimes(1);
    expect(transition.mock.calls[0]).toEqual([
      { expanded: false },
      { type: 'toggle', toggleId: toggle.id },
    ]);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(focus).toHaveBeenCalledWith({ kind: 'focus', target: toggle.id });

    transition.mockReturnValue(null);
    focus.mockClear();
    toggle.click();
    await settle(fixture);

    expect(focus).not.toHaveBeenCalled();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(itemsOf(cardOf(element, 0))).toHaveLength(9);
  });

  it('keeps per-card state independent', async () => {
    const { fixture, element } = await renderDisclosure();

    (toggleOf(cardOf(element, 1)) as HTMLButtonElement).click();
    await settle(fixture);

    expect(itemsOf(cardOf(element, 0))).toHaveLength(4);
    expect(itemsOf(cardOf(element, 1))).toHaveLength(6);
    expect(itemsOf(cardOf(element, 2))).toHaveLength(4);
  });

  it('shows the full list and no toggle at 768 px and up (2.2-AC-04)', async () => {
    const { element } = await renderDisclosure({ compact: false });

    launchServices.forEach((service, index) => {
      expect(itemsOf(cardOf(element, index))).toEqual([...service.subServices]);
      expect(toggleOf(cardOf(element, index))).toBeNull();
    });
    expect(element.querySelector('button')).toBeNull();
  });

  it('shows the full list and no toggle when matchMedia is unavailable (2.2-AC-04)', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { element } = await renderDisclosure({ withMatchMedia: false });

    expect(window.matchMedia).toBeUndefined();
    expect(consoleError).not.toHaveBeenCalled();
    expect(itemsOf(cardOf(element, 0))).toHaveLength(9);
    expect(element.querySelector('button')).toBeNull();
  });

  it('resizes across 768 px both ways and restores each card state', async () => {
    const { fixture, element } = await renderDisclosure();
    (toggleOf(cardOf(element, 0)) as HTMLButtonElement).click();
    await settle(fixture);

    query.set(false);
    await settle(fixture);
    expect(element.querySelector('button')).toBeNull();
    expect(itemsOf(cardOf(element, 1))).toHaveLength(6);

    query.set(true);
    await settle(fixture);
    const first = toggleOf(cardOf(element, 0)) as HTMLButtonElement;
    expect(itemsOf(cardOf(element, 0))).toHaveLength(9);
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(first.textContent?.trim()).toBe('Ver menos');
    expect(itemsOf(cardOf(element, 1))).toHaveLength(4);
    expect(toggleOf(cardOf(element, 1))?.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes the media-query and grid click listeners on destroy', async () => {
    const { fixture, element } = await renderDisclosure();
    const toggle = toggleOf(cardOf(element, 0)) as HTMLButtonElement;
    const transition = vi.spyOn(serviceCardDisclosure, 'transition');
    const focus = vi.spyOn(TestBed.inject(EffectRunner), 'focus');

    expect(query.addEventListener).toHaveBeenCalledTimes(1);
    expect(query.addEventListener.mock.calls[0][0]).toBe('change');
    fixture.destroy();

    expect(query.removeEventListener).toHaveBeenCalledTimes(1);
    expect(query.listeners.size).toBe(0);
    toggle.click();
    expect(transition).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
  });

  it('uses a delegated listener, no click bindings, and token styles with a focus ring', () => {
    const html = readFileSync('src/app/features/services/services.html', 'utf8');
    const css = readFileSync('src/app/features/services/services.scss', 'utf8');

    expect(html).not.toMatch(/\(click\)/);
    expect(css).toMatch(/\.service-toggle\s*{[^}]*--kva-component-button-text-min-height/);
    expect(css).toContain('--kva-component-button-text-text-color');
    expect(css).toMatch(/\.service-toggle:focus-visible/);
    expect(css).not.toMatch(/\.service-list[^{]*{[^}]*display:\s*none/);
  });
});

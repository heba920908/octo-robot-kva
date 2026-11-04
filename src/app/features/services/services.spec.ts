import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { ContentFacade, resolveServices } from '../../core/content/content-facade';
import { images } from '../../core/content/images.content';
import {
  services as launchServices,
  type ServiceContent,
} from '../../core/content/services.content';
import { uiStrings } from '../../core/content/ui-strings.content';
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

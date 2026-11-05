import { TestBed } from '@angular/core/testing';
import {
  ContentFacade,
  formatUiString,
  populatedSections,
  resolveServices,
} from './content-facade';
import { hero } from './hero.content';
import { images } from './images.content';
import { services } from './services.content';
import { siteContent } from './site.content';
import { privacyNotice } from './privacy-notice.content';
import { uiStrings } from './ui-strings.content';

describe('ContentFacade (AC2-3)', () => {
  it('exposes readonly site/UI data and populated visible sections (1.6-AC-02)', () => {
    const facade = TestBed.inject(ContentFacade);
    expect(facade.site).toEqual(siteContent);
    expect(facade.ui).toEqual(uiStrings);
    expect(facade.privacy).toEqual(privacyNotice);
    expect(Object.isFrozen(facade.privacy.sections[0].paragraphs)).toBe(true);
    expect(Object.isFrozen(facade.site.contact.phone)).toBe(true);
    expect(facade.hero).toEqual(hero);
    expect(Object.isFrozen(facade.hero)).toBe(true);
    expect(Object.isFrozen(facade.hero.logo)).toBe(true);
    expect(facade.visibleSections).toEqual(['hero', 'servicios', 'contacto']);
    expect(Object.isFrozen(facade.visibleSections)).toBe(true);
    expect(Object.isFrozen(facade.site)).toBe(true);
    expect(Object.isFrozen(facade.ui.menu)).toBe(true);
    expect(Object.isFrozen(facade.ui.servicesExpand.parameters)).toBe(true);
  });

  it('exposes frozen Services sorted by order and registers servicios (2.1-AC-02, 2.1-AC-06)', () => {
    const facade = TestBed.inject(ContentFacade);

    expect(facade.services.map((service) => service.id)).toEqual(
      services.map((service) => service.id),
    );
    expect(facade.services.map((service) => service.order)).toEqual([1, 2, 3, 4]);
    expect(Object.isFrozen(facade.services)).toBe(true);
    expect(Object.isFrozen(facade.services[0])).toBe(true);
    expect(Object.isFrozen(facade.services[0].subServices)).toBe(true);
  });

  it('sorts by order and resolves image ids with the Service alt, failing on unknown ids', () => {
    const base = { description: 'd', subServices: ['a'] };
    const resolved = resolveServices([
      { ...base, id: 'b', name: 'B', order: 2 },
      {
        ...base,
        id: 'a',
        name: 'A',
        order: 1,
        image: { id: 'wiring-technician', alt: 'Texto propio' },
      },
    ]);

    expect(resolved.map((service) => service.id)).toEqual(['a', 'b']);
    expect(resolved[0].image).toEqual({ ...images['wiring-technician'], alt: 'Texto propio' });
    expect(resolved[1].image).toBeUndefined();
    expect(() =>
      resolveServices([
        { ...base, id: 'd', name: 'D1', order: 1 },
        { ...base, id: 'd', name: 'D2', order: 2 },
      ]),
    ).toThrow(/duplicate.*d/i);
    expect(() =>
      resolveServices([{ ...base, id: 'c', name: 'C', order: 1, image: { id: 'nope', alt: 'x' } }]),
    ).toThrow(/c.*nope/);
  });

  it('formats known strings, zero, Spanish, numbers and plain text', () => {
    const facade = TestBed.inject(ContentFacade);
    expect(facade.format('menu')).toBe('Menú');
    expect(facade.format('filterCount', { n: 0, servicio: 'Instalación' })).toBe(
      '0 proyectos: Instalación',
    );
    expect(facade.format('footerCopyright', { year: 2026 })).toBe('© 2026 kVA Instalaciones');
    expect(facade.format('copyName', { address: '<b>{n}</b>' })).toBe('Copiar correo <b>{n}</b>');
    expect(formatUiString({ text: '{n}/{n}', parameters: ['n'] }, { n: 0 })).toBe('0/0');
  });

  it.each([
    [{}, /missing.*n/i],
    [{ n: 1, extra: 2 }, /unknown.*extra/i],
    [{ n: undefined }, /invalid.*n/i],
    [{ n: null }, /invalid.*n/i],
    [{ n: true }, /invalid.*n/i],
  ])('rejects invalid parameter maps %j', (values, message) => {
    expect(() => formatUiString({ text: '{n}', parameters: ['n'] }, values)).toThrow(message);
  });

  it('rejects unknown keys, invalid untyped maps and inconsistent placeholders', () => {
    const facade = TestBed.inject(ContentFacade);
    expect(() => Reflect.apply(facade.format, facade, ['invented'])).toThrow(/unknown.*invented/i);
    expect(() => Reflect.apply(facade.format, facade, ['toString'])).toThrow(/unknown/i);
    expect(() => Reflect.apply(facade.format, facade, ['menu', { n: 1 }])).toThrow(/unknown.*n/i);
    expect(() => Reflect.apply(facade.format, facade, ['servicesExpand'])).toThrow(/missing.*n/i);
    expect(() => formatUiString({ text: '{missing}', parameters: [] }, {})).toThrow(
      /placeholder.*missing/i,
    );
    expect(() => formatUiString({ text: '{n}', parameters: ['n'] }, null)).toThrow(/parameters/i);
    expect(() =>
      formatUiString({ text: '{n}', parameters: ['n'] }, Object.create({ n: 2 })),
    ).toThrow(/missing.*n/i);
  });

  it('keeps exact parameter contracts at compile time', () => {
    const facade = TestBed.inject(ContentFacade);
    if (false) {
      // @ts-expect-error Missing required named value.
      facade.format('filterCount', { n: 1 });
      // @ts-expect-error Unknown named value.
      facade.format('menu', { invented: 1 });
      // @ts-expect-error Unknown string key.
      facade.format('invented');
    }
  });

  it('filters absent, empty and label-only content and preserves page order', () => {
    expect(
      populatedSections([
        { id: 'contacto', content: { email: 'correo@empresa.mx' } },
        { id: 'confianza', content: [] },
        { id: 'nosotros', content: { label: 'Nosotros', items: [{}, '  '] } },
        { id: 'proyectos', content: [{ title: 'Proyecto' }] },
        { id: 'servicios', content: {} },
        { id: 'hero' },
      ]),
    ).toEqual(['proyectos', 'contacto']);
    expect(
      populatedSections([
        { id: 'contacto', content: 'Contacto real' },
        { id: 'confianza', content: 'Cliente real' },
        { id: 'nosotros', content: 'Empresa real' },
        { id: 'proyectos', content: 'Proyecto real' },
        { id: 'servicios', content: 'Servicio real' },
        { id: 'hero', content: 'Presentación real' },
      ]),
    ).toEqual(['hero', 'servicios', 'proyectos', 'nosotros', 'confianza', 'contacto']);
    expect(
      populatedSections([
        { id: 'hero', content: null },
        { id: 'contacto', content: '' },
      ]),
    ).toEqual([]);
  });
});

import { TestBed } from '@angular/core/testing';
import { ContentFacade } from '../content/content-facade';
import { EffectRunner } from '../effects/effects';
import { LayerController } from '../layers/layers';
import { SectionNavigation, sectionDomId } from './section-navigation';

function click(init: MouseEventInit = {}): MouseEvent {
  return new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init });
}

describe('SectionNavigation adapter (1.8-AC-03, AC-04, AC-05)', () => {
  let doc: Document;
  let adapter: SectionNavigation;
  let runner: EffectRunner;
  let heading: HTMLElement;
  let main: HTMLElement;
  const calls: string[] = [];

  function setup(visibleSections: readonly string[] = ['hero', 'contacto']) {
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () => Object.assign(new ContentFacade(), { visibleSections }),
    });
    adapter = TestBed.inject(SectionNavigation);
    runner = TestBed.inject(EffectRunner);
    vi.spyOn(runner, 'scroll').mockImplementation((effect) => {
      calls.push(`scroll:${effect.target}:${effect.instant}`);
      return true;
    });
    vi.spyOn(runner, 'focus').mockImplementation((effect) => {
      calls.push(`focus:${effect.target}:${effect.preventScroll === true}`);
      return true;
    });
    vi.spyOn(TestBed.inject(LayerController), 'replaceFragment').mockImplementation((fragment) => {
      calls.push(`replace:${fragment}`);
      return true;
    });
  }

  beforeEach(() => {
    calls.length = 0;
    doc = document;
    heading = doc.createElement('h2');
    heading.id = 'contacto-title';
    main = doc.createElement('main');
    main.id = 'main';
    doc.body.append(heading, main);
  });

  afterEach(() => {
    heading.remove();
    main.remove();
    vi.restoreAllMocks();
  });

  it('maps the Hero to #inicio and keeps other section ids', () => {
    expect(sectionDomId('hero')).toBe('inicio');
    expect(sectionDomId('contacto')).toBe('contacto');
  });

  it('applies scroll, focus and fragment replacement once, in order, and prevents the native jump', () => {
    setup();
    const event = click();

    adapter.activate(event, 'contacto');

    expect(calls).toEqual([
      'scroll:contacto:false',
      'focus:contacto-title:true',
      'replace:#contacto',
    ]);
    expect(event.defaultPrevented).toBe(true);
    expect(adapter.current()).toBe('contacto');
  });

  it('pre-applies the condensed scroll offset for section targets only', () => {
    setup();
    const root = doc.documentElement;
    root.removeAttribute('data-kva-header');

    adapter.activate(click(), 'inicio');
    expect(root.hasAttribute('data-kva-header')).toBe(false);

    adapter.activate(click(), 'contacto');
    expect(root.getAttribute('data-kva-header')).toBe('condensed');
    root.removeAttribute('data-kva-header');
  });

  it('activates the Hero heading from the logo link without the condensed offset', () => {
    setup();
    const root = doc.documentElement;
    root.removeAttribute('data-kva-header');
    const title = doc.createElement('h1');
    title.id = 'inicio-title';
    doc.body.append(title);

    adapter.activate(click(), 'inicio');
    title.remove();

    expect(calls).toEqual(['scroll:inicio:false', 'focus:inicio-title:true', 'replace:#inicio']);
    expect(root.hasAttribute('data-kva-header')).toBe(false);
  });

  it('leaves modified skip-link clicks native', () => {
    setup();
    const event = click({ ctrlKey: true });

    adapter.skipToMain(event);

    expect(event.defaultPrevented).toBe(false);
    expect(calls).toEqual([]);
  });

  it('scrolls instantly under prefers-reduced-motion', () => {
    setup();
    const view = doc.defaultView as Window;
    const original = Object.getOwnPropertyDescriptor(view, 'matchMedia');
    Object.defineProperty(view, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true }) as MediaQueryList,
    });

    try {
      adapter.activate(click(), 'contacto');
    } finally {
      if (original) Object.defineProperty(view, 'matchMedia', original);
      else delete (view as { matchMedia?: unknown }).matchMedia;
    }

    expect(calls[0]).toBe('scroll:contacto:true');
  });

  it.each([
    ['ctrl', { ctrlKey: true }],
    ['meta', { metaKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['middle button', { button: 1 }],
  ])('leaves a %s click native with no model event', (_name, init) => {
    setup();
    const event = click(init);

    adapter.activate(event, 'contacto');

    expect(calls).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
    expect(adapter.current()).toBeNull();
  });

  it('applies no effects when the target heading is missing', () => {
    setup();
    heading.remove();
    const event = click();

    adapter.activate(event, 'contacto');

    expect(calls).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });

  it('applies no effects for a section that is not visible (null transition)', () => {
    setup(['hero']);
    const event = click();

    adapter.activate(event, 'contacto');

    expect(calls).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
    expect(adapter.current()).toBeNull();
  });

  it('sets state only for scroll-spy and applies nothing for a duplicate', () => {
    setup();

    adapter.spy('contacto');
    adapter.spy('contacto');

    expect(adapter.current()).toBe('contacto');
    expect(calls).toEqual([]);
  });

  it('focuses main once from the skip link and prevents the native jump (1.8-AC-05)', () => {
    setup();
    const event = click();

    adapter.skipToMain(event);

    expect(calls).toEqual(['focus:main:false']);
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves the skip link native when main is missing', () => {
    setup();
    main.remove();
    const event = click();

    adapter.skipToMain(event);

    expect(calls).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });
});

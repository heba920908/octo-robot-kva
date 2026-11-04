import { TestBed } from '@angular/core/testing';
import { ContentFacade } from '../content/content-facade';
import { EffectRunner } from '../effects/effects';
import { LayerController } from '../layers/layers';
import { MobileMenu } from './mobile-menu';

function click(init: MouseEventInit = {}): MouseEvent {
  return new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init });
}

describe('MobileMenu adapter (1.9-AC-02..05)', () => {
  let adapter: MobileMenu;
  let layers: LayerController;
  let host: HTMLElement;
  let toggle: HTMLButtonElement;
  let link: HTMLAnchorElement;
  let hiddenLink: HTMLAnchorElement;
  let stop: () => void;
  const calls: string[] = [];

  beforeEach(() => {
    calls.length = 0;
    TestBed.overrideProvider(ContentFacade, {
      useFactory: () =>
        Object.assign(new ContentFacade(), { visibleSections: ['hero', 'contacto'] }),
    });
    adapter = TestBed.inject(MobileMenu);
    layers = TestBed.inject(LayerController);
    const runner = TestBed.inject(EffectRunner);
    vi.spyOn(runner, 'layer').mockImplementation((effect) => {
      calls.push(`layer:${effect.action}:${effect.overlay}`);
      return true;
    });
    vi.spyOn(runner, 'focus').mockImplementation((effect) => {
      calls.push(`focus:${effect.target}`);
      return true;
    });
    host = document.createElement('div');
    host.innerHTML =
      '<button data-menu-toggle id="t"></button><a href="#contacto" data-section-target="contacto"></a><a href="#servicios" data-section-target="servicios"></a>';
    document.body.appendChild(host);
    toggle = host.querySelector('button') as HTMLButtonElement;
    [link, hiddenLink] = Array.from(host.querySelectorAll('a'));
    stop = adapter.listen(host);
  });

  afterEach(() => {
    stop();
    host.remove();
    vi.restoreAllMocks();
  });

  it('opens once from the toggle and closes with focus on the toggle', () => {
    toggle.dispatchEvent(click());
    expect(calls).toEqual(['layer:open:mobile-menu']);
    expect(adapter.open()).toBe(true);

    calls.length = 0;
    toggle.dispatchEvent(click());
    expect(calls).toEqual(['layer:close:mobile-menu', 'focus:menu-toggle']);
    expect(adapter.open()).toBe(false);
  });

  it('ignores a non-primary toggle click', () => {
    toggle.dispatchEvent(click({ button: 1 }));

    expect(calls).toEqual([]);
    expect(adapter.open()).toBe(false);
  });

  it('closes on Esc once and applies nothing for Esc while closed', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(calls).toEqual([]);

    adapter.dispatch({ type: 'open' });
    calls.length = 0;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(calls).toEqual(['layer:close:mobile-menu', 'focus:menu-toggle']);

    calls.length = 0;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(calls).toEqual([]);
  });

  it('ignores other keys', () => {
    adapter.dispatch({ type: 'open' });
    calls.length = 0;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(calls).toEqual([]);
    expect(adapter.open()).toBe(true);
  });

  it('closes on a plain visible link click without preventing the native navigation', () => {
    adapter.dispatch({ type: 'open' });
    calls.length = 0;
    const event = click();

    link.dispatchEvent(event);

    expect(calls).toEqual(['layer:close:mobile-menu']);
    expect(event.defaultPrevented).toBe(false);
    expect(adapter.open()).toBe(false);
  });

  it.each([
    ['ctrl', { ctrlKey: true }],
    ['meta', { metaKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['middle button', { button: 1 }],
  ])('keeps the menu open on a %s link click', (_name, init) => {
    adapter.dispatch({ type: 'open' });
    calls.length = 0;

    link.dispatchEvent(click(init));

    expect(calls).toEqual([]);
    expect(adapter.open()).toBe(true);
  });

  it('applies nothing for a link to a hidden section or while closed', () => {
    link.dispatchEvent(click());
    expect(calls).toEqual([]);

    adapter.dispatch({ type: 'open' });
    calls.length = 0;
    hiddenLink.dispatchEvent(click());
    expect(calls).toEqual([]);
    expect(adapter.open()).toBe(true);
  });

  it('treats browser Back as one model event: focus on the toggle, no layer effect', () => {
    adapter.dispatch({ type: 'open' });
    calls.length = 0;

    document.defaultView?.history.pushState({ kvaLayer: 'mobile-menu' }, '');
    layers.open('mobile-menu');
    document.defaultView?.dispatchEvent(new PopStateEvent('popstate'));

    expect(calls).toEqual(['focus:menu-toggle']);
    expect(adapter.open()).toBe(false);
    document.defaultView?.history.replaceState(null, '', '/');
  });

  it('applies nothing for Back while closed', () => {
    layers.open('mobile-menu');
    document.defaultView?.dispatchEvent(new PopStateEvent('popstate'));

    expect(calls).toEqual([]);
    document.defaultView?.history.replaceState(null, '', '/');
  });

  it('applies nothing for null results', () => {
    expect(adapter.dispatch({ type: 'escape' })).toBe(false);
    expect(adapter.dispatch({ type: 'close' })).toBe(false);
    expect(calls).toEqual([]);
  });

  it('removes its listeners', () => {
    stop();
    toggle.dispatchEvent(click());
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(calls).toEqual([]);
    stop = adapter.listen(host);
  });
});

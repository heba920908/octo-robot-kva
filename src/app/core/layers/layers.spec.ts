import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BACK_FALLBACK_MS, LayerController } from './layers';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|html)$/.test(name) && !name.endsWith('.spec.ts') ? [path] : [];
  });
}

describe('LayerController (1.8-AC-04, AD-5)', () => {
  let controller: LayerController;
  let win: Window;

  beforeEach(() => {
    win = TestBed.inject(DOCUMENT).defaultView as Window;
    win.history.replaceState(null, '', '/');
    controller = TestBed.inject(LayerController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    win.history.replaceState(null, '', '/');
  });

  it('replaces the fragment without adding a history entry', () => {
    const length = win.history.length;
    const push = vi.spyOn(win.history, 'pushState');

    expect(controller.replaceFragment('#contacto')).toBe(true);

    expect(win.location.hash).toBe('#contacto');
    expect(win.history.length).toBe(length);
    expect(push).not.toHaveBeenCalled();
    expect(controller.fragment()).toBe('#contacto');
  });

  it('keeps the path and query, and preserves the history state', () => {
    win.history.replaceState({ keep: 1 }, '', '/octo?x=1');

    controller.replaceFragment('#inicio');

    expect(win.location.pathname + win.location.search + win.location.hash).toBe(
      '/octo?x=1#inicio',
    );
    expect(win.history.state).toEqual({ keep: 1 });
  });

  it.each(['', '#', 'contacto', '#1abc', '#a b', '#a"b', 'javascript:alert(1)', '#a#b'])(
    'rejects the invalid fragment %j',
    (fragment) => {
      const replace = vi.spyOn(win.history, 'replaceState');

      expect(controller.replaceFragment(fragment)).toBe(false);
      expect(replace).not.toHaveBeenCalled();
    },
  );

  it('serializes operations in request order, including re-entrant requests', () => {
    const calls: string[] = [];
    const original = win.history.replaceState.bind(win.history);
    vi.spyOn(win.history, 'replaceState').mockImplementation((state, unused, url) => {
      calls.push(String(url));
      if (String(url).endsWith('#a')) controller.replaceFragment('#c');
      calls.push(`done:${String(url)}`);
      original(state, unused, url);
    });

    controller.replaceFragment('#a');
    controller.replaceFragment('#b');

    // `#c` was requested while `#a` ran, so it completes before the later `#b`.
    expect(calls).toEqual(['/#a', 'done:/#a', '/#c', 'done:/#c', '/#b', 'done:/#b']);
    expect(controller.fragment()).toBe('#b');
  });

  it('updates the fragment signal from a single popstate listener and removes it on destroy', () => {
    const add = vi.spyOn(win, 'addEventListener');
    TestBed.resetTestingModule();
    const fresh = TestBed.inject(LayerController);
    expect(add.mock.calls.filter(([type]) => type === 'popstate')).toHaveLength(1);

    win.history.replaceState(null, '', '/#aviso');
    win.dispatchEvent(new PopStateEvent('popstate'));
    expect(fresh.fragment()).toBe('#aviso');

    fresh.ngOnDestroy();
    win.history.replaceState(null, '', '/#otro');
    win.dispatchEvent(new PopStateEvent('popstate'));
    expect(fresh.fragment()).toBe('#aviso');
  });

  it('is the only application source that mentions history mutation or popstate', () => {
    const offenders = sourceFiles('src/app').filter(
      (path) =>
        !path.endsWith('core/layers/layers.ts') &&
        /replaceState|pushState|popstate|history\s*\.\s*back/i.test(readFileSync(path, 'utf8')),
    );

    expect(offenders).toEqual([]);
  });
});

describe('LayerController overlays (1.9-AC-03, AC-04, AC-05, AD-5)', () => {
  let controller: LayerController;
  let win: Window;
  let doc: Document;
  let main: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    doc = TestBed.inject(DOCUMENT);
    win = doc.defaultView as Window;
    win.history.replaceState(null, '', '/');
    main = doc.createElement('main');
    footer = doc.createElement('footer');
    doc.body.append(main, footer);
    controller = TestBed.inject(LayerController);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    controller.ngOnDestroy();
    main.remove();
    footer.remove();
    win.history.replaceState(null, '', '/');
  });

  function popstate() {
    win.dispatchEvent(new PopStateEvent('popstate'));
  }

  it('opens: pushes one entry, makes main and footer inert, locks scroll and marks it active', () => {
    const push = vi.spyOn(win.history, 'pushState');
    const length = win.history.length;

    expect(controller.open('mobile-menu')).toBe(true);

    expect(push).toHaveBeenCalledTimes(1);
    expect(win.history.length).toBe(length + 1);
    expect(win.history.state).toEqual({ kvaLayer: 'mobile-menu' });
    expect(main.hasAttribute('inert')).toBe(true);
    expect(footer.hasAttribute('inert')).toBe(true);
    expect(doc.documentElement.getAttribute('data-kva-layer')).toBe('mobile-menu');
    expect(controller.active()).toBe('mobile-menu');
  });

  it('allows only one overlay at a time', () => {
    const push = vi.spyOn(win.history, 'pushState');
    controller.open('mobile-menu');

    expect(controller.open('privacy-notice')).toBe(false);
    expect(push).toHaveBeenCalledTimes(1);
    expect(controller.active()).toBe('mobile-menu');
  });

  it('does not touch elements that were already inert', () => {
    main.setAttribute('inert', '');
    controller.open('mobile-menu');
    controller.close('mobile-menu');

    expect(main.hasAttribute('inert')).toBe(true);
    expect(footer.hasAttribute('inert')).toBe(false);
  });

  it('closes: releases inert and scroll lock synchronously, then consumes the entry with back()', () => {
    controller.open('mobile-menu');
    const length = win.history.length;
    const back = vi.spyOn(win.history, 'back');

    expect(controller.close('mobile-menu')).toBe(true);

    expect(main.hasAttribute('inert')).toBe(false);
    expect(footer.hasAttribute('inert')).toBe(false);
    expect(doc.documentElement.hasAttribute('data-kva-layer')).toBe(false);
    expect(controller.active()).toBeNull();
    expect(back).toHaveBeenCalledTimes(1);
    expect(win.history.length).toBe(length);
  });

  it('does nothing when closing an overlay that is not open', () => {
    const back = vi.spyOn(win.history, 'back');

    expect(controller.close('mobile-menu')).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it('guards back(): it is skipped when the layer entry is no longer current', () => {
    controller.open('mobile-menu');
    win.history.replaceState(null, '', '/');
    const back = vi.spyOn(win.history, 'back');

    controller.close('mobile-menu');

    expect(back).not.toHaveBeenCalled();
    expect(controller.active()).toBeNull();
  });

  it('holds a later fragment replacement behind the traversal until popstate', () => {
    controller.open('mobile-menu');
    const order: string[] = [];
    const back = vi.spyOn(win.history, 'back').mockImplementation(() => {
      order.push('back');
    });
    const replace = vi.spyOn(win.history, 'replaceState').mockImplementation(() => {
      order.push('replace');
    });

    controller.close('mobile-menu');
    controller.replaceFragment('#contacto');
    expect(order).toEqual(['back']);
    expect(back).toHaveBeenCalledTimes(1);

    popstate();
    expect(order).toEqual(['back', 'replace']);
    expect(replace).toHaveBeenCalledTimes(1);
    expect(controller.fragment()).toBe('#contacto');
  });

  it('proceeds after the fallback timeout when popstate never arrives', () => {
    vi.useFakeTimers();
    controller.open('mobile-menu');
    vi.spyOn(win.history, 'back').mockImplementation(() => undefined);
    const replace = vi.spyOn(win.history, 'replaceState').mockImplementation(() => undefined);

    controller.close('mobile-menu');
    controller.replaceFragment('#contacto');
    vi.advanceTimersByTime(BACK_FALLBACK_MS - 1);
    expect(replace).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('treats a real traversal as the end of the close (the entry is consumed once)', async () => {
    controller.open('mobile-menu');
    const back = vi.spyOn(win.history, 'back');
    const replace = vi.spyOn(win.history, 'replaceState');

    controller.close('mobile-menu');
    controller.replaceFragment('#contacto');
    await new Promise((resolve) => win.addEventListener('popstate', resolve, { once: true }));
    await Promise.resolve();

    expect(back).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledTimes(1);
    expect(win.location.hash).toBe('#contacto');
  });

  it('browser Back releases the page and notifies handlers once with the overlay', () => {
    const handler = vi.fn();
    controller.onBack(handler);
    controller.open('mobile-menu');
    const back = vi.spyOn(win.history, 'back');

    popstate();

    expect(handler).toHaveBeenCalledExactlyOnceWith('mobile-menu');
    expect(controller.active()).toBeNull();
    expect(main.hasAttribute('inert')).toBe(false);
    expect(doc.documentElement.hasAttribute('data-kva-layer')).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it('does not notify Back handlers while no overlay is open or after unsubscribing', () => {
    const handler = vi.fn();
    const off = controller.onBack(handler);

    popstate();
    expect(handler).not.toHaveBeenCalled();

    off();
    controller.open('mobile-menu');
    popstate();
    expect(handler).not.toHaveBeenCalled();
  });

  it('ignores the popstate caused by its own close() for Back handlers', () => {
    const handler = vi.fn();
    controller.onBack(handler);
    controller.open('mobile-menu');
    vi.spyOn(win.history, 'back').mockImplementation(() => undefined);

    controller.close('mobile-menu');
    popstate();

    expect(handler).not.toHaveBeenCalled();
  });

  it('keeps serving later history operations after one throws', () => {
    const replace = vi.spyOn(win.history, 'replaceState').mockImplementationOnce(() => {
      throw new Error('SecurityError');
    });

    expect(() => controller.replaceFragment('#a')).toThrow('SecurityError');
    replace.mockRestore();

    expect(controller.replaceFragment('#b')).toBe(true);
    expect(win.location.hash).toBe('#b');
  });

  it('releases the page when destroyed while open', () => {
    controller.open('mobile-menu');

    controller.ngOnDestroy();

    expect(main.hasAttribute('inert')).toBe(false);
    expect(doc.documentElement.hasAttribute('data-kva-layer')).toBe(false);
  });
});

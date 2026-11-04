import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LayerController } from './layers';

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

  it('is the only application source that mentions replaceState, pushState or popstate', () => {
    const offenders = sourceFiles('src/app').filter(
      (path) =>
        !path.endsWith('core/layers/layers.ts') &&
        /replaceState|pushState|popstate/i.test(readFileSync(path, 'utf8')),
    );

    expect(offenders).toEqual([]);
    expect(readFileSync('src/app/core/layers/layers.ts', 'utf8')).not.toMatch(/pushState\s*\(/);
  });
});

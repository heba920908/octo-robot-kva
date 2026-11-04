import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import designTokens from '../schemas/design-tokens.json';
import { LayerController } from '../layers/layers';
import {
  ANNOUNCEMENT_DELAY_MS,
  COPY_STATUS_HOLD_MS,
  EffectRunner,
  type AnnounceEffect,
  type CopyEffect,
} from './effects';

describe('EffectRunner focus, scroll and navigate (1.8-AC-03, AC-04)', () => {
  let runner: EffectRunner;
  let doc: Document;
  let target: HTMLElement;

  beforeEach(() => {
    runner = TestBed.inject(EffectRunner);
    doc = TestBed.inject(DOCUMENT);
    target = doc.createElement('h2');
    target.id = 'contacto-title';
    target.tabIndex = -1;
    target.scrollIntoView = vi.fn();
    doc.body.appendChild(target);
  });

  afterEach(() => {
    target.remove();
    vi.restoreAllMocks();
  });

  it('focuses the target, scrolling only unless preventScroll is requested', () => {
    const focus = vi.spyOn(target, 'focus');

    expect(runner.focus({ kind: 'focus', target: 'contacto-title', preventScroll: true })).toBe(
      true,
    );
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    expect(doc.activeElement).toBe(target);

    runner.focus({ kind: 'focus', target: 'contacto-title' });
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: false });
  });

  it('does nothing for a missing focus or scroll target', () => {
    expect(runner.focus({ kind: 'focus', target: 'ausente' })).toBe(false);
    expect(runner.scroll({ kind: 'scroll', target: 'ausente', instant: false })).toBe(false);
  });

  it.each([
    [false, 'smooth'],
    [true, 'auto'],
  ])('scrolls to the target (instant=%s -> %s)', (instant, behavior) => {
    expect(runner.scroll({ kind: 'scroll', target: 'contacto-title', instant })).toBe(true);

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior, block: 'start' });
  });

  it('delegates fragment replacement to the layer controller and never pushes history', () => {
    const replace = vi.spyOn(TestBed.inject(LayerController), 'replaceFragment');

    expect(runner.navigate({ kind: 'navigate', fragment: '#contacto', replace: true })).toBe(true);
    expect(replace).toHaveBeenCalledExactlyOnceWith('#contacto');

    replace.mockClear();
    expect(runner.navigate({ kind: 'navigate', fragment: '#contacto', replace: false })).toBe(
      false,
    );
    expect(replace).not.toHaveBeenCalled();
  });
});

describe('EffectRunner (1.6-AC-03, AC-04, AC-05)', () => {
  let runner: EffectRunner;
  let doc: Document;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    runner = TestBed.inject(EffectRunner);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    runner.ngOnDestroy();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('copy effect', () => {
    const effect: CopyEffect = {
      kind: 'copy',
      text: 'proyectos1@kvainstalaciones.mx',
    };

    it('writes text via Async Clipboard API and resolves true on success', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      });

      const ok = await runner.copy(effect);

      expect(ok).toBe(true);
      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith('proyectos1@kvainstalaciones.mx');
    });

    it('resolves false when navigator.clipboard.writeText rejects', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      });

      const ok = await runner.copy(effect);

      expect(ok).toBe(false);
    });

    it('resolves false when navigator.clipboard is unavailable', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });

      const ok = await runner.copy(effect);

      expect(ok).toBe(false);
    });

    it('selects element text via the Selection API for copy-failure fallback', () => {
      const anchor = doc.createElement('a');
      anchor.textContent = 'proyectos1@kvainstalaciones.mx';
      doc.body.appendChild(anchor);
      try {
        const selected = runner.selectElementText(anchor);

        expect(selected).toBe(true);
        expect(doc.getSelection()?.toString()).toBe('proyectos1@kvainstalaciones.mx');
      } finally {
        anchor.remove();
        doc.getSelection()?.removeAllRanges();
      }
    });

    it('returns false gracefully when target element is null or selection fails', () => {
      expect(runner.selectElementText(null)).toBe(false);
      const anchor = doc.createElement('a');
      vi.spyOn(doc, 'getSelection').mockReturnValue(null);
      expect(runner.selectElementText(anchor)).toBe(false);
    });
  });

  describe('announce effect', () => {
    const effect: AnnounceEffect = {
      kind: 'announce',
      message: 'Copiado',
    };

    it('clears the live region immediately, sets message ~100 ms later, and calls onHoldComplete after 2500 ms', () => {
      const values: string[] = ['Previo'];
      const expired = vi.fn();

      runner.announce(effect, (text) => values.push(text), {
        holdMs: COPY_STATUS_HOLD_MS,
        onHoldComplete: expired,
      });

      expect(values).toEqual(['Previo', '']);

      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS - 1);
      expect(values).toEqual(['Previo', '']);

      vi.advanceTimersByTime(1);
      expect(values).toEqual(['Previo', '', 'Copiado']);
      expect(expired).not.toHaveBeenCalled();

      vi.advanceTimersByTime(COPY_STATUS_HOLD_MS - 1);
      expect(expired).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(expired).toHaveBeenCalledTimes(1);
    });

    it('cancels prior timers on rapid re-announcement so no stale callback fires', () => {
      const values: string[] = [];
      const firstHold = vi.fn();
      const secondHold = vi.fn();

      runner.announce(effect, (text) => values.push(text), {
        holdMs: COPY_STATUS_HOLD_MS,
        onHoldComplete: firstHold,
      });
      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS);
      expect(values).toEqual(['', 'Copiado']);

      runner.announce({ kind: 'announce', message: 'Copiado' }, (text) => values.push(text), {
        holdMs: COPY_STATUS_HOLD_MS,
        onHoldComplete: secondHold,
      });
      expect(values).toEqual(['', 'Copiado', '']);

      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS);
      expect(values).toEqual(['', 'Copiado', '', 'Copiado']);

      vi.advanceTimersByTime(COPY_STATUS_HOLD_MS);
      expect(firstHold).not.toHaveBeenCalled();
      expect(secondHold).toHaveBeenCalledTimes(1);
    });

    it('cancels a pending announceDelayId timer when re-announced at 50 ms and matches design-tokens.json hold duration', () => {
      expect(`${COPY_STATUS_HOLD_MS}ms`).toBe(designTokens.motion['copy-status-hold']);

      const values: string[] = [];
      const firstHold = vi.fn();
      const secondHold = vi.fn();

      runner.announce({ kind: 'announce', message: 'Primero' }, (text) => values.push(text), {
        holdMs: COPY_STATUS_HOLD_MS,
        onHoldComplete: firstHold,
      });

      vi.advanceTimersByTime(50);
      expect(values).toEqual(['']);

      runner.announce({ kind: 'announce', message: 'Segundo' }, (text) => values.push(text), {
        holdMs: COPY_STATUS_HOLD_MS,
        onHoldComplete: secondHold,
      });
      expect(values).toEqual(['', '']);

      vi.advanceTimersByTime(50);
      expect(values).toEqual(['', '']);

      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS - 50);
      expect(values).toEqual(['', '', 'Segundo']);

      vi.advanceTimersByTime(COPY_STATUS_HOLD_MS);
      expect(firstHold).not.toHaveBeenCalled();
      expect(secondHold).toHaveBeenCalledTimes(1);
    });

    it('announces without hold timeout when holdMs is omitted (failure announcement)', () => {
      const values: string[] = [];
      runner.announce(
        {
          kind: 'announce',
          message: 'No se pudo copiar. Selecciona el correo y cópialo.',
        },
        (text) => values.push(text),
      );

      expect(values).toEqual(['']);
      vi.advanceTimersByTime(ANNOUNCEMENT_DELAY_MS);
      expect(values).toEqual(['', 'No se pudo copiar. Selecciona el correo y cópialo.']);
      vi.advanceTimersByTime(COPY_STATUS_HOLD_MS * 2);
      expect(values).toEqual(['', 'No se pudo copiar. Selecciona el correo y cópialo.']);
    });
  });
});

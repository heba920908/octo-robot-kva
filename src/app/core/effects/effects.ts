import { DOCUMENT } from '@angular/common';
import { Injectable, inject, type OnDestroy } from '@angular/core';

/** Closed effect union; only the effect runner executes these. */

export type OverlayId = 'mobile-menu' | 'contact-composer' | 'project-detail' | 'privacy-notice';

/** Move keyboard focus to the element whose id is `target`. */
export interface FocusEffect {
  readonly kind: 'focus';
  readonly target: string;
}

/** Open or close an overlay through the layer controller. */
export interface LayerEffect {
  readonly kind: 'layer';
  readonly action: 'open' | 'close';
  readonly overlay: OverlayId;
}

/** Update the fragment through the layer controller; `replace` avoids a new history entry. */
export interface NavigateEffect {
  readonly kind: 'navigate';
  readonly fragment: string;
  readonly replace: boolean;
}

/** Write plain text to the clipboard. */
export interface CopyEffect {
  readonly kind: 'copy';
  readonly text: string;
}

/** Announce `message` politely in the persistent live region. */
export interface AnnounceEffect {
  readonly kind: 'announce';
  readonly message: string;
}

/** Scroll the element whose id is `target` into view; `instant` disables smooth motion. */
export interface ScrollEffect {
  readonly kind: 'scroll';
  readonly target: string;
  readonly instant: boolean;
}

export type Effect =
  FocusEffect | LayerEffect | NavigateEffect | CopyEffect | AnnounceEffect | ScrollEffect;

export const ANNOUNCEMENT_DELAY_MS = 100;
export const COPY_STATUS_HOLD_MS = 2500;

export interface AnnounceOptions {
  readonly holdMs?: number;
  readonly onHoldComplete?: () => void;
}

@Injectable({ providedIn: 'root' })
export class EffectRunner implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private announceDelayId: ReturnType<typeof setTimeout> | null = null;
  private announceHoldId: ReturnType<typeof setTimeout> | null = null;

  async copy(effect: CopyEffect): Promise<boolean> {
    const clipboard = this.document.defaultView?.navigator?.clipboard;
    if (!clipboard || typeof clipboard.writeText !== 'function') {
      return false;
    }
    try {
      await clipboard.writeText(effect.text);
      return true;
    } catch {
      return false;
    }
  }

  selectElementText(element: HTMLElement | null): boolean {
    if (!element) return false;
    try {
      const selection = this.document.getSelection();
      if (!selection) return false;
      const range = this.document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    } catch {
      return false;
    }
  }

  announce(
    effect: AnnounceEffect,
    setLiveText: (message: string) => void,
    options?: AnnounceOptions,
  ): void {
    this.clearAnnounceTimers();
    setLiveText('');
    this.announceDelayId = setTimeout(() => {
      this.announceDelayId = null;
      setLiveText(effect.message);
      if (options?.holdMs && options.holdMs > 0) {
        this.announceHoldId = setTimeout(() => {
          this.announceHoldId = null;
          options.onHoldComplete?.();
        }, options.holdMs);
      }
    }, ANNOUNCEMENT_DELAY_MS);
  }

  clearAnnounceTimers(): void {
    if (this.announceDelayId !== null) {
      clearTimeout(this.announceDelayId);
      this.announceDelayId = null;
    }
    if (this.announceHoldId !== null) {
      clearTimeout(this.announceHoldId);
      this.announceHoldId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearAnnounceTimers();
  }
}

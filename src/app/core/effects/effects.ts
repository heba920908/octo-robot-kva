/** Closed effect union; only the effect runner executes these. Executors arrive with Story 1.6. */

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

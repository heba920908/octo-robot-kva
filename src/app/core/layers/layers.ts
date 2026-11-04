import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal, type OnDestroy } from '@angular/core';

const FRAGMENT_PATTERN = /^#[A-Za-z][\w-]*$/;
const LAYER_STATE_KEY = 'kvaLayer';
const INERT_SELECTOR = 'main, footer';

/** Longest wait for a traversal to report back before the next history operation proceeds. */
export const BACK_FALLBACK_MS = 500;

/** Overlays that `core/layers` can open; mirrors the `OverlayId` effect payload. */
export type LayerId = 'mobile-menu' | 'contact-composer' | 'project-detail' | 'privacy-notice';

type Operation = (done: () => void) => void;

/** Sole owner of history mutation and the only `popstate` listener (AD-5). */
@Injectable({ providedIn: 'root' })
export class LayerController implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly window = isPlatformBrowser(inject(PLATFORM_ID))
    ? this.document.defaultView
    : null;
  private readonly queue: Operation[] = [];
  private busy = false;
  private pendingBack: (() => void) | null = null;
  private inertElements: Element[] = [];
  private readonly backHandlers = new Set<(overlay: LayerId) => void>();
  private readonly listener = () => this.onPopState();
  private readonly fragmentState = signal(this.window?.location.hash ?? '');
  private readonly activeState = signal<LayerId | null>(null);

  /** Current URL fragment, including the leading `#` (empty when none). */
  readonly fragment = this.fragmentState.asReadonly();

  /** The open overlay, `null` when none; only one overlay is active at a time. */
  readonly active = this.activeState.asReadonly();

  constructor() {
    this.window?.addEventListener('popstate', this.listener);
  }

  /** Replace the fragment without adding a history entry; returns false for an invalid fragment. */
  replaceFragment(fragment: string): boolean {
    const view = this.window;
    if (!view || !FRAGMENT_PATTERN.test(fragment)) return false;
    this.enqueue((done) => {
      const { pathname, search } = view.location;
      view.history.replaceState(view.history.state, '', `${pathname}${search}${fragment}`);
      this.fragmentState.set(fragment);
      done();
    });
    return true;
  }

  /** Open an overlay: inert page, scroll lock and one history entry. False if one is already open. */
  open(overlay: LayerId): boolean {
    const view = this.window;
    if (!view || this.activeState() !== null) return false;
    this.activeState.set(overlay);
    this.lockPage(overlay);
    this.enqueue((done) => {
      view.history.pushState({ [LAYER_STATE_KEY]: overlay }, '');
      done();
    });
    return true;
  }

  /**
   * Close an overlay. Inert and scroll lock are released at once so focus can move; the history
   * entry is then consumed by a guarded `history.back()` that later operations wait for.
   */
  close(overlay: LayerId): boolean {
    const view = this.window;
    if (!view || this.activeState() !== overlay) return false;
    this.releasePage();
    this.enqueue((done) => {
      if (!this.ownsCurrentEntry(overlay)) {
        done();
        return;
      }
      const finish = () => {
        clearTimeout(timer);
        if (this.pendingBack === finish) this.pendingBack = null;
        done();
      };
      const timer = setTimeout(finish, BACK_FALLBACK_MS);
      this.pendingBack = finish;
      view.history.back();
    });
    return true;
  }

  /** Register a handler for browser Back on an open overlay; returns the unsubscribe function. */
  onBack(handler: (overlay: LayerId) => void): () => void {
    this.backHandlers.add(handler);
    return () => this.backHandlers.delete(handler);
  }

  ngOnDestroy(): void {
    this.window?.removeEventListener('popstate', this.listener);
    this.releasePage();
    this.backHandlers.clear();
  }

  private onPopState(): void {
    const view = this.window;
    this.fragmentState.set(view?.location.hash ?? '');
    const pending = this.pendingBack;
    if (pending) {
      pending();
      return;
    }
    const overlay = this.activeState();
    if (overlay === null) return;
    this.releasePage();
    for (const handler of [...this.backHandlers]) handler(overlay);
  }

  private ownsCurrentEntry(overlay: LayerId): boolean {
    const state: unknown = this.window?.history.state;
    return (
      typeof state === 'object' &&
      state !== null &&
      (state as Record<string, unknown>)[LAYER_STATE_KEY] === overlay
    );
  }

  private lockPage(overlay: LayerId): void {
    this.inertElements = Array.from(this.document.querySelectorAll(INERT_SELECTOR)).filter(
      (element) => !element.hasAttribute('inert'),
    );
    for (const element of this.inertElements) element.setAttribute('inert', '');
    this.document.documentElement.setAttribute('data-kva-layer', overlay);
  }

  private releasePage(): void {
    for (const element of this.inertElements) element.removeAttribute('inert');
    this.inertElements = [];
    this.document.documentElement.removeAttribute('data-kva-layer');
    this.activeState.set(null);
  }

  // History operations run one at a time, in request order, even when re-entered; an operation
  // may finish later (a traversal), and the next one waits for it.
  private enqueue(operation: Operation): void {
    this.queue.push(operation);
    this.pump();
  }

  private pump(): void {
    if (this.busy) return;
    const next = this.queue.shift();
    if (!next) return;
    this.busy = true;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      this.busy = false;
      this.pump();
    };
    try {
      next(done);
    } catch (error) {
      done();
      throw error;
    }
  }
}

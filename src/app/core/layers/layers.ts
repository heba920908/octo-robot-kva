import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal, type OnDestroy } from '@angular/core';

const FRAGMENT_PATTERN = /^#[A-Za-z][\w-]*$/;

/** Sole owner of history mutation and the only `popstate` listener (AD-5). */
@Injectable({ providedIn: 'root' })
export class LayerController implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly window = isPlatformBrowser(inject(PLATFORM_ID))
    ? this.document.defaultView
    : null;
  private readonly queue: Array<() => void> = [];
  private draining = false;
  private readonly listener = () => this.fragmentState.set(this.window?.location.hash ?? '');
  private readonly fragmentState = signal(this.window?.location.hash ?? '');

  /** Current URL fragment, including the leading `#` (empty when none). */
  readonly fragment = this.fragmentState.asReadonly();

  constructor() {
    this.window?.addEventListener('popstate', this.listener);
  }

  /** Replace the fragment without adding a history entry; returns false for an invalid fragment. */
  replaceFragment(fragment: string): boolean {
    const view = this.window;
    if (!view || !FRAGMENT_PATTERN.test(fragment)) return false;
    this.enqueue(() => {
      const { pathname, search } = view.location;
      view.history.replaceState(view.history.state, '', `${pathname}${search}${fragment}`);
      this.fragmentState.set(fragment);
    });
    return true;
  }

  ngOnDestroy(): void {
    this.window?.removeEventListener('popstate', this.listener);
  }

  // History operations run one at a time, in request order, even when re-entered.
  private enqueue(operation: () => void): void {
    this.queue.push(operation);
    if (this.draining) return;
    this.draining = true;
    try {
      for (let next = this.queue.shift(); next; next = this.queue.shift()) next();
    } finally {
      this.draining = false;
    }
  }
}

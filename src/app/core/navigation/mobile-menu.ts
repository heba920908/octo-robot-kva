import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  mobileMenu,
  type MobileMenuEvent,
  type MobileMenuState,
} from '../../behaviors/mobile-menu.behavior';
import { ContentFacade } from '../content/content-facade';
import { EffectRunner, type Effect } from '../effects/effects';
import { LayerController } from '../layers/layers';
import { isPlainClick, sectionDomId } from './section-navigation';

/** Adapter: feeds events to the `mobile-menu` model and applies each result once. */
@Injectable({ providedIn: 'root' })
export class MobileMenu {
  private readonly document = inject(DOCUMENT);
  private readonly effects = inject(EffectRunner);
  private readonly layers = inject(LayerController);
  private readonly visibleIds: ReadonlySet<string> = new Set(
    inject(ContentFacade).visibleSections.map(sectionDomId),
  );
  private readonly state = signal<MobileMenuState>({ open: false });

  /** Whether the menu is open. */
  readonly open = computed(() => this.state().open);

  /**
   * Delegated toggle and link clicks inside `host`, Esc on the document and browser Back.
   * Register before `SectionNavigation.listen` so a link choice closes the menu first.
   * Template `(click)` bindings would make Angular inline an event-replay script that CSP forbids.
   */
  listen(host: HTMLElement): () => void {
    const onClick = (event: MouseEvent) => {
      const source = event.target as Element | null;
      const toggle = source?.closest?.<HTMLElement>('[data-menu-toggle]');
      if (toggle && host.contains(toggle)) {
        if (event.button === 0) this.dispatch({ type: 'toggle' });
        return;
      }
      const link = source?.closest?.<HTMLElement>('[data-section-target]');
      if (!link || !host.contains(link) || !isPlainClick(event)) return;
      const target = link.dataset['sectionTarget'] ?? '';
      this.dispatch({ type: 'choose-link', target, visible: this.visibleIds.has(target) });
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.dispatch({ type: 'escape' });
    };
    const offBack = this.layers.onBack((overlay) => {
      if (overlay === 'mobile-menu') this.dispatch({ type: 'back' });
    });
    host.addEventListener('click', onClick);
    this.document.addEventListener('keydown', onKey);
    return () => {
      host.removeEventListener('click', onClick);
      this.document.removeEventListener('keydown', onKey);
      offBack();
    };
  }

  /** Applies a non-null result exactly once; returns false (and applies nothing) for `null`. */
  dispatch(event: MobileMenuEvent): boolean {
    const result = mobileMenu.transition(this.state(), event);
    if (!result) return false;
    this.state.set(result.state);
    for (const effect of result.effects) this.run(effect);
    return true;
  }

  private run(effect: Effect): void {
    switch (effect.kind) {
      case 'layer':
        this.effects.layer(effect);
        break;
      case 'focus':
        this.effects.focus(effect);
        break;
      default:
        break;
    }
  }
}

import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  sectionNavigation,
  type SectionNavigationEvent,
  type SectionNavigationState,
} from '../../behaviors/section-navigation.behavior';
import { ContentFacade, type SectionId } from '../content/content-facade';
import { EffectRunner, type Effect } from '../effects/effects';

/** Root attribute the header sets once condensed; it selects the condensed scroll offset. */
export const CONDENSED_ATTRIBUTE = 'data-kva-header';

/** DOM id of a section; the Hero is the page top (`#inicio`). */
export function sectionDomId(section: SectionId): string {
  return section === 'hero' ? 'inicio' : section;
}

function isPlainClick(event: MouseEvent): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
  );
}

/** Adapter: feeds events to the `section-navigation` model and applies each result once. */
@Injectable({ providedIn: 'root' })
export class SectionNavigation {
  private readonly document = inject(DOCUMENT);
  private readonly effects = inject(EffectRunner);
  private readonly visibleIds: ReadonlySet<string> = new Set(
    inject(ContentFacade).visibleSections.map(sectionDomId),
  );
  private readonly state = signal<SectionNavigationState>({ current: null });

  /** DOM id of the section under the header line, `null` in the Hero. */
  readonly current = computed(() => this.state().current);

  /**
   * Delegated click handling for `[data-section-target]` links and `[data-skip-main]`.
   * Template `(click)` bindings would make Angular inline an event-replay script that CSP forbids.
   */
  listen(host: HTMLElement): () => void {
    const handler = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLElement>(
        '[data-section-target], [data-skip-main]',
      );
      if (!link || !host.contains(link)) return;
      if (link.hasAttribute('data-skip-main')) this.skipToMain(event);
      else this.activate(event, link.dataset['sectionTarget'] ?? '');
    };
    host.addEventListener('click', handler);
    return () => host.removeEventListener('click', handler);
  }

  /** Link activation: modified clicks and missing headings stay native anchors. */
  activate(event: MouseEvent, target: string): void {
    if (!isPlainClick(event) || !this.document.getElementById(`${target}-title`)) return;
    const reducedMotion =
      this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    // The header condenses while the page scrolls; aim at the offset it will have on arrival.
    if (target !== sectionDomId('hero') && this.visibleIds.has(target)) {
      this.document.documentElement.setAttribute(CONDENSED_ATTRIBUTE, 'condensed');
    }
    const applied = this.dispatch({
      type: 'activate-link',
      target,
      visible: this.visibleIds.has(target),
      reducedMotion,
    });
    if (applied) event.preventDefault();
  }

  skipToMain(event: MouseEvent): void {
    if (!isPlainClick(event) || !this.document.getElementById('main')) return;
    if (this.dispatch({ type: 'skip-to-main' })) event.preventDefault();
  }

  spy(current: string | null): void {
    this.dispatch({ type: 'scroll-spy', current });
  }

  /** Applies a non-null result exactly once; returns false (and applies nothing) for `null`. */
  dispatch(event: SectionNavigationEvent): boolean {
    const result = sectionNavigation.transition(this.state(), event);
    if (!result) return false;
    this.state.set(result.state);
    for (const effect of result.effects) this.run(effect);
    return true;
  }

  private run(effect: Effect): void {
    switch (effect.kind) {
      case 'focus':
        this.effects.focus(effect);
        break;
      case 'scroll':
        this.effects.scroll(effect);
        break;
      case 'navigate':
        this.effects.navigate(effect);
        break;
      default:
        break;
    }
  }
}

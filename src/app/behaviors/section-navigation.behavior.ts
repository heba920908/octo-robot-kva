import type { BehaviorModel } from './behavior-model';

/** `current` is the DOM id of the section under the header line; `null` while in the Hero. */
export interface SectionNavigationState {
  readonly current: string | null;
}

export type SectionNavigationEvent =
  | {
      readonly type: 'activate-link';
      readonly target: string;
      readonly visible: boolean;
      readonly reducedMotion: boolean;
    }
  | { readonly type: 'scroll-spy'; readonly current: string | null }
  | { readonly type: 'skip-to-main' };

function nonBlank(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const sectionNavigation: BehaviorModel<SectionNavigationState, SectionNavigationEvent> = {
  id: 'section-navigation',
  actor: 'Visitor',
  trigger: 'Activates a header link, logo, Hero CTA or the skip link, or scrolls past a section',
  preconditions: [
    'JavaScript is enabled; without it every link stays a native anchor',
    'The target section is in the facade visible-section list',
  ],
  acceptance: ['1.8-AC-03', '1.8-AC-04', '1.8-AC-05'],
  transition(state, event) {
    if (!state || !event || (state.current !== null && typeof state.current !== 'string')) {
      return null;
    }
    if (state.current === undefined) return null;
    switch (event.type) {
      case 'activate-link':
        if (
          nonBlank(event.target) &&
          event.visible === true &&
          typeof event.reducedMotion === 'boolean'
        ) {
          return {
            state: { current: event.target },
            effects: [
              { kind: 'scroll', target: event.target, instant: event.reducedMotion },
              { kind: 'focus', target: `${event.target}-title`, preventScroll: true },
              { kind: 'navigate', fragment: `#${event.target}`, replace: true },
            ],
          };
        }
        return null;
      case 'scroll-spy':
        if (
          (event.current === null || nonBlank(event.current)) &&
          event.current !== state.current
        ) {
          return { state: { current: event.current }, effects: [] };
        }
        return null;
      case 'skip-to-main':
        return { state: { current: state.current }, effects: [{ kind: 'focus', target: 'main' }] };
      default:
        return null;
    }
  },
};

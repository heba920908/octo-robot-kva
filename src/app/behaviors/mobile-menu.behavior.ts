import type { BehaviorModel } from './behavior-model';

export interface MobileMenuState {
  readonly open: boolean;
}

export type MobileMenuEvent =
  | { readonly type: 'open' }
  | { readonly type: 'close' }
  | { readonly type: 'toggle' }
  | { readonly type: 'escape' }
  | { readonly type: 'back' }
  | { readonly type: 'choose-link'; readonly target: string; readonly visible: boolean };

const OPENED: MobileMenuState = { open: true };
const CLOSED: MobileMenuState = { open: false };

const OPEN_LAYER = { kind: 'layer', action: 'open', overlay: 'mobile-menu' } as const;
const CLOSE_LAYER = { kind: 'layer', action: 'close', overlay: 'mobile-menu' } as const;
const FOCUS_TOGGLE = { kind: 'focus', target: 'menu-toggle' } as const;

export const mobileMenu: BehaviorModel<MobileMenuState, MobileMenuEvent> = {
  id: 'mobile-menu',
  actor: 'Visitor',
  trigger:
    'Activates the "Menú" button, presses Esc or Back, chooses a link, or widens the viewport',
  preconditions: [
    'JavaScript is enabled and the viewport is narrower than 1024 px',
    'Only one overlay is active at a time',
  ],
  acceptance: ['1.9-AC-02', '1.9-AC-03', '1.9-AC-04', '1.9-AC-05'],
  transition(state, event) {
    if (!state || !event || typeof state.open !== 'boolean') return null;
    switch (event.type) {
      case 'open':
        return state.open ? null : { state: OPENED, effects: [OPEN_LAYER] };
      case 'toggle':
        return state.open
          ? { state: CLOSED, effects: [CLOSE_LAYER, FOCUS_TOGGLE] }
          : { state: OPENED, effects: [OPEN_LAYER] };
      case 'escape':
        return state.open ? { state: CLOSED, effects: [CLOSE_LAYER, FOCUS_TOGGLE] } : null;
      case 'close':
        return state.open ? { state: CLOSED, effects: [CLOSE_LAYER] } : null;
      case 'back':
        // The traversal already consumed the entry, so no layer effect is needed.
        return state.open ? { state: CLOSED, effects: [FOCUS_TOGGLE] } : null;
      case 'choose-link':
        return state.open &&
          typeof event.target === 'string' &&
          event.target.trim().length > 0 &&
          event.visible === true
          ? { state: CLOSED, effects: [CLOSE_LAYER] }
          : null;
      default:
        return null;
    }
  },
};

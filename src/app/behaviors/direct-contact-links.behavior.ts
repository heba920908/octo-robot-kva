import type { BehaviorModel } from './behavior-model';

export type DirectContactLinksState = { readonly kind: 'idle' };
export type DirectContactLinksEvent =
  { readonly type: 'activate-email' } | { readonly type: 'activate-phone' };

export const directContactLinks: BehaviorModel<DirectContactLinksState, DirectContactLinksEvent> = {
  id: 'direct-contact-links',
  actor: 'Visitor',
  trigger: 'Activates a plain email or phone link in the footer or Contact section',
  preconditions: [
    'The prerendered page is displayed, with or without JavaScript',
    'The link is a native anchor built by the contact-link builder',
  ],
  acceptance: ['1.5-AC-03'],
  transition(state, event) {
    if (state?.kind !== 'idle') return null;
    switch (event?.type) {
      case 'activate-email':
      case 'activate-phone':
        // Hand-off to the OS: no page state change, no effects, nothing recorded.
        return { state, effects: [] };
      default:
        return null;
    }
  },
};

import type { BehaviorModel } from './behavior-model';

export type CopyAddressState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'copying' }
  | { readonly kind: 'copied'; readonly message: string }
  | { readonly kind: 'failed'; readonly message: string };

export type CopyAddressEvent =
  | { readonly type: 'request-copy'; readonly address: string }
  | { readonly type: 'copy-succeeded'; readonly message: string }
  | { readonly type: 'copy-failed'; readonly message: string }
  | { readonly type: 'status-timeout' };

function nonBlank(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const copyAddress: BehaviorModel<CopyAddressState, CopyAddressEvent> = {
  id: 'copy-address',
  actor: 'Visitor',
  trigger: 'Activates the copy-address button beside the published email address',
  preconditions: [
    'JavaScript is enabled and the copy button has been enhanced after hydration',
    'A persistent polite live region (role="status") is present beside the copy button',
  ],
  acceptance: ['1.6-AC-03', '1.6-AC-04', '1.6-AC-05'],
  transition(state, event) {
    if (!state || !event) return null;
    switch (event.type) {
      case 'request-copy':
        if (
          (state.kind === 'idle' || state.kind === 'copied' || state.kind === 'failed') &&
          nonBlank(event.address)
        ) {
          return {
            state: { kind: 'copying' },
            effects: [{ kind: 'copy', text: event.address }],
          };
        }
        return null;
      case 'copy-succeeded':
        if (state.kind === 'copying' && nonBlank(event.message)) {
          return {
            state: { kind: 'copied', message: event.message },
            effects: [{ kind: 'announce', message: event.message }],
          };
        }
        return null;
      case 'copy-failed':
        if (state.kind === 'copying' && nonBlank(event.message)) {
          return {
            state: { kind: 'failed', message: event.message },
            effects: [{ kind: 'announce', message: event.message }],
          };
        }
        return null;
      case 'status-timeout':
        if (state.kind === 'copied') {
          return {
            state: { kind: 'idle' },
            effects: [],
          };
        }
        return null;
      default:
        return null;
    }
  },
};

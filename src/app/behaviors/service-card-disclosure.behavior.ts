import type { BehaviorModel } from './behavior-model';

export interface ServiceCardDisclosureState {
  readonly expanded: boolean;
}

export type ServiceCardDisclosureEvent =
  | { readonly type: 'toggle'; readonly toggleId: string }
  | { readonly type: 'expand'; readonly toggleId: string }
  | { readonly type: 'collapse'; readonly toggleId: string };

function nonBlank(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const serviceCardDisclosure: BehaviorModel<
  ServiceCardDisclosureState,
  ServiceCardDisclosureEvent
> = {
  id: 'service-card-disclosure',
  actor: 'Visitor',
  trigger: 'Activates the Sub-service list toggle on a Service card',
  preconditions: [
    'JavaScript is enabled and the card has been enhanced after hydration',
    'The viewport is narrower than 768 px and the Service has more than 4 Sub-services',
  ],
  acceptance: ['2.2-AC-01', '2.2-AC-02', '2.2-AC-03'],
  transition(state, event) {
    if (!state || !event || typeof state.expanded !== 'boolean' || !nonBlank(event.toggleId)) {
      return null;
    }
    const effects = [{ kind: 'focus', target: event.toggleId }] as const;
    switch (event.type) {
      case 'toggle':
        return { state: { expanded: !state.expanded }, effects };
      case 'expand':
        return state.expanded ? null : { state: { expanded: true }, effects };
      case 'collapse':
        return state.expanded ? { state: { expanded: false }, effects } : null;
      default:
        return null;
    }
  },
};

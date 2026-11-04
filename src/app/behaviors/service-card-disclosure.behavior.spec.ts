import { mkdirSync, writeFileSync } from 'node:fs';
import type { BehaviorModel } from './behavior-model';
import {
  serviceCardDisclosure,
  type ServiceCardDisclosureEvent,
  type ServiceCardDisclosureState,
} from './service-card-disclosure.behavior';

const collapsed: ServiceCardDisclosureState = { expanded: false };
const expanded: ServiceCardDisclosureState = { expanded: true };
const toggleId = 'service-desarrollo-toggle';

describe('service-card-disclosure behavior model (2.2-AC-01)', () => {
  it('declares the shared model contract and stable acceptance IDs', () => {
    const model: BehaviorModel<ServiceCardDisclosureState, ServiceCardDisclosureEvent> =
      serviceCardDisclosure;
    expect(model.id).toBe('service-card-disclosure');
    expect(model.actor).toBe('Visitor');
    expect(model.trigger.length).toBeGreaterThan(0);
    expect(model.preconditions.length).toBeGreaterThan(0);
    expect(model.acceptance).toEqual(['2.2-AC-01', '2.2-AC-02', '2.2-AC-03']);
  });

  it.each<
    [
      string,
      ServiceCardDisclosureState,
      ServiceCardDisclosureEvent,
      ServiceCardDisclosureState,
      unknown[],
    ]
  >([
    [
      'toggle while collapsed expands',
      collapsed,
      { type: 'toggle', toggleId },
      expanded,
      [{ kind: 'focus', target: toggleId }],
    ],
    [
      'expand while collapsed expands',
      collapsed,
      { type: 'expand', toggleId },
      expanded,
      [{ kind: 'focus', target: toggleId }],
    ],
    [
      'toggle while expanded collapses',
      expanded,
      { type: 'toggle', toggleId },
      collapsed,
      [{ kind: 'focus', target: toggleId }],
    ],
    [
      'collapse while expanded collapses',
      expanded,
      { type: 'collapse', toggleId },
      collapsed,
      [{ kind: 'focus', target: toggleId }],
    ],
  ])('returns expected state and effects for %s', (_name, state, event, nextState, effects) => {
    expect(serviceCardDisclosure.transition(state, event)).toEqual({
      state: nextState,
      effects,
    });
  });

  it('emits focus only and never an announce effect', () => {
    for (const [state, event] of [
      [collapsed, { type: 'toggle', toggleId }],
      [expanded, { type: 'toggle', toggleId }],
    ] as const) {
      const result = serviceCardDisclosure.transition(state, event);
      expect(result?.effects.map((effect) => effect.kind)).toEqual(['focus']);
    }
  });

  it.each<[string, unknown, unknown]>([
    ['expand while already expanded', expanded, { type: 'expand', toggleId }],
    ['collapse while already collapsed', collapsed, { type: 'collapse', toggleId }],
    ['empty toggle id', collapsed, { type: 'toggle', toggleId: '' }],
    ['blank toggle id', expanded, { type: 'collapse', toggleId: '   ' }],
    ['missing toggle id', collapsed, { type: 'expand' }],
    ['non-string toggle id', collapsed, { type: 'toggle', toggleId: 7 }],
    ['unknown event', collapsed, { type: 'unknown', toggleId }],
    ['event without type', collapsed, { toggleId }],
    ['null event', collapsed, null],
    ['undefined event', collapsed, undefined],
    ['null state', null, { type: 'toggle', toggleId }],
    ['undefined state', undefined, { type: 'toggle', toggleId }],
    ['state without expanded', {}, { type: 'toggle', toggleId }],
    ['non-boolean expanded', { expanded: 'yes' }, { type: 'toggle', toggleId }],
  ])('returns null for unsupported or malformed input: %s', (_name, state, event) => {
    expect(
      serviceCardDisclosure.transition(
        state as ServiceCardDisclosureState,
        event as ServiceCardDisclosureEvent,
      ),
    ).toBeNull();
  });

  it('is pure and deterministic and does not mutate its inputs', () => {
    const state = Object.freeze({ expanded: false });
    const event = Object.freeze({ type: 'toggle', toggleId } as const);
    const first = serviceCardDisclosure.transition(state, event);
    expect(serviceCardDisclosure.transition(state, event)).toEqual(first);
    expect(state).toEqual({ expanded: false });
    expect(event).toEqual({ type: 'toggle', toggleId });
  });

  it('records the table cases as a behavior-flow log', () => {
    const directory = '.agents/workspace/bmad/2026-11-04/2-2';
    mkdirSync(directory, { recursive: true });
    const cases: Array<{
      from: ServiceCardDisclosureState;
      event: ServiceCardDisclosureEvent;
      notes: string;
    }> = [
      {
        from: collapsed,
        event: { type: 'toggle', toggleId },
        notes: 'expands and focuses the toggle',
      },
      {
        from: collapsed,
        event: { type: 'expand', toggleId },
        notes: 'expands and focuses the toggle',
      },
      {
        from: expanded,
        event: { type: 'toggle', toggleId },
        notes: 'collapses and focuses the toggle',
      },
      {
        from: expanded,
        event: { type: 'collapse', toggleId },
        notes: 'collapses and focuses the toggle',
      },
      {
        from: expanded,
        event: { type: 'expand', toggleId },
        notes: 'unsupported transition returns null',
      },
      {
        from: collapsed,
        event: { type: 'collapse', toggleId },
        notes: 'unsupported transition returns null',
      },
      {
        from: collapsed,
        event: { type: 'toggle', toggleId: ' ' },
        notes: 'blank toggle id returns null',
      },
    ];
    const lines = cases.map(({ from, event, notes }) => {
      const outcome = serviceCardDisclosure.transition(from, event);
      return JSON.stringify({
        ts: new Date().toISOString(),
        behaviorId: serviceCardDisclosure.id,
        from: from.expanded ? 'expanded' : 'collapsed',
        event: event.type,
        to: outcome ? (outcome.state.expanded ? 'expanded' : 'collapsed') : null,
        result: outcome ? 'supported' : 'unsupported',
        notes,
      });
    });
    writeFileSync(`${directory}/service-card-disclosure.jsonl`, `${lines.join('\n')}\n`);
  });
});

import { mkdirSync, writeFileSync } from 'node:fs';
import type { BehaviorModel } from './behavior-model';
import {
  sectionNavigation,
  type SectionNavigationEvent,
  type SectionNavigationState,
} from './section-navigation.behavior';

const none: SectionNavigationState = { current: null };
const atServicios: SectionNavigationState = { current: 'servicios' };

function activate(
  target: string,
  overrides: Partial<{ visible: boolean; reducedMotion: boolean }> = {},
): SectionNavigationEvent {
  return { type: 'activate-link', target, visible: true, reducedMotion: false, ...overrides };
}

describe('section-navigation behavior model (1.8-AC-03)', () => {
  it('declares the shared model contract and stable acceptance IDs', () => {
    const model: BehaviorModel<SectionNavigationState, SectionNavigationEvent> = sectionNavigation;
    expect(model.id).toBe('section-navigation');
    expect(model.actor.length).toBeGreaterThan(0);
    expect(model.trigger.length).toBeGreaterThan(0);
    expect(model.preconditions.length).toBeGreaterThan(0);
    expect(model.acceptance).toEqual(['1.8-AC-03', '1.8-AC-04', '1.8-AC-05']);
  });

  it.each<
    [string, SectionNavigationState, SectionNavigationEvent, SectionNavigationState, unknown[]]
  >([
    [
      'activate-link smooth',
      none,
      activate('contacto'),
      { current: 'contacto' },
      [
        { kind: 'scroll', target: 'contacto', instant: false },
        { kind: 'focus', target: 'contacto-title', preventScroll: true },
        { kind: 'navigate', fragment: '#contacto', replace: true },
      ],
    ],
    [
      'activate-link under reduced motion',
      atServicios,
      activate('contacto', { reducedMotion: true }),
      { current: 'contacto' },
      [
        { kind: 'scroll', target: 'contacto', instant: true },
        { kind: 'focus', target: 'contacto-title', preventScroll: true },
        { kind: 'navigate', fragment: '#contacto', replace: true },
      ],
    ],
    [
      'activate-link on the current section still re-focuses once',
      { current: 'contacto' },
      activate('contacto'),
      { current: 'contacto' },
      [
        { kind: 'scroll', target: 'contacto', instant: false },
        { kind: 'focus', target: 'contacto-title', preventScroll: true },
        { kind: 'navigate', fragment: '#contacto', replace: true },
      ],
    ],
    [
      'activate-link to the top (logo)',
      atServicios,
      activate('inicio'),
      { current: 'inicio' },
      [
        { kind: 'scroll', target: 'inicio', instant: false },
        { kind: 'focus', target: 'inicio-title', preventScroll: true },
        { kind: 'navigate', fragment: '#inicio', replace: true },
      ],
    ],
    [
      'scroll-spy to a section',
      none,
      { type: 'scroll-spy', current: 'servicios' },
      atServicios,
      [],
    ],
    ['scroll-spy back to the Hero', atServicios, { type: 'scroll-spy', current: null }, none, []],
    [
      'skip-to-main keeps state and focuses main',
      atServicios,
      { type: 'skip-to-main' },
      atServicios,
      [{ kind: 'focus', target: 'main' }],
    ],
  ])('returns expected state and effects for %s', (_name, state, event, nextState, effects) => {
    expect(sectionNavigation.transition(state, event)).toEqual({ state: nextState, effects });
  });

  it.each<[string, unknown, unknown]>([
    [
      'activate-link to a section that is not visible',
      none,
      activate('servicios', { visible: false }),
    ],
    ['activate-link with non-boolean visible', none, { ...activate('contacto'), visible: 'yes' }],
    ['activate-link with blank target', none, activate('  ')],
    ['activate-link with non-string target', none, { ...activate('contacto'), target: 7 }],
    [
      'activate-link with non-boolean reducedMotion',
      none,
      { ...activate('contacto'), reducedMotion: 1 },
    ],
    [
      'duplicate scroll-spy (current state)',
      atServicios,
      { type: 'scroll-spy', current: 'servicios' },
    ],
    ['duplicate scroll-spy while in the Hero', none, { type: 'scroll-spy', current: null }],
    ['scroll-spy with a blank id', none, { type: 'scroll-spy', current: ' ' }],
    ['scroll-spy with a non-string id', none, { type: 'scroll-spy', current: 3 }],
    ['unknown event', none, { type: 'open-menu' }],
    ['null event', none, null],
    ['null state', null, { type: 'skip-to-main' }],
    ['state without current', {}, { type: 'skip-to-main' }],
  ])('returns null for unsupported pair: %s', (_name, state, event) => {
    expect(
      sectionNavigation.transition(
        state as unknown as SectionNavigationState,
        event as unknown as SectionNavigationEvent,
      ),
    ).toBeNull();
  });

  it('is pure and deterministic and does not mutate its inputs', () => {
    const state = Object.freeze({ current: null });
    const event = Object.freeze(activate('contacto'));
    const first = sectionNavigation.transition(state, event);
    expect(sectionNavigation.transition(state, event)).toEqual(first);
    expect(state).toEqual({ current: null });
    expect(event).toEqual(activate('contacto'));
  });

  it('records the table cases as a behavior-flow log', () => {
    const directory = '.agents/workspace/bmad/2026-11-03/1-8';
    mkdirSync(directory, { recursive: true });
    const cases: Array<{ from: SectionNavigationState; event: SectionNavigationEvent }> = [
      { from: none, event: activate('contacto') },
      { from: atServicios, event: { type: 'scroll-spy', current: null } },
      { from: atServicios, event: { type: 'skip-to-main' } },
      { from: atServicios, event: { type: 'scroll-spy', current: 'servicios' } },
      { from: none, event: activate('servicios', { visible: false }) },
    ];
    const lines = cases.map(({ from, event }) => {
      const outcome = sectionNavigation.transition(from, event);
      return JSON.stringify({
        ts: new Date().toISOString(),
        behaviorId: sectionNavigation.id,
        from: from.current,
        event: event.type,
        to: outcome ? outcome.state.current : null,
        effects: outcome ? outcome.effects.map((effect) => effect.kind) : [],
        result: outcome ? 'supported' : 'unsupported',
      });
    });
    writeFileSync(`${directory}/section-navigation.jsonl`, `${lines.join('\n')}\n`);
  });
});

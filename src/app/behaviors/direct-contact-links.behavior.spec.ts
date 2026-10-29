import { mkdirSync, writeFileSync } from 'node:fs';
import type { BehaviorModel } from './behavior-model';
import {
  directContactLinks,
  type DirectContactLinksEvent,
  type DirectContactLinksState,
} from './direct-contact-links.behavior';

const idle: DirectContactLinksState = { kind: 'idle' };

describe('direct-contact-links behavior model (1.5-AC-03)', () => {
  it('declares the shared model contract', () => {
    const model: BehaviorModel<DirectContactLinksState, DirectContactLinksEvent> =
      directContactLinks;
    expect(model.id).toBe('direct-contact-links');
    expect(model.actor.length).toBeGreaterThan(0);
    expect(model.trigger.length).toBeGreaterThan(0);
    expect(model.preconditions.length).toBeGreaterThan(0);
    expect(model.acceptance).toEqual(['1.5-AC-03']);
  });

  it.each<[string, DirectContactLinksEvent]>([
    ['email link activation', { type: 'activate-email' }],
    ['phone link activation', { type: 'activate-phone' }],
  ])('keeps state and emits no effects for %s', (_name, event) => {
    expect(directContactLinks.transition(idle, event)).toEqual({ state: idle, effects: [] });
  });

  it.each<[string, unknown]>([
    ['unknown event', { type: 'copy' }],
    ['missing event type', {}],
    ['null event', null],
  ])('returns null for an unsupported pair: %s', (_name, event) => {
    expect(
      directContactLinks.transition(idle, event as unknown as DirectContactLinksEvent),
    ).toBeNull();
  });

  it('returns null for an unsupported state', () => {
    expect(
      directContactLinks.transition({ kind: 'busy' } as unknown as DirectContactLinksState, {
        type: 'activate-email',
      }),
    ).toBeNull();
  });

  it('is pure and deterministic and does not mutate its inputs', () => {
    const state = Object.freeze({ kind: 'idle' } as const);
    const event = Object.freeze({ type: 'activate-phone' } as const);
    const first = directContactLinks.transition(state, event);
    expect(directContactLinks.transition(state, event)).toEqual(first);
    expect(state).toEqual({ kind: 'idle' });
  });

  it('records the table cases as a behavior-flow log', () => {
    const directory = `.agents/workspace/bmad/2026-10-28/1-5`;
    mkdirSync(directory, { recursive: true });
    const events: DirectContactLinksEvent[] = [
      { type: 'activate-email' },
      { type: 'activate-phone' },
    ];
    const lines = events.map((event) => {
      const outcome = directContactLinks.transition(idle, event);
      expect(outcome).not.toBeNull();
      return JSON.stringify({
        ts: new Date().toISOString(),
        behaviorId: directContactLinks.id,
        from: idle.kind,
        event: event.type,
        to: outcome?.state.kind ?? null,
        result: outcome ? 'supported' : 'unsupported',
        notes: 'native anchor; no effects',
      });
    });
    // Truncate each run so the log reflects only the latest execution.
    writeFileSync(`${directory}/direct-contact-links.jsonl`, `${lines.join('\n')}\n`);
  });
});

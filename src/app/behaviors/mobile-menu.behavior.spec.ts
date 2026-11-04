import { mkdirSync, writeFileSync } from 'node:fs';
import type { BehaviorModel } from './behavior-model';
import { mobileMenu, type MobileMenuEvent, type MobileMenuState } from './mobile-menu.behavior';

const closed: MobileMenuState = { open: false };
const opened: MobileMenuState = { open: true };

const openLayer = { kind: 'layer', action: 'open', overlay: 'mobile-menu' };
const closeLayer = { kind: 'layer', action: 'close', overlay: 'mobile-menu' };
const focusToggle = { kind: 'focus', target: 'menu-toggle' };

function choose(target: string, overrides: Partial<{ visible: boolean }> = {}): MobileMenuEvent {
  return { type: 'choose-link', target, visible: true, ...overrides };
}

describe('mobile-menu behavior model (1.9-AC-02..05)', () => {
  it('declares the shared model contract and stable acceptance IDs', () => {
    const model: BehaviorModel<MobileMenuState, MobileMenuEvent> = mobileMenu;
    expect(model.id).toBe('mobile-menu');
    expect(model.actor.length).toBeGreaterThan(0);
    expect(model.trigger.length).toBeGreaterThan(0);
    expect(model.preconditions.length).toBeGreaterThan(0);
    expect(model.acceptance).toEqual(['1.9-AC-02', '1.9-AC-03', '1.9-AC-04', '1.9-AC-05']);
  });

  it.each<[string, MobileMenuState, MobileMenuEvent, MobileMenuState, unknown[]]>([
    ['open', closed, { type: 'open' }, opened, [openLayer]],
    ['toggle while closed', closed, { type: 'toggle' }, opened, [openLayer]],
    ['toggle while open', opened, { type: 'toggle' }, closed, [closeLayer, focusToggle]],
    ['escape while open', opened, { type: 'escape' }, closed, [closeLayer, focusToggle]],
    ['close at a wide viewport', opened, { type: 'close' }, closed, [closeLayer]],
    ['back while open (entry already consumed)', opened, { type: 'back' }, closed, [focusToggle]],
    ['link choice while open', opened, choose('contacto'), closed, [closeLayer]],
  ])('returns expected state and effects for %s', (_name, state, event, nextState, effects) => {
    expect(mobileMenu.transition(state, event)).toEqual({ state: nextState, effects });
  });

  it.each<[string, unknown, unknown]>([
    ['open while open', opened, { type: 'open' }],
    ['escape while closed', closed, { type: 'escape' }],
    ['back while closed', closed, { type: 'back' }],
    ['close while closed', closed, { type: 'close' }],
    ['link choice while closed', closed, choose('contacto')],
    ['link choice to a hidden target', opened, choose('servicios', { visible: false })],
    ['link choice with non-boolean visible', opened, { ...choose('contacto'), visible: 'yes' }],
    ['link choice with blank target', opened, choose('  ')],
    ['link choice with non-string target', opened, { ...choose('contacto'), target: 7 }],
    ['unknown event', closed, { type: 'swipe' }],
    ['null event', closed, null],
    ['null state', null, { type: 'open' }],
    ['state without open', {}, { type: 'open' }],
    ['state with non-boolean open', { open: 'yes' }, { type: 'toggle' }],
  ])('returns null for unsupported pair: %s', (_name, state, event) => {
    expect(
      mobileMenu.transition(
        state as unknown as MobileMenuState,
        event as unknown as MobileMenuEvent,
      ),
    ).toBeNull();
  });

  it('is pure and deterministic and does not mutate its inputs', () => {
    const state = Object.freeze({ open: true });
    const event = Object.freeze(choose('contacto'));
    const first = mobileMenu.transition(state, event);
    expect(mobileMenu.transition(state, event)).toEqual(first);
    expect(state).toEqual({ open: true });
    expect(event).toEqual(choose('contacto'));
  });

  it('records the table cases as a behavior-flow log', () => {
    const directory = '.agents/workspace/bmad/2026-11-04/1-9';
    mkdirSync(directory, { recursive: true });
    const cases: Array<{ from: MobileMenuState; event: MobileMenuEvent }> = [
      { from: closed, event: { type: 'toggle' } },
      { from: opened, event: { type: 'escape' } },
      { from: opened, event: { type: 'back' } },
      { from: opened, event: choose('contacto') },
      { from: opened, event: { type: 'close' } },
      { from: closed, event: { type: 'back' } },
      { from: opened, event: choose('servicios', { visible: false }) },
    ];
    const lines = cases.map(({ from, event }) => {
      const outcome = mobileMenu.transition(from, event);
      return JSON.stringify({
        ts: new Date().toISOString(),
        behaviorId: mobileMenu.id,
        from: from.open,
        event: event.type,
        to: outcome ? outcome.state.open : null,
        effects: outcome ? outcome.effects.map((effect) => effect.kind) : [],
        result: outcome ? 'supported' : 'unsupported',
      });
    });
    writeFileSync(`${directory}/mobile-menu.jsonl`, `${lines.join('\n')}\n`);
  });
});

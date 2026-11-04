import { mkdirSync, writeFileSync } from 'node:fs';
import type { BehaviorModel } from './behavior-model';
import { copyAddress, type CopyAddressEvent, type CopyAddressState } from './copy-address.behavior';

const idle: CopyAddressState = { kind: 'idle' };
const copying: CopyAddressState = { kind: 'copying' };
const copied: CopyAddressState = { kind: 'copied', message: 'Copiado' };
const failed: CopyAddressState = {
  kind: 'failed',
  message: 'No se pudo copiar. Selecciona el correo y cópialo.',
};
const address = 'proyectos1@kvainstalaciones.mx';

describe('copy-address behavior model (1.6-AC-03)', () => {
  it('declares the shared model contract and stable acceptance IDs', () => {
    const model: BehaviorModel<CopyAddressState, CopyAddressEvent> = copyAddress;
    expect(model.id).toBe('copy-address');
    expect(model.actor.length).toBeGreaterThan(0);
    expect(model.trigger.length).toBeGreaterThan(0);
    expect(model.preconditions.length).toBeGreaterThan(0);
    expect(model.acceptance).toEqual(['1.6-AC-03', '1.6-AC-04', '1.6-AC-05']);
  });

  it.each<[string, CopyAddressState, CopyAddressEvent, CopyAddressState, unknown[]]>([
    [
      'request-copy from idle',
      idle,
      { type: 'request-copy', address },
      copying,
      [{ kind: 'copy', text: address }],
    ],
    [
      'request-copy from copied (re-copy while status shown)',
      copied,
      { type: 'request-copy', address },
      copying,
      [{ kind: 'copy', text: address }],
    ],
    [
      'request-copy from failed (retry after failure)',
      failed,
      { type: 'request-copy', address },
      copying,
      [{ kind: 'copy', text: address }],
    ],
    [
      'copy-succeeded from copying',
      copying,
      { type: 'copy-succeeded', message: 'Copiado' },
      copied,
      [{ kind: 'announce', message: 'Copiado' }],
    ],
    [
      'copy-failed from copying',
      copying,
      { type: 'copy-failed', message: failed.message },
      failed,
      [{ kind: 'announce', message: failed.message }],
    ],
    ['status-timeout from copied resets to idle', copied, { type: 'status-timeout' }, idle, []],
  ])('returns expected state and effects for %s', (_name, state, event, nextState, effects) => {
    expect(copyAddress.transition(state, event)).toEqual({
      state: nextState,
      effects,
    });
  });

  it.each<[string, unknown, unknown]>([
    ['request-copy while already copying', copying, { type: 'request-copy', address }],
    ['request-copy with blank address', idle, { type: 'request-copy', address: '   ' }],
    ['copy-succeeded from idle', idle, { type: 'copy-succeeded', message: 'Copiado' }],
    ['copy-succeeded with blank message', copying, { type: 'copy-succeeded', message: '' }],
    ['copy-failed from idle', idle, { type: 'copy-failed', message: failed.message }],
    ['copy-failed with blank message', copying, { type: 'copy-failed', message: '  ' }],
    ['status-timeout from idle', idle, { type: 'status-timeout' }],
    ['status-timeout from copying', copying, { type: 'status-timeout' }],
    ['status-timeout from failed', failed, { type: 'status-timeout' }],
    ['unknown event', idle, { type: 'unknown' }],
    ['null event', idle, null],
    ['unknown state', { kind: 'busy' }, { type: 'request-copy', address }],
    ['null state', null, { type: 'request-copy', address }],
  ])('returns null for unsupported pair: %s', (_name, state, event) => {
    expect(
      copyAddress.transition(
        state as unknown as CopyAddressState,
        event as unknown as CopyAddressEvent,
      ),
    ).toBeNull();
  });

  it('is pure and deterministic and does not mutate its inputs', () => {
    const state = Object.freeze({ kind: 'idle' } as const);
    const event = Object.freeze({ type: 'request-copy', address } as const);
    const first = copyAddress.transition(state, event);
    expect(copyAddress.transition(state, event)).toEqual(first);
    expect(state).toEqual({ kind: 'idle' });
    expect(event).toEqual({ type: 'request-copy', address });
  });

  it('records the table cases as a behavior-flow log', () => {
    const directory = '.agents/workspace/bmad/2026-10-29/1-6';
    mkdirSync(directory, { recursive: true });
    const cases: Array<{
      from: CopyAddressState;
      event: CopyAddressEvent;
      notes: string;
    }> = [
      {
        from: idle,
        event: { type: 'request-copy', address },
        notes: 'emits copy effect and enters copying',
      },
      {
        from: copying,
        event: { type: 'copy-succeeded', message: 'Copiado' },
        notes: 'emits announce effect and enters copied',
      },
      {
        from: copied,
        event: { type: 'status-timeout' },
        notes: 'resets copied status after hold window',
      },
      {
        from: copying,
        event: { type: 'copy-failed', message: failed.message },
        notes: 'emits fallback announce effect and enters failed',
      },
      {
        from: idle,
        event: { type: 'status-timeout' },
        notes: 'unsupported transition returns null',
      },
    ];
    const lines = cases.map(({ from, event, notes }) => {
      const outcome = copyAddress.transition(from, event);
      return JSON.stringify({
        ts: new Date().toISOString(),
        behaviorId: copyAddress.id,
        from: from.kind,
        event: event.type,
        to: outcome?.state.kind ?? null,
        result: outcome ? 'supported' : 'unsupported',
        notes,
      });
    });
    writeFileSync(`${directory}/copy-address.jsonl`, `${lines.join('\n')}\n`);
  });
});

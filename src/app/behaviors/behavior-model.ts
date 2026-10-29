import type { Effect } from '../core/effects/effects';

export interface TransitionResult<State> {
  readonly state: State;
  readonly effects: readonly Effect[];
}

export interface BehaviorModel<State, Event> {
  readonly id: string;
  readonly actor: string;
  readonly trigger: string;
  readonly preconditions: readonly string[];
  readonly acceptance: readonly string[];
  /** Pure and deterministic; `null` marks an unsupported state/event pair. */
  transition(state: State, event: Event): TransitionResult<State> | null;
}

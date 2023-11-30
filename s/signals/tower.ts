
import {Op} from "../op/op.js"
import {ob} from "../tools/ob.js"
import {Signal} from "./signal.js"
import {OpSignal} from "./op_signal.js"
import {LeanTrack, NormalTrack, SignalTracker} from "./parts/tracker.js"
import { Collector, Lean } from "../flatstate/parts/types.js"

export class SignalTower {

	// TODO wrap all signals in WeakRef, to promote garbage collection?
	#signals = new Set<Signal<any>>()

	#waiters = new Set<Promise<void>>()

	signal<V>(value: V): Signal<V> {
		const signal = new Signal(value)
		this.#signals.add(signal)
		return signal
	}

	computed<V>(fun: () => V) {
		const signal = this.signal<V>(fun())
		this.reaction(() => { signal.value = fun() })
		return signal
	}

	op<V>(): Signal<Op.For<V>> {
		const signal = new OpSignal<V>()
		this.#signals.add(signal)
		return signal
	}

	many<S extends {[key: string]: any}>(states: S) {
		return (
			ob.map(states, state => this.signal(state))
		) as any as {[P in keyof S]: Signal<S[P]>}
	}

	reaction<P>(collector: () => P, responder?: (payload: P) => void) {
		const tracker = new SignalTracker({
			waiters: this.#waiters,
			all_signals: this.#signals,
		})
		const track: NormalTrack<P> = {collector, responder}
		const {recording} = tracker.observe(track.collector)
		tracker.add_listeners(track, recording)
		return () => tracker.shutdown()
	}

	lean(responder: () => void): Lean {
		const tracker = new SignalTracker({
			waiters: this.#waiters,
			all_signals: this.#signals,
		})
		const track: LeanTrack = {lean: true, responder}
		return {
			stop: () => tracker.shutdown(),
			collect: collector => {
				const {payload, recording} = tracker.observe(collector)
				tracker.add_listeners(track, recording)
				return payload
			},
		}
	}

	get wait(): Promise<void> {
		return Promise.all([...this.#signals].map(s => s.wait))
			.then(() => Promise.all([...this.#waiters]))
			.then(() => { this.#waiters.clear() })
	}
}


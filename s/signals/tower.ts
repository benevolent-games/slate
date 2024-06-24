
import {Op} from "../op/op.js"
import {ob} from "../tools/ob.js"
import {Signal} from "./signal.js"
import {OpSignal} from "./op_signal.js"
import {LeanTrack, NormalTrack, SignalTracker} from "./parts/tracker.js"
import {Collector, Lean, ReactorCore, Responder} from "../reactor/types.js"

export class SignalTower implements ReactorCore {

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

	async computedAsync<X, V>(
			collector: () => X,
			responder: (x: X) => Promise<V>,
		) {
		const value = await responder(collector())
		const signal = this.signal<V>(value)
		this.reaction(
			collector,
			async x => {
				signal.value = await responder(x)
			},
		)
		return signal
	}

	op<V>(op: Op.For<V> = Op.loading()) {
		const signal = new OpSignal<V>(op)
		this.#signals.add(signal)
		return signal
	}

	many<S extends {[key: string]: any}>(states: S) {
		return (
			ob(states).map(state => this.signal(state))
		) as any as {[P in keyof S]: Signal<S[P]>}
	}

	reaction<P>(collector: Collector<P>, responder?: Responder<P>) {
		const tracker = new SignalTracker({
			waiters: this.#waiters,
			all_signals: this.#signals,
		})
		const track: NormalTrack<P> = {collector, responder}
		const {recording} = tracker.observe(track.collector)
		tracker.add_listeners(track, recording)
		return () => tracker.shutdown()
	}

	lean(actor: () => void): Lean {
		const tracker = new SignalTracker({
			waiters: this.#waiters,
			all_signals: this.#signals,
		})
		const track: LeanTrack = {lean: true, actor}
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


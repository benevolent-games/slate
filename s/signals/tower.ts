
import {Op} from "../op/op.js"
import {ob} from "../tools/ob.js"
import {Signal} from "./signal.js"
import {OpSignal} from "./op_signal.js"
import {debounce} from "../tools/debounce/debounce.js"

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
		this.track(() => { signal.value = fun() })
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

	track(reader: () => any, actor: () => any = reader) {
		const actuate = debounce(0, actor)
		const accessed: Signal<any>[] = []

		for (const signal of this.#signals)
			signal.accessed = false

		reader()

		for (const signal of this.#signals)
			if (signal.accessed)
				accessed.push(signal)

		const unsubscribe_functions = accessed.map(signal => {
			return signal.subscribe(() => {
				const promise = actuate()
				this.#waiters.add(promise)
			})
		})

		return () => unsubscribe_functions
			.forEach(unsub => unsub())
	}

	get wait(): Promise<void> {
		return Promise.all([...this.#signals].map(s => s.wait))
			.then(() => Promise.all([...this.#waiters]))
			.then(() => { this.#waiters.clear() })
	}
}


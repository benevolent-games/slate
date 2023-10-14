
import {ob} from "../tools/ob.js"
import {Signal} from "./signal.js"
import {debounce} from "../tools/debounce/debounce.js"

export class SignalTower {
	#signals = new Set<Signal<any>>()

	create<S>(s: S) {
		const cue = new Signal(s)
		this.#signals.add(cue)
		return cue
	}

	many<S extends {[key: string]: any}>(states: S) {
		return (
			ob.map(states, state => this.create(state))
		) as any as {[P in keyof S]: Signal<S[P]>}
	}

	track(reader: () => any, actor: () => any) {
		const actuate = debounce(0, actor)
		const accessed: Signal<any>[] = []

		for (const signal of this.#signals)
			signal.accessed = false

		reader()

		for (const signal of this.#signals)
			if (signal.accessed)
				accessed.push(signal)

		const unsubscribe_functions = accessed
			.map(signal => signal.subscribe(() => actuate()))

		return () => unsubscribe_functions
			.forEach(unsub => unsub())
	}
}


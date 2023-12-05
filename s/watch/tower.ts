
import {StateTree} from "./state_tree.js"
import {deep} from "../tools/deep/deep.js"
import {Signal} from "../signals/signal.js"
import {SignalTower} from "../signals/tower.js"

export class WatchTower {
	#signals: SignalTower
	#computeds = new Set<() => void>()
	#listeners = new Set<() => void>()
	#memory = new Map<() => any, any>()

	constructor(signals: SignalTower) {
		this.#signals = signals
	}

	dispatch() {
		for (const computed of this.#computeds)
			computed()
		for (const listener of this.#listeners)
			listener()
	}

	computed<V>(fun: () => V): Signal<V> {
		const box = this.#signals.signal(fun())
		this.#computeds.add(() => { box.value = fun() })
		return box
	}

	track<T>(collector: () => T, responder: (data: T) => void) {
		let first = true
		const listener = () => {
			const current = collector()
			const previous = this.#memory.get(collector)
			if (first || !deep.equal(current, previous)) {
				first = false
				this.#memory.set(collector, current)
				responder(current)
			}
		}
		listener()
		this.#listeners.add(listener)
		return collector()
	}

	stateTree<S>(state: S) {
		return new StateTree(state, () => this.dispatch())
	}
}


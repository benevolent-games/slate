
import {Signal} from "../pure.js"
import {signal} from "../shiny/state.js"
import {StateTree} from "./state_tree.js"
import {deepEqual} from "../tools/deep_equal/deep_equal.js"

export class WatchTower {
	#computeds = new Set<() => void>()
	#listeners = new Set<() => void>()
	#memory = new Map<() => any, any>()

	dispatch() {
		for (const computed of this.#computeds)
			computed()
		for (const listener of this.#listeners)
			listener()
	}

	computed<V>(fun: () => V): Signal<V> {
		const box = signal(fun())
		this.#computeds.add(() => { box.value = fun() })
		return box
	}

	track<T>(collector: () => T, responder: (data: T) => void) {
		let first = true
		const listener = () => {
			const current = collector()
			const previous = this.#memory.get(collector)
			if (first || !deepEqual(current, previous)) {
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



import {deepFreeze} from "../tools/deep_freeze.js"
import {deepEqual} from "../tools/deep_equal/deep_equal.js"

export type Selector<T> = () => T

export class Selecton<S extends any> {
	#state: S
	#readable: S
	#memory = new Map<Selector<any>, any>()
	#listeners = new Set<() => void>()

	constructor(state: S) {
		this.#state = state
		this.#readable = structuredClone(state)
	}

	get state() {
		return this.#readable
	}

	transmute(fun: (state: S) => S) {
		this.#state = fun(this.#state)
		this.#readable = deepFreeze(structuredClone(this.#state))
		for (const listener of this.#listeners)
			listener()
	}

	track<T>(collector: Selector<T>, responder: (data: T) => void) {
		const listener = () => {
			const current = collector()
			const previous = this.#memory.get(collector)
			if (!deepEqual(current, previous)) {
				this.#memory.set(collector, current)
				responder(current)
			}
		}
		this.#listeners.add(listener)
		return () => this.#listeners.delete(listener)
	}
}


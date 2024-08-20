
import {deep} from "./deep/deep.js"

export type RefListener<X> = (x: X) => void

type Options = {dedupe: boolean}

export function ref<X>(x: X, options: Options = {dedupe: false}) {
	return new Ref(x, options)
}

/**
 * a wrapper for a value.
 * subscribe to changes with the `on` method.
 */
export class Ref<X> {
	#value: X
	#listeners = new Set<RefListener<X>>()

	constructor(x: X, private options: Options = {dedupe: false}) {
		this.#value = x
	}

	on(fn: RefListener<X>, initiate = false) {
		this.#listeners.add(fn)
		if (initiate)
			fn(this.#value)
		return () => this.#listeners.delete(fn)
	}

	publish() {
		const x = this.#value
		for (const fn of this.#listeners)
			fn(x)
	}

	get value() {
		return this.#value
	}

	set value(x: X) {
		if (this.options.dedupe) {
			const changed = !deep.equal(this.#value, x)
			if (changed) {
				this.#value = x
				this.publish()
			}
		}
		else {
			this.#value = x
			this.publish()
		}
	}

	dispose() {
		this.#listeners.clear()
	}
}


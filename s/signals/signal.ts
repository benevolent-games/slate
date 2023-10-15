
import {SignalListener} from "./parts/listener.js"
import {debounce} from "../tools/debounce/debounce.js"
import {SignalCircularError} from "./parts/circular_error.js"

export class Signal<V> {
	#value: V
	#lock = false
	#wait: Promise<V>
	#listeners = new Set<SignalListener<V>>()

	accessed = false

	constructor(v: V) {
		this.#value = v
		this.#wait = Promise.resolve(v)
	}

	subscribe(listener: SignalListener<V>) {
		this.#listeners.add(listener)
		return () => void this.#listeners.delete(listener)
	}

	clear() {
		return this.#listeners.clear()
	}

	#invoke_listeners = debounce(0, () => {
		const value = this.#value
		this.#lock = true

		for (const listener of this.#listeners)
			listener(value)

		this.#lock = false
		return value
	})

	async publish() {
		this.#wait = this.#invoke_listeners()
		await this.#wait
	}

	get wait() {
		return this.#wait
	}

	get value() {
		this.accessed = true
		return this.#value
	}

	set value(s: V) {
		if (this.#lock)
			throw new SignalCircularError(
				"you can't set a cue in a cue's subscription listener (infinite loop forbidden)"
			)
		this.#value = s
		this.publish()
	}
}


import {pub} from "../tools/pub.js"
import {deepFreeze} from "../tools/deep_freeze.js"

export class StateTree<S> {
	#state: S
	#readable: S

	#clone() {
		return deepFreeze(structuredClone(this.#state))
	}

	constructor(state: S, handleChange = () => {}) {
		this.#state = state
		this.#readable = this.#clone()
		this.onChange(handleChange)
	}

	onChange = pub<void>()

	get state() {
		return this.#readable
	}

	transmute(fun: (state: S) => S) {
		this.#state = fun(this.#state)
		this.#readable = this.#clone()
		this.onChange.publish()
	}
}


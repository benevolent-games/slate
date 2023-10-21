
import {pub} from "../tools/pub.js"
import {Slice} from "./parts/slice.js"
import {deepFreeze} from "../tools/deep_freeze.js"
import {SliceAccessors, Sliceable} from "./parts/types.js"

export class StateTree<S> implements Sliceable<S> {
	#state: S
	#readable: S

	#clone() {
		return deepFreeze(structuredClone(this.#state))
	}

	constructor(state: S, handleChange = () => {}) {
		this.#state = state
		this.#readable = this.#clone()
		this.#onChange(handleChange)
	}

	#onChange = pub<void>()

	get state() {
		return this.#readable
	}

	transmute(fun: (state: S) => S) {
		this.#state = fun(this.#state)
		this.#readable = this.#clone()
		this.#onChange.publish()
	}

	slice<X>({getter, setter}: SliceAccessors<S, X>) {
		return new Slice<S, X>({
			parent: this as Sliceable<S>,
			getter,
			setter,
		})
	}
}


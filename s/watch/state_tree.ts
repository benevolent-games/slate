
import {Slice} from "./parts/slice.js"
import {deepFreeze} from "../tools/deep_freeze.js"
import {SliceAccessors, Sliceable} from "./parts/types.js"

export class StateTree<S> implements Sliceable<S> {
	#state: S
	#readable: S
	#onChange: () => void
	#circularity_lock = false

	#make_frozen_clone() {
		return deepFreeze(structuredClone(this.#state))
	}

	constructor(state: S, onChange = () => {}) {
		this.#state = structuredClone(state)
		this.#readable = this.#make_frozen_clone()
		this.#onChange = onChange
	}

	get state() {
		return this.#readable
	}

	transmute(fun: (state: S) => S) {
		if (this.#circularity_lock)
			throw new Error("circular error")
		this.#circularity_lock = true

		this.#state = fun(structuredClone(this.#state))
		this.#readable = this.#make_frozen_clone()
		this.#onChange()

		this.#circularity_lock = false
	}

	slice<X>({getter, setter}: SliceAccessors<S, X>) {
		return new Slice<S, X>({
			parent: this as Sliceable<S>,
			getter,
			setter,
		})
	}
}


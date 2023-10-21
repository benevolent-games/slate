
import {SliceAccessors, SliceOptions, Sliceable} from "./types.js"

export class Slice<S, X> implements Sliceable<X> {
	#options: SliceOptions<S, X>

	constructor(options: SliceOptions<S, X>) {
		this.#options = options
	}

	get state() {
		return this.#options.getter(
			this.#options.parent.state
		)
	}

	transmute(fun: (x: X) => X) {
		this.#options.parent.transmute(state => {
			const x1 = this.#options.getter(state)
			const x2 = fun(x1)
			const new_state = this.#options.setter(state, x2)
			return new_state
		})
	}

	slice<Y>({getter, setter}: SliceAccessors<X, Y>) {
		return new Slice<X, Y>({
			parent: this as Sliceable<X>,
			getter,
			setter,
		})
	}
}


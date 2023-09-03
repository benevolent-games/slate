
import {FlipSetup} from "./types.js"
import {Flat} from "../../flatstate/flat.js"

export class FlipUse {
	#counter: {count: number}
	#flat: Flat
	#states: Map<number, {}>
	#setdata: Map<number, any>
	#setdowns: Map<number, () => void>

	readonly element: HTMLElement
	readonly rerender: () => void

	constructor(
			flat: Flat,
			counter: {count: number},
			states: Map<number, {}>,
			setdata: Map<number, any>,
			setdowns: Map<number, () => void>,
			element: HTMLElement,
			rerender: () => void,
		) {

		this.#counter = counter
		this.#flat = flat
		this.#states = states
		this.#setdata = setdata
		this.#setdowns = setdowns
		this.element = element
		this.rerender = rerender
	}

	setup<R>(up: FlipSetup<R>): R {
		const count = this.#counter.count++
		if (!this.#setdowns.has(count)) {
			const {result, setdown} = up()
			this.#setdata.set(count, result)
			this.#setdowns.set(count, setdown)
			return result as R
		}
		return this.#setdata.get(count) as R
	}

	state<S extends {}>(init: S | (() => S)): S {
		const count = this.#counter.count++
		let state = this.#states.get(count)
		if (!state) {
			state = this.#flat.state(
				typeof init === "function"
					? (init as () => S)()
					: init
			)
			this.#states.set(count, state)
		}
		return state as S
	}
}


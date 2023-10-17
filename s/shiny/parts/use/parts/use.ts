
import {Context} from "../../../context.js"
import {Signal} from "../../../../signals/signal.js"
import {maptool} from "../../../../tools/maptool.js"
import {OpSignal} from "../../../../signals/op_signal.js"

type Setdown = () => void
type Setup = () => Setdown

export class Use<C extends Context = Context> {
	static wrap<F extends (...args: any[]) => any>(use: Use, fun: F) {
		return ((...args: any[]) => {
			use.#counter.value = 0
			return fun(...args)
		}) as F
	}

	static disconnect(use: Use) {
		for (const down of use.#setdowns)
			down()
		use.#setdowns.clear()
	}

	static reconnect(use: Use) {
		for (const up of use.#setups.values())
			use.#setdowns.add(up())
	}

	#context: C
	#rerender: () => void
	#counter = {value: 0}

	#setups = new Map<number, Setup>()
	#setdowns = new Set<Setdown>()

	#states = new Map<number, any>()
	#preparations = new Map<number, any>()
	#flatstates = new Map<number, Record<string, any>>()
	#signals = new Map<number, any>()

	constructor(rerender: () => void, context: C) {
		this.#rerender = rerender
		this.#context = context
	}

	get context() {
		return this.#context
	}

	rerender() {
		this.#rerender()
	}

	setup(up: Setup) {
		const count = this.#counter.value
		if (!this.#setups.has(count)) {
			this.#setups.set(count, up)
			this.#setdowns.add(up())
		}
	}

	prepare<T>(prep: () => T): T {
		const count = this.#counter.value++
		return maptool(this.#preparations).grab(count, prep)
	}

	state<T>(init: T | (() => T)) {
		const count = this.#counter.value++
		const value: T = maptool(this.#states).grab(count, () => (
			(typeof init === "function")
				? (init as () => T)()
				: init
		))
		const setter = (v: T) => {
			this.#states.set(count, v)
			this.#rerender()
		}
		const getter = () => this.#states.get(count) as T
		return [value, setter, getter] as const
	}

	flatstate<S extends Record<string, any>>(init: S | (() => S)): S {
		const count = this.#counter.value++
		return maptool(this.#flatstates).grab(count, () => (
			this.#context.flat.state(
				(typeof init === "function")
					? (init as () => S)()
					: init
			)
		)) as S
	}

	signal<T>(init: T | (() => T)) {
		const count = this.#counter.value++
		return maptool(this.#signals).grab(count, () => (
			this.#context.tower.signal(
				(typeof init === "function")
					? (init as () => T)()
					: init
			)
		)) as Signal<T>
	}

	computed<T>(update: () => T) {
		const count = this.#counter.value++
		return maptool(this.#signals).grab(count, () => (
			this.#context.tower.computed(update)
		)) as Signal<T>
	}

	op<T>() {
		const count = this.#counter.value++
		return maptool(this.#signals).grab(
			count,
			() => this.#context.tower.op(),
		) as OpSignal<T>
	}
}



import {Context} from "../../../context.js"
import {Signal} from "../../../../signals/signal.js"
import {maptool} from "../../../../tools/maptool.js"
import {OpSignal} from "../../../../signals/op_signal.js"

type Setdown = () => void
type Setup = () => Setdown

type InitEnd<R> = [R, Setdown]
type InitStart<R> = () => InitEnd<R>

export class Use<C extends Context = Context> {
	static wrap<F extends (...args: any[]) => any>(use: Use, fun: F) {
		return ((...args: any[]) => {
			use.#counter.value = 0
			return fun(...args)
		}) as F
	}

	static disconnect(use: Use) {

		// cleanup setups
		for (const down of use.#setdowns)
			down()
		use.#setdowns.clear()

		// cleanup inits
		for (const down of use.#initDowns)
			down()
		use.#initDowns.clear()
		use.#initResults.clear()
	}

	static reconnect(use: Use) {

		// call all setups
		for (const up of use.#setups.values())
			use.#setdowns.add(up())

		// call all inits
		for (const [count, start] of use.#initStarts.entries()) {
			const [result, down] = start()
			use.#initResults.set(count, result)
			use.#initDowns.add(down)
		}
	}

	#context: C
	#rerender: () => void
	#counter = {value: 0}

	#setups = new Map<number, Setup>()
	#setdowns = new Set<Setdown>()

	#initStarts = new Map<number, InitStart<any>>()
	#initResults = new Map<number, any>()
	#initDowns = new Set<Setdown>()

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

	init<R>(start: InitStart<R>): R {
		const count = this.#counter.value
		if (!this.#initStarts.has(count)) {
			this.#initStarts.set(count, start)
			const [result, down] = start()
			this.#initResults.set(count, result)
			this.#initDowns.add(down)
			return result
		}
		return this.#initResults.get(count)
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

	#watches = new Map<number, any>()

	watch<T>(collector: () => T): T {
		const count = this.#counter.value++
		return maptool(this.#watches).grab(
			count,
			() => this.#context.watch.track(collector, data => {
				this.#watches.set(count, data)
				this.#rerender()
			}),
		)
	}
}



import {Context} from "../../../context.js"
import {InitFn, SetupFn, Setdown} from "./types.js"
import {Signal} from "../../../../signals/signal.js"
import {maptool} from "../../../../tools/maptool.js"
import {flat, signals, watch} from "../../../state.js"
import {OpSignal} from "../../../../signals/op_signal.js"

export class Use<C extends Context = Context> {
	static wrap<F extends (...args: any[]) => any>(use: Use, fun: F) {
		return ((...args: any[]) => {
			use.#counter.reset()
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

	static afterRender(use: Use) {
		for (const [count, fn] of use.#afterFns) {
			const result = fn()
			use.#afterResults.set(count, result)
		}
	}

	#context: C
	#rerender: () => void
	#counter = new Counter()

	#setups = new Map<number, SetupFn>()
	#setdowns = new Set<Setdown>()

	#initStarts = new Map<number, InitFn<any>>()
	#initResults = new Map<number, any>()
	#initDowns = new Set<Setdown>()

	#preparations = new Map<number, any>()

	#afterFns = new Map<number, () => any>()
	#afterResults = new Map<number, any>()

	#states = new Map<number, any>()
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

	mount(func: SetupFn) {
		const count = this.#counter.pull()
		if (!this.#setups.has(count)) {
			this.#setups.set(count, func)
			this.#setdowns.add(func())
		}
	}

	init<R>(func: InitFn<R>): R {
		const count = this.#counter.pull()
		if (!this.#initStarts.has(count)) {
			this.#initStarts.set(count, func)
			const [result, down] = func()
			this.#initResults.set(count, result)
			this.#initDowns.add(down)
			return result
		}
		return this.#initResults.get(count)
	}

	once<T>(prep: () => T): T {
		const count = this.#counter.pull()
		return maptool(this.#preparations).grab(count, prep)
	}

	defer<T>(fn: () => T): T | undefined {
		const count = this.#counter.pull()
		if (!this.#afterFns.has(count))
			this.#afterFns.set(count, fn)
		return this.#afterResults.get(count)
	}

	state<T>(init: T | (() => T)) {
		const count = this.#counter.pull()
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
		const count = this.#counter.pull()
		return maptool(this.#flatstates).grab(count, () => (
			flat.state(
				(typeof init === "function")
					? (init as () => S)()
					: init
			)
		)) as S
	}

	signal<T>(init: T | (() => T)) {
		const count = this.#counter.pull()
		return maptool(this.#signals).grab(count, () => (
			signals.signal(
				(typeof init === "function")
					? (init as () => T)()
					: init
			)
		)) as Signal<T>
	}

	computed<T>(update: () => T) {
		const count = this.#counter.pull()
		return maptool(this.#signals).grab(count, () => (
			signals.computed(update)
		)) as Signal<T>
	}

	op<T>() {
		const count = this.#counter.pull()
		return maptool(this.#signals).grab(
			count,
			() => signals.op(),
		) as OpSignal<T>
	}

	#watches = new Map<number, any>()

	watch<T>(collector: () => T): T {
		const count = this.#counter.pull()
		return maptool(this.#watches).grab(
			count,
			() => watch.track(collector, data => {
				this.#watches.set(count, data)
				this.#rerender()
			}),
		)
	}
}

class Counter {
	#value = 0
	pull() {
		return this.#value++
	}
	reset() {
		this.#value = 0
	}
}


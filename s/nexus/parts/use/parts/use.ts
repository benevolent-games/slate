
import {usekey} from "./utils/usekey.js"
import {Counter} from "./utils/counter.js"
import {Context} from "../../../context.js"
import {Init, Mount, Unmount} from "./types.js"
import {Signal} from "../../../../signals/signal.js"
import {maptool} from "../../../../tools/maptool.js"
import {flat, signals, watch} from "../../../state.js"
import {OpSignal} from "../../../../signals/op_signal.js"

export class Use<C extends Context = Context> {
	[usekey] = {
		wrap: <F extends (...args: any[]) => any>(fn: F) => {
			return ((...args: any[]) => {
				this.#counter.reset()
				return fn(...args)
			}) as F
		},

		disconnect: () => {

			// cleanup mounts
			for (const down of this.#unmounts)
				down()
			this.#unmounts.clear()

			// cleanup inits
			for (const down of this.#initDowns)
				down()
			this.#initDowns.clear()
			this.#initResults.clear()
		},

		reconnect: () => {

			// call all mounts
			for (const up of this.#mounts.values())
				this.#unmounts.add(up())

			// call all inits
			for (const [count, start] of this.#initStarts.entries()) {
				const [result, down] = start()
				this.#initResults.set(count, result)
				this.#initDowns.add(down)
			}
		},

		afterRender: () => {
			for (const [count, fn] of this.#deferred) {
				const result = fn()
				this.#deferredResults.set(count, result)
			}
		},
	}

	#context: C
	#rerender: () => void
	#counter = new Counter()

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

	#mounts = new Map<number, Mount>()
	#unmounts = new Set<Unmount>()

	mount(fn: Mount) {
		const count = this.#counter.pull()
		if (!this.#mounts.has(count)) {
			this.#mounts.set(count, fn)
			this.#unmounts.add(fn())
		}
	}

	#initStarts = new Map<number, Init<any>>()
	#initResults = new Map<number, any>()
	#initDowns = new Set<Unmount>()

	init<R>(fn: Init<R>): R {
		const count = this.#counter.pull()
		if (!this.#initStarts.has(count)) {
			this.#initStarts.set(count, fn)
			const [result, down] = fn()
			this.#initResults.set(count, result)
			this.#initDowns.add(down)
			return result
		}
		return this.#initResults.get(count)
	}

	#onces = new Map<number, any>()

	once<T>(prep: () => T): T {
		const count = this.#counter.pull()
		return maptool(this.#onces).guarantee(count, prep)
	}

	#deferred = new Map<number, () => any>()
	#deferredResults = new Map<number, any>()

	defer<T>(fn: () => T): T | undefined {
		const count = this.#counter.pull()
		if (!this.#deferred.has(count))
			this.#deferred.set(count, fn)
		return this.#deferredResults.get(count)
	}

	#states = new Map<number, any>()

	state<T>(init: T | (() => T)) {
		const count = this.#counter.pull()
		const value: T = maptool(this.#states).guarantee(count, () => (
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

	#flatstates = new Map<number, Record<string, any>>()

	flatstate<S extends Record<string, any>>(init: S | (() => S)): S {
		const count = this.#counter.pull()
		return maptool(this.#flatstates).guarantee(count, () => (
			flat.state(
				(typeof init === "function")
					? (init as () => S)()
					: init
			)
		)) as S
	}

	#signals = new Map<number, any>()

	signal<T>(init: T | (() => T)) {
		const count = this.#counter.pull()
		return maptool(this.#signals).guarantee(count, () => (
			signals.signal(
				(typeof init === "function")
					? (init as () => T)()
					: init
			)
		)) as Signal<T>
	}

	computed<T>(update: () => T) {
		const count = this.#counter.pull()
		return maptool(this.#signals).guarantee(count, () => (
			signals.computed(update)
		)) as Signal<T>
	}

	op<T>() {
		const count = this.#counter.pull()
		return maptool(this.#signals).guarantee(
			count,
			() => signals.op(),
		) as OpSignal<T>
	}

	#watches = new Map<number, any>()

	watch<T>(collector: () => T): T {
		const count = this.#counter.pull()
		return maptool(this.#watches).guarantee(
			count,
			() => watch.track(collector, data => {
				this.#watches.set(count, data)
				this.#rerender()
			}),
		)
	}
}


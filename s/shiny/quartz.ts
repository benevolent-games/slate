
import {CSSResultGroup, TemplateResult, css, html as lit_html} from "lit"
import {AsyncDirective, directive} from "lit/async-directive.js"

import {Cue} from "../cues/cue.js"
import {Flat} from "../flatstate/flat.js"
import {CueGroup} from "../cues/group.js"
import {maptool} from "../tools/maptool.js"
import {debounce} from "../tools/debounce/debounce.js"

export const html = (
		strings: TemplateStringsArray,
		...values: any[]
	): TemplateResult => (

	lit_html(strings, ...values.map(value => (
		(value instanceof Cue)
			? value.value
			: value
	)))
)

export class CoreContext {
	theme: CSSResultGroup = css``
	flat = new Flat()
	cues = new CueGroup()
}

export class Counter { value = 0 }
export type Setdown = () => void
export type Setup = () => Setdown

export class Use<C extends CoreContext = CoreContext> {

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
	#counter: Counter = new Counter()

	#setups = new Map<number, Setup>()
	#setdowns = new Set<Setdown>()

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

	setup(up: Setup) {
		const count = this.#counter.value
		if (!this.#setups.has(count)) {
			this.#setups.set(count, up)
			this.#setdowns.add(up())
		}
	}

	state<T>(init: T | (() => T)) {
		const count = this.#counter.value++
		const value = maptool(this.#states).grab(count, () => (
			(typeof init === "function")
				? (init as () => T)()
				: init
		))
		const setter = (v: T) => {
			this.#states.set(count, v)
			this.#rerender()
		}
		const getter = () => this.#states.get(count)
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

	signal<T>(init: T) {
		const count = this.#counter.value++
		return maptool(this.#signals).grab(count, () => (
			this.#context.cues.create(init)
		)) as Cue<T>
	}
}

export type QuartzFun<C extends CoreContext, P extends any[]> = (
	(use: Use<C>) => (...props: P) => (TemplateResult | void)
)

export const prepare_quartz = (
	<C extends CoreContext>(context: C) =>
	<P extends any[]>(fun: QuartzFun<C, P>) => {

	return directive(class extends AsyncDirective {
		#props?: P
		#rerender = debounce(0, () => {
			if (this.#props)
				this.setValue(this.render(...this.#props!))
		})
		#use = new Use(this.#rerender, context)
		#rend = Use.wrap(this.#use, fun(this.#use))

		#stop_cues: undefined | (() => void)
		#stop_flat: undefined | (() => void)

		#render_and_track_cues(...props: P) {
			if (this.#stop_cues)
				this.#stop_cues()

			let result: TemplateResult | void = undefined

			this.#stop_cues = context.cues.track(
				() => { result = this.#rend(...props) },
				this.#rerender,
			)

			return result
		}

		#render_and_track_flatstate(...props: P) {
			if (this.#stop_flat)
				this.#stop_flat()

			let result: TemplateResult | void = undefined

			this.#stop_flat = context.flat.manual({
				debounce: true,
				discover: false,
				collector: () => { result = this.#render_and_track_cues(...props) },
				responder: () => { this.#rerender() },
			})

			return result
		}

		render(...props: P) {
			this.#props = props
			return this.#render_and_track_flatstate(...props)
		}

		reconnected() {
			Use.reconnect(this.#use)
		}

		disconnected() {
			Use.disconnect(this.#use)
		}
	})
})


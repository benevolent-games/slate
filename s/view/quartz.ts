
import {CSSResultGroup} from "lit"
import {ViewUse} from "./parts/use.js";

export function obsidian() {}

import {TemplateResult} from "lit"
import {AsyncDirective, directive} from "lit/async-directive.js"

import {hooks} from "./parts/hooks.js"
import {Flat} from "../flatstate/flat.js"
import {custom_directive_with_detail_input} from "./parts/custom_directives.js"
import {BaseContext} from "../prepare/frontend.js";
import {maptool} from "../tools/maptool.js";
import { debounce } from "../tools/debounce/debounce.js";

// export type FlipAttributes = {
// 	[key: string]: string | number | boolean | undefined
// }

// export type FlipSettings = {
// 	class?: string
// 	part?: string
// 	gpart?: string
// 	attributes?: FlipAttributes
// 	auto_exportparts?: boolean
// }

// export type FlipData<P extends Record<string, any>> = FlipSettings & {
// 	props: P
// 	attributes?: FlipAttributes
// 	content?: TemplateResult | void
// }

// export type FlipRender<P extends Record<string, any>> = (
// 	(use: ViewUse) => (props: P) => (TemplateResult | void)
// )

// export type FlipOptions<P extends any[]> = {
// 	flat: Flat
// 	name: string
// 	styles: CSSResultGroup
// 	default_auto_exportparts: boolean
// 	render: FlipRender<P>
// }

// export type Flipview<P extends Record<string, any>> = (data: FlipData<P>) => (TemplateResult | void)

// export function flipview<P extends Record<string, any>>({
// 		flat,
// 		name,
// 		styles,
// 		default_auto_exportparts,
// 		render,
// 	}: {
// 		flat: Flat
// 		name: string
// 		styles: CSSResultGroup | undefined
// 		default_auto_exportparts: boolean
// 		render: (use: ViewUse) => (props: P) => (TemplateResult | void)
// 	}) {

// 	return custom_directive_with_detail_input(class extends AsyncDirective {
// 		#recent_input?: FlipData<P>
// 		#rerender = () => {
// 			if (this.#recent_input)
// 				this.setValue(
// 					this.#root.render_into_shadow(
// 						this.render(this.#recent_input!)
// 					)
// 				)
// 		}
// 		#stop: (() => void) | undefined
// 		#root = make_view_root(name, styles)
// 		#hooks = hooks(flat, this.#root.container, this.#rerender)
// 		#renderize = this.#hooks.wrap(render)

// 		update(_: Part, props: [FlipData<P>]) {
// 			return this.#root.render_into_shadow(this.render(...props))
// 		}

// 		render(input: FlipData<P>) {
// 			apply_details(this.#root.container, input, this.#recent_input)
// 			this.#recent_input = input
// 			this.#root.auto_exportparts = (
// 				input.auto_exportparts ?? default_auto_exportparts
// 			)

// 			if (this.#stop)
// 				this.#stop()

// 			let result: TemplateResult | void = undefined

// 			this.#stop = flat.manual({
// 				debounce: true,
// 				discover: false,
// 				collector: () => {
// 					const props = this.#recent_input!.props
// 					result = this.#renderize(this.#hooks.use)(props)
// 				},
// 				responder: () => {
// 					this.#rerender()
// 				},
// 			})

// 			return result
// 		}

// 		disconnected() {
// 			if (this.#stop) {
// 				this.#stop()
// 				this.#stop = undefined
// 			}
// 			this.#hooks.setdown()
// 		}
// 	}) as Flipview<P>
// }

export class Counter { value = 0 }
export type Setdown = () => void
export type Setup = () => Setdown

export class Use {

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

	#rerender: () => void
	#counter: Counter = new Counter()
	#states = new Map<number, any>()
	#setups = new Map<number, Setup>()
	#setdowns = new Set<Setdown>()

	constructor(rerender: () => void) {
		this.#rerender = rerender
	}

	state<T>(init: T | (() => T)) {
		const count = this.#counter.value++
		const value = maptool(this.#states).grab(count, () => (
			(typeof init === "function")
				? (init as any)()
				: init
		))
		const setter = (v: T) => {
			this.#states.set(count, v)
			this.#rerender()
		}
		const getter = () => this.#states.get(count)
		return [value, setter, getter] as const
	}

	setup(up: Setup) {
		const count = this.#counter.value
		if (!this.#setups.has(count)) {
			this.#setups.set(count, up)
			this.#setdowns.add(up())
		}
	}
}

export type QuartzFun<C extends BaseContext, P extends any[]> = (
	(context: C) => (use: Use) => (...props: P) => (TemplateResult | void)
)

export const quartz = (
	<C extends BaseContext>(context: C) =>
	<P extends any[]>(fun: QuartzFun<C, P>) => {

	return directive(class extends AsyncDirective {
		#props?: P
		#rerender = debounce(0, () => {
			if (this.#props)
				this.setValue(this.render(...this.#props!))
		})
		#use = new Use(this.#rerender)
		#rend = Use.wrap(this.#use, fun(context)(this.#use))

		render(...props: P) {
			this.#props = props
			return this.#rend(...props)
		}

		reconnected() {
			Use.reconnect(this.#use)
		}

		disconnected() {
			Use.disconnect(this.#use)
		}
	})
})

// export function lol<P extends Record<string, any>>({
// 		flat,
// 		name,
// 		styles,
// 		render,
// 	}: {
// 		flat: Flat
// 		name: string
// 		styles: CSSResultGroup | undefined
// 		render: (use: ViewUse) => (props: P) => (TemplateResult | void)
// 	}) {

// 	return custom_directive_with_detail_input(class extends AsyncDirective {
// 		#recent_props?: P
// 		#rerender = () => {
// 				if (this.#recent_props)
// 					this.setValue(this.render(this.#recent_props!))
// 		}
// 		#stop: (() => void) | undefined
// 		#hooks = hooks(flat, this.#root.container, this.#rerender)
// 		#renderize = this.#hooks.wrap(render)(this.#hooks.use)

// 		render(props: P) {
// 			this.#recent_input = input

// 			if (this.#stop)
// 				this.#stop()

// 			let result: TemplateResult | void = undefined

// 			this.#stop = flat.manual({
// 				debounce: true,
// 				discover: false,
// 				collector: () => {
// 					const props = this.#recent_input!.props
// 					result = this.#renderize(props)
// 				},
// 				responder: () => {
// 					this.#rerender()
// 				},
// 			})

// 			return result
// 		}

// 		disconnected() {
// 			if (this.#stop) {
// 				this.#stop()
// 				this.#stop = undefined
// 			}
// 			this.#hooks.setdown()
// 		}
// 	}) as Flipview<P>
// }



// /////

// export const MyView = quartz({styles})(context => use => (props: any) => {

// 	// you can use preact signals
// 	const alpha = use.signal(0)

// 	// or flatstate
// 	const bravo = use.flat({count: 0})

// 	// or traditional react hooks
// 	const [charlie, setCharlie] = use.state(0)

// 	const incrementAlpha = () => alpha.value++
// 	const incrementBravo = () => bravo.count++
// 	const incrementCharlie = () => setCharlie(charlie + 1)

// 	use.setup(() => {
// 		const interval = setInterval(incrementAlpha, 1000)
// 		return () => clearInterval(interval)
// 	})

// 	return html`
// 		${alpha.value}
// 		${bravo.count}
// 		${charlie}

// 		<button @click=${incrementAlpha}>+alpha</button>
// 		<button @click=${incrementBravo}>+bravo</button>
// 		<button @click=${incrementCharlie}>+charlie</button>
// 	`
// })

// // ////

// // const example = html`
// // 	${MyView(props, options)}
// // `


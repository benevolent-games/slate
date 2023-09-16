
import {AsyncDirective} from "lit/async-directive.js"
import {CSSResultGroup, Part, TemplateResult} from "lit"

import {Flat} from "../flatstate/flat.js"
import {make_view_root} from "./parts/root.js"
import {ViewInputs, View} from "./parts/types.js"
import {apply_details} from "./parts/apply_details.js"
import {debounce} from "../tools/debounce/debounce.js"
import {explode_promise} from "../tools/explode_promise.js"
import {custom_directive_with_detail_input} from "./parts/custom_directive_with_detail_input.js"

export abstract class ShaleView {
	static name: string
	static styles: CSSResultGroup
	abstract render(...args: any[]): TemplateResult | void
	default_auto_exportparts = true

	#init? = explode_promise<void>()
	#wait = this.#init!.promise
	#root: ReturnType<typeof make_view_root>
	#rerender: () => void

	init() {}

	constructor(root: ReturnType<typeof make_view_root>, rerender: () => void) {
		this.#root = root
		this.#rerender = rerender
		this.init()
	}

	get element() { return this.#root.container }
	get shadow() { return this.#root.shadow }
	get updateComplete() { return this.#wait.then(() => true) }

	#setups = new Set<() => () => void>()
		.add(() => this.setup())

	#setdowns = new Set<() => void>()

	register_setup(setup: () => () => void) {
		this.#setups.add(setup)
	}

	setup() {
		return () => {}
	}

	connectedCallback() {
		for (const setup of this.#setups) {
			setup()()
			this.#setdowns.add(setup())
		}
	}

	disconnectedCallback() {
		for (const setdown of this.#setdowns)
			setdown()
		this.#setdowns.clear()
	}

	#render_debounced = debounce(0, () => {
		const template = this.render()
		this.render(template, this, {host: this})
	})

	requestUpdate() {
		this.#rerender()
		const promise = this.#render_debounced()

		if (this.#init) {
			promise.then(this.#init.resolve)
			this.#init = undefined
		}

		this.#wait = promise
		return promise
	}
}

export type ShaleViewClass = {
	new(...params: ConstructorParameters<typeof ShaleView>): ShaleView
	name: string
	styles: CSSResultGroup
}

export function shale_view<V extends ShaleViewClass>({flat, theme, View}: {
		flat: Flat
		theme: CSSResultGroup
		View: V
	}): View<Parameters<InstanceType<V>["render"]>> {

	type P = Parameters<InstanceType<V>["render"]>

	return custom_directive_with_detail_input(class extends AsyncDirective {
		#recent_input?: ViewInputs<P>
		#rerender = () => {
			if (this.#recent_input)
				this.setValue(
					this.#root.render_into_shadow(
						this.render(this.#recent_input!)
					)
				)
		}
		#stop: (() => void) | undefined
		#root = make_view_root(View.name, [theme, View.styles])
		#view = new View(this.#root, this.#rerender)

		update(_: Part, props: [ViewInputs<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(input: ViewInputs<P>) {
			if (this.isConnected) {
				this.#view.connectedCallback()
			}
			apply_details(this.#root.container, input, this.#recent_input)
			this.#recent_input = input
			this.#root.auto_exportparts = (
				input.auto_exportparts ?? this.#view.default_auto_exportparts
			)

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					const props = this.#recent_input!.props
					result = this.#view.render(...props)
				},
				responder: () => {
					this.#rerender()
				},
			})

			return result
		}

		disconnected() {
			if (this.#stop) {
				this.#stop()
				this.#stop = undefined
			}

			this.#view.disconnectedCallback()
		}

		reconnected() {
			this.#view.connectedCallback()
		}
	}) as View<P>
}



import {AsyncDirective} from "lit/async-directive.js"
import {CSSResultGroup, Part, TemplateResult} from "lit"

import {Flat} from "../flatstate/flat.js"
import {make_view_root} from "./parts/root.js"
import {ViewInputs, View} from "./parts/types.js"
import {apply_details} from "./parts/apply_details.js"
import {custom_directive_with_detail_input} from "./parts/custom_directive_with_detail_input.js"

export abstract class ShaleView {
	static name: string
	static styles: CSSResultGroup
	abstract render(...args: any[]): TemplateResult | void
	default_auto_exportparts = true

	#root: ReturnType<typeof make_view_root>
	#rerender: () => void

	constructor(root: ReturnType<typeof make_view_root>, rerender: () => void) {
		this.#root = root
		this.#rerender = rerender
	}

	get element() { return this.#root.container }
	get shadow() { return this.#root.shadow }
	requestUpdate() { this.#rerender() }
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
		}
	}) as View<P>
}


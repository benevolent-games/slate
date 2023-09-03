
import {Part, TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {hooks} from "./parts/hooks.js"
import {make_view_root} from "./parts/root.js"
import {apply_details} from "./parts/apply_details.js"
import {Flipview, FlipData, FlipOptions} from "./parts/types.js"
import {custom_directive_with_detail_input} from "./parts/custom_directive_with_detail_input.js"

export function flipview<P extends any[]>({
		flat,
		name,
		styles,
		default_auto_exportparts,
		render,
	}: FlipOptions<P>) {

	return custom_directive_with_detail_input(class extends AsyncDirective {
		#recent_input?: FlipData<P>
		#rerender = () => {
			if (this.#recent_input)
				this.setValue(
					this.#root.render_into_shadow(
						this.render(this.#recent_input!)
					)
				)
		}
		#stop: (() => void) | undefined
		#root = make_view_root(name, styles)
		#hooks = hooks(flat, this.#root.container, this.#rerender)
		#renderize = this.#hooks.wrap(render)

		update(_: Part, props: [FlipData<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(input: FlipData<P>) {
			apply_details(this.#root.container, input, this.#recent_input)
			this.#recent_input = input
			this.#root.auto_exportparts = (
				input.auto_exportparts ?? default_auto_exportparts
			)

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					const props = this.#recent_input!.props
					result = this.#renderize(this.#hooks.use)(...props)
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
			this.#hooks.setdown()
		}
	}) as Flipview<P>
}


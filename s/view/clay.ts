
import {TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Flat} from "../flatstate/flat.js"
import {BaseView} from "./parts/base_view.js"
import {LightView, ViewParams} from "./parts/types.js"
import {custom_directive_for_light_view} from "./parts/custom_directives.js"

export type ClayViewClass = ({
	new(...p: ConstructorParameters<typeof ClayView>): ClayView
} & typeof ClayView)

export abstract class ClayView extends BaseView {
	#rerender: () => void

	constructor(rerender: () => void) {
		super()
		this.#rerender = rerender
	}

	requestUpdate() { this.#rerender() }
	abstract render(...props: any[]): TemplateResult | void

	static directive<V extends ClayViewClass>(
			View: ClayViewClass,
			{flat}: {flat: Flat},
		) {

		type P = ViewParams<V>

		return custom_directive_for_light_view(class extends AsyncDirective {
			#recent_input?: P
			#rerender = () => {
				if (this.#recent_input)
					this.setValue(this.render(...this.#recent_input!))
			}
			#stop: (() => void) | undefined
			#view = new View(this.#rerender)

			render(...props: P) {
				this.#recent_input = props

				if (this.#stop)
					this.#stop()

				let result: TemplateResult | void = undefined

				this.#stop = flat.manual({
					debounce: true,
					discover: false,
					collector: () => {
						result = this.#view.render(...this.#recent_input!)
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
		}) as LightView<P>
	}
}


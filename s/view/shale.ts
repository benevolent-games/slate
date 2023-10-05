
import {CSSResultGroup, Part, TemplateResult, css} from "lit"

import {Flat} from "../flatstate/flat.js"
import {BaseView} from "./parts/base_view.js"
import {make_view_root} from "./parts/root.js"
import {AsyncDirective} from "lit/async-directive.js"
import {apply_details} from "./parts/apply_details.js"
import {View, ViewInputs, ViewParams} from "./parts/types.js"
import {custom_directive_with_detail_input} from "./parts/custom_directives.js"

export type ShaleViewClass = ({
	new(...p: ConstructorParameters<typeof ShaleView>): ShaleView
} & typeof ShaleView)

export abstract class ShaleView extends BaseView {
	static name = "unknown"
	static styles: CSSResultGroup = css``

	default_auto_exportparts = true
	#root: ReturnType<typeof make_view_root>
	#rerender: () => void

	constructor(root: ReturnType<typeof make_view_root>, rerender: () => void) {
		super()
		this.#root = root
		this.#rerender = rerender
	}

	get element() { return this.#root.container }
	get shadow() { return this.#root.shadow }
	requestUpdate() { this.#rerender() }
	abstract render(...props: any[]): TemplateResult | void

	static directive<V extends ShaleViewClass>(
			View: ShaleViewClass,
			{flat, theme}: {
				flat: Flat
				theme: CSSResultGroup
			},
		) {

		type P = ViewParams<V>

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
}


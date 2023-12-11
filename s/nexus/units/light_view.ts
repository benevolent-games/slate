
import {Part, TemplateResult, render} from "lit"
import {AsyncDirective, DirectiveResult, directive} from "lit/async-directive.js"

import {Context} from "../context.js"
import {Shell} from "../parts/shell.js"
import {LightViewRenderer} from "../parts/types.js"
import {UseLightView} from "../parts/use/tailored.js"
import {SlateView} from "../parts/slate_view_element.js"
import {debounce} from "../../tools/debounce/debounce.js"
import {usekey} from "../parts/use/parts/utils/usekey.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"

export const prepare_light_view = (
	<C extends Context>(shell: Shell<C>) =>
	<P extends any[]>(renderer: LightViewRenderer<C, P>) =>

	directive(class extends AsyncDirective {
		#props?: P
		#element = document.createElement(SlateView.tag) as SlateView
		#render_into_element(template: TemplateResult | void) {
			render(template, this.#element)
			this.#use[usekey].afterRender()
			return this.#element
		}
		#rerender = debounce(0, () => {
			if (this.#props && this.isConnected)
				this.setValue(this.#render_into_element(this.render(...this.#props!)))
		})
		#use = new UseLightView(this.#element, this.#rerender, shell.context)
		#rend = this.#use[usekey].wrap(renderer(this.#use))
		#reactivity?: Reactivity<P> = setup_reactivity<P>(
			this.#rend,
			this.#rerender,
		)

		update(_: Part, props: P) {
			return this.#render_into_element(this.render(...props))
		}

		render(...props: P) {
			this.#props = props
			return this.#reactivity?.render(...props)
		}

		reconnected() {
			this.#use[usekey].reconnect()
			this.#reactivity = setup_reactivity<P>(
				this.#rend,
				this.#rerender,
			)
		}

		disconnected() {
			this.#use[usekey].disconnect()
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
		}
	}) as (...props: P) => DirectiveResult<any>
)


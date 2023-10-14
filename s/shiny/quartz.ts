
import {AsyncDirective, directive} from "lit/async-directive.js"

import {Use} from "./parts/use.js"
import {Context} from "./context.js"
import {ViewRenderer} from "./parts/types.js"
import {debounce} from "../tools/debounce/debounce.js"
import {setup_reactivity} from "./parts/setup_reactivity.js"

export const prepare_quartz = (
	<C extends Context>(context: C) =>
	<P extends any[]>(renderer: ViewRenderer<C, P>) =>

	directive(class extends AsyncDirective {
		#props?: P
		#rerender = debounce(0, () => {
			if (this.#props)
				this.setValue(this.render(...this.#props!))
		})
		#use = new Use(this.#rerender, context)
		#rend = Use.wrap(this.#use, renderer(this.#use))

		#render_with_reactivity = setup_reactivity<P>(
			context,
			this.#rend,
			this.#rerender,
		)

		render(...props: P) {
			this.#props = props
			return this.#render_with_reactivity(...props)
		}

		reconnected() {
			Use.reconnect(this.#use)
		}

		disconnected() {
			Use.disconnect(this.#use)
		}
	})
)


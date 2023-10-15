
import {AsyncDirective, directive} from "lit/async-directive.js"

import {Context} from "./context.js"
import {QuartzRenderer} from "./parts/types.js"
import {UseQuartz} from "./parts/use/tailored.js"
import {debounce} from "../tools/debounce/debounce.js"
import {setup_reactivity} from "./parts/setup_reactivity.js"

export const prepare_quartz = (
	<C extends Context>(context: C) =>
	<P extends any[]>(renderer: QuartzRenderer<C, P>) =>

	directive(class extends AsyncDirective {
		#props?: P
		#rerender = debounce(0, () => {
			if (this.#props)
				this.setValue(this.render(...this.#props!))
		})
		#use = new UseQuartz(this.#rerender, context)
		#rend = UseQuartz.wrap(this.#use, renderer(this.#use))

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
			UseQuartz.reconnect(this.#use)
		}

		disconnected() {
			UseQuartz.disconnect(this.#use)
		}
	}) as (...props: P) => any
)


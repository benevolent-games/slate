
import {AsyncDirective, DirectiveResult, directive} from "lit/async-directive.js"

import {Shell} from "../shell.js"
import {Context} from "../context.js"
import {QuartzRenderer} from "../parts/types.js"
import {UseQuartz} from "../parts/use/tailored.js"
import {debounce} from "../../tools/debounce/debounce.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"

export const prepare_quartz = (
	<C extends Context>(shell: Shell<C>) =>
	<P extends any[]>(renderer: QuartzRenderer<C, P>) =>

	directive(class extends AsyncDirective {
		#props?: P
		#rerender = debounce(0, () => {
			if (this.#props)
				this.setValue(this.render(...this.#props!))
		})
		#use = new UseQuartz(this.#rerender, shell.context)
		#rend = UseQuartz.wrap(this.#use, renderer(this.#use))
		#reactivity?: Reactivity<P> = setup_reactivity<P>(
			this.#rend,
			this.#rerender,
		)

		render(...props: P) {
			this.#props = props
			return this.#reactivity?.render(...props)
		}

		reconnected() {
			UseQuartz.reconnect(this.#use)
			this.#reactivity = setup_reactivity<P>(
				this.#rend,
				this.#rerender,
			)
		}

		disconnected() {
			UseQuartz.disconnect(this.#use)
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
		}
	}) as (...props: P) => DirectiveResult<any>
)


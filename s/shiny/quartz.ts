
import {TemplateResult} from "lit"
import {AsyncDirective, directive} from "lit/async-directive.js"

import {Use} from "./parts/use.js"
import {Context} from "./context.js"
import {QuartzFun} from "./parts/types.js"
import {debounce} from "../tools/debounce/debounce.js"

export const prepare_quartz = (
	<C extends Context>(context: C) =>
	<P extends any[]>(fun: QuartzFun<C, P>) =>

	directive(class extends AsyncDirective {
		#props?: P
		#rerender = debounce(0, () => {
			if (this.#props)
				this.setValue(this.render(...this.#props!))
		})
		#use = new Use(this.#rerender, context)
		#rend = Use.wrap(this.#use, fun(this.#use))

		#stop_cues: undefined | (() => void)
		#stop_flat: undefined | (() => void)

		#render_and_track_cues(...props: P) {
			if (this.#stop_cues)
				this.#stop_cues()

			let result: TemplateResult | void = undefined

			this.#stop_cues = context.cues.track(
				() => { result = this.#rend(...props) },
				this.#rerender,
			)

			return result
		}

		#render_and_track_flatstate(...props: P) {
			if (this.#stop_flat)
				this.#stop_flat()

			let result: TemplateResult | void = undefined

			this.#stop_flat = context.flat.manual({
				debounce: true,
				discover: false,
				collector: () => { result = this.#render_and_track_cues(...props) },
				responder: () => { this.#rerender() },
			})

			return result
		}

		render(...props: P) {
			this.#props = props
			return this.#render_and_track_flatstate(...props)
		}

		reconnected() {
			Use.reconnect(this.#use)
		}

		disconnected() {
			Use.disconnect(this.#use)
		}
	})
)


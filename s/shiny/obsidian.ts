
import {Part, TemplateResult, css} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Use} from "./parts/use.js"
import {Context} from "./context.js"
import {make_view_root} from "../view/parts/root.js"
import {debounce} from "../tools/debounce/debounce.js"
import {apply_details} from "./parts/apply_details.js"
import {ObsidianInput, ObsidianSettings, QuartzFun} from "./parts/types.js"
import {obsidian_custom_lit_directive} from "./parts/obsidian_custom_lit_directive.js"

export const prepare_obsidian = (
	<C extends Context>(context: C) =>
	<P extends any[]>(
		settings: ObsidianSettings = {},
		fun: QuartzFun<C, P>,
	) => (

	obsidian_custom_lit_directive(class extends AsyncDirective {
		#input?: ObsidianInput<P>
		#root = make_view_root(
			settings.name ?? "",
			[context.theme, settings.styles ?? css``],
		)
		#rerender = debounce(0, () => {
			if (this.#input)
				this.setValue(
					this.#root.render_into_shadow(
						this.render(this.#input!)
					)
				)
		})

		#use = new Use(this.#rerender, context)
		#rend = Use.wrap(this.#use, fun(this.#use))

		#stop_cues: undefined | (() => void)
		#stop_flat: undefined | (() => void)

		update(_: Part, props: [ObsidianInput<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

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

		render(input: ObsidianInput<P>) {
			apply_details(this.#root.container, input.meta, this.#input?.meta)
			this.#input = input
			this.#root.auto_exportparts = (
				input.meta.auto_exportparts ?? settings.auto_exportparts ?? true
			)
			return this.#render_and_track_flatstate(...input.props)
		}

		reconnected() {
			Use.reconnect(this.#use)
		}

		disconnected() {
			Use.disconnect(this.#use)
		}
	})
))


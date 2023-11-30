
import {Part, css} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Shell} from "../shell.js"
import {Context} from "../context.js"
import {make_view_root} from "../parts/root.js"
import {UseObsidian} from "../parts/use/tailored.js"
import {apply_details} from "../parts/apply_details.js"
import {debounce} from "../../tools/debounce/debounce.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"
import {ObsidianInput, ShadowSettings, ObsidianRenderer} from "../parts/types.js"
import {obsidian_custom_lit_directive} from "../parts/obsidian_custom_lit_directive.js"

export const prepare_obsidian = (
	<C extends Context>(shell: Shell<C>) =>
	<P extends any[]>(
		settings: ShadowSettings = {},
		renderer: ObsidianRenderer<C, P>,
	) => (

	obsidian_custom_lit_directive<P>(class extends AsyncDirective {
		#input?: ObsidianInput<P>
		#first_connection = true
		#root = make_view_root({
			name: settings.name ?? "",
			css: [shell.context.theme, settings.styles ?? css``],
			onDisconnected: () => this.disconnected(),
			onConnected: () => {
				if (!this.#first_connection)
					this.reconnected()
				this.#first_connection = false
			},
		})
		#rerender = debounce(0, () => {
			if (this.#input)
				this.setValue(
					this.#root.render_into_shadow(
						this.render(this.#input!)
					)
				)
		})

		#use = new UseObsidian(
			this.#root.container,
			this.#root.shadow,
			this.#rerender,
			shell.context,
		)

		#rend = UseObsidian.wrap(this.#use, renderer(this.#use))

		#reactivity?: Reactivity<P> = setup_reactivity<P>(
			this.#rend,
			this.#rerender,
		)

		update(_: Part, props: [ObsidianInput<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(input: ObsidianInput<P>) {
			apply_details(this.#root.container, input.meta, this.#input?.meta)
			this.#input = input
			this.#root.auto_exportparts = (
				input.meta.auto_exportparts ?? settings.auto_exportparts ?? true
			)
			return this.#reactivity!.render(...input.props)
		}

		reconnected() {
			UseObsidian.reconnect(this.#use)
			this.#reactivity = setup_reactivity<P>(
				this.#rend,
				this.#rerender,
			)
		}

		disconnected() {
			UseObsidian.disconnect(this.#use)
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
		}
	})
))


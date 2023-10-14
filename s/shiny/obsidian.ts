
import {Part, css} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Use} from "./parts/use.js"
import {Context} from "./context.js"
import {make_view_root} from "./parts/root.js"
import {debounce} from "../tools/debounce/debounce.js"
import {apply_details} from "./parts/apply_details.js"
import {setup_reactivity} from "./parts/setup_reactivity.js"
import {ObsidianInput, ShadowSettings, ViewRenderer} from "./parts/types.js"
import {obsidian_custom_lit_directive} from "./parts/obsidian_custom_lit_directive.js"
import { UseShadow } from "./parts/use_shadow.js"

export const prepare_obsidian = (
	<C extends Context>(context: C) =>
	<P extends any[]>(
		settings: ShadowSettings = {},
		renderer: ViewRenderer<C, P>,
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

		#use = new UseShadow(
			this.#root.container,
			this.#root.shadow,
			this.#rerender,
			context,
		)

		#rend = Use.wrap(this.#use, renderer(this.#use))

		#render_with_reactivity = setup_reactivity<P>(
			context,
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
			return this.#render_with_reactivity(...input.props)
		}

		reconnected() {
			Use.reconnect(this.#use)
		}

		disconnected() {
			Use.disconnect(this.#use)
		}
	})
))



import {Part} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Context} from "../context.js"
import {Shell} from "../parts/shell.js"
import {make_view_root} from "../parts/root.js"
import {UseShadowView} from "../parts/use/tailored.js"
import {apply_details} from "../parts/apply_details.js"
import {usekey} from "../parts/use/parts/utils/usekey.js"
import {debounce} from "../../tools/debounce/debounce.js"
import {ShadowViewInput, ShadowViewRenderer} from "../parts/types.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"
import {custom_lit_directive_for_shadow_view} from "../parts/custom_lit_directive_for_shadow_view.js"

export const prepare_shadow_view = (
	<C extends Context>(shell: Shell<C>) =>
	<P extends any[]>(renderer: ShadowViewRenderer<C, P>) => (

	custom_lit_directive_for_shadow_view<P>(class extends AsyncDirective {
		#input?: ShadowViewInput<P>
		#first_connection = true
		#root = make_view_root({
			afterRender: () => this.#use[usekey].afterRender(),
			onDisconnected: () => this.disconnected(),
			onConnected: () => {
				if (!this.#first_connection)
					this.reconnected()
				this.#first_connection = false
			},
		})
		#rerender = debounce(0, () => {
			if (this.#input && this.isConnected)
				this.setValue(
					this.#root.render_into_shadow(
						this.render(this.#input!)
					)
				)
		})

		#use = new UseShadowView(
			this.#root.container,
			this.#root.shadow,
			this.#rerender,
			shell.context,
		)

		#rend = this.#use[usekey].wrap(renderer(this.#use))

		#reactivity?: Reactivity<P> = setup_reactivity<P>(
			this.#rend,
			this.#rerender,
		)

		update(_: Part, props: [ShadowViewInput<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(input: ShadowViewInput<P>) {
			apply_details(this.#root.container, input.meta, this.#input?.meta)
			this.#input = input
			this.#root.auto_exportparts = (
				input.meta.auto_exportparts ?? true
			)
			return this.#reactivity?.render(...input.props)
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
	})
))


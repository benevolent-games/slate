
import {css} from "lit"

import {Shell} from "../shell.js"
import {Context} from "../context.js"
import {GoldElement} from "../../element/gold.js"
import {UseCarbon} from "../parts/use/tailored.js"
import {setup_reactivity} from "../parts/setup_reactivity.js"
import {ShadowSettings, CarbonRenderer} from "../parts/types.js"

export const prepare_carbon = (
	<C extends Context>(shell: Shell<C>) =>
	(settings: ShadowSettings, renderer: CarbonRenderer<C>) => (

	class extends GoldElement {
		static label = settings.name
		static get styles() {
			return [
				shell.context.theme,
				settings.styles ?? css``,
			]
		}

		#use = new UseCarbon(
			this as GoldElement,
			this.root,
			() => void this.requestUpdate(),
			shell.context,
		)

		#rend = UseCarbon.wrap(this.#use, () => renderer(this.#use))

		#render_with_reactivity = setup_reactivity<[]>(
			this.#rend,
			() => void this.requestUpdate(),
		)

		render() {
			return this.#render_with_reactivity()
		}

		connectedCallback() {
			super.connectedCallback()
			UseCarbon.reconnect(this.#use)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			UseCarbon.disconnect(this.#use)
		}
	} as typeof GoldElement
))


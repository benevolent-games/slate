
import {CSSResultGroup, css} from "lit"

import {Context} from "./context.js"
import {GoldElement} from "../element/gold.js"
import {UseCarbon} from "./parts/use/tailored.js"
import {setup_reactivity} from "./parts/setup_reactivity.js"
import {ShadowSettings, CarbonRenderer} from "./parts/types.js"

export const prepare_carbon = (
	<C extends Context>(context: C) =>
	(settings: ShadowSettings, renderer: CarbonRenderer<C>) => (

	class extends GoldElement {
		static name = settings.name
		static styles: CSSResultGroup = [
			context.theme,
			settings.styles ?? css``,
		]

		#use = new UseCarbon(
			this as GoldElement,
			this.root,
			() => void this.requestUpdate(),
			context,
		)

		#rend = UseCarbon.wrap(this.#use, () => renderer(this.#use))

		#render_with_reactivity = setup_reactivity<[]>(
			context,
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
	}
))


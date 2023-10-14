
import {Use} from "./parts/use.js"
import {Context} from "./context.js"
import {UseLight} from "./parts/use_light.js"
import {OxygenRenderer} from "./parts/types.js"
import {SilverElement} from "../element/silver.js"
import {setup_reactivity} from "./parts/setup_reactivity.js"

export const prepare_oxygen = (
	<C extends Context>(context: C) =>
	(renderer: OxygenRenderer<C>) => (

	class extends SilverElement {
		#use = new UseLight(
			this as any,
			() => void this.requestUpdate(),
			context,
		)

		#rend = Use.wrap(this.#use, () => renderer(this.#use))

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
			Use.reconnect(this.#use)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			Use.disconnect(this.#use)
		}
	}
))


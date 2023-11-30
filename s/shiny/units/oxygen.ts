
import {Shell} from "../shell.js"
import {Context} from "../context.js"
import {OxygenRenderer} from "../parts/types.js"
import {UseOxygen} from "../parts/use/tailored.js"
import {SilverElement} from "../../element/silver.js"
import {setup_reactivity} from "../parts/setup_reactivity.js"

export const prepare_oxygen = (
	<C extends Context>(shell: Shell<C>) =>
	(renderer: OxygenRenderer<C>) => (

	class extends SilverElement {
		#use = new UseOxygen(
			this as SilverElement,
			() => void this.requestUpdate(),
			shell.context,
		)

		#rend = UseOxygen.wrap(this.#use, () => renderer(this.#use))

		#render_with_reactivity = setup_reactivity<[]>(
			this.#rend,
			() => void this.requestUpdate(),
		)

		render() {
			return this.#render_with_reactivity()
		}

		connectedCallback() {
			super.connectedCallback()
			UseOxygen.reconnect(this.#use)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			UseOxygen.disconnect(this.#use)
		}
	}
))


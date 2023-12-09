
import {Shell} from "../shell.js"
import {Context} from "../context.js"
import {OxygenRenderer} from "../parts/types.js"
import {UseOxygen} from "../parts/use/tailored.js"
import {SilverElement} from "../../element/silver.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"

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

		#reactivity?: Reactivity<[]>

		render() {
			this.updateComplete.then(() => UseOxygen.afterRender(this.#use))
			return this.#reactivity?.render()
		}

		connectedCallback() {
			super.connectedCallback()
			this.#reactivity = setup_reactivity<[]>(
				this.#rend,
				() => void this.requestUpdate(),
			)
			UseOxygen.reconnect(this.#use)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
			UseOxygen.disconnect(this.#use)
		}
	}
))


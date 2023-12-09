
import {Context} from "../context.js"
import {Shell} from "../parts/shell.js"
import {SilverElement} from "../../element/silver.js"
import {LightComponentRenderer} from "../parts/types.js"
import {UseLightComponent} from "../parts/use/tailored.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"

export const prepare_light_component = (
	<C extends Context>(shell: Shell<C>) =>
	(renderer: LightComponentRenderer<C>) => (

	class extends SilverElement {
		#use = new UseLightComponent(
			this as SilverElement,
			() => void this.requestUpdate(),
			shell.context,
		)

		#rend = UseLightComponent.wrap(this.#use, () => renderer(this.#use))

		#reactivity?: Reactivity<[]>

		render() {
			this.updateComplete.then(() => UseLightComponent.afterRender(this.#use))
			return this.#reactivity?.render()
		}

		connectedCallback() {
			super.connectedCallback()
			this.#reactivity = setup_reactivity<[]>(
				this.#rend,
				() => void this.requestUpdate(),
			)
			UseLightComponent.reconnect(this.#use)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
			UseLightComponent.disconnect(this.#use)
		}
	}
))



import {Context} from "../context.js"
import {Shell} from "../parts/shell.js"
import {GoldElement} from "../../element/gold.js"
import {ShadowComponentRenderer} from "../parts/types.js"
import {UseShadowComponent} from "../parts/use/tailored.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"

export const prepare_shadow_component = (
	<C extends Context>(shell: Shell<C>) =>
	(renderer: ShadowComponentRenderer<C>) => (

	class extends GoldElement {
		#use = new UseShadowComponent(
			this as GoldElement,
			this.root,
			() => void this.requestUpdate(),
			shell.context,
		)

		#rend = UseShadowComponent.wrap(this.#use, () => renderer(this.#use))

		#reactivity?: Reactivity<[]>

		render() {
			this.updateComplete.then(() => UseShadowComponent.afterRender(this.#use))
			return this.#reactivity?.render()
		}

		connectedCallback() {
			super.connectedCallback()
			UseShadowComponent.reconnect(this.#use)
			this.#reactivity = setup_reactivity<[]>(
				this.#rend,
				() => void this.requestUpdate(),
			)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			UseShadowComponent.disconnect(this.#use)
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
		}
	} as typeof GoldElement
))


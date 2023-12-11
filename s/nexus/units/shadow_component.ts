
import {Context} from "../context.js"
import {Shell} from "../parts/shell.js"
import {GoldElement} from "../../element/gold.js"
import {usekey} from "../parts/use/parts/utils/usekey.js"
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

		#rend = this.#use[usekey].wrap(() => renderer(this.#use))

		#reactivity?: Reactivity<[]>

		render() {
			this.updateComplete.then(() => this.#use[usekey].afterRender())
			return this.#reactivity?.render()
		}

		connectedCallback() {
			super.connectedCallback()
			this.#use[usekey].reconnect()
			this.#reactivity = setup_reactivity<[]>(
				this.#rend,
				() => void this.requestUpdate(),
			)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			this.#use[usekey].disconnect()
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
		}
	} as typeof GoldElement
))



import {Shell} from "../shell.js"
import {Context} from "../context.js"
import {GoldElement} from "../../element/gold.js"
import {UseCarbon} from "../parts/use/tailored.js"
import {CarbonRenderer} from "../parts/types.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"

export const prepare_carbon = (
	<C extends Context>(shell: Shell<C>) =>
	(renderer: CarbonRenderer<C>) => (

	class extends GoldElement {
		#use = new UseCarbon(
			this as GoldElement,
			this.root,
			() => void this.requestUpdate(),
			shell.context,
		)

		#rend = UseCarbon.wrap(this.#use, () => renderer(this.#use))

		#reactivity?: Reactivity<[]>

		render() {
			this.updateComplete.then(() => UseCarbon.afterRender(this.#use))
			return this.#reactivity?.render()
		}

		connectedCallback() {
			super.connectedCallback()
			UseCarbon.reconnect(this.#use)
			this.#reactivity = setup_reactivity<[]>(
				this.#rend,
				() => void this.requestUpdate(),
			)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			UseCarbon.disconnect(this.#use)
			if (this.#reactivity) {
				this.#reactivity.stop()
				this.#reactivity = undefined
			}
		}
	} as typeof GoldElement
))


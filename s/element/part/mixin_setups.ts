
import {Constructor} from "../../tools/constructor.js"

export function mixinSetups<C extends Constructor<any>>(Base: C) {
	return class extends Base {

		#setups = new Set<() => () => void>()
			.add(() => this.setup())

		#setdowns = new Set<() => void>()

		register_setup(setup: () => () => void) {
			this.#setups.add(setup)
		}

		setup() {
			return () => {}
		}

		connectedCallback() {
			for (const setup of this.#setups)
				this.#setdowns.add(setup())
		}

		disconnectedCallback() {
			for (const setdown of this.#setdowns)
				setdown()
			this.#setdowns.clear()
		}
	}
}


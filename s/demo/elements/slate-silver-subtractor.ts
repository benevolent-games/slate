
import {html} from "lit"
import {component} from "../frontend.js"
import {SilverElement} from "../../element/silver.js"

export const SlateSilverSubtractor = component(context => class extends SilverElement {

	#state = context.flat.state({
		count: 0,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count--}>-</button>
		`
	}
})


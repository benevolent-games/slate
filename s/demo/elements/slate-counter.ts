
import {html} from "lit"
import {component} from "../frontend.js"
import {GoldElement} from "../../element/gold.js"

export const SlateCounter = component(context => class extends GoldElement {

	#state = context.flat.state({
		count: 0,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count++}>+</button>
		`
	}
})


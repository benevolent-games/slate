
import {html} from "lit"
import {view} from "../frontend.js"
import {ClayView} from "../../view/clay.js"

export const ClayDoubler = view(context => class extends ClayView {

	setup() {
		console.log("setup")

		return () => {
			console.log("setdown")
		}
	}

	#state = context.flat.state({
		count: 3,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count *= 2}>x2</button>
		`
	}
})



import {css, html} from "lit"
import {view} from "../frontend.js"
import {ShaleView} from "../../view/shale.js"

export const ShaleDoubler = view(context => class extends ShaleView {
	static name = "shale-doubler"
	static styles = css`
		span {
			color: lime;
		}
	`

	#state = context.flat.state({
		count: 1,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count *= 2}>x2</button>
		`
	}
})


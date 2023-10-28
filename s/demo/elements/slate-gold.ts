
import {html, css} from "lit"
import {slate} from "../frontend.js"
import {GoldElement} from "../../element/gold.js"

export class SlateGold extends GoldElement {
	static styles = css`span {color: orange}`

	#state = slate.context.flat.state({
		count: 0,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count++}>gold</button>
		`
	}
}


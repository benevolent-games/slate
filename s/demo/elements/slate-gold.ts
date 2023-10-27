
import {html, css} from "lit"
import {shell} from "../frontend.js"
import {GoldElement} from "../../element/gold.js"

export const SlateGold = class extends GoldElement {
	static styles = css`span {color: orange}`

	#state = shell.context.flat.state({
		count: 0,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count++}>gold</button>
		`
	}
}


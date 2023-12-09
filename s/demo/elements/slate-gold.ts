
import {html, css} from "lit"
import {flat} from "../../nexus/state.js"
import {GoldElement} from "../../element/gold.js"

export class SlateGold extends GoldElement {
	static get styles() { return css`span {color: orange}` }

	#state = flat.state({
		count: 0,
	})

	render() {
		return html`
			<span>${this.#state.count}</span>
			<button @click=${() => this.#state.count++}>gold</button>
		`
	}
}


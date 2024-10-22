
import {html, css} from "lit"
import {flat} from "../../nexus/state.js"
import {ShadowElement} from "../../element/gold.js"

export class SlateGold extends ShadowElement {
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


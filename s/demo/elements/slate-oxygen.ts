
import {slate} from "../frontend.js"
import {html} from "../../shiny/html.js"

export const SlateOxygen = slate.oxygen(use => {
	const count = use.signal(256)
	const decrease = () => count.value -= 8

	return html`
		<span>${count}</span>
		<button @click=${decrease}>oxygen</button>
	`
})


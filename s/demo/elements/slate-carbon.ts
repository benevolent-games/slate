
import {slate} from "../frontend.js"
import {css, html} from "../../nexus/html.js"

const random = () => Math.ceil(Math.random() * 1000)

export const SlateCarbon = slate.shadowComponent(use => {
	use.styles(css`button { color: green }`)

	const x = use.signal(random)
	const randomize = () => x.value = random()

	return html`
		<span>${x}</span>
		<button @click=${randomize}>carbon</button>
	`
})


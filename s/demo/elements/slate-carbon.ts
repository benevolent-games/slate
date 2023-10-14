
import {carbon} from "../frontend.js"
import {css, html} from "../../shiny/html.js"

const random = () => Math.ceil(Math.random() * 1000)

const styles = css`button { color: green }`

export const SlateCarbon = carbon({styles}, use => {
	const x = use.signal(random)
	const randomize = () => x.value = random()

	return html`
		<span>${x}</span>
		<button @click=${randomize}>carbon</button>
	`
})


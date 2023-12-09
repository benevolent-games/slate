
import {css} from "lit"
import {slate} from "../frontend.js"
import {html} from "../../nexus/html.js"

export const ObsidianQuadrupler = slate.shadow_view(use =>
		(start: number) => {

	use.name("quadrupler")
	use.styles(css`span { color: yellow }`)

	const count = use.signal(start)
	const increase = () => count.value *= 4

	return html`
		<span>${count}</span>
		<button @click=${increase}>obsidian</button>
	`
})


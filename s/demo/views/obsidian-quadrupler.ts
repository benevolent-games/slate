
import {css} from "lit"
import {slate} from "../frontend.js"
import {html} from "../../shiny/html.js"

const name = "quadrupler"
const styles = css`span { color: yellow }`

export const ObsidianQuadrupler = slate.shadow_view({name, styles}, use =>
		(start: number) => {

	const count = use.signal(start)
	const increase = () => count.value *= 4

	return html`
		<span>${count}</span>
		<button @click=${increase}>obsidian</button>
	`
})


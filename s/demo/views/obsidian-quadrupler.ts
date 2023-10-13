
import {obsidian} from "../frontend.js"
import {html} from "../../shiny/quartz.js"

export const ObsidianQuadrupler = obsidian()(use => (start: number) => {
	const count = use.signal(start)

	return html`
		<span>${count}</span>
		<button @click=${() => count.value *= 4}>quadrupler</button>
	`
})


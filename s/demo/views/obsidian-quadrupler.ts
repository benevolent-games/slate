
import {css} from "lit"
import {obsidian} from "../frontend.js"
import {html} from "../../shiny/quartz.js"

const settings = {
	name: "quadrupler",
	styles: css`span {color: yellow}`,
}

export const ObsidianQuadrupler = obsidian(settings, use => (start: number) => {
	const count = use.signal(start)

	return html`
		<span>${count}</span>
		<button @click=${() => count.value *= 4}>quadrupler</button>
	`
})



import {css} from "../shiny/html.js"
import {Context} from "../shiny/context.js"
import {prepare_frontend} from "../shiny/frontend.js"

export class DemoContext extends Context {
	theme = css`
		button {
			padding: 0.5em;
			font-style: italic;
		}
	`
}

export const {
	oxygen,
	carbon,
	quartz,
	obsidian,
	component,
} = prepare_frontend(new DemoContext)


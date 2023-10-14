
import {css} from "../shiny/html.js"
import {Context} from "../shiny/context.js"
import {prepare_frontend} from "../shiny/frontend.js"
import {BaseContext, prepare_frontend as old_prepare_frontend} from "../prepare/frontend.js"

export const {quartz, obsidian, oxygen, carbon} = prepare_frontend(new class extends Context {
	theme = css`
		button {
			padding: 0.5em;
			font-style: italic;
		}
	`
})

export const {view, views, component, components} = old_prepare_frontend<BaseContext>()


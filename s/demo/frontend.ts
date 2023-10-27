
import {CSSResultGroup} from "lit"
import {Context} from "../shiny/context.js"
import {prepare_frontend} from "../shiny/frontend.js"

export class DemoContext extends Context {
	constructor(public theme: CSSResultGroup) {
		super()
	}
}

export const {
	shell,
	set_context,
	oxygen,
	carbon,
	quartz,
	obsidian,
} = prepare_frontend<DemoContext>()


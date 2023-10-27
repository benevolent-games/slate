
import {CSSResultGroup} from "lit"
import {Context} from "../shiny/context.js"
import {prepare_frontend} from "../shiny/frontend.js"

export class DemoContext extends Context {
	constructor(public theme: CSSResultGroup) {
		super()
	}
}

export const {
	setContext,
	oxygen,
	carbon,
	quartz,
	obsidian,
	component,
} = prepare_frontend<DemoContext>()


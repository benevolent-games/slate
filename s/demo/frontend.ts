
import {Context} from "../shiny/context.js"
import {prepare_frontend} from "../shiny/frontend.js"

export class DemoContext extends Context {}
export const demoContext = new DemoContext()

export const {
	oxygen,
	carbon,
	quartz,
	obsidian,
	component,
} = prepare_frontend(demoContext)


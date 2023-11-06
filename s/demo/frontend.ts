
import {CSSResultGroup} from "lit"
import {setup} from "../shiny/frontend.js"
import {Context} from "../shiny/context.js"

export class DemoContext extends Context {
	constructor(public theme: CSSResultGroup) {
		super()
	}
}

export const slate = setup<DemoContext>()



import {CSSResultGroup} from "lit"
import {Nexus} from "../shiny/nexus.js"
import {Context} from "../shiny/context.js"

export class DemoContext extends Context {
	constructor(public theme: CSSResultGroup) {
		super()
	}
}

export const slate = new Nexus<DemoContext>()


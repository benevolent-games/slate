
import {CSSResultGroup} from "lit"
import {Nexus} from "../nexus/nexus.js"
import {Context} from "../nexus/context.js"

export class DemoContext extends Context {
	constructor(public theme: CSSResultGroup) {
		super()
	}
}

export const slate = new Nexus<DemoContext>()


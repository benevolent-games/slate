
import {CSSResultGroup} from "lit"
import {Slate} from "../shiny/slate.js"
import {Context} from "../shiny/context.js"

export class DemoContext extends Context {
	constructor(public theme: CSSResultGroup) {
		super()
	}
}

export const slate = new Slate<DemoContext>()


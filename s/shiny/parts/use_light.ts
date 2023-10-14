
import {Use} from "./use.js"
import {Context} from "../context.js"
import {SilverElement} from "../../element/silver.js"

export class UseLight<C extends Context = Context> extends Use<C> {

	#element: SilverElement
	get element() { return this.#element }

	constructor(
			element: SilverElement,
			rerender: () => void,
			context: C,
		) {
		super(rerender, context)
		this.#element = element
	}
}


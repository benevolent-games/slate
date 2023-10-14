
import {Use} from "./use.js"
import {Context} from "../context.js"
import {BaseElement} from "../../base/element.js"
import {MetallicElement} from "../../element/part/metallic.js"

export class UseLight<C extends Context = Context> extends Use<C> {
	#element: MetallicElement & BaseElement

	get element() {
		return this.#element
	}

	constructor(
			element: MetallicElement & BaseElement,
			rerender: () => void,
			context: C,
		) {
		super(rerender, context)
		this.#element = element
	}
}


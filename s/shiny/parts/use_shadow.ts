
import {Use} from "./use.js"
import {Context} from "../context.js"
import {GoldElement} from "../../element/gold.js"

export class UseShadow<C extends Context = Context> extends Use<C> {

	#element: GoldElement
	get element() { return this.#element }

	#shadow: ShadowRoot
	get shadow() { return this.#shadow }

	constructor(
			element: GoldElement,
			shadow: ShadowRoot,
			rerender: () => void,
			context: C,
		) {
		super(rerender, context)
		this.#element = element
		this.#shadow = shadow
	}
}


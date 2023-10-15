
import {Use} from "./use.js"
import {Context} from "../../../context.js"

export class UseShadow<C extends Context = Context, E extends HTMLElement = HTMLElement> extends Use<C> {

	#element: E
	get element() { return this.#element }

	#shadow: ShadowRoot
	get shadow() { return this.#shadow }

	constructor(
			element: E,
			shadow: ShadowRoot,
			rerender: () => void,
			context: C,
		) {
		super(rerender, context)
		this.#element = element
		this.#shadow = shadow
	}
}


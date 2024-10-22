
import {Use} from "./use.js"
import {Context} from "../../../context.js"
import {LightElement} from "../../../../element/silver.js"
import {SetupAttrs, setup_use_attrs} from "../../setup_use_attrs.js"

export class UseSilver<C extends Context = Context> extends Use<C> {

	#element: LightElement
	get element() { return this.#element }

	readonly attrs: SetupAttrs

	constructor(
			element: LightElement,
			rerender: () => void,
			context: C,
		) {
		super(rerender, context)
		this.#element = element
		this.attrs = setup_use_attrs(element)
	}
}


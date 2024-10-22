
import {UseShadow} from "./use_shadow.js"
import {Context} from "../../../context.js"
import {ShadowElement} from "../../../../element/gold.js"
import {SetupAttrs, setup_use_attrs} from "../../setup_use_attrs.js"

export class UseGold<C extends Context = Context> extends UseShadow<C, ShadowElement> {

	readonly attrs: SetupAttrs

	constructor(
			element: ShadowElement,
			shadow: ShadowRoot,
			rerender: () => void,
			context: C,
		) {
		super(element, shadow, rerender, context)
		this.attrs = setup_use_attrs(element)
	}
}


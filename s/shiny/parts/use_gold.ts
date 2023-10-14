
import {Context} from "../context.js"
import {UseShadow} from "./use_shadow.js"
import {GoldElement} from "../../element/gold.js"
import {SetupAttrs, setup_use_attrs} from "./setup_use_attrs.js"

export class UseGold<C extends Context = Context> extends UseShadow<C, GoldElement> {

	readonly attrs: SetupAttrs

	constructor(
			element: GoldElement,
			shadow: ShadowRoot,
			rerender: () => void,
			context: C,
		) {
		super(element, shadow, rerender, context)
		this.attrs = setup_use_attrs(element)
	}
}


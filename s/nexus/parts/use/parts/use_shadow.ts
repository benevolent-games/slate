
import {CSSResultGroup, css} from "lit"

import {Use} from "./use.js"
import {Context} from "../../../context.js"
import {apply_styles_to_shadow} from "../../../../base/utils/apply_styles_to_shadow.js"

export class UseShadow<C extends Context = Context, E extends HTMLElement = HTMLElement> extends Use<C> {

	#element: E
	get element() { return this.#element }

	#shadow: ShadowRoot
	get shadow() { return this.#shadow }

	styles(styles: CSSResultGroup | undefined) {
		this.prepare(() => apply_styles_to_shadow(
			this.shadow,
			[this.context.theme, styles ?? css``],
		))
	}

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


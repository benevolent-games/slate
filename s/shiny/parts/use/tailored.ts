
import {Use} from "./parts/use.js"
import {Context} from "../../context.js"
import {UseGold} from "./parts/use_gold.js"
import {UseShadow} from "./parts/use_shadow.js"
import {UseSilver} from "./parts/use_silver.js"
import {SlateView} from "../slate_view_element.js"

export class UseCarbon<C extends Context = Context> extends UseGold<C> {}
export class UseOxygen<C extends Context = Context> extends UseSilver<C> {}

export class UseQuartz<C extends Context> extends Use<C> {
	readonly element: SlateView

	name(name: string) {
		this.prepare(() => this.element.setAttribute("view", name))
	}

	constructor(element: SlateView, rerender: () => void, context: C) {
		super(rerender, context)
		this.element = element
	}
}

export class UseObsidian<
		C extends Context = Context,
		E extends HTMLElement = HTMLElement,
	> extends UseShadow<C, E> {

	name(name: string) {
		this.prepare(() => this.element.setAttribute("view", name))
	}
}


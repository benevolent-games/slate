
import {html} from "lit"
import {component, views} from "../frontend.js"
import {ClayDoubler} from "../views/clay-doubler.js"
import {SilverElement} from "../../element/silver.js"
import {ShaleDoubler} from "../views/shale-doubler.js"
import { QuartzDoubler } from "../views/quartz-doubler.js"

export const SlateDoubler = component(context => class extends SilverElement {

	#views = views(context, {ShaleDoubler, ClayDoubler})

	render() {
		return html`
			${this.#views.ShaleDoubler({props: []})}
			${this.#views.ClayDoubler()}
			${QuartzDoubler(99)}
		`
	}
})


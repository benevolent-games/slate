
/*

import {TemplateResult, html} from "lit"

const {component, view, prep_views} = prepare<Context>()

export const CoolView = view(context => class extends ZenView {

	#state = context.flat.state({
		count: 123,
	})

	render(label: string) {
		return html`
			<div>
				<p>${label}: ${this.#state.count}</p>
			</div>
		`
	}
})

export const CoolComponent = component(context => class extends ZenElement {

	#view = prep_views(context, {
		CoolView,
	})

	#state = context.flat.state({
		cow: "moo",
	})

	render() {
		return html`
			<div>
				<p>cows say: ${this.#state.cow}</p>

				${this.#views.CoolView({
					props: ["hello world"],
					attributes: {gpart: "view"},
				})}
			</div>
		`
	}
})

*/


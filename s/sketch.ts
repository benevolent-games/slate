
import {css, html} from "lit"
import {ZenElement} from "./zen/element.js"
import {ShaleView} from "./flipview/shale_view.js"
import {BaseContext, prepare_frontend} from "./prepare/frontend.js"

const {component, view, views} = prepare_frontend<BaseContext>()

export const MyComponent = component(_ => class extends ZenElement {
	render() {
	}
})

export const MyView = view(_ => class extends ShaleView {
	name = "MyCoolView"
	styles = css``
	render(count: number) {
		return html`<p>${count}</p>`
	}
})

export const MyView2 = view(context => class extends ShaleView {
	name = "MyCoolView"
	styles = css``

	#views = views(context, {
		MyView,
	})

	#state = context.flat.state({
		count: 0,
	})

	#increment = () => {
		this.#state.count++
	}

	render() {
		return html`
			${this.#views.MyView({
				props: [this.#state.count],
			})}
			<button @click=${this.#increment}>increment</button>
		`
	}
})


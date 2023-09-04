
import {css, html} from "lit"
import {ShaleView} from "./view/shale.js"
import {GoldElement} from "./element/gold.js"
import {BaseContext, prepare_frontend} from "./prepare/frontend.js"

const {component, view, views} = prepare_frontend<BaseContext>()

export const MyComponent = component(_ => class extends GoldElement {
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


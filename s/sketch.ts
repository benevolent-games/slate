
import {css, html} from "lit"
import {Flat} from "./flatstate/flat.js"
import {ShaleView} from "./view/shale.js"
import {GoldElement} from "./element/gold.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"
import {BaseContext, ComponentClass, ComponentInstance, prepare_frontend} from "./prepare/frontend.js"

export class Context implements BaseContext {
	flat = new Flat()
	theme = css``
}

const {component, components, view, views} = prepare_frontend<Context>()

export const MyComponent = component(_ => class extends GoldElement {
	render() {
	}
})

export type MyComponentClass = ComponentClass<typeof MyComponent>
export type MyComponentInstance = ComponentInstance<typeof MyComponent>

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

const context = new Context()

register_to_dom(components(context, {MyComponent}))


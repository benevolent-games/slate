
import {css, html} from "lit"
import {Flat} from "./flatstate/flat.js"
import {ShaleView} from "./view/shale.js"
import {GoldElement} from "./element/gold.js"
import {Attrite} from "./base/addons/attrite.js"
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

export const MyView = view(context => class extends ShaleView {
	static name = "my-view"
	static styles = css``

	render(count: number) {
		return html`
			<p>${count}</p>
			<p></p>
		`
	}
})

export const MyView2 = view(context => class extends ShaleView {
	static name = "my-view-2"
	static styles = css``

	#state = context.flat.state({
		count: 0,
	})

	#attrs = Attrite.setup(this as ShaleView, {
		hello: String,
		world: Number,
		lol: Boolean,
	})

	#increment = () => {
		this.#state.count++
	}

	#views = views(context, {
		MyView,
	})

	render() {
		return html`
			<p>${this.#attrs.hello} ${this.#attrs.world}</p>
			${this.#views.MyView({
				props: [this.#state.count],
			})}
			<button @click=${this.#increment}>increment</button>
		`
	}
})

const context = new Context()

register_to_dom(components(context, {MyComponent}))


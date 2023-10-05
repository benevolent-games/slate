
import {css, html} from "lit"

import {ClayView} from "./view/clay.js"
import {Flat} from "./flatstate/flat.js"
import {ShaleView} from "./view/shale.js"
import {GoldElement} from "./element/gold.js"
import {Attributes} from "./base/addons/attributes.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"
import {BaseContext, ComponentClass, ComponentInstance, prepare_frontend} from "./prepare/frontend.js"

export class Context implements BaseContext {
	flat = new Flat()
	theme = css``
}

const {component, components, view, views} = prepare_frontend<Context>()

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

export const MyClay = view(context => class extends ClayView {
	render(greeting: string) {
		return html`<p>${greeting}</p>`
	}
})

export const MyView2 = view(context => class extends ShaleView {
	static name = "my-view-2"
	static styles = css``

	#state = context.flat.state({
		count: 0,
	})

	#attrs = Attributes.setup(this as ShaleView, {
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
		const lol = this.#attrs.lol
		const hello = this.#attrs.hello
		return html`
			<p>${hello} ${this.#attrs.world} ${lol && "lol"}</p>
			${this.#views.MyView({
				props: [this.#state.count],
			})}
			<button @click=${this.#increment}>increment</button>
		`
	}
})

export const MyComponent = component(context => class extends GoldElement {
	#views = views(context, {
		MyView,
		MyView2,
		MyClay,
	})

	render() {
		return html`
			${this.#views.MyView({props: [123]})}
			${this.#views.MyClay("hello")}
		`
	}
})

export type MyComponentClass = ComponentClass<typeof MyComponent>
export type MyComponentInstance = ComponentInstance<typeof MyComponent>

const context = new Context()

register_to_dom(components(context, {MyComponent}))


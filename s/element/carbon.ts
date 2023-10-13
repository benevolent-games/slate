
// import {CSSResultGroup, html, render} from "lit"

// import {ViewUse} from "../view/parts/use.js"
// import {BaseElement} from "../base/element.js"
// import {BaseContext} from "../prepare/frontend.js"
// import {MetallicElement} from "./part/metallic.js"
// import {explode_promise} from "../tools/explode_promise.js"
// import {apply_styles_to_shadow} from "../base/utils/apply_styles_to_shadow.js"
// import { hooks } from "../view/parts/hooks.js"
// import { debounce } from "../tools/debounce/debounce.js"

// export type CarbonFun<P extends Record<string, any>> = (use: ViewUse) => (props: P) => any

// export function carbon<C extends BaseContext, P extends Record<string, any>>({
// 		styles,
// 	}: {
// 		styles?: CSSResultGroup
// 	} = {}) {

// 	return (fun: CarbonFun<P>) => (context: C) =>
// 		class CarbonElement
// 		extends MetallicElement
// 		implements BaseElement {

// 		#root: ShadowRoot
// 		#init? = explode_promise<void>()
// 		#wait = this.#init!.promise

// 		#render_debounced = debounce(0, () => {
// 			const root = this.#root
// 			const template = this.render()
// 			if (template)
// 				render(template, root, {host: this})
// 		})

// 		#hooks = hooks(context.flat, this, this.#render_debounced)

// 		init() {}

// 		constructor() {
// 			super()
// 			this.#root = this.attachShadow({mode: "open"})
// 			const C = this.constructor as typeof CarbonElement
// 			apply_styles_to_shadow(this.#root, styles)
// 			this.init()
// 		}

// 		get root() {
// 			return this.#root
// 		}

// 		get updateComplete() {
// 			return this.#wait.then(() => true)
// 		}

// 		render() {
// 			return html``
// 		}

// 		async requestUpdate() {
// 			const promise = this.#render_debounced()

// 			if (this.#init) {
// 				promise.then(this.#init.resolve)
// 				this.#init = undefined
// 			}

// 			this.#wait = promise
// 			return promise
// 		}

// 		connectedCallback() {
// 			super.connectedCallback()
// 			this.requestUpdate()
// 		}
// 	}
// }


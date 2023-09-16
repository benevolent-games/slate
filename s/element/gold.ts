
import {CSSResultGroup, TemplateResult, render} from "lit"

import {BaseElement} from "../base/element.js"
import {MetallicElement} from "./part/metallic.js"
import {debounce} from "../tools/debounce/debounce.js"
import {explode_promise} from "../tools/explode_promise.js"
import {apply_styles_to_shadow} from "../base/utils/apply_styles_to_shadow.js"

export abstract class GoldElement extends MetallicElement implements BaseElement {
	static styles?: CSSResultGroup

	#root: ShadowRoot
	#init? = explode_promise<void>()
	#wait = this.#init!.promise

	init() {}

	constructor() {
		super()
		this.#root = this.attachShadow({mode: "open"})
		const C = this.constructor as typeof GoldElement
		apply_styles_to_shadow(this.#root, C.styles)
		this.init()
	}

	get root() {
		return this.#root
	}

	get wait() {
		return this.#wait
	}

	get updateComplete() {
		return this.#wait.then(() => true)
	}

	abstract render(): TemplateResult | void

	#render_debounced = debounce(0, () => {
		const root = this.#root
		const template = this.render()
		if (template)
			render(template, root, {host: this})
	})

	async requestUpdate() {
		const promise = this.#render_debounced()

		if (this.#init) {
			promise.then(this.#init.resolve)
			this.#init = undefined
		}

		this.#wait = promise
		return promise
	}

	connectedCallback() {
		super.connectedCallback()
		this.requestUpdate()
	}
}


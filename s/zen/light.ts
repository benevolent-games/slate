
import {TemplateResult, render} from "lit"

import {BaseElement} from "../base/element.js"
import {debounce} from "../tools/debounce/debounce.js"
import {explode_promise} from "../tools/explode_promise.js"

export class LightElement extends HTMLElement implements BaseElement {
	#init? = explode_promise<void>()
	#wait = this.#init!.promise

	init() {}

	constructor() {
		super()
		this.init()
	}

	get updateComplete() {
		return this.#wait
	}

	render(): TemplateResult | void {
		return undefined
	}

	#render_debounced = debounce(0, () => {
		const template = this.render()
		render(template, this, {host: this})
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
		this.requestUpdate()
	}

	disconnectedCallback() {}
}


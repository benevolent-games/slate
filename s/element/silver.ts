
import {TemplateResult, render} from "lit"

import {BaseElement} from "../base/element.js"
import {MetallicElement} from "./part/metallic.js"
import {debounce} from "../tools/debounce/debounce.js"
import {explode_promise} from "../tools/explode_promise.js"

export abstract class SilverElement extends MetallicElement implements BaseElement {

	#init? = explode_promise<void>()
	#wait = this.#init!.promise

	init() {}

	constructor() {
		super()
		this.init()
	}

	get updateComplete() {
		return this.#wait.then(() => true)
	}

	abstract render(): TemplateResult | void

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
		super.connectedCallback()
		this.requestUpdate()
	}
}


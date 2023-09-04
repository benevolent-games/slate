
import {TemplateResult, render} from "lit"

import {BaseElement} from "../base/element.js"
import {debounce} from "../tools/debounce/debounce.js"
import {explode_promise} from "../tools/explode_promise.js"

export abstract class SilverElement extends HTMLElement implements BaseElement {
	#init? = explode_promise<void>()
	#wait = this.#init!.promise

	#setups = new Set<() => () => void>()
	#setdowns = new Set<() => void>()

	register_setup(setup: () => () => void) {
		this.#setups.add(setup)
	}

	setup() {
		return () => {}
	}

	init() {}

	constructor() {
		super()
		this.init()
		this.register_setup(() => this.setup())
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
		for (const setup of this.#setups)
			this.#setdowns.add(setup())

		this.requestUpdate()
	}

	disconnectedCallback() {
		for (const setdown of this.#setdowns)
			setdown()

		this.#setdowns.clear()
	}
}


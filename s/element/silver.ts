
import {render} from "lit"

import {BaseElement} from "../base/element.js"
import {MetallicElement} from "./part/metallic.js"
import {RenderResult} from "../nexus/parts/types.js"
import {debounce} from "../tools/debounce/debounce.js"
import {deferPromise} from "../tools/defer-promise.js"

export class LightElement extends MetallicElement implements BaseElement {
	#init? = deferPromise<void>()
	#wait = this.#init!.promise

	init() {}

	constructor() {
		super()
		this.init()
	}

	get updateComplete() {
		return this.#wait.then(() => true)
	}

	render(): RenderResult {}

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

/** @deprecated renamed to `LightElement` */
export const SilverElement = LightElement


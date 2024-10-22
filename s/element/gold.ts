
import {CSSResultGroup, render} from "lit"

import {BaseElement} from "../base/element.js"
import {MetallicElement} from "./part/metallic.js"
import {RenderResult} from "../nexus/parts/types.js"
import {debounce} from "../tools/debounce/debounce.js"
import {deferPromise} from "../tools/defer-promise.js"
import {apply_styles_to_shadow} from "../base/utils/apply_styles_to_shadow.js"

export class ShadowElement extends MetallicElement implements BaseElement {
	static get styles(): CSSResultGroup | undefined { return undefined }

	#root: ShadowRoot
	#init? = deferPromise<void>()
	#wait = this.#init!.promise

	init() {}

	constructor() {
		super()
		this.#root = this.attachShadow({mode: "open"})
		const C = this.constructor as typeof ShadowElement
		apply_styles_to_shadow(this.#root, C.styles)
		this.init()
	}

	get root() {
		return this.#root
	}

	get updateComplete() {
		return this.#wait.then(() => true)
	}

	render(): RenderResult {}

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

/** @deprecated renamed to `ShadowElement` */
export const GoldElement = ShadowElement


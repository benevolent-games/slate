
import {CSSResultGroup, TemplateResult, render} from "lit"

import {BaseElement} from "../base/element.js"
import {debounce} from "../tools/debounce/debounce.js"
import {explode_promise} from "../tools/explode_promise.js"
import {apply_styles_to_shadow} from "../base/utils/apply_styles_to_shadow.js"

export class ZenElement extends HTMLElement implements BaseElement {
	static styles?: CSSResultGroup

	#root: ShadowRoot
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
		this.#root = this.attachShadow({mode: "open"})
		const C = this.constructor as typeof ZenElement
		apply_styles_to_shadow(this.#root, C.styles)
		this.init()
		this.register_setup(() => this.setup())
	}

	get root() {
		return this.#root
	}

	get updateComplete() {
		return this.#wait
	}

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
		for (const setup of this.#setups)
			this.#setdowns.add(setup())

		this.requestUpdate()
	}

	disconnectedCallback() {
		for (const setdown of this.#setdowns)
			setdown()

		this.#setdowns.clear()
	}

	render(): TemplateResult | void {
		return undefined
	}
}


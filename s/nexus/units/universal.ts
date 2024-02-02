
import {TemplateResult} from "lit"
import {Context} from "../context.js"
import {Shell} from "../parts/shell.js"
import {Use} from "../parts/use/parts/use.js"
import {usekey} from "../parts/use/parts/utils/usekey.js"
import {Reactivity, setup_reactivity} from "../parts/setup_reactivity.js"
import {AsyncDirective, DirectiveResult} from "lit/async-directive.js"
import {ShadowViewMeta} from "../parts/types.js"
import {Constructor} from "../../tools/constructor.js"
import {debounce} from "../../tools/debounce/debounce.js"
import {GoldElement} from "../../element/gold.js"

export type UniRenderer<C extends Context, P extends any[]> = (
	(use: Use<C>) => (...props: P) => (TemplateResult | void)
)

export type UniUnit = DirectiveResult<any> & {
	UniComponent: Constructor<GoldElement>
}

export class Uni<C extends Context, P extends any[]> {
	#request_rerender: () => void

	#use: Use<C>
	#rend: ReturnType<UniRenderer<C, P>>
	#reactivity?: Reactivity<[]>

	constructor(params: {
			context: C
			renderer: UniRenderer<C, P>
			request_rerender: () => void
		}) {
		this.#request_rerender = debounce(0, params.request_rerender)
		this.#use = new Use(() => this.#request_rerender(), params.context)
		this.#rend = this.#use[usekey].wrap(() => params.renderer(this.#use))()
	}

	render() {
		return this.#reactivity?.render()
	}

	afterRender() {
		this.#use[usekey].afterRender()
	}

	connect() {
		this.#use[usekey].reconnect()
		this.#reactivity = setup_reactivity<P>(
			this.#rend,
			this.#request_rerender,
		)
	}

	disconnect() {
		this.#use[usekey].disconnect()
		if (this.#reactivity) {
			this.#reactivity.stop()
			this.#reactivity = undefined
		}
	}
}

export const prepare_uni_view = (
	<C extends Context>(shell: Shell<C>) =>
	<P extends any[]>(renderer: UniRenderer<C, P>) => {


	class UniDirective extends AsyncDirective {
		render(...props: P) {}
	}

	class UniComponent extends GoldElement {
		#uni = new Uni<C, P>({
			renderer,
			context: shell.context,
			request_rerender: () => void this.requestUpdate(),
		})

		render() {
			this.updateComplete.then(() => this.#uni.afterRender())
			return this.#uni.render()
		}

		connectedCallback() {
			this.#uni.connect()
		}

		disconnectedCallback() {
			this.#uni.disconnect()
		}
	}

	function view(props: P, meta: ShadowViewMeta): DirectiveResult<any> {
		return ({
			UniComponent,
			values: [{meta, props}],
			["_$litDirective$"]: UniDirective,
		}) as UniUnit
	}

	view.UniComponent = UniComponent

	return view
})


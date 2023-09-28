
import {BaseElement} from "../element.js"
import {ShaleView} from "../../view/shale.js"

export namespace Attributes {
	type HardValue = (
		| typeof String
		| typeof Number
		| typeof Boolean
	)

	type SoftenValue<H extends HardValue> = (
		H extends typeof String
			? string | undefined

		: H extends typeof Number
			? number | undefined

		: H extends typeof Boolean
			? boolean

		: never
	)

	export type Spec = {
		[key: string]: HardValue
	}

	type SoftenSpec<A extends Spec> = {
		[P in keyof A]: SoftenValue<A[P]>
	}

	export const proxy = <A extends Spec>(
			element: HTMLElement,
			spec: A,
		) => new Proxy(spec, {

		get: (_target, name: string) => {
			const type = spec[name]
			const raw = element.getAttribute(name)

			switch (type) {
				case String:
					return raw

				case Number:
					return raw && Number(raw)

				case Boolean:
					return raw !== null
						? raw !== "false"
						: false

				default:
					throw new Error(`invalid attribute type for "${name}"`)
			}
		},

		set: (_target, name: string, value: any) => {
			const type = spec[name]

			switch (type) {
				case String: {
					element.setAttribute(name, value)
					return true
				}

				case Number: {
					element.setAttribute(name, value.toString())
					return true
				}

				case Boolean: {
					if (value)
						element.setAttribute(name, "")
					else
						element.removeAttribute(name)
					return true
				}

				default:
					throw new Error(`invalid attribute type for "${name}"`)
			}
		},

	}) as any as SoftenSpec<A>

	export function on_change(element: HTMLElement, handle_change: () => void) {
		const observer = new MutationObserver(handle_change)
		observer.observe(element, {attributes: true})
		return () => observer.disconnect()
	}

	export function base<A extends Spec>(element: BaseElement, spec: A) {
		on_change(element, () => element.requestUpdate())
		return proxy(element, spec)
	}

	export function view<A extends Spec>(view: ShaleView, spec: A) {
		on_change(view.element, () => view.requestUpdate())
		return proxy(view.element, spec)
	}

	export function setup<A extends Spec>(target: ShaleView | BaseElement, spec: A) {
		return (target instanceof ShaleView)
			? view(target, spec)
			: base(target, spec)
	}
}


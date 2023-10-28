
import {BaseElement} from "../element.js"

export function attributes<A extends Attributes.Spec>(
		element: BaseElement,
		spec: A,
	) {
	Attributes.on_change(element, () => element.requestUpdate())
	return Attributes.proxy(element, spec)
}

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

	export type SoftenSpec<A extends Spec> = {
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
					return raw ?? undefined

				case Number:
					return raw !== null
						? Number(raw)
						: undefined

				case Boolean:
					return raw !== null

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
}


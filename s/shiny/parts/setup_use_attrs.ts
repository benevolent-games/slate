
import {BaseElement} from "../../base/element.js"
import {Attributes, attributes} from "../../base/addons/attributes.js"

export type SetupAttrs = (
	<A extends Attributes.Spec>(spec: A) => Attributes.SoftenSpec<A>
)

export function setup_use_attrs(element: BaseElement) {
	let attrs: undefined | Attributes.SoftenSpec<any>

	return function<A extends Attributes.Spec>(spec: A):
			Attributes.SoftenSpec<A> {

		if (!attrs)
			attrs = attributes(element, spec)
		return attrs
	}
}


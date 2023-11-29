
import {Op} from "./op.js"
import type {TemplateResult} from "lit"
import type {DirectiveResult} from "lit/async-directive.js"

export function prep_render_op({loading, error}: {
		loading: () => TemplateResult
		error: (reason: string) => TemplateResult
	}) {

	return function render_op<X>(
			op: Op.For<X>,
			on_ready: (value: X) => TemplateResult | DirectiveResult | void,
		) {
		return Op.select(op, {
			loading,
			error,
			ready: on_ready,
		})
	}
}


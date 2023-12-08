
import {Op} from "./op.js"
import type {TemplateResult} from "lit"
import type {DirectiveResult} from "lit/async-directive.js"

type Result = TemplateResult | DirectiveResult | void

export function prep_render_op({loading, error}: {
		loading: () => Result
		error: (reason: string) => Result
	}) {

	return function render_op<X>(
			op: Op.For<X>,
			on_ready: (value: X) => Result,
		) {
		return Op.select(op, {
			loading,
			error,
			ready: on_ready,
		})
	}
}


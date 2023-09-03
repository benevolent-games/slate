
import {Op} from "./op.js"
import {TemplateResult} from "lit"

export function prep_render_op({loading, error}: {
		loading: () => TemplateResult
		error: (reason: string) => TemplateResult
	}) {

	return function render_op<X>(op: Op.For<X>, on_ready: (value: X) => TemplateResult | void) {
		return Op.select(op, {
			loading,
			error,
			ready: on_ready,
		})
	}
}


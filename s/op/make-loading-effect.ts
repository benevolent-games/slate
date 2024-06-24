
import {Op} from "./op.js"
import {Signal} from "../signals/signal.js"
import {RenderResult} from "../nexus/parts/types.js"

export function makeLoadingEffect({loading, error}: {
		loading: () => RenderResult
		error: (reason: string) => RenderResult
	}) {

	return function loadingEffect<X>(
			op: Op.For<X> | Signal<Op.For<X>>,
			onReady: (value: X) => RenderResult,
		) {

		const realOp = op instanceof Signal
			? op.value
			: op

		return Op.select(realOp, {
			loading,
			error,
			ready: onReady,
		})
	}
}


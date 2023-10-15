
const JsError = Error

export namespace Op {
	export type Mode = "loading" | "error" | "ready"
	export type Loading = {mode: "loading"}
	export type Error = {mode: "error", reason: string}
	export type Ready<X> = {mode: "ready", payload: X}

	export type For<X> = Loading | Error | Ready<X>
	export type Setter<X> = (op: For<X>) => void

	export const loading = <X>(): For<X> => ({mode: "loading"})
	export const error = <X>(reason: string): For<X> => ({mode: "error", reason})
	export const ready = <X>(payload: X): For<X> => ({mode: "ready", payload})

	export const is = Object.freeze({
		loading: (op: For<any>) => op.mode === "loading",
		error: (op: For<any>) => op.mode === "error",
		ready: (op: For<any>) => op.mode === "ready",
	})

	export function payload<X>(op: For<X>) {
		return (op.mode === "ready")
			? op.payload
			: undefined
	}

	export type Choices<X, R> = {
		loading: () => R
		error: (reason: string) => R
		ready: (payload: X) => R
	}

	export function select<X, R>(op: For<X>, choices: Choices<X, R>) {
		switch (op.mode) {

			case "loading":
				return choices.loading()

			case "error":
				return choices.error(op.reason)

			case "ready":
				return choices.ready(op.payload)

			default:
				console.error("op", op)
				throw new JsError("invalid op mode")
		}
	}

	export async function run<X>(
			set_op: Setter<X>,
			operation: () => Promise<X>,
		) {

		set_op(loading())

		try {
			const payload = await operation()
			set_op(ready(payload))
			return payload as X
		}
		catch (err) {
			const reason = (err instanceof JsError)
				? err.message
				: (typeof err === "string")
					? err
					: "error"
			set_op(error(reason))
		}
	}

	export function morph<A, B>(op: For<A>, transmute: (a: A) => B) {
		return select<A, For<B>>(op, {
			loading: () => loading(),
			error: reason => error(reason),
			ready: a => ready(transmute(a)),
		})
	}
}


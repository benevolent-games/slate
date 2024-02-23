
const JsError = Error

export namespace Op {
	export type Status = "loading" | "error" | "ready"
	export type Loading = {status: "loading"}
	export type Error = {status: "error", reason: string}
	export type Ready<X> = {status: "ready", payload: X}

	export type For<X> = Loading | Error | Ready<X>
	export type Setter<X> = (op: For<X>) => void
	export type Payload<O> = O extends Op.Ready<infer X> ? X : never;

	export const loading = <X>(): For<X> => ({status: "loading"})
	export const error = <X>(reason: string): For<X> => ({status: "error", reason})
	export const ready = <X>(payload: X): For<X> => ({status: "ready", payload})

	export const is = Object.freeze({
		loading: (op: For<any>): op is Op.Loading => op.status === "loading",
		error: (op: For<any>): op is Op.Error => op.status === "error",
		ready: <X>(op: For<X>): op is Op.Ready<X> => op.status === "ready",
	})

	export function payload<X>(op: For<X>) {
		return (op.status === "ready")
			? op.payload
			: undefined
	}

	export function reason<X>(op: For<X>) {
		return (op.status === "error")
			? op.reason
			: undefined
	}

	export type Choices<X, R> = {
		loading: () => R
		error: (reason: string) => R
		ready: (payload: X) => R
	}

	export function select<X, R>(op: For<X>, choices: Choices<X, R>) {
		switch (op.status) {

			case "loading":
				return choices.loading()

			case "error":
				return choices.error(op.reason)

			case "ready":
				return choices.ready(op.payload)

			default:
				console.error("op", op)
				throw new JsError("invalid op status")
		}
	}

	export async function load<X>(
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
			throw err
		}
	}

	export function morph<A, B>(op: For<A>, transmute: (a: A) => B) {
		return select<A, For<B>>(op, {
			loading: () => loading(),
			error: reason => error(reason),
			ready: a => ready(transmute(a)),
		})
	}

	export function all<O extends For<any>[]>(...ops: O) {
		const error = ops.find(is.error)
		return (
			error
				? error
				: ops.every(is.ready)
					? ready(ops.map(payload))
					: loading()
		) as For<{[K in keyof O]: Payload<O[K]>}>
	}
}


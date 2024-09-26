
export type DeferPromise<R> = {
	promise: Promise<R>
	resolve: (result: R) => void
	reject: (reason: any) => void
	entangle: (outsidePromise: Promise<R>) => Promise<R>
}

export function deferPromise<R>(): DeferPromise<R> {
	let resolve!: (result: R) => void
	let reject!: (reason: any) => void

	const promise = new Promise<R>((res, rej) => {
		resolve = res
		reject = rej
	})

	function entangle(outside: Promise<R>) {
		outside.then(resolve).catch(reject)
		return promise
	}

	return {promise, resolve, reject, entangle}
}


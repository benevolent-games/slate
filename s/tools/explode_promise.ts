
export type PromiseParts = ReturnType<typeof explode_promise>

/** @deprecated use `deferredPromise` instead */
export function explode_promise<T>() {
	let resolve!: (value: T) => void
	let reject!: (reason: any) => void

	const promise = new Promise<T>((res, rej) => {
		resolve = res
		reject = rej
	})

	return {promise, resolve, reject}
}


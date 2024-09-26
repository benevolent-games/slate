
export function deadline<R>(milliseconds: number, fn: () => Promise<R>) {
	return new Promise<R>((resolve, reject) => {

		const id = setTimeout(
			() => reject(new Error("timeout error")),
			milliseconds,
		)

		fn()
			.then(resolve)
			.catch(reject)
			.finally(() => clearTimeout(id))
	})
}


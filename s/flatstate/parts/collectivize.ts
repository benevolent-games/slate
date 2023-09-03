
export function collectivize<S extends {}>(state: S | (() => S)) {
	return function<D>(collector: (state: S) => D): (() => D) {
		return () => {

			const s = typeof state === "function"
				? (state as any)()
				: state

			return collector(s)
		}
	}
}


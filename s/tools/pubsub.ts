
export interface Pubsub<P extends any[] = []> {
	(fn: (...p: P) => void): () => void
	publish(...p: P): void
	clear(): void
}

/**
 * simple pub-sub mechanism.
 *
 *     // create pubsub function
 *     const onCount = pubsub<[string, number]>()
 *
 *     // subscribe
 *     const stop = onCount((a, b) => console.log(a, b))
 *
 *     // publish
 *     onWhatever.publish("count", 123)
 *
 *     // unsubscribe
 *     stop()
 *
 */
export function pubsub<P extends any[] = []>(): Pubsub<P> {
	const set = new Set<(...p: P) => void>()

	function subscribe(fn: (...p: P) => void) {
		set.add(fn)
		return () => { set.delete(fn) }
	}

	subscribe.publish = (...p: P) => {
		for (const fn of set)
			fn(...p)
	}

	subscribe.clear = () => set.clear()

	return subscribe
}


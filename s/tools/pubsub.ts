
import {deferredPromise} from "./deferred-promise.js"

export type PubsubListener<A extends any[]> = (...a: A) => (void | Promise<void>)

export interface Pubsub<A extends any[] = []> {
	(fn: PubsubListener<A>): () => void
	publish(...a: A): Promise<void>
	once(): Promise<A>
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
export function pubsub<A extends any[] = []>(): Pubsub<A> {
	const set = new Set<PubsubListener<A>>()

	function subscribe(fn: PubsubListener<A>) {
		set.add(fn)
		return () => { set.delete(fn) }
	}

	subscribe.publish = async(...a: A) => {
		await Promise.all([...set].map(fn => fn(...a)))
	}

	subscribe.clear = () => set.clear()

	subscribe.once = async() => {
		const {promise, resolve} = deferredPromise<A>()
		const unsubscribe = subscribe((...a) => {
			resolve(a)
			unsubscribe()
		})
		return promise
	}

	return subscribe
}


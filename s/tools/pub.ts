
export type Listener<X> = (x: X) => void

export type Pub<X> = {
	(listener: Listener<X>): () => void
	publish(x: X): void
	clear(): void
}

export function pub<X>(): Pub<X> {
	const listeners = new Set<Listener<X>>()

	function subscribe(listener: Listener<X>) {
		listeners.add(listener)
		return () => void listeners.delete(listener)
	}

	subscribe.publish = (x: X) => {
		for (const listener of listeners)
			listener(x)
	}

	subscribe.clear = () => listeners.clear()

	return subscribe
}

